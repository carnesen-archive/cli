import { createLeaf, createJsonInput, createBranch } from '@alwaysai/alwayscli';
import { rpcMethodSpecs } from '@alwaysai/cloud-api';
import { rpcClient } from '../util/rpc-client';
import { ALWAYSAI_SHOW_HIDDEN } from '../environment';

const rpcMethodCliLeaves = Object.entries(rpcMethodSpecs).map(
  ([methodName, { description }]) => {
    return createLeaf({
      name: methodName,
      description,
      args: createJsonInput({
        placeholder: '<args>',
        description: 'Method arguments array as a JSON string',
      }),
      async action(args) {
        const method = (rpcClient as any)[methodName];
        const result = await method(...(args || []));
        return result;
      },
    });
  },
);

const rpcRawCliLeaf = createLeaf({
  name: 'raw',
  args: createJsonInput({
    required: true,
  }),
  description: 'Send a custom data payload to the RPC endpoint',
  async action(data) {
    return await rpcClient.raw(data);
  },
});

export const rpc = createBranch({
  name: 'rpc',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  description: 'Call the alwaysAI Cloud API RPC interface',
  subcommands: [...rpcMethodCliLeaves, rpcRawCliLeaf],
});
