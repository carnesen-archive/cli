import { Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { APP_DIR, IMAGE_NAME } from './docker-spawner';
import { ResolvePosixPath } from '../util/resolve-posix-path';

export function SshDockerSpawner(config: { path: string; hostname: string }) {
  const resolvePath = ResolvePosixPath(APP_DIR);
  return GnuSpawner({ resolvePath, ...SpawnerBase(translate) });

  function translate(cmd: Cmd) {
    const exe = 'ssh';
    const sshArgs: string[] = [];
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
      `${config.path}:${APP_DIR}`,
    ];

    if (cmd.tty) {
      sshArgs.push('-t');
      dockerArgs.push('--tty');
    }

    if (cmd.expose5000) {
      sshArgs.push('-L', '5000:0.0.0.0:5000');
    }
    sshArgs.push(config.hostname);
    dockerArgs.push('--workdir', resolvePath(cmd.cwd), IMAGE_NAME, cmd.exe);

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
