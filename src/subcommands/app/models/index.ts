import { createBranch } from '@alwaysai/alwayscli';
import { addModelsAddCliLeaf } from './add';
import { removeModels } from './remove';
import { showModels } from './show';
import { searchModels } from './search';
import { appModelsUpdate } from './update';

export const appModelsCliBranch = createBranch({
  name: 'models',
  description: "Manage this application's models",
  subcommands: [
    addModelsAddCliLeaf,
    removeModels,
    searchModels,
    showModels,
    appModelsUpdate,
  ],
});
