import { CliBranch, CliLeaf, CliOneOfInput } from '@alwaysai/alwayscli';
import { SYSTEM_IDS, getSystemId, setSystemId } from '../../util/system-id';
import { ALWAYSAI_CLI_EXECUTABLE_NAME } from '../../constants';
import { ALWAYSAI_SHOW_HIDDEN } from '../../environment';

const show = CliLeaf({
  name: 'show',
  description: `Show your current "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration`,
  action() {
    return { systemId: getSystemId() };
  },
});

const set = CliLeaf({
  name: 'set',
  description: `Set an "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration value`,
  namedInputs: {
    systemId: CliOneOfInput({ values: SYSTEM_IDS, required: true }),
  },
  action(_, { systemId }) {
    return setSystemId(systemId);
  },
});

export const config = CliBranch({
  name: 'config',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  description: `Show or set "${ALWAYSAI_CLI_EXECUTABLE_NAME}" configuration values`,
  subcommands: [show, set],
});
