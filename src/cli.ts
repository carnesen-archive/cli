import { createBranch, createCli } from '@alwaysai/alwayscli';
import { subcommands } from './subcommands';
import { ALWAYSAI_CLI_EXECUTABLE_NAME } from './constants';
import { audit, openAuditLog } from './util/audit';
import { ALWAYSAI_AUDIT_LOG } from './environment';
import logSymbols = require('log-symbols');
import { authenticationClient } from './util/authentication-client';

const writeKey = 'H9SHsAseGIYI6PjjNhBO6OSyzx4cJSUG:';
const buff = Buffer.from(writeKey, 'utf-8');
const authHeader = buff.toString('base64');

const track = async (message: any) => {
  let userId;

  try {
    userId = await authenticationClient.getInfo().then(res => {
      return res.uuid || 'undefined';
    });
  } catch {
    userId = 'undefined';
  }

  message.userId = userId;
  message.context = { direct: true };
  message.properties.version = require('../package.json').version;
  await fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    body: JSON.stringify(message, null, 2),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authHeader}`,
    },
  });
};

const root = createBranch({
  name: ALWAYSAI_CLI_EXECUTABLE_NAME,
  description: 'Manage your alwaysAI assets and environment',
  subcommands,
});

const createdCli = createCli(root);

export async function cli(...argv: string[]) {
  if (ALWAYSAI_AUDIT_LOG) {
    try {
      await openAuditLog(ALWAYSAI_AUDIT_LOG);
    } catch (exception) {
      console.error(
        `${logSymbols.warning} Failed to open audit log: "${exception.message}"`,
      );
    }
  }

  audit(`start "${argv.join(' ')}"`);
  const returnValue = await createdCli(...argv);
  await new Promise(resolve => {
    audit(`end "${returnValue}"`, () => {
      resolve();
    });
  });

  const commandName = argv.join(' ');

  await track({
    event: commandName,
    properties: {
      returnVal: returnValue,
    },
  });

  return returnValue;
}
