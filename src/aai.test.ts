import { runAndCatch } from '@alwaysai/alwayscli';

import { aai } from './aai';

describe(aai.name, () => {
  it('is the main cli function', async () => {
    const exception = await runAndCatch(aai, '--help');
    expect(exception).toMatch('Usage');
  });
});
