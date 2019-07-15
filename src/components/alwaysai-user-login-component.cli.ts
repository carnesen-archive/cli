import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { alwaysaiUserLoginComponent } from './alwaysai-user-login-component';

const leaf = createLeaf({
  name: alwaysaiUserLoginComponent.name,
  async action() {
    await alwaysaiUserLoginComponent({
      yes: false,
      alwaysaiUserEmail: 'dev@alwaysai.co',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
