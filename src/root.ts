import { CliBranch } from '@alwaysai/alwayscli';

import { subcommands } from './subcommands';
import { ALWAYSAI_CLI_EXECUTABLE_NAME } from './constants';

export const root = CliBranch({
  name: ALWAYSAI_CLI_EXECUTABLE_NAME,
  description: 'Manage your alwaysAI assets and environment',
  subcommands,
});
