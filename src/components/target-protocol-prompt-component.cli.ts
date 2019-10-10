import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { targetProtocolPromptComponent } from './target-protocol-prompt-component';

const leaf = CliLeaf({
  name: targetProtocolPromptComponent.name,
  async action() {
    return await targetProtocolPromptComponent({});
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
