import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { alwaysaiUserLoginPromptComponent } from './alwaysai-user-login-prompt-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { alwaysaiUserEmailCliInput } from '../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../cli-inputs/alwaysai-user-password-cli-input';

const leaf = CliLeaf({
  name: alwaysaiUserLoginPromptComponent.name,
  namedInputs: {
    yes: yesCliInput,
    email: alwaysaiUserEmailCliInput,
    password: alwaysaiUserPasswordCliInput,
  },
  async action(_, opts) {
    return await alwaysaiUserLoginPromptComponent({
      alwaysaiUserEmail: opts.email,
      alwaysaiUserPassword: opts.password,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
