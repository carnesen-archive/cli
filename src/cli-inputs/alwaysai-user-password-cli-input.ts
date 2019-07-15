import { UsageError, Input } from '@alwaysai/alwayscli';

const placeholder = '<password>';

export const alwaysaiUserPasswordCliInput: Input<string | undefined, false> = {
  async getValue(argv) {
    if (!argv) {
      return undefined;
    }
    if (argv.length > 2) {
      throw new UsageError(`Expected a single ${placeholder} value`);
    }
    if (!argv[0]) {
      throw new UsageError(`Expected a ${placeholder} value`);
    }
    return argv[0];
  },
  getDescription() {
    return 'Your alwaysAI user password';
  },
  placeholder,
  required: false,
};
