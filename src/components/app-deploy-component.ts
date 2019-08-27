import logSymbols = require('log-symbols');
import { TerseError } from '@alwaysai/alwayscli';
import ora = require('ora');

import { appConfigFile } from '../util/app-config-file';
import { targetConfigFile } from '../util/target-config-file';
import { JsSpawner } from '../spawner/js-spawner';
import { AppInstaller } from '../app-installer';
import { spinOnPromise } from '../util/spin-on-promise';
import { echo } from '../util/echo';
import { getBearerToken } from '../util/cognito-auth';
import { appConfigurePreliminaryStepsComponent } from './app-configure-preliminary-steps-component';
import { TARGET_JSON_FILE_NAME } from '../constants';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { MissingFilePleaseRunAppConfigureMessage } from '../util/missing-file-please-run-app-configure-message';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { confirmWriteFileComponent } from './confirm-write-file-component';
import { buildDockerImageComponent } from './build-docker-image-component';

export async function appDeployComponent(props: { yes: boolean }) {
  const { yes } = props;

  await appConfigurePreliminaryStepsComponent({ yes, weAreInAppConfigure: false });
  let ranTargetJsonPromptComponent = false;
  if (targetConfigFile.exists()) {
    ora(`Found ${TARGET_JSON_FILE_NAME}`);
  } else {
    if (yes) {
      throw new TerseError(
        MissingFilePleaseRunAppConfigureMessage(TARGET_JSON_FILE_NAME),
      );
    }
    await confirmWriteFileComponent({
      description: 'Target configuration file',
      yes,
      fileName: TARGET_JSON_FILE_NAME,
    });
    await targetJsonPromptComponent();
    ranTargetJsonPromptComponent = true;
  }

  const bearerToken = await getBearerToken();
  if (!bearerToken) {
    throw new Error('Expected to get bearer token');
  }

  const appConfig = appConfigFile.read();
  const targetHostSpawner = targetConfigFile.readHostSpawner();
  const targetConfig = targetConfigFile.read();
  const sourceSpawner = JsSpawner();

  const hostAppInstaller = AppInstaller(targetHostSpawner, bearerToken);

  // Protocol-specific installation steps
  switch (targetConfig.targetProtocol) {
    case 'ssh+docker:': {
      const { targetHostname, targetPath } = targetConfig;
      if (!ranTargetJsonPromptComponent) {
        // If we ran the targetJsonPromptComponent we can skip these checks
        await findOrWritePrivateKeyFileComponent({ yes, weAreInAppConfigure: false });
        await checkSshConnectivityComponent({ targetHostname });
        await createTargetDirectoryComponent({ targetHostname, targetPath });
      }
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

  const dockerImageId = await buildDockerImageComponent({ targetHostSpawner });
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
