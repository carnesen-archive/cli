import { alwaysaiUserEmailCliInput } from './alwaysai-user-email-cli-input';
import { CLI_USAGE_ERROR, CLI_TERSE_ERROR } from '@alwaysai/alwayscli';
import { runAndCatch } from '@carnesen/run-and-catch';

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

  it('throws CLI_USAGE_ERROR error "single" if more than one value is passed', async () => {
    const exception = await runAndCatch(alwaysaiUserEmailCliInput.getValue, [
      'foo',
      'bar',
    ]);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/single/);
  });

  it('throws CLI_USAGE_ERROR error "address" if more than one value is passed', async () => {
    const exception = await runAndCatch(alwaysaiUserEmailCliInput.getValue, ['']);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/address/);
  });

  it('throws CLI_TERSE_ERROR error "not a valid email" if more than one value is passed', async () => {
    const exception = await runAndCatch(alwaysaiUserEmailCliInput.getValue, ['foo']);
    expect(exception.code).toBe(CLI_TERSE_ERROR);
    expect(exception.message).toMatch(/not a valid email/);
  });

  it('has an appropriate description', () => {
    expect(alwaysaiUserEmailCliInput.description).toMatch(/email address/i);
  });
});
