import { createLeaf } from '@alwaysai/alwayscli';
import { modelConfigFile } from './model-config-file';
import { RpcClient } from '../../rpc-client';
import { parsePackageUrl } from '../../model-manager/parse-package-url';
import { PackageStreamFromCache } from '../../model-manager/package-stream-from-cache';
import { PackageStreamFromCwd } from '../../model-manager/package-stream-from-cwd';
import { streamPackageToCache } from '../../model-manager/stream-package-to-cache';
import { spinOnPromise } from '../../util/spin-on-promise';
import { S3 } from '../../util/s3';

export const publish = createLeaf({
  name: 'publish',
  description: 'Publish a new version of a model to the alwaysAI cloud',
  async action() {
    const config = modelConfigFile.read();
    const { accuracy, description, id, license, public: public_, version } = config;
    const strippedConfig = {
      accuracy,
      description,
      id,
      license,
      public: public_,
      version,
    };
    // Create the provisional record in the database and get packageUrl
    const rpcApi = await RpcClient();
    const modelVersion = await rpcApi.createModelVersion(strippedConfig);
    await spinOnPromise(
      (async () => {
        const cwdPackageStream = await PackageStreamFromCwd();
        await streamPackageToCache({
          id: config.id,
          version: config.version,
          readable: cwdPackageStream,
        });
      })(),
      'Create package',
    );

    await spinOnPromise(
      (async () => {
        const { awsRegion, bucketName, bucketKey } = parsePackageUrl(
          modelVersion.packageUrl,
        );
        const s3 = S3({ region: awsRegion });
        const readStream = await PackageStreamFromCache({
          id: config.id,
          version: config.version,
        });
        await s3
          .upload({ Bucket: bucketName, Body: readStream, Key: bucketKey })
          .promise();
      })(),
      'Upload to cloud',
    );

    await spinOnPromise(
      (async () => {
        await rpcApi.finalizeModelVersion(modelVersion.uuid as any);
      })(),
      'Mark package as final',
    );
  },
});
