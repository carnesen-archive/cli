import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

const leaf = createLeaf({
  name: checkSshConnectivityComponent.name,
  options: {
    hostname: targetHostnameCliInput,
  },
  async action(_, { hostname = 'localhost' }) {
    return await checkSshConnectivityComponent({
      targetHostname: hostname,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
