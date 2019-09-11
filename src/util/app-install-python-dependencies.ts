import { Spawner } from '../spawner/types';
import { VENV } from '../constants';

export const REQUIREMENTS_FILE_NAME = 'requirements.txt';

export async function appInstallPythonDependencies(target: Spawner) {
  await target.run({
    exe: target.resolvePath(VENV, 'bin', 'pip'),
    args: ['install', '--requirement', target.resolvePath(REQUIREMENTS_FILE_NAME)],
  });
}
