import { ALWAYSAI_OS_PLATFORM } from '../environment';

export function VenvExecutablesDirectoryName() {
  return ALWAYSAI_OS_PLATFORM === 'win32' ? 'Scripts' : 'bin';
}
