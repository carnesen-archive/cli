import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { targetProtocolPromptComponent } from './target-protocol-prompt-component';

const leaf = createLeaf({
  name: targetProtocolPromptComponent.name,
  async action() {
    return await targetProtocolPromptComponent({});
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
