(global as any)['fetch'] = require('node-fetch');
import { AuthenticationClient } from '@alwaysai/cloud-api';
import { getSystemId } from './system-id';
import { credentialsJsonFile } from './credentials-json-file';

export function CliAuthenticationClient(options: Partial<{ readonly: boolean }> = {}) {
  const { readonly } = options;
  return AuthenticationClient({
    systemId: getSystemId(),
    storage: credentialsJsonFile,
    readonly,
  });
}
