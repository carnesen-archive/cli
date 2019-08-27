import { getRandomString } from './get-random-string';
import { createWriteStream } from 'fs';

const noop = (_: string, callback?: () => void) => {
  if (callback) {
    callback();
  }
};

export let audit = noop;

export async function openAuditLog(path: string) {
  const uniqueId = getRandomString().padEnd(11, ' ');
  const stream = createWriteStream(path, { flags: 'a' });
  const writeToStream: typeof audit = (message, callback) => {
    stream.write(`${new Date().toISOString()} ${uniqueId} ${message}\n`, callback);
  };
  await new Promise((resolve, reject) => {
    stream.on('error', err => {
      audit = noop;
      reject(err);
    });
    stream.on('open', _ => {
      resolve();
    });
    writeToStream('open');
  });
  audit = writeToStream;
}
