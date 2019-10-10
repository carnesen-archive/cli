import { RpcClient } from '@alwaysai/cloud-api';
import { CliAuthenticationClient } from './authentication-client';
import { getSystemId } from './system-id';

export function CliRpcClient() {
  const { getAuthorizationHeader } = CliAuthenticationClient();
  return RpcClient({
    systemId: getSystemId(),
    getAuthorizationHeader,
  });
}
