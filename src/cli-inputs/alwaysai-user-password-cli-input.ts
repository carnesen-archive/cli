import { createStringInput } from '@alwaysai/alwayscli';

const placeholder = '<password>';

export const alwaysaiUserPasswordCliInput = createStringInput({
  description: 'Your alwaysAI user password',
  placeholder,
  required: false,
});
