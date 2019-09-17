import { existsSync } from 'fs';
import logSymbols = require('log-symbols');
import { TerseError } from '@alwaysai/alwayscli';

import { AppJsonFile } from '../util/app-json-file';
import { TargetJsonFile } from '../util/target-json-file';
import { JsSpawner } from '../util/spawner/js-spawner';
import { spinOnPromise } from '../util/spin-on-promise';
import { echo } from '../util/echo';
import {
  TARGET_JSON_FILE_NAME,
  DOCKERFILE,
  DOCKER_TEST_IMAGE_ID,
  VENV_BIN_ACTIVATE,
  PYTHON_REQUIREMENTS_FILE_NAME,
} from '../constants';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { buildDockerImageComponent } from './build-docker-image-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import ora = require('ora');
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { appInstallPythonDependencies } from '../util/app-install-python-dependencies';
import { appInstallVirtualenv } from '../util/app-install-virtualenv';
import { appCopyFiles } from '../util/app-copy-files';
import { appInstallModels } from '../util/app-install-models';
import { Spinner } from '../util/spinner';

export async function appDeployComponent(props: { yes: boolean }) {
  const { yes } = props;
  const appJsonFile = AppJsonFile();
  await checkUserIsLoggedInComponent({ yes });
  if (!appJsonFile.exists()) {
    throw new TerseError(MissingFilePleaseRunAppConfigureMessage(appJsonFile.name));
  }
  if (!existsSync(DOCKERFILE)) {
    throw new TerseError(MissingFilePleaseRunAppConfigureMessage(DOCKERFILE));
  }

  let ranTargetJsonPromptComponent = false;
  const targetJsonFile = TargetJsonFile();
  if (!targetJsonFile.exists()) {
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

  const appJson = appJsonFile.read();
  const targetHostSpawner = targetJsonFile.readHostSpawner();
  const targetJson = targetJsonFile.read();
  const sourceSpawner = JsSpawner();

  const targetSpawner = targetJsonFile.readContainerSpawner();

  // Protocol-specific installation steps
  switch (targetJson.targetProtocol) {
    case 'ssh+docker:': {
      const { targetHostname, targetPath } = targetJson;
      if (!ranTargetJsonPromptComponent) {
        // If we ran the targetJsonPromptComponent we can skip these checks
        await findOrWritePrivateKeyFileComponent({ yes });
        await checkSshConnectivityComponent({ targetHostname });
        await createTargetDirectoryComponent({ targetHostname, targetPath });
      }
      const spinner = ora('Copy application to target').start();
      try {
        await appCopyFiles(sourceSpawner, targetSpawner);
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
    echo(`${logSymbols.warning} Application has no models`);
  }

  const dockerImageId = await buildDockerImageComponent({ targetHostSpawner });
  targetJsonFile.update(targetJson => {
    targetJson.dockerImageId = dockerImageId;
  });

  {
    const spinner = Spinner('Install python virtualenv');
    try {
      if (await targetSpawner.exists(VENV_BIN_ACTIVATE)) {
        spinner.succeed('Found python virtualenv');
      } else {
        await appInstallVirtualenv(targetSpawner);
        spinner.succeed();
      }
    } catch (exception) {
      spinner.fail();
      throw exception;
    }
  }

  if (await sourceSpawner.exists(PYTHON_REQUIREMENTS_FILE_NAME)) {
    await spinOnPromise(
      appInstallPythonDependencies(targetSpawner),
      'Install python dependencies',
    );
  }
}

function MissingFilePleaseRunAppConfigureMessage(fileName: string) {
  return `Missing file "${fileName}". Please run \`alwaysai app configure\` to set up this directory as an alwaysAI application.`;
}
