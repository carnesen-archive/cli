import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { writeAppConfigFileComponent } from './write-app-config-file-component';
import { appConfigFile } from '../util/app-config-file';

const leaf = createLeaf({
  name: writeAppConfigFileComponent.name,
  async action() {
    appConfigFile.remove();
    return await writeAppConfigFileComponent({
      yes: false,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
