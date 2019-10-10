import { CliLeaf } from '@alwaysai/alwayscli';
import { AppJsonFile } from '../../../util/app-json-file';
import { modelIdsCliInput } from '../../../cli-inputs/model-ids-cli-input';
import logSymbols = require('log-symbols');
import { echo } from '../../../util/echo';

export const removeModels = CliLeaf({
  name: 'remove',
  description: `Remove model(s) from this application`,
  positionalInput: modelIdsCliInput,
  async action(ids) {
    const appJsonFile = AppJsonFile();
    appJsonFile.read();
    for (const id of ids) {
      appJsonFile.removeModel(id);
      echo(`${logSymbols.success} Remove ${id}`);
    }
  },
});
