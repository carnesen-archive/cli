import { cast } from '@alwaysai/codecs';
import { rpcMethodSpecs, RpcApi, RpcRequest, ErrorCode } from '@alwaysai/cloud-api';
import { TerseError } from '@alwaysai/alwayscli';

import { SendRpcData } from './send-rpc-data';
import { deserializeRpcResponse } from './deserialize-rpc-response';

import { getBearerToken } from '../util/cognito-auth';
import { PLEASE_LOG_IN_MESSAGE } from '../util/credentials-store';

export async function RpcClient(): Promise<RpcApi> {
  const bearerToken = await getBearerToken();
  const sendRpcData = SendRpcData({ bearerToken });

  const rpcClient: any = {};
  for (const [methodName, { argsCodec }] of Object.entries(rpcMethodSpecs)) {
    rpcClient[methodName] = async (...rawArgs: unknown[]) => {
      // Client-side validation of args
      const args = cast(argsCodec as any, rawArgs);
      // Prepare request
      const rpcRequest: RpcRequest = {
        methodName,
        args: args as unknown[],
      };
      const data = JSON.stringify(rpcRequest);

      // Send request
      const responseData = await sendRpcData(data);

      // Process response
      try {
        const result = deserializeRpcResponse(responseData);
        return result;
      } catch (err) {
        if (err.code === ErrorCode.AUTHENTICATION_REQUIRED) {
          throw new TerseError(PLEASE_LOG_IN_MESSAGE);
        }
        throw err;
      }
    };
  }
  return rpcClient;
}
