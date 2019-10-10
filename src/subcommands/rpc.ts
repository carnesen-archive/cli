import { CliLeaf, CliJsonInput, CliBranch } from '@alwaysai/alwayscli';
import { rpcMethodSpecs } from '@alwaysai/cloud-api';
import { CliRpcClient } from '../util/rpc-client';
import { ALWAYSAI_SHOW_HIDDEN } from '../environment';

const rpcMethodCliLeaves = Object.entries(rpcMethodSpecs).map(
  ([methodName, { description }]) => {
    return CliLeaf({
      name: methodName,
      description,
      positionalInput: CliJsonInput({
        placeholder: '<args>',
        description: 'Method arguments array as a JSON string',
      }),
      async action(args) {
        const method = (CliRpcClient() as any)[methodName];
        const result = await method(...(args || []));
        return result;
      },
    });
  },
);

const rpcRawCliLeaf = CliLeaf({
  name: 'raw',
  positionalInput: CliJsonInput({
    required: true,
  }),
  description: 'Send a custom data payload to the RPC endpoint',
  async action(data) {
    return await CliRpcClient().raw(data);
  },
});

export const rpc = CliBranch({
  name: 'rpc',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  description: 'Call the alwaysAI Cloud API RPC interface',
  subcommands: [...rpcMethodCliLeaves, rpcRawCliLeaf],
});
