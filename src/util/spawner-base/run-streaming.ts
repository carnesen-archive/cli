import { spawn } from 'child_process';

import signalExit = require('signal-exit');

import { Cmd } from '../spawner/types';

export function runStreaming(cmd: Cmd) {
  return new Promise<NodeJS.ReadableStream>((resolve, reject) => {
    const child = spawn(cmd.exe, cmd.args || [], {
      cwd: cmd.cwd,
    });

    signalExit(() => {
      child.kill();
    });

    if (cmd.input) {
      cmd.input.pipe(child.stdin);
    }

    const errChunks: Buffer[] = [];
    function stderrChunkHandler(chunk: Buffer) {
      errChunks.push(chunk);
    }

    child.stderr.on('data', stderrChunkHandler);

    child.on('error', (err: any) => {
      if (err && !err.stderr) {
        err.stderr = Buffer.concat(errChunks).toString();
      }
      reject(err);
    });

    child.stdout.once('readable', () => {
      resolve(child.stdout);
      child.stderr.removeListener('data', stderrChunkHandler);
    });
  });
}
