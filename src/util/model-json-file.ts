import { join } from 'path';
import * as t from 'io-ts';
import { rpcCreateModelVersionArg0Codec } from '@alwaysai/cloud-api';
import { ConfigFile } from '@alwaysai/config-nodejs';
import { TERSE } from '@alwaysai/alwayscli';

export const MODEL_JSON_FILE_NAME = 'alwaysai.model.json';

const ENOENT = {
  message: `File not found "${MODEL_JSON_FILE_NAME}". Did you run "aai model configure"?`,
  code: TERSE,
};

export type ModelJson = t.TypeOf<typeof rpcCreateModelVersionArg0Codec>;

export function ModelJsonFile(dir: string) {
  const path = join(dir, MODEL_JSON_FILE_NAME);
  const configFile = ConfigFile({ path, codec: rpcCreateModelVersionArg0Codec, ENOENT });
  return configFile;
}
