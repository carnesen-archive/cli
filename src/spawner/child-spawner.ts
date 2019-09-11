import { Cmd } from './types';
import { SpawnerBase } from './spawner-base';
import { GnuSpawner } from './gnu-spawner';
import { ResolvePosixPath } from '../util/resolve-posix-path';

// This ChildSpawner isn't really used anywhere in the CLI, but it provides a
// convenient way to test the GNU spawner which is used extensively by the SSH
// and Docker spawners
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
