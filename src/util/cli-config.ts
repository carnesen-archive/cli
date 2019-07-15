import { join } from 'path';

import * as t from 'io-ts';
import * as c from '@alwaysai/codecs';

import { ConfigFile, ALWAYSAI_CONFIG_DIR } from '@alwaysai/config-nodejs';
import { TERSE } from '@alwaysai/alwayscli';
import { CLI_NAME } from '../constants';

const props = {
  systemId: c.systemId,
};

const codec = t.partial(props);

const FILE_NAME = 'alwaysai.cli.json';
const path = join(ALWAYSAI_CONFIG_DIR, FILE_NAME);

export const cliConfigFile = ConfigFile({
  path,
  codec,
  ENOENT: {
    code: TERSE,
    message: `File not found. Run "${CLI_NAME} config set" to set configuration values.`,
  },
  initialValue: {},
});

const maybeConfig = cliConfigFile.readIfExists();
const systemId =
  maybeConfig && maybeConfig.systemId ? maybeConfig.systemId : 'production';

export const userPoolId = 'us-west-2_1qn5QzXzP';
export const userPoolClientId = '3mot5qlvchlui2mqs803fccbvm';
export const webAuthUrl = 'https://auth.a6i0.net&redirect_uri=https://dashboard.a6i0.net';
export let cloudApiUrl: string;
switch (systemId) {
  case 'local':
    cloudApiUrl = 'http://localhost:8000';
    break;
  case 'development':
  case 'production':
    cloudApiUrl = 'http://cloud-api-586812470.us-west-2.elb.amazonaws.com/';
    break;
  default:
    throw new Error('Unsupported systemId');
}
