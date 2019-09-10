import { rename } from 'fs';
import { promisify } from 'util';
import { dirname, basename } from 'path';

import mkdirp = require('mkdirp');
import rimraf = require('rimraf');

import { getRandomString } from './get-random-string';
import { modelVersionPackageCacheGetPath } from './model-version-package-path';
import { cloudApiUrl } from './cli-config';
import { CLOUD_API_MODEL_VERSION_PACKAGES_PATH } from '@alwaysai/cloud-api';
import download = require('download');
import { rpcClient } from './rpc-client';
import { authenticationClient } from './authentication-client';

const rimrafAsync = promisify(rimraf);

export async function modelVersionPackageCacheDownloadFromCloud(opts: {
  id: string;
  version: number;
}) {
  const { id, version } = opts;
  const bearerToken = await authenticationClient.getAccessJwt();
  const modelVersion = await rpcClient.getModelVersion({ id, version });
  const packageUrl = `${cloudApiUrl}${CLOUD_API_MODEL_VERSION_PACKAGES_PATH}/${
    modelVersion.uuid
  }`;
  const destinationPath = modelVersionPackageCacheGetPath({ id, version });
  const destinationDir = dirname(destinationPath);
  await promisify(mkdirp)(destinationDir);

  const temporaryDownloadPath = `${destinationPath}.${getRandomString()}.download`;

  try {
    await download(packageUrl, destinationDir, {
      headers: { Authorization: `Bearer ${bearerToken}` },
      filename: basename(temporaryDownloadPath),
    });
    await promisify(rename)(temporaryDownloadPath, destinationPath);
  } finally {
    await rimrafAsync(temporaryDownloadPath);
  }
}
