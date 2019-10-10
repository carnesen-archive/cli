import { CliLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { checkUserIsLoggedInComponent } from '../../components/check-user-is-logged-in-component';
import { modelPackageCloudClient } from '../../util/model-package-cloud-client';

export const modelPublish = CliLeaf({
  name: 'publish',
  description: 'Publish a new version of a model to the alwaysAI Cloud',
  namedInputs: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await checkUserIsLoggedInComponent({ yes });
    await modelPackageCloudClient.publish();
  },
});
