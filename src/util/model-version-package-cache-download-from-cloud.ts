import { rename } from 'fs';
import { promisify } from 'util';
import { dirname, basename } from 'path';

import mkdirp = require('mkdirp');
import rimraf = require('rimraf');

import { RpcClient } from '../rpc-client';
import { getRandomString } from './get-random-string';
import { modelVersionPackageCacheGetPath } from './model-version-package-path';
import { cloudApiUrl } from './cli-config';
import { CLOUD_API_MODEL_VERSION_PACKAGES_PATH } from '@alwaysai/cloud-api';
import download = require('download');

const rimrafAsync = promisify(rimraf);

export async function modelVersionPackageCacheDownloadFromCloud(opts: {
  id: string;
  version: number;
  bearerToken: string;
}) {
  const { id, version, bearerToken } = opts;
  const rpcApi = await RpcClient();
  const modelVersion = await rpcApi.getModelVersion({ id, version });
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
