import { posix, basename } from 'path';

export function TargetPathDefaultValue(dir = process.cwd()) {
  const targetPath = posix.join('alwaysai', basename(dir));
  return targetPath;
}
