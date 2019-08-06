import { join } from 'path';
import { rpcCreateModelVersionArg0Codec } from '@alwaysai/cloud-api';
import { ConfigFile } from '@alwaysai/config-nodejs';

export const MODEL_CONFIG_FILE_NAME = 'alwaysai.model.json';

const ENOENT = {
  message: `${MODEL_CONFIG_FILE_NAME} not found. Did you run "alwaysai model init"?`,
  code: 'TERSE',
};

export function ModelConfigFile(dir = process.cwd()) {
  const path = join(dir, MODEL_CONFIG_FILE_NAME);
  const configFile = ConfigFile({ path, codec: rpcCreateModelVersionArg0Codec, ENOENT });
  return configFile;
}

export const modelConfigFile = ModelConfigFile();
