import { modelVersionPackageCacheWriteReadableStream } from './model-version-package-cache-write-readable-stream';
import { getRandomString } from './get-random-string';
import { JsSpawner } from '../spawner/js-spawner';
import { basename } from 'path';
import tempy = require('tempy');
import { modelVersionPackageCacheGetReadableStream } from './model-version-package-readable-stream-from-cache-or-cloud';
import { modelVersionPackageGetReadableStreamFromCwd } from './model-version-package-readable-stream-from-cwd';
import { authenticationClient } from './authentication-client';

describe(__dirname, () => {
  it('downloads models from the cloud', () => {
    // TODO
  });
  it('reads and writes models locally', async () => {
    const id = `${getRandomString()}/${getRandomString()}`;
    const version = Math.random();
    const cwd = __dirname;
    const fromCwd = await modelVersionPackageGetReadableStreamFromCwd({ cwd });
    await modelVersionPackageCacheWriteReadableStream({
      id,
      version,
      readable: fromCwd,
    });
    const target = JsSpawner({ path: tempy.directory() });
    const bearerToken = await authenticationClient.getAccessJwt();
    const fromCache = await modelVersionPackageCacheGetReadableStream({
      id,
      version,
      bearerToken,
    });
    await target.untar(fromCache);
    const fileNames = await target.readdir();
    expect(fileNames).toEqual([basename(__dirname)]);
  });
});
