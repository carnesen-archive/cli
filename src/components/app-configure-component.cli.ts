import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { appConfigureComponent } from './app-configure-component';

const leaf = createLeaf({
  name: appConfigureComponent.name,
  async action() {
    return await appConfigureComponent({
      yes: false,
      targetProtocol: 'ssh+docker:',
      targetHostname: 'localhost',
      targetPath: '',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
