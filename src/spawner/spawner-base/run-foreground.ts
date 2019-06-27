import { spawn } from 'child_process';
import * as open from 'open';

import { Cmd } from '../types';

import signalExit = require('signal-exit');

export async function runForeground(cmd: Cmd): Promise<void> {
  const childProcess = spawn(cmd.exe, cmd.args || [], {
    cwd: cmd.cwd,
    stdio: 'inherit',
  });

  // Kill child when parent exits
  signalExit(() => {
    childProcess.kill();
    process.exit(1);
  });

  await new Promise<void>(() => {
    // Kill parent when child errors
    childProcess.on('error', () => {
      process.exit(1);
    });

    // Kill parent when child exits
    childProcess.on('exit', () => {
      process.exit(1);
    });

    // Kill parent when child process is closed.
    childProcess.on('close', () => {
      process.exit(1);
    });

    if (childProcess.stdout) {
      childProcess.stdout.on('data', (data: any) => {
        process.stdout.write(data);
        if (data.includes('http://0.0.0.0:5000/')) {
          open('http://0.0.0.0:5000/');
        }
      });
    }

    if (childProcess.stderr) {
      childProcess.stderr.on('data', (data: any) => {
        process.stderr.write(data);
      });
    }
  });
}
