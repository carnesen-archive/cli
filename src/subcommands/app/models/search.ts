import { createLeaf } from '@alwaysai/alwayscli';
import { searchModelsComponent } from '../../../components/search-models-component';

export const searchModels = createLeaf({
  name: 'search',
  description: 'Search models in the alwaysAI Cloud',
  async action() {
    await searchModelsComponent();
  },
});
