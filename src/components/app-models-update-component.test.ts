import { appModelsUpdateComponent } from './app-models-update-component';
import tempy = require('tempy');
import { AppJsonFile } from '../util/app-json-file';
import { rpcClient } from '../util/rpc-client';
import { runAndCatch, TERSE } from '@alwaysai/alwayscli';
import { authenticationClient } from '../util/authentication-client';
import { RandomString } from '../util/get-random-string';

describe(appModelsUpdateComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    const dir = tempy.directory();
    const appJsonFile = AppJsonFile(dir);
    const { username } = await authenticationClient.getInfo();

    // Does nothing if there are no models
    appJsonFile.write({ models: {} });
    await appModelsUpdateComponent({ yes, dir });
    expect(appJsonFile.read().models).toEqual({});
    const id = 'alwaysai/yolo_v2';
    appJsonFile.write({
      models: {
        [id]: -1,
      },
    });

    // Updates the version identifier for an existing model
    await appModelsUpdateComponent({ yes, dir });
    const { version } = await rpcClient.getModelVersion({ id });
    expect(appJsonFile.read().models![id]).toBe(version);

    // Operation is idempotent
    await appModelsUpdateComponent({ yes, dir });

    // Throws "model not found" if the model id does not exist
    appJsonFile.write({ models: { [`${username}/${RandomString()}`]: 1 } });
    const exception = await runAndCatch(appModelsUpdateComponent, { yes, dir });
    expect(exception.code).toBe(TERSE);
    expect(exception.message).toMatch(/model not found/i);
  });
});
