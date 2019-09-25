import { alwaysaiUserEmailCliInput } from './alwaysai-user-email-cli-input';
import { runAndCatch, USAGE, TERSE } from '@alwaysai/alwayscli';

describe(__filename, () => {
  it('parses a valid email', async () => {
    const VALID_EMAIL = 'me@example.com';
    const value = await alwaysaiUserEmailCliInput.getValue([VALID_EMAIL]);
    expect(value).toBe(VALID_EMAIL);
  });

  it('returns undefined on undefined', async () => {
    const value = await alwaysaiUserEmailCliInput.getValue(undefined);
    expect(value).toBe(undefined);
  });

  it('throws USAGE error "single" if more than one value is passed', async () => {
    const exception = await runAndCatch(alwaysaiUserEmailCliInput.getValue, [
      'foo',
      'bar',
    ]);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch(/single/);
  });

  it('throws USAGE error "address" if more than one value is passed', async () => {
    const exception = await runAndCatch(alwaysaiUserEmailCliInput.getValue, ['']);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch(/address/);
  });

  it('throws TERSE error "not a valid email" if more than one value is passed', async () => {
    const exception = await runAndCatch(alwaysaiUserEmailCliInput.getValue, ['foo']);
    expect(exception.code).toBe(TERSE);
    expect(exception.message).toMatch(/not a valid email/);
  });

  it('returns an appropriate description', async () => {
    const description = await alwaysaiUserEmailCliInput.getDescription();
    expect(description).toMatch(/email address/i);
  });
});
