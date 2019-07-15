import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { checkForPasswordlessSshConnectivityComponent } from './check-for-passwordless-ssh-connectivity-component';

const leaf = createLeaf({
  name: checkForPasswordlessSshConnectivityComponent.name,
  async action() {
    return await checkForPasswordlessSshConnectivityComponent({
      targetHostname: 'localhost',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
