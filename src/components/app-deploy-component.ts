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
import { buildDockerImage } from '../util/build-docker-image';

export async function appDeployComponent(props: { yes: boolean }) {
  const { yes } = props;

  await checkUserIsLoggedInComponent({ yes });
  const bearerToken = await getBearerToken();
  if (!bearerToken) {
    throw new Error('Expected to get bearer token');
  }
  await checkForRequiredFilesComponent({ yes });
  const appConfig = appConfigFile.read();
  const targetHostSpawner = targetConfigFile.readHostSpawner();
  const targetConfig = targetConfigFile.read();
  const sourceSpawner = JsSpawner();
  await spinOnPromise(targetHostSpawner.mkdirp(), 'Create target directory');

  const hostAppInstaller = AppInstaller(targetHostSpawner, bearerToken);

  // Protocol-specific installation steps
  switch (targetConfig.targetProtocol) {
    case 'ssh+docker:': {
      await spinOnPromise(
        hostAppInstaller.installSource(sourceSpawner),
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
        hostAppInstaller.installModels(appConfig.models),
        `Model${ids.length > 1 ? 's' : ''} ${ids.join(' ')}`,
      );
    }
  }

  if (!hasModels) {
    echo(`${logSymbols.warning} Application has no models`);
  }

  const dockerImageId = await spinOnPromise(
    buildDockerImage(targetHostSpawner),
    'Build docker image',
  );

  targetConfigFile.update(targetConfiguration => {
    targetConfiguration.dockerImageId = dockerImageId;
  });

  const targetSpawner = targetConfigFile.readContainerSpawner();
  const targetAppInstaller = AppInstaller(targetSpawner, bearerToken);
  await spinOnPromise(
    targetAppInstaller.installVirtualenv(),
    'Install python virtualenv',
  );
  await spinOnPromise(
    targetAppInstaller.installPythonDeps(),
    'Install python dependencies',
  );
}
