import { Cmd } from './types';
import { SpawnerBase } from '../spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../resolve-posix-path';
import { PRIVATE_KEY_FILE_PATH } from '../../constants';

export type SshSpawner = ReturnType<typeof SshSpawner>;
export function SshSpawner(opts: { targetHostname: string; targetPath?: string }) {
  const resolvePath = ResolvePosixPath(opts.targetPath);
  return GnuSpawner({ resolvePath, ...SpawnerBase(translate) });

  function translate(cmd: Cmd) {
    if (cmd.superuser) {
      throw new Error(`${SshSpawner.name} does not support cmd option "superuser"`);
    }
    const exe = 'ssh';
    const args: string[] = [
      '-i',
      PRIVATE_KEY_FILE_PATH,
      '-o',
      'BatchMode=yes',
      '-o',
      'StrictHostKeyChecking=no',
    ];
    if (cmd.tty) {
      args.push('-t');
    }
    if (cmd.expose5000) {
      args.push('-L', '5000:0.0.0.0:5000');
    }
    args.push(
      opts.targetHostname,
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
