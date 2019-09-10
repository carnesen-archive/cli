import { createLeaf } from '@alwaysai/alwayscli';

import { modelConfigFile } from './model-config-file';
import { modelVersionPackageCacheUploadToCloud } from '../../util/model-version-package-cache-upload-to-cloud';
import { modelVersionPackageGetReadableStreamFromCwd } from '../../util/model-version-package-readable-stream-from-cwd';
import { modelVersionPackageCacheWriteReadableStream } from '../../util/model-version-package-cache-write-readable-stream';
import { LOCAL_MODEL_VERSION_PACKAGE_NUMBER } from '../../constants';
import { rpcClient } from '../../util/rpc-client';
import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { checkUserIsLoggedInComponent } from '../../components/check-user-is-logged-in-component';

export const modelPublish = createLeaf({
  name: 'publish',
  description: 'Publish a new version of a model to the alwaysAI Cloud',
  options: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await checkUserIsLoggedInComponent({ yes });
    const modelConfiguration = modelConfigFile.read();
    const { id } = modelConfiguration;
    const readable = await modelVersionPackageGetReadableStreamFromCwd();
    await modelVersionPackageCacheWriteReadableStream({
      id,
      version: LOCAL_MODEL_VERSION_PACKAGE_NUMBER,
      readable,
    });

    const result = await rpcClient.createModelVersion(modelConfiguration);
    await modelVersionPackageCacheUploadToCloud({ id, uuid: result.uuid });
    await rpcClient.finalizeModelVersion(result.uuid);
  },
});
