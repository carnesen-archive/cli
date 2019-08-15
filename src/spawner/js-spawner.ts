import { readdir as fsReaddir, access } from 'fs';

import { Readable } from 'stream';
import { promisify } from 'util';
import { isAbsolute, resolve } from 'path';

import * as tarJs from 'tar';
import * as mkdirpJs from 'mkdirp';
import * as rimrafJs from 'rimraf';

import { Spawner, Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';

export function JsSpawner(context: { path?: string } = {}): Spawner {
  const gnuSpawner = GnuSpawner({ resolvePath, ...SpawnerBase(translate) });
  return {
    ...gnuSpawner,
    resolvePath,
    readdir,
    mkdirp,
    rimraf,
    tar,
    exists,
  };

  function resolvePath(...paths: (string | undefined)[]) {
    return resolve(context.path || '', ...paths.map(path => path || ''));
  }

  function translate(cmd: Cmd) {
    if (cmd.superuser) {
      throw new Error(`${JsSpawner.name} does not support cmd option "superuser"`);
    }
    const translated: Cmd = {
      ...cmd,
    };

    if (cmd.cwd) {
      translated.cwd = resolvePath(cmd.cwd);
    }

    return translated;
  }

  async function mkdirp(path = '') {
    await promisify(mkdirpJs)(resolvePath(path));
  }

  async function rimraf(path = '') {
    await promisify(rimrafJs)(resolvePath(path));
  }

  function readdir(path = '') {
    return promisify(fsReaddir)(resolvePath(path));
  }

  async function tar(...paths: string[]) {
    for (const path in paths) {
      if (isAbsolute(path)) {
        throw new Error('Paths passed to spawner.tar must not be absolute');
      }
    }
    const packageStream = (tarJs.create(
      { sync: true, gzip: true, cwd: resolvePath() },
      paths,
    ) as unknown) as Readable;
    // ^^ The @types for tar.create are not correct
    return packageStream;
  }

  async function exists(path: string) {
    if (!path) {
      throw new Error('path is mandatory');
    }
    try {
      await promisify(access)(resolvePath(path));
      return true;
    } catch (ex) {
      return false;
    }
  }
}
