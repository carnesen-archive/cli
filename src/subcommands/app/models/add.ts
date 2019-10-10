import { CliLeaf } from '@alwaysai/alwayscli';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import { appModelsAddComponent } from '../../../components/app-models-add-component';
import { yesCliInput } from '../../../cli-inputs/yes-cli-input';

export const addModelsAddCliLeaf = CliLeaf({
  name: 'add',
  description: 'Add model(s) to this application',
  positionalInput: modelIdsCliInput,
  namedInputs: {
    yes: yesCliInput,
  },
  async action(ids, { yes }) {
    await appModelsAddComponent({ ids, yes });
  },
});
