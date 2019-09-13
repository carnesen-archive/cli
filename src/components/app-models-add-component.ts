import ora = require('ora');

import { TerseError } from '@alwaysai/alwayscli';

import { AppJsonFile } from '../util/app-json-file';
import { echo } from '../util/echo';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { rpcClient } from '../util/rpc-client';
import { downloadModelPackageToCache } from '../util/download-model-package-to-cache';
import { modelPackageCache } from '../util/model-package-cache';

export async function appModelsAddComponent(props: {
  yes: boolean;
  dir: string;
  ids: string[];
}) {
  const { yes, dir, ids } = props;
  const appJsonFile = AppJsonFile(dir);
  appJsonFile.read();
  await checkUserIsLoggedInComponent({ yes });
  const fetched: [string, number][] = [];
  for (const id of ids) {
    const spinner = ora(`Fetch model "${id}"`).start();
    try {
      const { version } = await rpcClient.getModelVersion({ id });
      if (!modelPackageCache.has(id, version)) {
        await downloadModelPackageToCache(id, version);
      }
      fetched.push([id, version]);
      spinner.succeed();
    } catch (ex) {
      spinner.fail();
      if (ex.code === 'MODEL_VERSION_NOT_FOUND') {
        throw new TerseError(`Model not found: "${id}"`);
      }
      throw ex;
    }
  }
  fetched.forEach(([id, version]) => {
    appJsonFile.addModel(id, version);
  });
  echo();
  echo(appJsonFile.describeModels());
}
