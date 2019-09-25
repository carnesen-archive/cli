import { runAndCatch } from '@alwaysai/alwayscli';

import { cli } from './cli';

describe(cli.name, () => {
  it('is the main cli function', async () => {
    const exception = await runAndCatch(cli, '--help');
    expect(exception).toMatch('Usage');
  });
});
