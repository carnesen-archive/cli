import { createFlagInput } from '@alwaysai/alwayscli';

export const yesCliInput = createFlagInput({
  description: 'Skip interactive prompts (accept default response)',
});
