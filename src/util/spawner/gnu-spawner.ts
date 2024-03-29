import { Spawner } from './types';
import { CodedError } from '@carnesen/coded-error';
import toReadableStream = require('to-readable-stream');

export function GnuSpawner(context: {
  resolvePath: Spawner['resolvePath'];
  run: Spawner['run'];
  runForegroundSync: Spawner['runForegroundSync'];
  runForeground: Spawner['runForeground'];
  runStreaming: Spawner['runStreaming'];
}): Spawner {
  const { resolvePath, run, runForegroundSync, runForeground, runStreaming } = context;

  return {
    run,
    runForegroundSync,
    runForeground,
    runStreaming,
    resolvePath,
    readdir,
    async readFile(path) {
      const output = await run({
        exe: 'cat',
        args: [resolvePath(path)],
      });
      return output;
    },
    async writeFile(path, data) {
      await run({
        exe: 'dd',
        args: [`of=${resolvePath(path)}`],
        input: toReadableStream(data),
      });
    },
    async rename(oldPath, newPath) {
      await run({
        exe: 'mv',
        args: [resolvePath(oldPath), resolvePath(newPath)],
      });
    },
    mkdirp,
    rimraf,
    tar,
    untar,
    exists,
  };

  async function mkdirp(path?: string) {
    await run({ exe: 'mkdir', args: ['-p', resolvePath(path)] });
  }

  async function readdir(path?: string) {
    let output: string;
    const resolvedPath = resolvePath(path);
    try {
      output = await run({ exe: 'ls', args: ['-A1', resolvedPath] });
      // ^^ The output looks like '/foo/bar.txt' if path is an existing file
      // Else it looks like 'a b c' if the path is a directory with files/subdirs a, b, c.
    } catch (ex) {
      if (
        ex &&
        typeof ex.message === 'string' &&
        ex.message.includes('No such file or directory')
      ) {
        ex.code = 'ENOENT';
      }
      throw ex;
    }
    if (output.startsWith('/')) {
      throw new CodedError(`ENOTDIR: not a directory "${resolvedPath}"`, 'ENOTDIR');
    }
    return output.length > 0 ? output.split('\n') : [];
  }

  async function rimraf(path?: string) {
    await run({ exe: 'rm', args: ['-rf', resolvePath(path)] });
  }

  async function tar(...paths: string[]) {
    return await runStreaming({
      exe: 'tar',
      args: ['-cz', ...paths],
      cwd: resolvePath(),
    });
  }

  async function untar(input: NodeJS.ReadableStream, cwd = '.') {
    await run({
      exe: 'tar',
      args: ['-xz'],
      cwd,
      input,
    });
  }

  async function exists(path: string) {
    if (!path) {
      throw new Error('"path" is required');
    }
    try {
      await run({ exe: 'stat', args: [resolvePath(path)] });
      return true;
    } catch (ex) {
      return false;
    }
  }
}
