import { spawnSync } from 'child_process';

import { Cmd } from '../spawner/types';

export function runForegroundSync(cmd: Cmd) {
  const out = spawnSync(cmd.exe, cmd.args || [], {
    cwd: cmd.cwd,
    stdio: 'inherit',
  });
  if (out.error) {
    throw out.error;
  }
}
