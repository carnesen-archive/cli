import { createLeaf } from '@alwaysai/alwayscli';
import { appConfigFile } from '../../../config/app-config-file';
import { ids } from '../../../inputs/ids';
import logSymbols = require('log-symbols');
import { echo } from '../../../util/echo';

export const removeModels = createLeaf({
  name: 'remove',
  description: `Remove model(s) from this alwaysAI app`,
  options: {},
  args: ids,
  async action(ids) {
    appConfigFile.read();
    for (const id of ids) {
      appConfigFile.removeModel(id);
      echo(`${logSymbols.success} Remove ${id}`);
    }
  },
});
