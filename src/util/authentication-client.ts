(global as any)['fetch'] = require('node-fetch');
import { AuthenticationClient } from '@alwaysai/cloud-api';
import { systemId } from './cli-config';
import { credentialsJsonFile } from './credentials-json-file';

export const authenticationClient = AuthenticationClient({
  systemId,
  storage: credentialsJsonFile,
});
