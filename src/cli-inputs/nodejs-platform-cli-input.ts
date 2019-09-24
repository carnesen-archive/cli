import { createOneOfInput } from '@alwaysai/alwayscli';

const NODEJS_PLATFORMS: NodeJS.Platform[] = ['win32', 'darwin', 'linux'];

export const nodejsPlatformCliInput = createOneOfInput({
  required: false,
  values: NODEJS_PLATFORMS,
});
