import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { targetPathPromptComponent } from './target-path-prompt-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../cli-inputs/target-path-cli-input';

const leaf = createLeaf({
  name: targetPathPromptComponent.name,
  options: {
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, { hostname: targetHostname = 'localhost', path: targetPath }) {
    await targetPathPromptComponent({ targetHostname, targetPath });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
