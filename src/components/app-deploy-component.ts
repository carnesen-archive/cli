import { existsSync } from 'fs';
import logSymbols = require('log-symbols');
import { TerseError } from '@alwaysai/alwayscli';

import { appConfigFile } from '../util/app-config-file';
import { targetConfigFile } from '../util/target-config-file';
import { JsSpawner } from '../spawner/js-spawner';
import { AppInstaller } from '../app-installer';
import { spinOnPromise } from '../util/spin-on-promise';
import { echo } from '../util/echo';
import { TARGET_JSON_FILE_NAME, DOCKERFILE, DOCKER_TEST_IMAGE_ID } from '../constants';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { MissingFilePleaseRunAppConfigureMessage } from '../util/missing-file-please-run-app-configure-message';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { buildDockerImageComponent } from './build-docker-image-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import ora = require('ora');
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';

export async function appDeployComponent(props: { yes: boolean }) {
  const { yes } = props;

  await checkUserIsLoggedInComponent({ yes });
  if (!appConfigFile.exists()) {
    throw new TerseError(MissingFilePleaseRunAppConfigureMessage(appConfigFile.name));
  }
  if (!existsSync(DOCKERFILE)) {
    throw new TerseError(MissingFilePleaseRunAppConfigureMessage(DOCKERFILE));
  }

  let ranTargetJsonPromptComponent = false;
  if (!targetConfigFile.exists()) {
    if (yes) {
      throw new TerseError(
        MissingFilePleaseRunAppConfigureMessage(TARGET_JSON_FILE_NAME),
      );
    }
    const confirmed = await confirmWriteFilePromptComponent({
      fileName: undefined,
      description: 'Target configuration',
    });
    if (!confirmed) {
      throw new TerseError('Unable to proceed without a target configuration');
    }
    await targetJsonPromptComponent();
    ranTargetJsonPromptComponent = true;
  }

  const appConfig = appConfigFile.read();
  const targetHostSpawner = targetConfigFile.readHostSpawner();
  const targetConfig = targetConfigFile.read();
  const sourceSpawner = JsSpawner();

  const hostAppInstaller = AppInstaller(targetHostSpawner);

  // Protocol-specific installation steps
  switch (targetConfig.targetProtocol) {
    case 'ssh+docker:': {
      const { targetHostname, targetPath } = targetConfig;
      if (!ranTargetJsonPromptComponent) {
        // If we ran the targetJsonPromptComponent we can skip these checks
        await findOrWritePrivateKeyFileComponent({ yes });
        await checkSshConnectivityComponent({ targetHostname });
        await createTargetDirectoryComponent({ targetHostname, targetPath });
      }
      const spinner = ora('Copy application to target').start();
      try {
        await hostAppInstaller.installSource(sourceSpawner);
        await targetHostSpawner.run({
          exe: 'docker',
          args: [
            'run',
            '--rm',
            '--workdir',
            '/app',
            '--volume',
            '$(pwd):/app',
            DOCKER_TEST_IMAGE_ID,
            'chown',
            '-R',
            '$(id -u ${USER}):$(id -g ${USER})',
            '/app',
          ],
          cwd: '.',
        });
        spinner.succeed();
      } catch (exception) {
        spinner.fail();
        throw exception;
      }
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
  const targetAppInstaller = AppInstaller(targetSpawner);
  await spinOnPromise(
    targetAppInstaller.installVirtualenv(),
    'Install python virtualenv',
  );
  await spinOnPromise(
    targetAppInstaller.installPythonDeps(),
    'Install python dependencies',
  );
}
