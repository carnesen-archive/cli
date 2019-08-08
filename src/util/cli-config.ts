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

export let userPoolId: string;
export let userPoolClientId: string;
export let cloudApiUrl: string;
export let s3Credentials: string;
let domainName: string;
switch (systemId) {
  case 'local': {
    userPoolId = 'us-west-2_1qn5QzXzP';
    userPoolClientId = '3mot5qlvchlui2mqs803fccbvm';
    domainName = 'a6i0.net';
    cloudApiUrl = 'http://localhost:8000';
    s3Credentials =
      'eyJhY2Nlc3NLZXlJZCI6IkFLSUE2UERXNFJHNE9KTkNLUEdCIiwic2VjcmV0QWNjZXNzS2V5IjoiSmt0QWttUVhKU1ppdGlucjZQZGw1VGIyOXIvWEltVHFSVXUzcDErZyJ9';
    break;
  }

  case 'development': {
    userPoolId = 'us-west-2_1qn5QzXzP';
    userPoolClientId = '3mot5qlvchlui2mqs803fccbvm';
    domainName = 'a6i0.net';
    cloudApiUrl = `https://api.${domainName}`;
    s3Credentials =
      'eyJhY2Nlc3NLZXlJZCI6IkFLSUE2UERXNFJHNE9KTkNLUEdCIiwic2VjcmV0QWNjZXNzS2V5IjoiSmt0QWttUVhKU1ppdGlucjZQZGw1VGIyOXIvWEltVHFSVXUzcDErZyJ9';
    break;
  }

  case 'production': {
    userPoolId = 'us-west-2_4GY5EITYm';
    userPoolClientId = '2mm3lcucrf53da27mjs5p5ei47';
    domainName = 'alwaysai.co';
    cloudApiUrl = `https://api.${domainName}`;
    s3Credentials =
      'eyJhY2Nlc3NLZXlJZCI6IkFLSUE1WUhIUVRLQ1kyRERDMzc2Iiwic2VjcmV0QWNjZXNzS2V5IjoiOU4vUlpCQVpQOEZIL0cvN1ZuNVBHeG0vc09Nb1BsMUlMeGU0SjZQUiJ9';
    break;
  }

  default: {
    throw new Error('Unsupported systemId');
  }
}

export const webAuthUrl = `https://auth.${domainName}`;
