import logSymbols = require('log-symbols');

import { AppJsonFile } from '../util/app-json-file';
import { runWithSpinner } from '../util/run-with-spinner';
import { echo } from '../util/echo';
import { appInstallModels } from '../util/app-install-models';
import { Spawner } from '../util/spawner/types';

const SEPARATOR = '\n    ';

export async function appInstallModelsComponent(spawner: Spawner) {
  const appJsonFile = AppJsonFile();
  const appJson = appJsonFile.read();

  let hasModels = false;
  if (appJson.models) {
    const ids = Object.keys(appJson.models);
    if (ids.length > 0) {
      hasModels = true;
      await runWithSpinner(
        appInstallModels,
        [spawner],
        `Install model${ids.length > 1 ? `s:${SEPARATOR}` : ' '}${ids.join(SEPARATOR)}`,
      );
    }
  }

  if (!hasModels) {
    echo(`${logSymbols.warning} Application has no models`);
  }
}
