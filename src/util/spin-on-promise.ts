import ora = require('ora');
import { audit } from './audit';

export function spinOnPromise<T>(promise: Promise<T>, opts?: ora.Options | string) {
  audit(`${spinOnPromise.name} ${JSON.stringify(opts)}`);
  ora.promise(promise, opts);
  return promise;
}
