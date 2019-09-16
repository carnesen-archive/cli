import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { underscoreTestComponent } from './underscore-test-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

const leaf = createLeaf({
  name: underscoreTestComponent.name,
  options: {
    hostname: targetHostnameCliInput,
  },
  async action(_, { hostname = 'localhost' }) {
    return await underscoreTestComponent({
      targetHostname: hostname,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
