import { CliAuthenticationClient } from './authentication-client';

const version = require('../../package.json');

const writeKey = 'H9SHsAseGIYI6PjjNhBO6OSyzx4cJSUG:';
const buffer = Buffer.from(writeKey, 'utf8');
const authHeader = buffer.toString('base64');

export async function postTrackingDataToSegment(event: string, label?: any) {
  let uuid = 'undefined';
  try {
    ({ uuid } = await CliAuthenticationClient().getInfo());
  } catch {}

  const data = {
    event,
    properties: {
      category: 'CLI',
      label,
      userId: uuid,
      context: { direct: true },
      version,
    },
  };
  try {
    await fetch('https://api.segment.io/v1/track', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
    });
  } catch {}
}
