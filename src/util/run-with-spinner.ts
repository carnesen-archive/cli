import { Spinner } from './spinner';

export async function runWithSpinner<T extends any[]>(
  func: (...args: T) => any,
  args: T,
  message: string,
) {
  const spinner = Spinner(message);
  try {
    await func(...args);
    spinner.succeed();
  } catch (exception) {
    spinner.fail();
    throw exception;
  }
}
