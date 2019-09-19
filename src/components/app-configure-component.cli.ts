import { runAndExit, createCli, createLeaf, createOneOfInput } from '@alwaysai/alwayscli';
import { appConfigureComponent } from './app-configure-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

const NODEJS_PLATFORMS: NodeJS.Platform[] = ['win32', 'darwin', 'linux'];

const leaf = createLeaf({
  name: appConfigureComponent.name,
  options: {
    yes: yesCliInput,
    platform: createOneOfInput({ required: false, values: NODEJS_PLATFORMS }),
  },
  async action(_, { yes, platform }) {
    return await appConfigureComponent({
      yes,
      nodejsPlatform: platform,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
