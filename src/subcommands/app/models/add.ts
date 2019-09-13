import ora = require('ora');

import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { appConfigFile } from '../../../util/app-json-file';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import { echo } from '../../../util/echo';
import { checkUserIsLoggedInComponent } from '../../../components/check-user-is-logged-in-component';
import { rpcClient } from '../../../util/rpc-client';
import { downloadModelPackageToCache } from '../../../util/download-model-package-to-cache';
import { modelPackageCache } from '../../../util/model-package-cache';

export const addModelsAddCliLeaf = createLeaf({
  name: 'add',
  description: 'Add model(s) to this application',
  args: modelIdsCliInput,
  async action(ids) {
    appConfigFile.read();
    await checkUserIsLoggedInComponent({ yes: false });
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
      appConfigFile.addModel(id, version);
    });
    echo();
    echo(appConfigFile.describeModels());
  },
});
