import { createStringInput } from '@alwaysai/alwayscli';
import { basename } from 'path';
const DEFAULT_VALUE = `alwaysai/${basename(process.cwd())}`;

export const targetPathCliInput = createStringInput({
  description: `Application directory path [e.g. "${DEFAULT_VALUE}"]`,
  defaultValue: DEFAULT_VALUE,
});
