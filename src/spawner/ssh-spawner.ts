import { Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../util/resolve-posix-path';

export type SshSpawner = ReturnType<typeof SshSpawner>;
export function SshSpawner(config: { path: string; hostname: string }) {
  const resolvePath = ResolvePosixPath(config.path);
  return GnuSpawner({ resolvePath, ...SpawnerBase(translate) });

  function translate(cmd: Cmd) {
    const exe = 'ssh';
    const args: string[] = [];
    if (cmd.tty) {
      args.push('-t');
    }
    if (cmd.expose5000) {
      args.push('-L', '5000:0.0.0.0:5000');
    }
    args.push(
      config.hostname,
      cmd.cwd ? `cd "${resolvePath(cmd.cwd)}" && ${cmd.exe}` : cmd.exe,
    );
    if (cmd.args) {
      args.push(...cmd.args);
    }
    const translated: Cmd = {
      exe,
      args,
      input: cmd.input,
    };
    return translated;
  }
}
