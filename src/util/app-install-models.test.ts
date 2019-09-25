import { AppJsonFile } from './app-json-file';
import * as tempy from 'tempy';
import { MockModel } from './mock-model';
import { JsSpawner } from './spawner/js-spawner';
import { appInstallModels } from './app-install-models';
import { join } from 'path';
import { APP_MODELS_DIRECTORY_NAME } from '../constants';
import { ModelId } from './model-id';
import { MODEL_JSON_FILE_NAME } from './model-json-file';

describe(appInstallModels.name, () => {
  it("Installs the models described in the app's json file", async () => {
    const appDir = tempy.directory();
    const mockModel = await MockModel();
    const appConfigFile = AppJsonFile(appDir);
    appConfigFile.addModel(mockModel.json.id, mockModel.metadata.version);
    const spawner = JsSpawner({ path: appDir });
    await appInstallModels(spawner);
    const { publisher, name } = ModelId.parse(mockModel.json.id);
    const installedModelJsonSerialized = await spawner.readFile(
      join(APP_MODELS_DIRECTORY_NAME, publisher, name, MODEL_JSON_FILE_NAME),
    );
    const installedModelJson = JSON.parse(installedModelJsonSerialized);
    expect(installedModelJson.id).toBe(mockModel.json.id);
    expect(installedModelJson.version).toBe(mockModel.metadata.version);
  });
});
