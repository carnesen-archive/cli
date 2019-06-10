import { Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../util/resolve-posix-path';

export function ChildSpawner(context: { path: string }) {
  const resolvePath = ResolvePosixPath(context.path);

  return GnuSpawner({ resolvePath, ...SpawnerBase(translate) });

  function translate(cmd: Cmd) {
    const translated = { ...cmd };
    if (cmd.cwd) {
      translated.cwd = resolvePath(cmd.cwd);
    }

    return translated;
  }
}
