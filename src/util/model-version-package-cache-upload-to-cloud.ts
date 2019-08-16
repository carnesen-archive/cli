import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import { promisify } from 'util';
import { stat, createReadStream } from 'fs';
import { NO_CONTENT, OK } from 'http-status-codes';

import { CodedError } from '@carnesen/coded-error';
import pump = require('pump');

import { cloudApiUrl } from './cli-config';
import { modelVersionPackageCacheGetPath } from './model-version-package-path';
import { CLOUD_API_MODEL_VERSION_PACKAGES_PATH } from '@alwaysai/cloud-api';
import { LOCAL_MODEL_VERSION_PACKAGE_NUMBER } from '../constants';

export async function modelVersionPackageCacheUploadToCloud(opts: {
  id: string;
  uuid: string;
  bearerToken: string;
}) {
  const { id, bearerToken, uuid } = opts;
  const { protocol, hostname, port } = new URL(cloudApiUrl);

  const headers: http.OutgoingHttpHeaders = {
    'Content-Type': 'application/gzip',
    Authorization: `Bearer ${bearerToken}`,
  };

  const packagePath = modelVersionPackageCacheGetPath({
    id,
    version: LOCAL_MODEL_VERSION_PACKAGE_NUMBER,
  });
  const stats = await promisify(stat)(packagePath);

  return new Promise<string>((resolve, reject) => {
    const req = (protocol === 'http:' ? http : https).request({
      hostname,
      port,
      method: 'PUT',
      path: `${CLOUD_API_MODEL_VERSION_PACKAGES_PATH}/${uuid}`,
      headers: {
        ...headers,
        'Content-Length': stats.size,
      },
    });

    req.once('response', (res: http.IncomingMessage) => {
      let responseData = '';

      res.on('data', chunk => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && (res.statusCode === NO_CONTENT || res.statusCode === OK)) {
          resolve(responseData);
        } else {
          reject(
            new CodedError(
              `Server responded status ${res.statusCode}`,
              res.statusCode,
              responseData,
            ),
          );
        }
      });
    });

    req.on('error', (err: NodeJS.ErrnoException) => {
      reject(new CodedError(`http request failed "${err.message}"`, err.code));
    });

    const readable = createReadStream(packagePath);
    pump(readable, req, err => {
      if (err) {
        reject(err);
      }
    });
  });
}
