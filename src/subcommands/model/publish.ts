import { createLeaf } from '@alwaysai/alwayscli';

import { modelConfigFile } from './model-config-file';
import { modelVersionPackageCacheUploadToCloud } from '../../util/model-version-package-cache-upload-to-cloud';
import { getBearerToken } from '../../util/cognito-auth';
import { modelVersionPackageGetReadableStreamFromCwd } from '../../util/model-version-package-readable-stream-from-cwd';
import { modelVersionPackageCacheWriteReadableStream } from '../../util/model-version-package-cache-write-readable-stream';
import { LOCAL_MODEL_VERSION_PACKAGE_NUMBER } from '../../constants';
import { RpcClient } from '../../rpc-client';

export const modelPublish = createLeaf({
  name: 'publish',
  description: 'Publish a new version of a model to the alwaysAI cloud',
  async action() {
    const modelConfiguration = modelConfigFile.read();
    const { id } = modelConfiguration;
    const readable = await modelVersionPackageGetReadableStreamFromCwd();
    await modelVersionPackageCacheWriteReadableStream({
      id,
      version: LOCAL_MODEL_VERSION_PACKAGE_NUMBER,
      readable,
    });

    const bearerToken = await getBearerToken();
    if (!bearerToken) {
      throw new Error('must log in');
    }

    const rpcClient = await RpcClient();
    const result = await rpcClient.createModelVersion(modelConfiguration);
    await modelVersionPackageCacheUploadToCloud({ id, bearerToken, uuid: result.uuid });
    await rpcClient.finalizeModelVersion(result.uuid);
  },
});
