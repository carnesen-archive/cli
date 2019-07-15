import ora = require('ora');
import logSymbols = require('log-symbols');

import { createLeaf, TerseError } from '@alwaysai/alwayscli';
import { ErrorCode } from '@alwaysai/cloud-api';

import { appConfigFile } from '../../../util/app-config-file';
import { RpcClient } from '../../../rpc-client';
import { echo } from '../../../util/echo';

export const appModelsUpdate = createLeaf({
  name: 'update',
  description: "Update this application's models to the latest versions",
  async action() {
    const { models } = appConfigFile.read();
    const rpcClient = await RpcClient();
    const updates: [string, string, string][] = [];
    if (!models || Object.keys(models).length === 0) {
      return 'No models to update!';
    }
    const spinner = ora('Fetching model metadata').start();
    for (const [id, currentVersion] of Object.entries(models)) {
      try {
        const { version: latestVersion } = await rpcClient.getModelVersion({ id });
        if (currentVersion !== latestVersion) {
          updates.push([id, currentVersion, latestVersion]);
        }
      } catch (ex) {
        spinner.fail();
        if (ex.code === ErrorCode.MODEL_VERSION_NOT_FOUND) {
          throw new TerseError(`Model not found: "${id}"`);
        }
        throw ex;
      }
    }
    spinner.succeed();

    if (updates.length === 0) {
      return `${logSymbols.success} All models are already up to date!`;
    }

    echo(`${logSymbols.success} Updated models`);
    updates.forEach(([id, currentVersion, nextVersion]) => {
      echo(`    ${id} ${currentVersion} --> ${nextVersion}`);
      appConfigFile.addModel(id, nextVersion);
    });
    return undefined;
  },
});
