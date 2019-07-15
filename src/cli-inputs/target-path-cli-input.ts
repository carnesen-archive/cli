import { createStringInput, UsageError } from '@alwaysai/alwayscli';

function validatePath(value: string) {
  return !value
    ? 'Value is required'
    : value === '/'
    ? 'The filesystem root "/" is not a valid target directory'
    : undefined;
}

export const targetPathCliInput = createStringInput({
  description: 'Application directory path',
});

const originalGetValue = targetPathCliInput.getValue;

targetPathCliInput.getValue = async argv => {
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
