import tempy = require('tempy');
import { modelPackageCloudClient } from './model-package-cloud-client';
import { ModelJsonFile, ModelJson } from './model-json-file';
import { RandomString } from './get-random-string';
import { ModelId } from './model-id';
import { authenticationClient } from './authentication-client';
import { rpcClient } from './rpc-client';

export async function MockModel() {
  const { username } = await authenticationClient.getInfo();

  const id = ModelId.serialize({
    publisher: username,
    name: RandomString(),
  });

  const dir = tempy.directory();
  const modelJsonFile = ModelJsonFile(dir);
  const json: ModelJson = {
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
  };

  modelJsonFile.write(json);

  const uuid = await modelPackageCloudClient.publish(dir);
  const metadata = await rpcClient.getModelVersionByUuid(uuid);
  return {
    json,
    dir,
    metadata,
  };
}
