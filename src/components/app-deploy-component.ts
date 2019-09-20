import { TerseError } from '@alwaysai/alwayscli';
import { existsSync } from 'fs';

import { TargetJsonFile } from '../util/target-json-file';
import { JsSpawner } from '../util/spawner/js-spawner';
import { runWithSpinner } from '../util/run-with-spinner';
import {
  TARGET_JSON_FILE_NAME,
  DOCKER_TEST_IMAGE_ID,
  VENV_BIN_ACTIVATE,
  PYTHON_REQUIREMENTS_FILE_NAME,
  VENV,
} from '../constants';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { buildDockerImageComponent } from './build-docker-image-component';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { appCopyFiles } from '../util/app-copy-files';
import { Spinner } from '../util/spinner';
import { appInstallPreliminaryStepsComponent } from './app-install-preliminary-steps-component';
import { appInstallModelsComponent } from './app-install-models-component';
import { SshDockerSpawner } from '../util/spawner/ssh-docker-spawner';
import { posix } from 'path';

export async function appDeployComponent(props: { yes: boolean }) {
  const { yes } = props;

  await appInstallPreliminaryStepsComponent({ yes });

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

  const targetHostSpawner = targetJsonFile.readHostSpawner();
  const targetJson = targetJsonFile.read();
  const sourceSpawner = JsSpawner();

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

      const busyboxSpawner = SshDockerSpawner({
        targetHostname,
        targetPath,
        dockerImageId: DOCKER_TEST_IMAGE_ID,
      });

      await runWithSpinner(
        async () => {
          await appCopyFiles(sourceSpawner, busyboxSpawner);
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
        },
        [],
        'Copy application to target',
      );
    }
  }

  const dockerImageId = await buildDockerImageComponent({ targetHostSpawner });
  targetJsonFile.update(targetJson => {
    targetJson.dockerImageId = dockerImageId;
  });

  const targetSpawner = targetJsonFile.readContainerSpawner();

  await appInstallModelsComponent(targetSpawner);

  const spinner = Spinner('Install python virtual environment');
  try {
    if (await targetSpawner.exists(VENV_BIN_ACTIVATE)) {
      spinner.succeed('Found python virtual environment');
    } else {
      await targetSpawner.run({
        exe: 'virtualenv',
        args: ['--system-site-packages', VENV],
        cwd: '.',
      });
      spinner.succeed();
    }
  } catch (exception) {
    spinner.fail();
    throw exception;
  }

  if (existsSync(PYTHON_REQUIREMENTS_FILE_NAME)) {
    await runWithSpinner(
      targetSpawner.run,
      [
        {
          exe: posix.join(VENV, 'bin', 'pip'),
          args: ['install', '--requirement', PYTHON_REQUIREMENTS_FILE_NAME],
          cwd: '.',
        },
      ],
      'Install python dependencies',
    );
  }
}

function MissingFilePleaseRunAppConfigureMessage(fileName: string) {
  return `Missing file "${fileName}". Please run \`alwaysai app configure\` to set up this directory as an alwaysAI application.`;
}
