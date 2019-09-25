import { join, dirname } from 'path';
import { rename, createWriteStream, existsSync, createReadStream } from 'fs';
import { promisify } from 'util';

import pump = require('pump');
import rimraf = require('rimraf');

import { MODEL_PACKAGE_CACHE_DIR } from '../constants';
import { RandomString } from './get-random-string';
import mkdirp = require('mkdirp');
import { ModelId } from './model-id';
import { systemId } from './cli-config';

const SYSTEM_MODEL_PACKAGE_CACHE_DIR = join(MODEL_PACKAGE_CACHE_DIR, systemId);

export const modelPackageCache = {
  has(id: string, version: number) {
    const modelPackagePath = ModelPackagePath(id, version);
    return existsSync(modelPackagePath);
  },

  read(id: string, version: number) {
    const modelPackagePath = ModelPackagePath(id, version);
    return createReadStream(modelPackagePath);
  },

  async clear() {
    await new Promise((resolve, reject) => {
      rimraf(SYSTEM_MODEL_PACKAGE_CACHE_DIR, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  async write(id: string, version: number, readable: NodeJS.ReadableStream) {
    const modelPackagePath = ModelPackagePath(id, version);
    await promisify(mkdirp)(dirname(modelPackagePath));
    const tmpFilePath = `${modelPackagePath}.${RandomString()}.tmp`;
    try {
      await new Promise((resolve, reject) => {
        const writeable = createWriteStream(tmpFilePath);
        pump(readable, writeable, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      await promisify(rename)(tmpFilePath, modelPackagePath);
    } catch (exception) {
      try {
        await promisify(rimraf)(tmpFilePath);
      } finally {
        throw exception;
      }
    }
  },

  async remove(id: string, version: number) {
    const modelPackagePath = ModelPackagePath(id, version);
    await new Promise((resolve, reject) => {
      rimraf(modelPackagePath, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
};

function ModelPackagePath(id: string, version: number) {
  const { publisher, name } = ModelId.parse(id);
  return join(SYSTEM_MODEL_PACKAGE_CACHE_DIR, publisher, name, `${version}.tar.gz`);
}
