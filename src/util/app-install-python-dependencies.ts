import { Spawner } from './spawner/types';
import { VENV, PYTHON_REQUIREMENTS_FILE_NAME } from '../constants';

export async function appInstallPythonDependencies(target: Spawner) {
  await target.run({
    exe: target.resolvePath(VENV, 'bin', 'pip'),
    args: ['install', '--requirement', target.resolvePath(PYTHON_REQUIREMENTS_FILE_NAME)],
  });
}
