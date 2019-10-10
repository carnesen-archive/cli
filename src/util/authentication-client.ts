(global as any)['fetch'] = require('node-fetch');
import { AuthenticationClient } from '@alwaysai/cloud-api';
import { getSystemId } from './system-id';
import { credentialsJsonFile } from './credentials-json-file';

export function CliAuthenticationClient() {
  return AuthenticationClient({
    systemId: getSystemId(),
    storage: credentialsJsonFile,
  });
}
