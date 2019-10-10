import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { connectBySshComponent } from './connect-by-ssh-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

const leaf = CliLeaf({
  name: connectBySshComponent.name,
  namedInputs: {
    hostname: targetHostnameCliInput,
  },
  async action(_, { hostname = 'localhost' }) {
    return await connectBySshComponent({
      targetHostname: hostname,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
