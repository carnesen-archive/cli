import { createLeaf, UsageError } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { appConfigureComponent } from '../../components/app-configure-component';
import { targetProtocolCliInput } from '../../cli-inputs/target-protocol-cli-input';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../../cli-inputs/target-path-cli-input';
import { NotAllowedWithMessage } from '../../util/not-allowed-with-message';
import { RequiredWithYesMessage } from '../../util/required-with-yes-message';
import { platform } from 'os';

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
    switch (opts.protocol) {
      case 'docker:': {
        if (platform() !== 'linux') {
          throw new UsageError(
            `Option "protocol" is not allowed to have value "${
              opts.protocol
            }" if your operating system platform is "${platform}"`,
          );
        }
        if (opts.hostname) {
          throw new UsageError(
            NotAllowedWithMessage('hostname', 'protocol', opts.protocol),
          );
        }
        break;
      }
      case 'ssh+docker:': {
        if (opts.yes) {
          if (!opts.hostname) {
            throw new UsageError(
              RequiredWithYesMessage(
                'hostname',
                undefined,
                `If "protocol" is "${opts.protocol}"`,
              ),
            );
          }
        }
        break;
      }
    }

    return await appConfigureComponent({
      yes: opts.yes,
      targetProtocol: opts.protocol || 'ssh+docker:',
      targetHostname: opts.hostname || '',
      targetPath: opts.path,
    });
  },
});
