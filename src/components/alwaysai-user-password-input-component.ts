import { UsageError } from '@alwaysai/alwayscli';

import { prompt } from '../util/prompt';
import { checkInteractivityConditionsForAuthentication } from './check-interactivity-conditions-for-authentication';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';

export async function alwaysaiUserPasswordInputComponent(props: {
  yes: boolean;
  alwaysaiUserPassword?: string;
}) {
  if (props.yes) {
    if (!props.alwaysaiUserPassword) {
      throw new UsageError(RequiredWithYesMessage('password'));
    }
    return props.alwaysaiUserPassword;
  }

  checkInteractivityConditionsForAuthentication('password', 'password');

  const response = await prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      initial: props.alwaysaiUserPassword,
      validate: value => value.length >= 8 || 'Password must be eight or more characters',
    },
  ]);

  return response.password as string;
}
