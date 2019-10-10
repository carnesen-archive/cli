import { CliLeaf } from '@alwaysai/alwayscli';
import { appModelsSearchComponent } from '../../../components/app-models-search-component';
import { yesCliInput } from '../../../cli-inputs/yes-cli-input';

export const searchModels = CliLeaf({
  name: 'search',
  description: 'Search models in the alwaysAI Cloud',
  namedInputs: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await appModelsSearchComponent({ yes });
  },
});
