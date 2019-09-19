import tempy = require('tempy');
import { runAndCatch } from '@carnesen/run-and-catch';
import { TERSE } from '@alwaysai/alwayscli';
import pump = require('pump');
import { createWriteStream } from 'fs';
import * as tar from 'tar';

import { modelPackageCloudClient } from './model-package-cloud-client';
import { ModelJsonFile } from './model-json-file';
import { join, basename } from 'path';
import { MockModel } from './mock-model';

describe('model package cloud client', () => {
  it(`throws ${TERSE} error if directory does not have a model json file`, async () => {
    const tmpDir = tempy.directory();
    const exception = await runAndCatch(modelPackageCloudClient.publish, tmpDir);
    expect(exception.code).toBe(TERSE);
  });

  it(`publish and download`, async () => {
    const mockModel = await MockModel();
    expect(mockModel.metadata.description).toBe(mockModel.json.description);
    expect(mockModel.metadata.final).toBe(true);
    expect(mockModel.metadata.failed).toBe(false);

    const modelPackageFilePath = tempy.file();

    const readable = await modelPackageCloudClient.download(
      mockModel.metadata.id,
      mockModel.metadata.version,
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
    const downloadedModelJsonFile = ModelJsonFile(
      join(targetDir, basename(mockModel.dir)),
    );
    expect(downloadedModelJsonFile.read().description).toBe(mockModel.json.description);
  });
});
