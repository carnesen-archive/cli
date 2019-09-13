import logSymbols = require('log-symbols');
import { TerseError } from '@alwaysai/alwayscli';

import { AppJsonFile } from '../util/app-json-file';
import { rpcClient } from '../util/rpc-client';
import { echo } from '../util/echo';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { Spinner } from '../util/spinner';

export async function appModelsUpdateComponent(props: { yes: boolean; dir: string }) {
  const { yes, dir } = props;
  await checkUserIsLoggedInComponent({ yes });
  const appJsonFile = AppJsonFile(dir);
  const { models } = appJsonFile.read();
  const updates: [string, number, number][] = [];
  if (!models || Object.keys(models).length === 0) {
    echo('No models to update!');
  } else {
    const spinner = Spinner('Fetching model metadata');
    for (const [id, currentVersion] of Object.entries(models)) {
      try {
        const { version: latestVersion } = await rpcClient.getModelVersion({ id });
        if (currentVersion !== latestVersion) {
          updates.push([id, currentVersion, latestVersion]);
        }
      } catch (ex) {
        spinner.fail();
        if (ex.code === 'MODEL_VERSION_NOT_FOUND') {
          throw new TerseError(`Model not found: "${id}"`);
        }
        throw ex;
      }
    }
    spinner.succeed();

    if (updates.length === 0) {
      echo(`${logSymbols.success} All models are already up to date!`);
    }

    echo(`${logSymbols.success} Updated models`);
    updates.forEach(([id, currentVersion, nextVersion]) => {
      echo(`    ${id} ${currentVersion} --> ${nextVersion}`);
      appJsonFile.addModel(id, nextVersion);
    });
  }
}
