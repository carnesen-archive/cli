import { dirname, posix } from 'path';

import { Spawner } from '../spawner/types';
import { ModelId } from './model-id';
import { MODEL_JSON_FILE_NAME } from './model-json-file';
import { RandomString } from './get-random-string';
import { AppConfig } from './app-config-file';
import { modelPackageCache } from './model-package-cache';
import { downloadModelPackageToCache } from './download-model-package-to-cache';
import { APP_JSON_FILE_NAME } from '../constants';

const MODELS_DIR = 'models';

export async function appInstallModels(target: Spawner) {
  const appConfigFileContents = await target.readFile(APP_JSON_FILE_NAME);
  const parsed = JSON.parse(appConfigFileContents);
  const models: AppConfig['models'] = parsed.models;

  if (models) {
    await Promise.all(
      Object.entries(models).map(([id, version]) => installModel(id, version)),
    );
  }

  async function installModel(id: string, version: number) {
    const { publisher, name } = ModelId.parse(id);
    const destinationDir = posix.join(MODELS_DIR, publisher, name);
    let installedVersion: number | undefined = undefined;
    try {
      const parsed = await readModelJson(destinationDir);
      installedVersion = parsed.version;
    } catch (_) {
      // TODO finer-grained error handling
    }

    if (installedVersion !== version) {
      const tmpId = RandomString();
      const tmpDir = `${destinationDir}.${tmpId}.tmp`;
      await target.mkdirp(tmpDir);
      try {
        if (!modelPackageCache.has(id, version)) {
          await downloadModelPackageToCache(id, version);
        }
        const modelPackageStream = await modelPackageCache.read(id, version);
        await target.untar(modelPackageStream, tmpDir);
        const fileNames = await target.readdir(tmpDir);
        if (fileNames.length !== 1 || !fileNames[0]) {
          throw new Error('Expected package to contain single directory');
        }
        function modelJsonUpdater(modelJson: any) {
          return { ...modelJson, version };
        }
        await updateModelJson(posix.join(tmpDir, fileNames[0]), modelJsonUpdater);
        await target.rimraf(destinationDir);
        await target.mkdirp(dirname(destinationDir));
        await target.run({
          exe: 'mv',
          args: [
            target.resolvePath(tmpDir, fileNames[0]),
            target.resolvePath(destinationDir),
          ],
        });
      } catch (exception) {
        try {
          await target.rimraf(tmpDir);
        } finally {
          throw exception;
        }
      }
    }

    async function readModelJson(dir: string) {
      const filePath = target.resolvePath(dir, MODEL_JSON_FILE_NAME);
      const output = await target.readFile(filePath);
      const parsed = JSON.parse(output);
      return parsed;
    }

    async function updateModelJson(dir: string, updater: (current: any) => any) {
      const parsed = await readModelJson(dir);
      const updated = updater(parsed);
      const filePath = target.resolvePath(dir, MODEL_JSON_FILE_NAME);
      const serialized = JSON.stringify(updated, null, 2);
      await target.writeFile(filePath, serialized);
    }
  }
}
