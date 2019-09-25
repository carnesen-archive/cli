import { join } from 'path';

import * as t from 'io-ts';

import { ALWAYSAI_CONFIG_DIR, ConfigFile } from '@alwaysai/config-nodejs';
import { AuthenticationStorage } from '@alwaysai/cloud-api';

const credentialsJsonCodec = t.record(t.string, t.any);

export const credentialsJsonFile = CredentialsJsonFile(ALWAYSAI_CONFIG_DIR);

export function CredentialsJsonFile(dir: string) {
  const path = join(dir, 'alwaysai.credentials.json');
  const configFile = ConfigFile({
    path,
    codec: credentialsJsonCodec,
    initialValue: {},
  });

  configFile.initialize();
  const authenticationStorage: AuthenticationStorage = {
    setItem(key: string, value: string) {
      configFile.update(config => {
        config[key] = value;
      });
    },
    getItem(key: string) {
      return configFile.read()[key] || '';
    },
    removeItem(key: string) {
      configFile.update(config => {
        delete config[key];
      });
    },
    clear() {
      configFile.write({});
    },
  };

  return authenticationStorage;
}
