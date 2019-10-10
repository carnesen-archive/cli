import tempy = require('tempy');
import { appModelsUpdateComponent } from './app-models-update-component';
import { AppJsonFile } from '../util/app-json-file';
import { CliRpcClient } from '../util/rpc-client';
import { CLI_TERSE_ERROR } from '@alwaysai/alwayscli';
import { CliAuthenticationClient } from '../util/authentication-client';
import { RandomString } from '../util/get-random-string';
import { runAndCatch } from '@carnesen/run-and-catch';

describe(appModelsUpdateComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    const dir = tempy.directory();
    const appJsonFile = AppJsonFile(dir);
    const { username } = await CliAuthenticationClient().getInfo();

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
    const { version } = await CliRpcClient().getModelVersion({ id });
    expect(appJsonFile.read().models![id]).toBe(version);

    // Operation is idempotent
    await appModelsUpdateComponent({ yes, dir });

    // Throws "model not found" if the model id does not exist
    appJsonFile.write({ models: { [`${username}/${RandomString()}`]: 1 } });
    const exception = await runAndCatch(appModelsUpdateComponent, { yes, dir });
    expect(exception.code).toBe(CLI_TERSE_ERROR);
    expect(exception.message).toMatch(/model not found/i);
  });
});
