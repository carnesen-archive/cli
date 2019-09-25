import { join } from 'path';
import * as t from 'io-ts';
import { ConfigFile, ALWAYSAI_CONFIG_DIR } from '@alwaysai/config-nodejs';
import { TERSE } from '@alwaysai/alwayscli';
import KeyMirror = require('keymirror');
import { ALWAYSAI_CLI_EXECUTABLE_NAME } from '../constants';

export const SystemId = KeyMirror({
  local: null,
  development: null,
  qa: null,
  production: null,
});

export type SystemId = keyof typeof SystemId;

export const SYSTEM_IDS = Object.keys(SystemId) as SystemId[];

const props = {
  systemId: t.keyof(SystemId),
};

const codec = t.partial(props);

const CLI_JSON_FILE_NAME = 'alwaysai.cli.json';
const path = join(ALWAYSAI_CONFIG_DIR, CLI_JSON_FILE_NAME);

export const cliConfigFile = ConfigFile({
  path,
  codec,
  ENOENT: {
    code: TERSE,
    message: `File not found ${CLI_JSON_FILE_NAME}. Run command "${ALWAYSAI_CLI_EXECUTABLE_NAME} config set" to set configuration values.`,
  },
  initialValue: {},
});

const maybeConfig = cliConfigFile.readIfExists();
export const systemId =
  maybeConfig && maybeConfig.systemId ? maybeConfig.systemId : 'production';
