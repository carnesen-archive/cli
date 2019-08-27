import {
  createLeaf,
  createJsonInput,
  createBranch,
  createStringInput,
} from '@alwaysai/alwayscli';
import { rpcMethodSpecs } from '@alwaysai/cloud-api';
import { RpcClient } from '../rpc-client';
import { SendRpcData } from '../rpc-client/send-rpc-data';
import { getBearerToken } from '../util/cognito-auth';

const methods = Object.entries(rpcMethodSpecs).map(([methodName, { description }]) => {
  return createLeaf({
    name: methodName,
    description,
    args: createJsonInput({
      placeholder: '<args>',
      description: 'Method arguments array as a JSON string',
    }),
    async action(args) {
      const rpcClient = await RpcClient();
      const method = (rpcClient as any)[methodName];
      const result = await method(...(args || []));
      return result;
    },
  });
});

const raw = createLeaf({
  name: 'raw',
  args: createStringInput({
    placeholder: '<data>',
    required: true,
  }),
  description: 'Send a custom data payload to the RPC endpoint',
  async action(data) {
    const bearerToken = await getBearerToken();
    const sendRpcData = SendRpcData({ bearerToken });
    return await sendRpcData(data);
  },
});

export const rpc = createBranch({
  name: 'rpc',
  description: 'Call the alwaysAI Cloud API RPC interface',
  subcommands: [...methods, raw],
});
