import { CliStringInput } from '@alwaysai/alwayscli';

const placeholder = '<password>';

export const alwaysaiUserPasswordCliInput = CliStringInput({
  description: 'Your alwaysAI user password',
  placeholder,
  required: false,
});
