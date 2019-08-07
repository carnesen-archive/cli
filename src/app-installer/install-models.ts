import { dirname, posix } from 'path';
import toReadableStream = require('to-readable-stream');

import { Spawner } from '../spawner/types';
import { ModelId } from '../util/model-id';
import { MODEL_CONFIG_FILE_NAME } from '../subcommands/model/model-config-file';
import { getRandomString } from '../util/get-random-string';
import { modelVersionPackageCacheGetReadableStream } from '../util/model-version-package-readable-stream-from-cache-or-cloud';
import { AppConfig } from '../util/app-config-file';

const MODELS_DIR = 'models';

function runBestEffortBackgroundTask<T extends any[]>(
  fn: (...args: T) => any,
  ...args: T
) {
  (async () => {
    try {
      await fn(...args);
    } catch (ex) {}
  })();
}

export function InstallModelVersionPackages(spawner: Spawner, bearerToken: string) {
  return async function installModelVersionPackages(models: AppConfig['models']) {
    let changed = false;
    if (models) {
      await Promise.all(
        Object.entries(models).map(async ([id, version]) => {
          changed = changed || (await installModel(id, version)).changed;
        }),
      );
    }
    return { changed };
  };

  async function installModel(id: string, version: number) {
    let changed = false;
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
      changed = true;
      const tmpId = getRandomString();
      const tmpDir = `${destinationDir}.${tmpId}.download`;
      await spawner.mkdirp(tmpDir);
      try {
        await spawner.untar(
          await modelVersionPackageCacheGetReadableStream({ id, version, bearerToken }),
          tmpDir,
        );
        const fileNames = await spawner.readdir(tmpDir);
        if (fileNames.length !== 1 || !fileNames[0]) {
          throw new Error('Expected package to contain single directory');
        }
        function modelJsonUpdater(modelJson: any) {
          return { ...modelJson, version };
        }
        updateModelJson(posix.join(tmpDir, fileNames[0]), modelJsonUpdater);
        await spawner.rimraf(destinationDir);
        await spawner.mkdirp(dirname(destinationDir));
        await spawner.run({
          exe: 'mv',
          args: [
            spawner.resolvePath(tmpDir, fileNames[0]),
            spawner.resolvePath(destinationDir),
          ],
        });
      } finally {
        runBestEffortBackgroundTask(spawner.rimraf, tmpDir);
      }
    }
    return { changed };

    async function readModelJson(dir: string) {
      const output = await spawner.run({
        exe: 'cat',
        args: [spawner.resolvePath(dir, MODEL_CONFIG_FILE_NAME)],
      });
      const parsed = JSON.parse(output);
      return parsed;
    }

    async function updateModelJson(dir: string, updater: (current: any) => any) {
      const parsed = await readModelJson(dir);
      const updated = updater(parsed);
      const serialized = JSON.stringify(updated, null, 2);
      await spawner.run({
        exe: 'dd',
        args: [`of=${spawner.resolvePath(dir, MODEL_CONFIG_FILE_NAME)}`],
        input: toReadableStream(serialized),
      });
    }
  }
}
