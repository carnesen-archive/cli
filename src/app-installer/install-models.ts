import { dirname, posix } from 'path';

import { Spawner } from '../spawner/types';
import { ModelId } from '../util/model-id';
import { MODEL_CONFIG_FILE_NAME } from '../subcommands/model/model-config-file';
import { getRandomString } from '../util/get-random-string';
import { PackageStreamFromCache } from '../model-manager/package-stream-from-cache';
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

export function InstallModels(spawner: Spawner) {
  return async function installModels(models: AppConfig['models']) {
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

  async function installModel(id: string, version: string) {
    let changed = false;
    const { publisher, name } = ModelId.parse(id);
    const modelDir = posix.join(MODELS_DIR, publisher, name);
    let installedVersion: string | undefined = undefined;
    try {
      const output = await spawner.run({
        exe: 'cat',
        args: [spawner.resolvePath(modelDir, MODEL_CONFIG_FILE_NAME)],
      });
      const parsed = JSON.parse(output);
      installedVersion = parsed.version;
    } catch (_) {
      // TODO finer-grained error handling
    }

    if (installedVersion !== version) {
      changed = true;
      const tmpId = getRandomString();
      const tmpDir = `${modelDir}.${tmpId}.download`;
      await spawner.mkdirp(tmpDir);
      try {
        await spawner.untar(await PackageStreamFromCache({ id, version }), tmpDir);
        const fileNames = await spawner.readdir(tmpDir);
        if (fileNames.length !== 1 || !fileNames[0]) {
          throw new Error('Expected package to contain single directory');
        }
        await spawner.rimraf(modelDir);
        await spawner.mkdirp(dirname(modelDir));
        await spawner.run({
          exe: 'mv',
          args: [
            spawner.resolvePath(tmpDir, fileNames[0]),
            spawner.resolvePath(modelDir),
          ],
        });
      } finally {
        runBestEffortBackgroundTask(spawner.rimraf, tmpDir);
      }
    }
    return { changed };
  }
}
