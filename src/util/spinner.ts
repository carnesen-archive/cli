import ora = require('ora');
import { audit } from './audit';
import { NODE_ENV } from '../environment';

type Spinner = {
  fail: (message?: string) => void;
  succeed: (message?: string) => void;
  warn: (message?: string) => void;
  setMessage: (message: string) => void;
};

export function Spinner(message: string) {
  audit(`Spinner: ${message}`);
  let spinner: Spinner;
  if (NODE_ENV === 'test') {
    spinner = {
      fail() {},
      succeed() {},
      warn() {},
      setMessage() {},
    };
  } else {
    const oraSpinner = ora({ text: message, discardStdin: false }).start();
    spinner = {
      fail(message) {
        oraSpinner.fail(message);
      },
      warn(message) {
        oraSpinner.warn(message);
      },
      succeed(message) {
        oraSpinner.succeed(message);
      },
      setMessage(message) {
        oraSpinner.text = message;
      },
    };
  }
  return spinner;
}
