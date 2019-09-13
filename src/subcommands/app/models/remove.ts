import { createLeaf } from '@alwaysai/alwayscli';
import { appConfigFile } from '../../../util/app-json-file';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import logSymbols = require('log-symbols');
import { echo } from '../../../util/echo';

export const removeModels = createLeaf({
  name: 'remove',
  description: `Remove model(s) from this application`,
  options: {},
  args: modelIdsCliInput,
  async action(ids) {
    appConfigFile.read();
    for (const id of ids) {
      appConfigFile.removeModel(id);
      echo(`${logSymbols.success} Remove ${id}`);
    }
  },
});
