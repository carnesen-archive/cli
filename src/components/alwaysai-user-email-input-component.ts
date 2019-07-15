import { UsageError } from '@alwaysai/alwayscli';

import { VALID_EMAIL_REGULAR_EXPRESSION } from '../constants';
import { prompt } from '../util/prompt';
import { checkInteractivityConditionsForAuthentication } from './check-interactivity-conditions-for-authentication';

export async function alwaysaiUserEmailInputComponent(props: {
  yes: boolean;
  alwaysaiUserEmail?: string;
}) {
  if (props.yes) {
    if (!props.alwaysaiUserEmail) {
      throw new UsageError('Option "email" is required if the "yes" flag is passed');
    }
    return props.alwaysaiUserEmail;
  }

  checkInteractivityConditionsForAuthentication('email', 'email address');

  const answers = await prompt([
    {
      type: 'text',
      name: 'email',
      message: 'Email address associated with your alwaysAI user:',
      initial: props.alwaysaiUserEmail,
      validate: value =>
        VALID_EMAIL_REGULAR_EXPRESSION.test(value) ||
        `"${value}" is not a valid email address`,
    },
  ]);

  return answers.email as string;
}
