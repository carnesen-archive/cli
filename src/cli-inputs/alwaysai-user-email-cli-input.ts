import { Input, UsageError, TerseError } from '@alwaysai/alwayscli';
import { VALID_EMAIL_REGULAR_EXPRESSION } from '../constants';

const placeholder = '<address>';

export const alwaysaiUserEmailCliInput: Input<string | undefined, false> = {
  required: false,
  async getValue(argv) {
    if (!argv) {
      return undefined;
    }

    if (argv.length > 2) {
      throw new UsageError(`Expected a single ${placeholder}`);
    }

    if (!argv[0]) {
      throw new UsageError(`Expected an ${placeholder}`);
    }

    if (!VALID_EMAIL_REGULAR_EXPRESSION.test(argv[0])) {
      throw new TerseError(`"${argv[0]}" is not a valid email`);
    }

    return argv[0];
  },
  getDescription() {
    return 'Email address associated with your alwaysAI user account';
  },
  placeholder,
};
