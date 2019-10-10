import { runAndCatch } from '@carnesen/run-and-catch';
import tempy = require('tempy');

import { AppJsonFile } from '../util/app-json-file';
import { CliRpcClient } from '../util/rpc-client';
import { appModelsAddComponent } from './app-models-add-component';
import { modelPackageCache } from '../util/model-package-cache';
import { CLI_TERSE_ERROR } from '@alwaysai/alwayscli';
import { RandomString } from '../util/get-random-string';
import { CliAuthenticationClient } from '../util/authentication-client';

const EMPTY_MODEL_ID = 'alwaysai/empty';

describe(appModelsAddComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    // Start with no models
    const dir = tempy.directory();
    const appJsonFile = AppJsonFile(dir);
    appJsonFile.write({ models: {} });
    const { username } = await CliAuthenticationClient().getInfo();

    // We'll add the "empty" model
    const { version } = await CliRpcClient().getModelVersion({ id: EMPTY_MODEL_ID });

    // Make sure it's not in the cache
    modelPackageCache.remove(EMPTY_MODEL_ID, version);

    // Now add it
    await appModelsAddComponent({ yes, dir, ids: [EMPTY_MODEL_ID] });

    // Should now be in the json file and cached
    expect(appJsonFile.read().models).toEqual({
      [EMPTY_MODEL_ID]: version,
    });
    expect(modelPackageCache.has(EMPTY_MODEL_ID, version)).toBe(true);

    // Error condition: model not found
    const exception = await runAndCatch(appModelsAddComponent, {
      yes,
      dir,
      ids: [`${username}/${RandomString()}`],
    });
    expect(exception.code).toBe(CLI_TERSE_ERROR);
    expect(exception.message).toMatch(/model not found/i);
  });
});
