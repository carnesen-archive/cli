import LogSymbols = require('log-symbols');

import { createLeaf } from '@alwaysai/alwayscli';

import { AppJsonFile } from '../../util/app-json-file';
import { spinOnPromise } from '../../util/spin-on-promise';
import { JsSpawner } from '../../util/spawner/js-spawner';
import { echo } from '../../util/echo';
import { checkUserIsLoggedInComponent } from '../../components/check-user-is-logged-in-component';
import { appInstallModels } from '../../util/app-install-models';

export const appUnderscoreInstallCliLeaf = createLeaf({
  name: '_install',
  hidden: true,
  description: "Install this application's dependencies",
  async action() {
    const appJsonFile = AppJsonFile(process.cwd());
    const appJson = appJsonFile.read();
    await checkUserIsLoggedInComponent({ yes: false });
    const targetSpawner = JsSpawner();

    let hasModels = false;
    if (appJson.models) {
      const ids = Object.keys(appJson.models);
      if (ids.length > 0) {
        hasModels = true;
        await spinOnPromise(
          appInstallModels(targetSpawner),
          `Model${ids.length > 1 ? 's' : ''} ${ids.join(' ')}`,
        );
      }
    }

    if (!hasModels) {
      echo(`${LogSymbols.warning} Application has no models`);
    }

    // await spinOnPromise(appInstaller.installVirtualenv(), 'Python virtualenv');
    // await spinOnPromise(appInstaller.installPythonDeps(), 'Python dependencies');
  },
});
