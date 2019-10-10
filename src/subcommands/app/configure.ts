import { CliLeaf, CliUsageError } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { appConfigureComponent } from '../../components/app-configure-component';
import { targetProtocolCliInput } from '../../cli-inputs/target-protocol-cli-input';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../../cli-inputs/target-path-cli-input';
import { NotAllowedWithMessage } from '../../util/not-allowed-with-message';
import { TargetProtocol } from '../../util/target-protocol';
import { ALWAYSAI_OS_PLATFORM } from '../../environment';

export const appConfigureCliLeaf = CliLeaf({
  name: 'configure',
  description: 'Configure this directory as an alwaysAI application',
  namedInputs: {
    yes: yesCliInput,
    protocol: targetProtocolCliInput,
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, opts) {
    const { yes, hostname, path, protocol } = opts;

    // Preliminary checks that don't help us with type narrowing
    if (protocol === 'docker:' && ALWAYSAI_OS_PLATFORM !== 'linux') {
      throw new CliUsageError(
        `Option "protocol" is not allowed to have value "${
          TargetProtocol['docker:']
        }" if your operating system platform is "${ALWAYSAI_OS_PLATFORM}"`,
      );
    }

    if (protocol === 'docker:' && hostname) {
      throw new CliUsageError(
        NotAllowedWithMessage('hostname', 'protocol', TargetProtocol['docker:']),
      );
    }

    if (protocol === 'docker:' && path) {
      throw new CliUsageError(
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
