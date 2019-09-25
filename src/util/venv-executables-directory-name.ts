import { platform } from 'os';

export function VenvExecutablesDirectoryName(osPlatform = platform()) {
  return osPlatform === 'win32' ? 'Scripts' : 'bin';
}
