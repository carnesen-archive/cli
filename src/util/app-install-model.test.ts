import * as tempy from 'tempy';
import { MockModel } from './mock-model';
import { JsSpawner } from './spawner/js-spawner';
import { appInstallModel } from './app-install-model';
import { join } from 'path';
import { APP_MODELS_DIRECTORY_NAME } from '../constants';
import { ModelId } from './model-id';
import { MODEL_JSON_FILE_NAME } from './model-json-file';

describe(appInstallModel.name, () => {
  it('Untars a model to the target and adds "version" to its model.json file', async () => {
    const appDir = tempy.directory();
    const mockModel = await MockModel();
    const spawner = JsSpawner({ path: appDir });
    await appInstallModel(spawner, mockModel.json.id, mockModel.metadata.version);
    const { publisher, name } = ModelId.parse(mockModel.json.id);
    const installedModelJsonSerialized = await spawner.readFile(
      join(APP_MODELS_DIRECTORY_NAME, publisher, name, MODEL_JSON_FILE_NAME),
    );
    const installedModelJson = JSON.parse(installedModelJsonSerialized);
    expect(installedModelJson.id).toBe(mockModel.json.id);
    expect(installedModelJson.version).toBe(mockModel.metadata.version);
  });
});
