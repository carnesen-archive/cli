import { posix } from 'path';

export function ResolvePosixPath(from: string = '.') {
  return function resolvePosixPath(...paths: (string | undefined)[]) {
    let resolved = from;
    for (const path of paths) {
      if (path) {
        if (posix.isAbsolute(path)) {
          resolved = path;
        } else {
          resolved = posix.join(resolved, path);
        }
      }
    }
    return posix.normalize(resolved);
  };
}
