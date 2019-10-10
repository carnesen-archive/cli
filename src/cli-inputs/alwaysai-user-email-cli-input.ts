import { CliInput, CliUsageError, CliTerseError } from '@alwaysai/alwayscli';
import { VALID_EMAIL_REGULAR_EXPRESSION } from '../constants';

const placeholder = '<address>';

export const alwaysaiUserEmailCliInput: CliInput<string | undefined, false> = {
  required: false,
  async getValue(argv) {
    if (!argv) {
      return undefined;
    }

    if (argv.length > 1) {
      throw new CliUsageError(`Expected a single ${placeholder}`);
    }

    if (!argv[0]) {
      throw new CliUsageError(`Expected an ${placeholder}`);
    }

    if (!VALID_EMAIL_REGULAR_EXPRESSION.test(argv[0])) {
      throw new CliTerseError(`"${argv[0]}" is not a valid email`);
    }

    return argv[0];
  },
  description: 'Email address associated with your alwaysAI user account',
  placeholder,
};
