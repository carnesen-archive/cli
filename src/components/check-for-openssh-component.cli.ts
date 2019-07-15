import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { checkForOpensshComponent } from './check-for-openssh-component';

const leaf = createLeaf({
  name: checkForOpensshComponent.name,
  async action() {
    return await checkForOpensshComponent();
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
