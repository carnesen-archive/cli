import { RpcClient } from '@alwaysai/cloud-clients';
import { systemId } from './cli-config';
import { authenticationClient } from './authentication-client';

const { getAccessJwt } = authenticationClient;

export const rpcClient = RpcClient({
  systemId,
  getAccessJwt,
});
