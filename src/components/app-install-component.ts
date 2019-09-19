import { JsSpawner } from '../util/spawner/js-spawner';
import { runWithSpinner } from '../util/run-with-spinner';
import { VENV_BIN_ACTIVATE, PYTHON_REQUIREMENTS_FILE_NAME } from '../constants';
import { appInstallPythonDependencies } from '../util/app-install-python-dependencies';
import { appInstallVirtualenv } from '../util/app-install-virtualenv';
import { appInstallPreliminaryStepsComponent } from './app-install-preliminary-steps-component';
import { appInstallModelsComponent } from './app-install-models-component';
import { ALWAYSAI_HOME } from '../environment';
import { TerseError } from '@alwaysai/alwayscli';
import { isAbsolute, join } from 'path';

export async function appInstallComponent(props: { yes: boolean }) {
  const { yes } = props;

  if (!ALWAYSAI_HOME || !isAbsolute(ALWAYSAI_HOME)) {
    throw new TerseError(
      'This command requires that ALWAYSAI_HOME is set in your environment to the absolute path of your alwaysAI installation',
    );
  }

  await appInstallPreliminaryStepsComponent({ yes });

  const spawner = JsSpawner();

  await appInstallModelsComponent(spawner);

  if (!(await spawner.exists(VENV_BIN_ACTIVATE))) {
    const pythonExecutablePath = join(
      ALWAYSAI_HOME,
      'resources',
      'app',
      'python35',
      'python',
    );

    await runWithSpinner(
      appInstallVirtualenv,
      [spawner, pythonExecutablePath],
      'Install python virtualenv',
    );
  }

  if (await spawner.exists(PYTHON_REQUIREMENTS_FILE_NAME)) {
    await runWithSpinner(
      appInstallPythonDependencies,
      [spawner],
      'Install python dependencies',
    );
  }
}
