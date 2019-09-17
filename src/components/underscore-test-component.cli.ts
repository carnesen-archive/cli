import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { underscoreTestComponent } from './underscore-test-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

const leaf = createLeaf({
  name: underscoreTestComponent.name,
  options: {
    hostname: targetHostnameCliInput,
    reset: createFlagInput(),
  },
  async action(_, { hostname = 'localhost', reset }) {
    return await underscoreTestComponent({
      targetHostname: hostname,
      reset,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
