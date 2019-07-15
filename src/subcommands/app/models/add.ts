import ora = require('ora');
import { existsSync } from 'fs';

import { createLeaf, TerseError } from '@alwaysai/alwayscli';
import { ErrorCode } from '@alwaysai/cloud-api';

import { appConfigFile } from '../../../util/app-config-file';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import { RpcClient } from '../../../rpc-client';
import { echo } from '../../../util/echo';
import { downloadModelVersionPackage } from '../../../model-manager/download-model-version-package';
import { ModelPackagePath } from '../../../model-manager/model-package-path';

export const addModelsAddCliLeaf = createLeaf({
  name: 'add',
  description: 'Add one or more alwaysAI models to this app',
  args: modelIdsCliInput,
  async action(modelIds) {
    appConfigFile.read();
    const rpcClient = await RpcClient();
    const fetched: [string, string][] = [];
    for (const modelId of modelIds) {
      const spinner = ora(`Fetch model "${modelId}"`).start();
      try {
        const { version } = await rpcClient.getModelVersion({ id: modelId });
        if (!existsSync(ModelPackagePath({ id: modelId, version }))) {
          await downloadModelVersionPackage({ id: modelId, version });
        }
        fetched.push([modelId, version]);
        spinner.succeed();
      } catch (ex) {
        spinner.fail();
        if (ex.code === ErrorCode.MODEL_VERSION_NOT_FOUND) {
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
