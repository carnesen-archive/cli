import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { targetPathPromptComponent } from './target-path-prompt-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../cli-inputs/target-path-cli-input';

const leaf = CliLeaf({
  name: targetPathPromptComponent.name,
  namedInputs: {
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, { hostname: targetHostname = 'localhost', path: targetPath }) {
    await targetPathPromptComponent({ targetHostname, targetPath });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
