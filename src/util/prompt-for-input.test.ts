import { runAndCatch } from '@alwaysai/alwayscli';

import { promptForInput } from './prompt-for-input';

describe(promptForInput.name, () => {
  it('throws "This feature is disabled" if process.stdin is not a TTY', async () => {
    if (!process.stdin.isTTY) {
      const ex = await runAndCatch(promptForInput, { purpose: '', questions: [] });
      expect(ex.message).toMatch(/This feature is disabled/i);
    }
  });
});
