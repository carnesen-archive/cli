import { RpcClient } from '@alwaysai/cloud-api';
import { systemId } from './cli-config';
import { authenticationClient } from './authentication-client';

const { getAuthorizationHeader } = authenticationClient;

export const rpcClient = RpcClient({
  systemId,
  getAuthorizationHeader,
});
