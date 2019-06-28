import { basename } from 'path';

import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { yes } from '../../inputs/yes';
import { modelConfigFile } from './model-config-file';
import { checkTerminalIsInteractive } from '../../util/prompt';
import { echo } from '../../util/echo';

type Config = Parameters<typeof modelConfigFile.write>[0];

const ALREADY_EXISTS_MESSAGE = "You're already in an alwaysAI model directory!";

export const init = createLeaf({
  name: 'init',
  description: 'Initialize this directory as an alwaysAI model',
  options: {
    yes,
  },
  async action(_, { yes }) {
    if (!yes) {
      checkTerminalIsInteractive();
    }

    if (modelConfigFile.exists()) {
      if (!yes) {
        throw new TerseError(ALREADY_EXISTS_MESSAGE);
      } else {
        return ALREADY_EXISTS_MESSAGE;
      }
    }

    echo('Welcome! This command will initialize this directory as an alwaysAI model.');
    echo();

    const defaultConfig: Config = {
      id: `alwaysai/${basename(process.cwd())}`,
      version: '0.0.0-0',
      accuracy: '',
      description: '',
      license: 'UNLICENSED',
      public: true,
    };

    modelConfigFile.write(defaultConfig);
    return `Wrote ${basename(modelConfigFile.path)}`;
  },
});
