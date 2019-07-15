import { createLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { alwaysaiUserEmailCliInput } from '../../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../../cli-inputs/alwaysai-user-password-cli-input';
import { appConfigureComponent } from '../../components/app-configure-component';
import { targetProtocolCliInput } from '../../cli-inputs/target-protocol-cli-input';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../../cli-inputs/target-path-cli-input';

export const appConfigureCliLeaf = createLeaf({
  name: 'configure',
  description: 'Configure your application and deployment target',
  options: {
    yes: yesCliInput,
    email: alwaysaiUserEmailCliInput,
    password: alwaysaiUserPasswordCliInput,
    protocol: targetProtocolCliInput,
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, opts) {
    return await appConfigureComponent({
      yes: opts.yes,
      alwaysaiUserEmail: opts.email,
      alwaysaiUserPassword: opts.password,
      targetProtocol: opts.protocol,
      targetHostname: opts.hostname,
      targetPath: opts.path,
    });
  },
});
