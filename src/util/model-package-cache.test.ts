import toReadableStream = require('to-readable-stream');
import getStream = require('get-stream');

import { modelPackageCache } from './model-package-cache';
import { ModelId } from './model-id';
import { RandomString } from './get-random-string';

describe('model package cache', () => {
  const id = ModelId.serialize({
    publisher: RandomString(),
    name: RandomString(),
  });
  const version = 123;

  it('big test of all the methods', async () => {
    const dataIn = 'foo bar baz';
    const readableIn = toReadableStream(dataIn);
    await modelPackageCache.write(id, version, readableIn);
    const readableOut = modelPackageCache.read(id, version);
    const dataOut = await getStream(readableOut);
    expect(dataOut).toBe(dataIn);
    expect(modelPackageCache.has(id, version)).toBe(true);
    expect(modelPackageCache.has(id, version + 12)).toBe(false);
  });
});
