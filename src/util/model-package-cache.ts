import { join, dirname } from 'path';
import { rename, createWriteStream, existsSync, createReadStream } from 'fs';
import { promisify } from 'util';
import { Readable } from 'stream';

import pump = require('pump');
import rimraf = require('rimraf');

import { MODEL_PACKAGE_CACHE_DIR } from '../constants';
import { getRandomString } from './get-random-string';
import { modelVersionPackageCacheGetPath } from './model-version-package-path';
import mkdirp = require('mkdirp');
import { ModelId } from './model-id';
import { systemId } from './cli-config';

export const modelPackageCache = {
  read(id: string, version: number) {
    const modelPackagePath = ModelPackagePath(id, version);
    if (!existsSync(modelPackagePath)) {
      return undefined;
    }
    return createReadStream(modelPackagePath);
  },

  async write(opts: { id: string; version: number; readable: Readable }) {
    const packagePath = modelVersionPackageCacheGetPath(opts);
    await promisify(mkdirp)(dirname(packagePath));

    const tmpPath = `${packagePath}.${getRandomString()}.tmp`;
    try {
      await new Promise((resolve, reject) => {
        const writeable = createWriteStream(tmpPath);
        pump(opts.readable, writeable, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      await promisify(rename)(tmpPath, packagePath);
    } finally {
      await promisify(rimraf)(tmpPath);
    }
  },
};

function ModelPackagePath(id: string, version: number) {
  const { publisher, name } = ModelId.parse(id);
  return join(MODEL_PACKAGE_CACHE_DIR, systemId, publisher, name, `${version}.tar.gz`);
}
