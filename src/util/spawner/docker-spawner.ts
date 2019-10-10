import { Spawner, Cmd } from './types';
import { SpawnerBase } from '../spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../resolve-posix-path';
import { CliTerseError } from '@alwaysai/alwayscli';
import { EMPTY_DOCKER_IMAGE_ID_MESSAGE } from '../../constants';
import { ALWAYSAI_OS_PLATFORM } from '../../environment';

export const APP_DIR = '/app';

export function DockerSpawner(opts: { dockerImageId: string }): Spawner {
  const { dockerImageId } = opts;
  if (!dockerImageId) {
    throw new CliTerseError(EMPTY_DOCKER_IMAGE_ID_MESSAGE);
  }
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
      if (ALWAYSAI_OS_PLATFORM === 'linux') {
        args.push('--network=host');
      } else {
        args.push('--publish', '127.0.0.1:5000:5000/tcp');
      }
    }

    // Note: We do not fully support docker spawner except on Linux
    if (ALWAYSAI_OS_PLATFORM !== 'win32') {
      args.push('--volume', '/dev:/dev');
    }

    if (cmd.tty) {
      args.push('--tty');
    }

    args.push('--workdir', resolvePath(cmd.cwd));
    args.push(dockerImageId, cmd.exe);

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
