import { createStringArrayInput } from '@alwaysai/alwayscli';

export const modelIdsCliInput = createStringArrayInput({
  description: 'For example, "alwaysai/MobileNetSSD"',
  required: true,
  placeholder: '<id> [...]',
});
