import ora = require('ora');
import { audit } from './audit';
import { NODE_ENV } from '../environment';

type Spinner = {
  fail: (message?: string) => void;
  succeed: (message?: string) => void;
};

export function Spinner(message: string) {
  audit(`Spinner: ${message}`);
  let spinner: Spinner;
  if (NODE_ENV === 'test') {
    spinner = {
      fail() {},
      succeed() {},
    };
  } else {
    const oraSpinner = ora(message).start();
    spinner = {
      fail(message) {
        oraSpinner.fail(message);
      },
      succeed(message) {
        oraSpinner.succeed(message);
      },
    };
  }
  return spinner;
}
