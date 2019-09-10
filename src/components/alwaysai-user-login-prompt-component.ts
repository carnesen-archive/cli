import { getNonInteractiveStreamName, prompt } from '../util/prompt';
import { TerseError } from '@alwaysai/alwayscli';
import { VALID_EMAIL_REGULAR_EXPRESSION } from '../constants';
import { alwaysaiUserLoginYesComponent } from './alwaysai-user-login-yes-component';

export async function alwaysaiUserLoginPromptComponent(
  props: {
    alwaysaiUserEmail?: string;
    alwaysaiUserPassword?: string;
  } = {},
) {
  const nonInteractiveStreamName = getNonInteractiveStreamName();
  if (nonInteractiveStreamName) {
    throw new TerseError(
      `We were about to prompt you to enter your alwaysAI user account credentials, but this shell is not fully interactive. ("${nonInteractiveStreamName}" is not a TTY.) You can re-run this command in a fully interactive shell, or you authenticate first with the command "alwaysai user login".`,
    );
  }

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
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      initial: props.alwaysaiUserPassword,
      validate: value => value.length >= 8 || 'Password must be eight or more characters',
    },
  ]);

  await alwaysaiUserLoginYesComponent({
    alwaysaiUserEmail: answers.email,
    alwaysaiUserPassword: answers.password,
  });
}
