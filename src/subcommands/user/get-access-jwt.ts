import { CliLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { checkUserIsLoggedInComponent } from '../../components/check-user-is-logged-in-component';
import { CliAuthenticationClient } from '../../util/authentication-client';

export const getAccessJwtCliLeaf = CliLeaf({
  name: 'get-access-jwt',
  description: 'Get a JSON web token (JWT) for accessing the alwaysAI Cloud API',
  hidden: true,
  namedInputs: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await checkUserIsLoggedInComponent({ yes });
    const { Authorization } = await CliAuthenticationClient().getAuthorizationHeader();
    return Authorization.split(' ')[1];
  },
});
