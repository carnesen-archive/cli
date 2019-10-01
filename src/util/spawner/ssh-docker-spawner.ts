import { posix } from 'path';

import { Cmd } from './types';
import { SpawnerBase } from '../spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { APP_DIR } from './docker-spawner';
import { ResolvePosixPath } from '../resolve-posix-path';
import { PRIVATE_KEY_FILE_PATH, EMPTY_DOCKER_IMAGE_ID_MESSAGE } from '../../constants';
import { TerseError } from '@alwaysai/alwayscli';

export function SshDockerSpawner(opts: {
  targetPath: string;
  targetHostname: string;
  dockerImageId: string;
}) {
  const { dockerImageId } = opts;
  if (!dockerImageId) {
    throw new TerseError(EMPTY_DOCKER_IMAGE_ID_MESSAGE);
  }

  const resolvePath = ResolvePosixPath(APP_DIR);
  return GnuSpawner({ resolvePath, ...SpawnerBase(translate) });

  function translate(cmd: Cmd) {
    const exe = 'ssh';
    const sshArgs: string[] = ['-i', PRIVATE_KEY_FILE_PATH];
    const expandablePath = posix.isAbsolute(opts.targetPath)
      ? opts.targetPath
      : `~/${opts.targetPath}`;
    const dockerArgs: string[] = [
      'docker',
      'run',
      '--rm',
      '--privileged',
      '--interactive',
      '--network=host',
      '--volume',
      '/dev:/dev',
      '--volume',
      `${expandablePath}:${APP_DIR}`,
    ];

    if (!cmd.superuser) {
      dockerArgs.push('--user', '$(id -u ${USER}):$(id -g ${USER})');
    }

    if (cmd.tty) {
      sshArgs.push('-t', '-t');
      dockerArgs.push('--tty');
    }

    if (cmd.expose5000) {
      sshArgs.push('-L', '5000:0.0.0.0:5000');
    }
    sshArgs.push(opts.targetHostname);
    dockerArgs.push('--workdir', resolvePath(cmd.cwd), opts.dockerImageId, cmd.exe);

    if (cmd.args) {
      dockerArgs.push(...cmd.args);
    }

    const translated: Cmd = {
      exe,
      args: [...sshArgs, ...dockerArgs],
      input: cmd.input,
    };

    return translated;
  }
}
