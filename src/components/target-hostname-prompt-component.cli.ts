import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { targetHostnamePromptComponent } from './target-hostname-prompt-component';

const leaf = CliLeaf({
  name: targetHostnamePromptComponent.name,
  async action() {
    return await targetHostnamePromptComponent({
      targetHostname: 'localhost',
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
