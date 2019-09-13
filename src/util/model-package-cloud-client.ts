import fetch, { Response } from 'node-fetch';
import { CLOUD_API_MODEL_VERSION_PACKAGES_PATH } from '@alwaysai/cloud-api';
import { CodedError } from '@carnesen/coded-error';
import * as tar from 'tar';
import { CloudApiUrl } from '@alwaysai/cloud-api';
import { rpcClient } from './rpc-client';
import { authenticationClient } from './authentication-client';
import { ModelJsonFile } from './model-json-file';
import { dirname, basename } from 'path';
import { promisify } from 'util';
import { stat, createReadStream } from 'fs';
import tempy = require('tempy');
import { systemId } from './cli-config';

const cloudApiUrl = CloudApiUrl(systemId);

export const modelPackageCloudClient = {
  async download(id: string, version: number) {
    const { uuid } = await rpcClient.getModelVersion({ id, version });
    const modelPackageUrl = ModelPackageUrl(uuid);
    const authorizationHeader = await authenticationClient.getAuthorizationHeader();
    const response = await fetch(modelPackageUrl, {
      method: 'GET',
      headers: { ...authorizationHeader, 'Content-Length': '0' },
    });
    await throwIfNotOk(response);
    return response.body;
  },

  async publish(dir: string) {
    const modelJson = ModelJsonFile(dir).read();
    const { uuid } = await rpcClient.createModelVersion(modelJson);

    const authorizationHeader = await authenticationClient.getAuthorizationHeader();
    const modelPackagePath = tempy.file();

    // Note: The TypeScript types on tar.create are not 100% accurate
    await tar.create({ cwd: dirname(dir), gzip: true, file: modelPackagePath }, [
      basename(dir),
    ]);

    const stats = await promisify(stat)(modelPackagePath);

    const modelPackageStream = createReadStream(modelPackagePath);
    const response = await fetch(ModelPackageUrl(uuid), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Length': stats.size.toString(),
        ...authorizationHeader,
      },
      body: modelPackageStream,
    });

    await throwIfNotOk(response);
    await rpcClient.finalizeModelVersion(uuid);
    return uuid;
  },
};

function ModelPackageUrl(uuid: string) {
  return `${cloudApiUrl}${CLOUD_API_MODEL_VERSION_PACKAGES_PATH}/${uuid}`;
}

async function throwIfNotOk(response: Response) {
  if (!response.ok) {
    const parsed = await response.json();
    const {
      message = `Server responded ${response.status} ("${response.statusText}")`,
      code,
      data,
    } = parsed;
    throw new CodedError(message, code, data);
  }
}
