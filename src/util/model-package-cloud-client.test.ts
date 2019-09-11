import tempy = require('tempy');
import { runAndCatch } from '@carnesen/run-and-catch';
import { modelPackageCloudClient } from './model-package-cloud-client';
import { TERSE } from '@alwaysai/alwayscli';
import pump = require('pump');
import { createWriteStream, readdirSync } from 'fs';
import * as tar from 'tar';
import { ModelJsonFile } from './model-json-file';
import { RandomString } from './get-random-string';
import { ModelId } from './model-id';
import { authenticationClient } from './authentication-client';
import { rpcClient } from './rpc-client';
import { join, basename } from 'path';

describe('model package cloud client', () => {
  it(`throws ${TERSE} error if directory does not have a model json file`, async () => {
    const tmpDir = tempy.directory();
    const exception = await runAndCatch(modelPackageCloudClient.publish, tmpDir);
    expect(exception.code).toBe(TERSE);
  });

  it(`publish and download`, async () => {
    const { username } = await authenticationClient.getInfo();

    const id = ModelId.serialize({
      publisher: username,
      name: RandomString(),
    });

    const sourceDir = tempy.directory();
    const modelJsonFile = ModelJsonFile(sourceDir);
    modelJsonFile.write({
      accuracy: '',
      description: RandomString(),
      id,
      inference_time: null,
      license: '',
      mean_average_precision_top_1: null,
      mean_average_precision_top_5: null,
      public: false,
      website_url: '',
      model_parameters: {},
    });
    const modelJson = modelJsonFile.read();

    const uuid = await modelPackageCloudClient.publish(sourceDir);
    const modelVersion = await rpcClient.getModelVersionByUuid(uuid);
    expect(modelVersion.description).toBe(modelJson.description);
    expect(modelVersion.final).toBe(true);
    expect(modelVersion.failed).toBe(false);

    const modelPackageFilePath = tempy.file();

    const readable = await modelPackageCloudClient.download(
      modelVersion.id,
      modelVersion.version,
    );

    await new Promise((resolve, reject) => {
      pump(readable, createWriteStream(modelPackageFilePath), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const targetDir = tempy.directory();
    // tar automatically detects gzip compression
    await tar.extract({ file: modelPackageFilePath, cwd: targetDir });
    const downloadedModelJsonFile = ModelJsonFile(join(targetDir, basename(sourceDir)));
    expect(downloadedModelJsonFile.read().description).toBe(modelJson.description);
  });
});
