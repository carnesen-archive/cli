import { createLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { alwaysaiUserEmailCliInput } from '../../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../../cli-inputs/alwaysai-user-password-cli-input';
import { targetProtocolCliInput } from '../../cli-inputs/target-protocol-cli-input';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';
import { appDeployComponent } from '../../components/app-deploy-component';
import { targetPathCliInput } from '../../cli-inputs/target-path-cli-input';

export const appDeployCliLeaf = createLeaf({
  name: 'deploy',
  description: 'Install this application and its dependencies to the target',
  options: {
    yes: yesCliInput,
    email: alwaysaiUserEmailCliInput,
    password: alwaysaiUserPasswordCliInput,
    protocol: targetProtocolCliInput,
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, opts) {
    return await appDeployComponent({
      yes: opts.yes,
      alwaysaiUserEmail: opts.email,
      alwaysaiUserPassword: opts.password,
      targetProtocol: opts.protocol,
      targetHostname: opts.hostname,
      targetPath: opts.path,
    });
  },
});
