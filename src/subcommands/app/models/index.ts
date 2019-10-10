import { CliBranch } from '@alwaysai/alwayscli';
import { addModelsAddCliLeaf } from './add';
import { removeModels } from './remove';
import { showModels } from './show';
import { searchModels } from './search';
import { appModelsUpdateCliLeaf } from './update';

export const appModelsCliBranch = CliBranch({
  name: 'models',
  description: "Manage this application's models",
  subcommands: [
    addModelsAddCliLeaf,
    removeModels,
    searchModels,
    showModels,
    appModelsUpdateCliLeaf,
  ],
});
