import { createStringInput } from '@alwaysai/alwayscli';
import { basename } from 'path';
const EXAMPLE_VALUE = `alwaysai/${basename(process.cwd())}`;

export const targetPathCliInput = createStringInput({
  description: `Application directory path [e.g. "${EXAMPLE_VALUE}"]`,
});
