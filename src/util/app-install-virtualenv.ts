import { Spawner } from './spawner/types';
import { VENV } from '../constants';

export async function appInstallVirtualenv(
  spawner: Spawner,
  pythonExecutablePath = 'python',
) {
  const venvPath = spawner.resolvePath(VENV);
  await spawner.run({
    exe: pythonExecutablePath,
    args: ['-m', 'virtualenv', '--system-site-packages', venvPath],
  });
}
