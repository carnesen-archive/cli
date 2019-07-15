import { createBranch } from '@alwaysai/alwayscli';
import { addModelsAddCliLeaf } from './add';
import { removeModels } from './remove';
import { showModels } from './show';
import { searchModels } from './search';
import { appModelsUpdate } from './update';

export const appModelsCliBranch = createBranch({
  name: 'models',
  description: 'Manage models in an alwaysAI App',
  subcommands: [
    showModels,
    searchModels,
    addModelsAddCliLeaf,
    appModelsUpdate,
    removeModels,
  ],
});
