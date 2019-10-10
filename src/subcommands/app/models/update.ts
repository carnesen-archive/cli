import { CliLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../../cli-inputs/yes-cli-input';
import { appModelsUpdateComponent } from '../../../components/app-models-update-component';

export const appModelsUpdateCliLeaf = CliLeaf({
  name: 'update',
  description: "Update this application's models to the latest versions",
  namedInputs: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await appModelsUpdateComponent({ yes });
  },
});
