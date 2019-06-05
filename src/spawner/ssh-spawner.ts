import { Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../util/resolve-posix-path';

export type SshSpawner = ReturnType<typeof SshSpawner>;
export function SshSpawner(config: { path: string; hostname: string }) {
  const abs = ResolvePosixPath(config.path);
  return GnuSpawner({ abs, ...SpawnerBase(translate) });

  function translate(cmd: Cmd) {
    const exe = 'ssh';
    const args: string[] = ['-L', '5000:0.0.0.0:5000'];
    if (cmd.tty) {
      args.push('-t');
    }
    args.push(config.hostname, cmd.cwd ? `cd "${abs(cmd.cwd)}" && ${cmd.exe}` : cmd.exe);
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
