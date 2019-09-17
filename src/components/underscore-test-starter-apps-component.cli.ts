import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { underscoreTestStarterAppsComponent } from './underscore-test-starter-apps-component';

const leaf = createLeaf({
  name: underscoreTestStarterAppsComponent.name,
  options: {
    hostname: targetHostnameCliInput,
    reset: createFlagInput(),
  },
  async action(_, { hostname = 'localhost', reset }) {
    return await underscoreTestStarterAppsComponent({
      targetHostname: hostname,
      reset,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
