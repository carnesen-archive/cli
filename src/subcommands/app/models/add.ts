import ora = require('ora');
import { existsSync } from 'fs';

import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { appConfigFile } from '../../../util/app-config-file';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import { RpcClient } from '../../../rpc-client';
import { echo } from '../../../util/echo';
import { modelVersionPackageCacheDownloadFromCloud } from '../../../util/model-version-package-cache-download-from-cloud';
import { modelVersionPackageCacheGetPath } from '../../../util/model-version-package-path';
import { getBearerToken } from '../../../util/cognito-auth';
import { checkUserIsLoggedInComponent } from '../../../components/check-user-is-logged-in-component';

export const addModelsAddCliLeaf = createLeaf({
  name: 'add',
  description: 'Add model(s) to this application',
  args: modelIdsCliInput,
  async action(modelIds) {
    appConfigFile.read();
    await checkUserIsLoggedInComponent({ yes: false });
    const bearerToken = await getBearerToken();
    if (!bearerToken) {
      throw new Error('Expected user to be logged in');
    }
    const rpcClient = await RpcClient();
    const fetched: [string, number][] = [];
    for (const modelId of modelIds) {
      const spinner = ora(`Fetch model "${modelId}"`).start();
      try {
        const { version } = await rpcClient.getModelVersion({ id: modelId });
        if (!existsSync(modelVersionPackageCacheGetPath({ id: modelId, version }))) {
          await modelVersionPackageCacheDownloadFromCloud({
            id: modelId,
            version,
            bearerToken,
          });
        }
        fetched.push([modelId, version]);
        spinner.succeed();
      } catch (ex) {
        spinner.fail();
        if (ex.code === 'MODEL_VERSION_NOT_FOUND') {
          throw new TerseError(`Model not found: "${modelId}"`);
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
