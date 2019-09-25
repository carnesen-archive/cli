import { TerseError } from '@alwaysai/alwayscli';
import { isAbsolute, join } from 'path';
import { existsSync } from 'fs';

import { JsSpawner } from '../util/spawner/js-spawner';
import { runWithSpinner } from '../util/run-with-spinner';
import {
  VENV,
  PYTHON_REQUIREMENTS_FILE_NAME,
  ALWAYSAI_DESKTOP_SOFTWARE_NAME,
} from '../constants';
import { appInstallPreliminaryStepsComponent } from './app-install-preliminary-steps-component';
import { appInstallModelsComponent } from './app-install-models-component';
import { ALWAYSAI_HOME } from '../environment';
import { run } from '../util/spawner-base/run';
import { VenvExecutablesDirectoryName } from '../util/venv-executables-directory-name';

export async function appInstallComponent(props: { yes: boolean }) {
  const { yes } = props;

  if (!ALWAYSAI_HOME || !isAbsolute(ALWAYSAI_HOME)) {
    throw new TerseError(
      `This command requires that ALWAYSAI_HOME is set in your environment to the absolute path of your ${ALWAYSAI_DESKTOP_SOFTWARE_NAME} installation`,
    );
  }

  await appInstallPreliminaryStepsComponent({ yes });

  await appInstallModelsComponent(JsSpawner());

  if (!existsSync(join(VENV, VenvExecutablesDirectoryName()))) {
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
          exe: join(VENV, VenvExecutablesDirectoryName(), 'pip'),
          args: ['--requirement', PYTHON_REQUIREMENTS_FILE_NAME],
        },
      ],
      'Install python dependencies',
    );
  }
}
