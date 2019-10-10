import { CliStringArrayInput } from '@alwaysai/alwayscli';

export const modelIdsCliInput = CliStringArrayInput({
  description: 'For example, "alwaysai/MobileNetSSD"',
  required: true,
  placeholder: '<id> [...]',
});
