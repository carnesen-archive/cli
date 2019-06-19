import { echo } from '../../util/echo';
import { getNonInteractiveStreamName, prompt } from '../../util/prompt';
import { TerseError } from '@alwaysai/alwayscli';
import logSymbols = require('log-symbols');

export async function promptForNewPassword(yes: boolean) {
  echo(`${logSymbols.warning} Change your password`);
  if (getNonInteractiveStreamName()) {
    throw new TerseError(
      'Please re-run this command in an interactive shell so we can prompt for your new password',
    );
  }
  if (yes) {
    throw new TerseError(
      'Please re-run this command without the --yes flag so we can prompt for your new password',
    );
  }
  const answer0 = await prompt([
    {
      type: 'password',
      name: 'password',
      message: 'New password',
      validate: value => value.length >= 8 || 'Password must be at least 8 characters',
    },
  ]);
  await prompt([
    {
      type: 'password',
      name: 'password',
      message: 'New password (again)',
      validate: value => value === answer0.password || 'New passwords do not match',
    },
  ]);

  const newPassword: string = answer0.password;
  return newPassword;
}
