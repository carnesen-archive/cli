(global as any)['fetch'] = require('node-fetch');
import { AuthenticationClient } from '@alwaysai/cloud-clients';
import { systemId } from './cli-config';
import { credentialsStore } from './credentials-store';

export const authenticationClient = AuthenticationClient({
  systemId,
  storage: credentialsStore,
});
