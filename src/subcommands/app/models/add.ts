import { createLeaf } from '@alwaysai/alwayscli';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import { appModelsAddComponent } from '../../../components/app-models-add-component';
import { yesCliInput } from '../../../cli-inputs/yes-cli-input';

export const addModelsAddCliLeaf = createLeaf({
  name: 'add',
  description: 'Add model(s) to this application',
  args: modelIdsCliInput,
  options: {
    yes: yesCliInput,
  },
  async action(ids, { yes }) {
    await appModelsAddComponent({ ids, yes });
  },
});
