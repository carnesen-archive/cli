import { runAndCatch } from '@carnesen/run-and-catch';

import { promptForInput } from './prompt-for-input';

describe(promptForInput.name, () => {
  it('throws `purpose` if process.stdin is not a TTY', async () => {
    if (!process.stdin.isTTY) {
      const ex = await runAndCatch(promptForInput, {
        purpose: 'for foo bar baz',
        questions: [],
      });
      expect(ex.message).toMatch('for foo bar baz');
    }
  });
});
