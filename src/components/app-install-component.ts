import { TerseError } from '@alwaysai/alwayscli';
import { isAbsolute, join } from 'path';
import { platform } from 'os';
import { existsSync } from 'fs';

import { JsSpawner } from '../util/spawner/js-spawner';
import { runWithSpinner } from '../util/run-with-spinner';
import {
  VENV,
  VENV_SCRIPTS_ACTIVATE,
  PYTHON_REQUIREMENTS_FILE_NAME,
  ALWAYSAI_DESKTOP_SOFTWARE_NAME,
} from '../constants';
import { appInstallPreliminaryStepsComponent } from './app-install-preliminary-steps-component';
import { appInstallModelsComponent } from './app-install-models-component';
import { ALWAYSAI_HOME } from '../environment';
import { run } from '../util/spawner-base/run';

export async function appInstallComponent(props: {
  yes: boolean;
  nodejsPlatform?: NodeJS.Platform;
}) {
  const { yes, nodejsPlatform = platform() } = props;

  if (!ALWAYSAI_HOME || !isAbsolute(ALWAYSAI_HOME)) {
    throw new TerseError(
      `This command requires that ALWAYSAI_HOME is set in your environment to the absolute path of your ${ALWAYSAI_DESKTOP_SOFTWARE_NAME} installation`,
    );
  }

  await appInstallPreliminaryStepsComponent({ yes });

  await appInstallModelsComponent(JsSpawner());

  // TODO: Remove Windows specificity
  if (!existsSync(VENV_SCRIPTS_ACTIVATE)) {
    const pythonExecutablePath = join(
      ALWAYSAI_HOME,
      'resources',
      'app',
      'python35',
      'python',
    );

    await runWithSpinner(
      run,
      [
        {
          exe: pythonExecutablePath,
          args: ['-m', VENV, '--system-site-packages', VENV],
          cwd: '.',
        },
      ],
      'Install python virtual environment',
    );
  }

  if (existsSync(PYTHON_REQUIREMENTS_FILE_NAME)) {
    await runWithSpinner(
      run,
      [
        {
          exe: join(VENV, nodejsPlatform === 'win32' ? 'Scripts' : 'bin', 'pip'),
          args: ['--requirement', PYTHON_REQUIREMENTS_FILE_NAME],
        },
      ],
      'Install python dependencies',
    );
  }
}
