import { CliBranch } from '@alwaysai/alwayscli';

import { userLogin } from './login';
import { userLogout } from './logout';
import { userShow } from './show';
import { getAccessJwtCliLeaf } from './get-access-jwt';

export const user = CliBranch({
  name: 'user',
  description: 'Log in or log out of the alwaysAI Cloud',
  subcommands: [userLogin, userLogout, userShow, getAccessJwtCliLeaf],
});
