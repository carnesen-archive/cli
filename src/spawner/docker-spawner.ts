import { platform } from 'os';

import { Spawner, Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../util/resolve-posix-path';

export const APP_DIR = '/app';

export function DockerSpawner(opts: { dockerImageId: string }): Spawner {
  const resolvePath = ResolvePosixPath(APP_DIR);
  const gnuSpawner = GnuSpawner({ resolvePath, ...SpawnerBase(translate) });
  return {
    ...gnuSpawner,
    rimraf(path?: string) {
      if (!path || resolvePath(path) === resolvePath()) {
        throw new Error('Refusing to delete whole directory because it is mirrored');
      }
      return gnuSpawner.rimraf(path);
    },
  };

  function translate(cmd: Cmd) {
    const args = [
      'run',
      '--rm',
      '--privileged',
      '--interactive',
      '--volume',
      `${process.cwd()}:${resolvePath()}`,
    ];

    if (!cmd.superuser) {
      args.push('--user', `${process.getuid()}:${process.getgid()}`);
    }

    if (cmd.expose5000) {
      if (platform() === 'linux') {
        args.push('--network=host');
      } else {
        args.push('--publish', '127.0.0.1:5000:5000/tcp');
      }
    }

    if (platform() !== 'win32') {
      args.push('--volume', '/dev:/dev');
    }

    if (cmd.tty) {
      args.push('--tty');
    }

    args.push('--workdir', resolvePath(cmd.cwd));
    args.push(opts.dockerImageId, cmd.exe);

    if (cmd.args) {
      args.push(...cmd.args);
    }

    const translated: Cmd = {
      exe: 'docker',
      args,
      input: cmd.input,
    };

    return translated;
  }
}
