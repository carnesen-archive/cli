import logSymbols = require('log-symbols');

import { AppJsonFile } from '../util/app-json-file';
import { runWithSpinner } from '../util/run-with-spinner';
import { echo } from '../util/echo';
import { appInstallModel } from '../util/app-install-model';
import { Spawner } from '../util/spawner/types';

export async function appInstallModelsComponent(spawner: Spawner) {
  const appJsonFile = AppJsonFile();
  const appJson = appJsonFile.read();

  let hasModels = false;
  if (appJson.models) {
    for (const [id, version] of Object.entries(appJson.models)) {
      hasModels = true;
      await runWithSpinner(
        appInstallModel,
        [spawner, id, version],
        `Install model ${id}`,
      );
    }
  }

  if (!hasModels) {
    echo(`${logSymbols.warning} Application has no models`);
  }
}
