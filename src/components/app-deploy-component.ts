import logSymbols = require('log-symbols');

import { appConfigFile } from '../util/app-config-file';
import { targetConfigFile } from '../util/target-config-file';
import { JsSpawner } from '../spawner/js-spawner';
import { AppInstaller } from '../app-installer';
import { spinOnPromise } from '../util/spin-on-promise';
import { echo } from '../util/echo';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { checkForRequiredFilesComponent } from './check-for-required-files-component';
import { getBearerToken } from '../util/cognito-auth';

export async function appDeployComponent(props: { yes: boolean }) {
  const { yes } = props;

  await checkUserIsLoggedInComponent({ yes });
  const bearerToken = await getBearerToken();
  if (!bearerToken) {
    throw new Error('Expected to get bearer token');
  }
  await checkForRequiredFilesComponent({ yes });
  const appConfig = appConfigFile.read();
  const targetSpawner = targetConfigFile.readSpawner();
  const targetConfig = targetConfigFile.read();
  const sourceSpawner = JsSpawner();
  await spinOnPromise(targetSpawner.mkdirp(), 'Create target directory');

  const appInstaller = AppInstaller(targetSpawner, bearerToken);

  // Protocol-specific installation steps
  switch (targetConfig.protocol) {
    case 'ssh+docker:': {
      await spinOnPromise(
        appInstaller.installSource(sourceSpawner),
        'Copy application to target',
      );
    }
  }

  let hasModels = false;
  if (appConfig.models) {
    const ids = Object.keys(appConfig.models);
    if (ids.length > 0) {
      hasModels = true;
      await spinOnPromise(
        appInstaller.installModels(appConfig.models),
        `Model${ids.length > 1 ? 's' : ''} ${ids.join(' ')}`,
      );
    }
  }

  if (!hasModels) {
    echo(`${logSymbols.warning} Application has no models`);
  }

  await spinOnPromise(appInstaller.installVirtualenv(), 'Install python virtualenv');
  await spinOnPromise(appInstaller.installPythonDeps(), 'Install python dependencies');
}
