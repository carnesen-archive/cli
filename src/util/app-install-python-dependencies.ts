import { Spawner } from './spawner/types';
import { VENV, PYTHON_REQUIREMENTS_FILE_NAME } from '../constants';

export async function appInstallPythonDependencies(spawner: Spawner) {
  await spawner.run({
    exe: spawner.resolvePath(VENV, 'bin', 'pip'),
    args: [
      'install',
      '--requirement',
      spawner.resolvePath(PYTHON_REQUIREMENTS_FILE_NAME),
    ],
  });
}
