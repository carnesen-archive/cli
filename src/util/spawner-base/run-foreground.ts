import { spawn } from 'child_process';

import { Cmd } from '../spawner/types';

import signalExit = require('signal-exit');

export async function runForeground(cmd: Cmd) {
  const childProcess = spawn(cmd.exe, cmd.args || [], {
    cwd: cmd.cwd,
    stdio: 'inherit',
  });

  // Kill child when parent exits
  signalExit(() => {
    childProcess.kill();
  });

  return await new Promise<number | undefined>((resolve, reject) => {
    childProcess.on('error', err => {
      reject(err);
    });

    childProcess.on('exit', code => {
      if (code) {
        resolve(code);
      } else {
        resolve();
      }
    });
  });
}
