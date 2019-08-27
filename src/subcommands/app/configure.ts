import { createLeaf, UsageError } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { appConfigureComponent } from '../../components/app-configure-component';
import { targetProtocolCliInput } from '../../cli-inputs/target-protocol-cli-input';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../../cli-inputs/target-path-cli-input';
import { NotAllowedWithMessage } from '../../util/not-allowed-with-message';
import { platform } from 'os';
import { TargetProtocol } from '../../util/target-protocol';

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
    const { yes, hostname, path, protocol } = opts;

    // Preliminary checks that don't help us with type narrowing
    if (protocol === 'docker:' && platform() !== 'linux') {
      throw new UsageError(
        `Option "protocol" is not allowed to have value "${
          TargetProtocol['docker:']
        }" if your operating system platform is "${platform}"`,
      );
    }

    if (protocol === 'docker:' && hostname) {
      throw new UsageError(
        NotAllowedWithMessage('hostname', 'protocol', TargetProtocol['docker:']),
      );
    }

    if (protocol === 'docker:' && path) {
      throw new UsageError(
        NotAllowedWithMessage('path', 'protocol', TargetProtocol['docker:']),
      );
    }

    return await appConfigureComponent({
      yes,
      targetProtocol: protocol,
      targetHostname: hostname,
      targetPath: path,
    });
  },
});
