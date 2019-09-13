import { Spawner } from './spawner/types';
import { VENV } from '../constants';

export async function appInstallVirtualenv(target: Spawner) {
  await target.run({
    exe: 'virtualenv',
    args: ['--system-site-packages', VENV],
    cwd: '.',
  });
}
