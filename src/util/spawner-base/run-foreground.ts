import { spawn } from 'child_process';

import { Cmd } from '../spawner/types';

import signalExit = require('signal-exit');
import { TerseError } from '@alwaysai/alwayscli';

export async function runForeground(cmd: Cmd): Promise<void> {
  const childProcess = spawn(cmd.exe, cmd.args || [], {
    cwd: cmd.cwd,
    stdio: 'inherit',
  });

  // Kill child when parent exits
  signalExit(() => {
    childProcess.kill();
  });

  await new Promise<void>((resolve, reject) => {
    childProcess.on('error', err => {
      reject(err);
    });

    childProcess.on('exit', code => {
      if (code) {
        reject(new TerseError(`Child process exited with code "${code}"`));
      } else {
        resolve();
      }
    });
  });
}
