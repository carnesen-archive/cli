import ora = require('ora');
import { authenticationClient } from '../util/authentication-client';

export async function alwaysaiUserLoginYesComponent(props: {
  alwaysaiUserEmail: string;
  alwaysaiUserPassword: string;
}) {
  const spinner = ora(`Log in ${props.alwaysaiUserEmail}`).start();
  try {
    const cognitoUser = await authenticationClient.signIn(
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
