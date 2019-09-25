import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { connectBySshComponent } from './connect-by-ssh-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

const leaf = createLeaf({
  name: connectBySshComponent.name,
  options: {
    hostname: targetHostnameCliInput,
  },
  async action(_, { hostname = 'localhost' }) {
    return await connectBySshComponent({
      targetHostname: hostname,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
