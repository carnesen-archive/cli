import { NOT_FOUND } from 'http-status-codes';

import { createLeaf, TerseError } from '@alwaysai/always-cli';
import { createRpcClient } from '@alwaysai/cloud-api-nodejs';

import { cloudApi } from '../../cloud-api';
import { appConfigFile } from '../../app-config-file';
import { ModelId } from '../../model-id';
import { ids } from './ids';
import { fakeSpinner } from '../../fake-spinner';
import { credentialsStore } from '../../credentials-store';

export const addModels = createLeaf({
  name: 'add',
  description: 'Add one or more alwaysAI models to this app',
  options: {
    cloudApi,
  },
  args: ids,
  async action(ids, { cloudApi }) {
    const credentials = credentialsStore.read();
    const rpcClient = createRpcClient({ credentials, cloudApiUrl: cloudApi });
    for (const id of ids) {
      const { publisher, name } = ModelId.parse(id);
      try {
        await rpcClient.getModel({ name, publisher });
      } catch (ex) {
        if (ex.code === NOT_FOUND) {
          throw new TerseError(`Model not found: "${id}"`);
        }
        throw ex;
      }
      await fakeSpinner(`Adding model "${id}"`);
      appConfigFile.addModel(id);
    }
    console.log('Done!');
  },
});
