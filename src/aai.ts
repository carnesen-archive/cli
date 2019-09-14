import { createBranch, createCli } from '@alwaysai/alwayscli';
import { subcommands } from './subcommands';
import { CLI_NAME } from './constants';
import { audit, openAuditLog } from './util/audit';
import { ALWAYSAI_AUDIT_LOG } from './environment';
import logSymbols = require('log-symbols');

const root = createBranch({
  name: CLI_NAME,
  description: 'Manage your alwaysAI assets and environment',
  subcommands,
});

const cli = createCli(root);

export async function aai(...argv: string[]) {
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
  const returnValue = await cli(...argv);
  await new Promise(resolve => {
    audit(`end "${returnValue}"`, () => {
      resolve();
    });
  });
  return returnValue;
}
