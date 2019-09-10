import { createLeaf } from '@alwaysai/alwayscli';
import { appModelsSearchComponent } from '../../../components/app-models-search-component';
import { yesCliInput } from '../../../cli-inputs/yes-cli-input';

export const searchModels = createLeaf({
  name: 'search',
  description: 'Search models in the alwaysAI Cloud',
  options: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await appModelsSearchComponent({ yes });
  },
});
