import { createLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../../cli-inputs/yes-cli-input';
import { appModelsUpdateComponent } from '../../../components/app-models-update-component';

export const appModelsUpdateCliLeaf = createLeaf({
  name: 'update',
  description: "Update this application's models to the latest versions",
  options: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await appModelsUpdateComponent({ yes, dir: process.cwd() });
  },
});
