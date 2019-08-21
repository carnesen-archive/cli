import { createLeaf, UsageError } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { appConfigureComponent } from '../../components/app-configure-component';
import { targetProtocolCliInput } from '../../cli-inputs/target-protocol-cli-input';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../../cli-inputs/target-path-cli-input';

export const appConfigureCliLeaf = createLeaf({
  name: 'configure',
  description: 'Configure this directory as an alwaysAI application',
  options: {
    yes: yesCliInput,
    protocol: targetProtocolCliInput,
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, opts) {
    return await appConfigureComponent({
      yes: opts.yes,
      targetProtocol: opts.protocol,
      targetHostname: opts.hostname,
      targetPath: opts.path,
    });
  },
});
