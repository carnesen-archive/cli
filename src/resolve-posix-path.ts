import { posix } from 'path';

export function ResolvePosixPath(root: string) {
  if (!root.startsWith('/')) {
    throw new Error('root path must start with "/"');
  }
  return function resolvePath(...paths: string[]) {
    return posix.resolve(root, ...paths);
  };
}
