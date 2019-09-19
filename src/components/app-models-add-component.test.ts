import tempy = require('tempy');
import { AppJsonFile } from '../util/app-json-file';
import { rpcClient } from '../util/rpc-client';
import { appModelsAddComponent } from './app-models-add-component';
import { modelPackageCache } from '../util/model-package-cache';
import { runAndCatch, TERSE } from '@alwaysai/alwayscli';

const EMPTY_MODEL_ID = 'alwaysai/empty';

describe(appModelsAddComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    // Start with no models
    const dir = tempy.directory();
    const appJsonFile = AppJsonFile(dir);
    appJsonFile.write({ models: {} });

    // We'll add the "empty" model
    const { version } = await rpcClient.getModelVersion({ id: EMPTY_MODEL_ID });

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
      ids: ['foo/bar'],
    });
    expect(exception.code).toBe(TERSE);
    expect(exception.message).toMatch(/model not found/i);
  });
});
