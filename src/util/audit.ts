import { RandomString } from './get-random-string';
import { createWriteStream } from 'fs';

const Analytics = require('analytics-node');
const analytics = new Analytics('62LYiCfyDB5MKGwKEYdsdY1ZTUY6VXVV');

const noop = (_: string, callback?: () => void) => {
  if (callback) {
    callback();
  }
};

export let audit = noop;

export async function openAuditLog(path: string) {
  const uniqueId = RandomString().padEnd(11, ' ');
  const stream = createWriteStream(path, { flags: 'a' });
  const writeToStream: typeof audit = (message, callback) => {
    const formattedMessage = `${new Date().toISOString()} ${uniqueId} ${message}\n`;
    console.log('formattedMessage : ', formattedMessage);
    analytics.track({
      userId: 'test',
      event: 'CLI Audit Log',
      properties: {
        message,
      },
    });
    stream.write(formattedMessage, callback);
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
