import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { appConfigureComponent } from './app-configure-component';

const leaf = createLeaf({
  name: appConfigureComponent.name,
  async action() {
    return await appConfigureComponent({
      yes: false,
      alwaysaiUserEmail: 'dev@alwaysai.co',
      alwaysaiUserPassword: '',
      targetProtocol: 'ssh+docker:',
      targetHostname: 'localhost',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
