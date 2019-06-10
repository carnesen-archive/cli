import logSymbols = require('log-symbols');

import { TerseError } from '@alwaysai/alwayscli';

import { prompt, getNonInteractiveStreamName } from '../../../../util/prompt';
import { echo } from '../../../../util/echo';

export async function confirmSave(yes: boolean) {
  if (yes) {
    echo(
      logSymbols.warning,
      "We'll save this configuration despite failed checks because --yes was passed",
    );
    return;
  }
  if (getNonInteractiveStreamName()) {
    throw new TerseError(
      'The above error is fatal because this terminal is not interactive nor was "--yes" passed as a command-line option.',
    );
  }

  const answers = await prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Do you want to save this configuration?',
      initial: false,
    },
  ]);

  if (!answers.confirmed) {
    throw new TerseError('Operation canceled by user');
  }
}
