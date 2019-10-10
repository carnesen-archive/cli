import { CliEnhancer } from '@alwaysai/alwayscli';
import logSymbols = require('log-symbols');
import { audit, openAuditLog } from './util/audit';
import { ALWAYSAI_AUDIT_LOG } from './environment';
import { postTrackingDataToSegment } from './util/post-tracking-data-to-segment';

export const enhancer: CliEnhancer = argvInterface => async (...argv: string[]) => {
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

  const argvString = argv.join(' ');
  const trackingPromise = postTrackingDataToSegment(argvString);
  try {
    const returnValue = await argvInterface(...argv);

    await new Promise(resolve => {
      audit(`end "${returnValue}"`, () => {
        resolve();
      });
    });
    await trackingPromise;
    return returnValue;
  } catch (exception) {
    await Promise.all([
      postTrackingDataToSegment(argvString, exception),
      trackingPromise,
    ]);
    throw exception;
  }
};
