import ora = require('ora');

import { authenticateUser } from '../util/cognito-auth';

export async function alwaysaiUserLoginComponent(props: {
  alwaysaiUserEmail: string;
  alwaysaiUserPassword: string;
}) {
  const spinner = ora(`Log in ${props.alwaysaiUserEmail}`).start();
  try {
    const cognitoUser = await authenticateUser(
      props.alwaysaiUserEmail,
      props.alwaysaiUserPassword,
    );
    spinner.succeed();
    return cognitoUser;
  } catch (exception) {
    spinner.fail();
    throw exception;
  }
}
