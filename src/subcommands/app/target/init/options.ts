import { createStringInput, UsageError, createOneOfInput } from '@alwaysai/alwayscli';

import { yes } from '../../../../inputs/yes';
import { TARGET_PROTOCOLS } from '../../../../util/target-protocol';

export function validatePath(value: string) {
  return !value
    ? 'Value is required'
    : value === '/'
    ? 'The filesystem root "/" is not a valid target directory'
    : undefined;
}

const path = createStringInput({
  description: 'Application directory path',
});
const originalGetValue = path.getValue;
path.getValue = async argv => {
  const path = await originalGetValue(argv);
  if (typeof path === 'undefined') {
    return undefined;
  }
  const errorMessage = validatePath(path);
  if (errorMessage) {
    throw new UsageError(errorMessage);
  }
  return path;
};

export const options = {
  yes,
  protocol: createOneOfInput({
    values: TARGET_PROTOCOLS,
  }),
  hostname: createStringInput({
    description: 'Hostname or IP address',
  }),
  path,
};
