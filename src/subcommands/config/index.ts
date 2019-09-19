import {
  createBranch,
  createLeaf,
  createOneOfInput,
  createFlagInput,
} from '@alwaysai/alwayscli';
import { cliConfigFile, SYSTEM_IDS } from '../../util/cli-config';
import { ALWAYSAI_CLI_EXECUTABLE_NAME } from '../../constants';

const show = createLeaf({
  name: 'show',
  description: `Show your current "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration`,
  action() {
    return cliConfigFile.read();
  },
});

const set = createLeaf({
  name: 'set',
  description: `Set an "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration value`,
  options: {
    systemId: createOneOfInput({ values: SYSTEM_IDS, required: true }),
  },
  action(_, opts) {
    if (opts.systemId) {
      cliConfigFile.update(config => {
        config.systemId = opts.systemId;
      });
    }
  },
});

const unset = createLeaf({
  name: 'unset',
  description: `Unset an "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration value`,
  options: {
    all: createFlagInput(),
    systemId: createFlagInput(),
  },
  action(_, opts) {
    if (opts.all) {
      cliConfigFile.remove();
      return;
    }
    if (opts.systemId) {
      cliConfigFile.update(config => {
        delete config.systemId;
      });
    }
  },
});

export const config = createBranch({
  name: 'config',
  hidden: true,
  description: `Show or set "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration values`,
  subcommands: [show, set, unset],
});
