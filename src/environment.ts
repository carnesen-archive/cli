import { platform } from 'os';

export const NODE_ENV = process.env.NODE_ENV;

export const ALWAYSAI_HOME = process.env.ALWAYSAI_HOME;
export const ALWAYSAI_AUDIT_LOG = process.env.ALWAYSAI_AUDIT_LOG;
export const ALWAYSAI_SHOW_HIDDEN = parseBoolean(process.env.ALWAYSAI_SHOW_HIDDEN);
export const ALWAYSAI_OS_PLATFORM = parseOsPlatform(process.env.ALWAYSAI_OS_PLATFORM);

function parseOsPlatform(str: string | undefined): NodeJS.Platform {
  switch (str) {
    case 'win32':
    case 'darwin':
    case 'linux': {
      return str;
    }
    default:
      return platform();
  }
}

function parseBoolean(str: string | undefined) {
  return str === '1';
}
