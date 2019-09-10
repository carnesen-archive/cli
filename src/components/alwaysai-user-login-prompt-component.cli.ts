import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { alwaysaiUserLoginPromptComponent } from './alwaysai-user-login-prompt-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { alwaysaiUserEmailCliInput } from '../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../cli-inputs/alwaysai-user-password-cli-input';

const leaf = createLeaf({
  name: alwaysaiUserLoginPromptComponent.name,
  options: {
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

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
