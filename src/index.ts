#!/usr/bin/env node

import { createBranch, createCli, runAndExit } from '@alwaysai/alwayscli';
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

export const alwaysai = createCli(root);

if (module === require.main) {
  runAndExit(async () => {
    const args = process.argv.slice(2);
    if (ALWAYSAI_AUDIT_LOG) {
      try {
        await openAuditLog(ALWAYSAI_AUDIT_LOG);
      } catch (exception) {
        console.error(
          `${logSymbols.warning} Failed to open audit log: "${exception.message}"`,
        );
      }
    }

    audit(`start "${args.join(' ')}"`);
    const returnValue = await alwaysai(...args);
    await new Promise(resolve => {
      audit(`end "${returnValue}"`, () => {
        resolve();
      });
    });
    return returnValue;
  });
}
