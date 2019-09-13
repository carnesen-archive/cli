import { createLeaf } from '@alwaysai/alwayscli';
import { getStarterApps } from '../util/get-starter-apps';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { checkUserIsLoggedInComponent } from '../components/check-user-is-logged-in-component';
import { Spinner } from '../util/spinner';
import { ALWAYSAI_STARTER_APPS } from '../constants';

export const getStarterAppsCliLeaf = createLeaf({
  name: 'get-starter-apps',
  description: 'Download the alwaysAI starter applications',
  options: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await checkUserIsLoggedInComponent({ yes });
    const spinner = Spinner(`Get ${ALWAYSAI_STARTER_APPS}`);
    try {
      await getStarterApps(process.cwd());
    } catch (exception) {
      spinner.fail();
      throw exception;
    }
  },
});
