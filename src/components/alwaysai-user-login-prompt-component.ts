import { promptForInput } from '../util/prompt-for-input';
import { VALID_EMAIL_REGULAR_EXPRESSION } from '../constants';
import { alwaysaiUserLoginYesComponent } from './alwaysai-user-login-yes-component';

export async function alwaysaiUserLoginPromptComponent(
  props: {
    alwaysaiUserEmail?: string;
    alwaysaiUserPassword?: string;
  } = {},
) {
  const answers = await promptForInput({
    purpose: 'to enter your alwaysAI user account credentials',
    alternative: 'authenticate yourself first with the command "alwaysai user login"',
    questions: [
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
        validate: value =>
          value.length >= 8 || 'Password must be eight or more characters',
      },
    ],
  });

  await alwaysaiUserLoginYesComponent({
    alwaysaiUserEmail: answers.email,
    alwaysaiUserPassword: answers.password,
  });
}
