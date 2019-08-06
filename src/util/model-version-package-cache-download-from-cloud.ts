import { rename } from 'fs';
import { promisify } from 'util';
import { dirname } from 'path';

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
  const packagePath = modelVersionPackageCacheGetPath(opts);

  await promisify(mkdirp)(dirname(packagePath));

  const tmpPath = `${packagePath}.${getRandomString()}.download`;

  try {
    await download(packageUrl, tmpPath, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    await promisify(rename)(tmpPath, packagePath);
  } finally {
    await rimrafAsync(tmpPath);
  }
}
