import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

import { CodedError } from '@carnesen/coded-error';
import { CLOUD_API_RPC_PATH } from '@alwaysai/cloud-api';
import { cloudApiUrl } from '../util/cli-config';

export function SendRpcData(config: { bearerToken?: string }) {
  const { bearerToken } = config;
  const { protocol, hostname, port } = new URL(cloudApiUrl);

  const headers: http.OutgoingHttpHeaders = {
    'Content-Type': 'application/json',
  };

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  return function sendRpcData(data: string) {
    return new Promise<string>((resolve, reject) => {
      const req = (protocol === 'http:' ? http : https).request({
        hostname,
        port,
        method: 'POST',
        path: CLOUD_API_RPC_PATH,
        headers: {
          ...headers,
          'Content-Length': data.length,
        },
      });

      req.end(data);

      req.once('response', (res: http.IncomingMessage) => {
        let responseData = '';

        res.on('data', chunk => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode! < 599) {
            resolve(responseData);
          } else {
            reject(
              new CodedError(`Server responded status ${res.statusCode}`, res.statusCode),
            );
          }
        });
      });

      req.on('error', (err: NodeJS.ErrnoException) => {
        reject(new CodedError(`http request failed "${err.message}"`, err.code));
      });
    });
  };
}
