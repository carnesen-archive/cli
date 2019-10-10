import { CliOneOfInput } from '@alwaysai/alwayscli';
import { TARGET_PROTOCOLS } from '../util/target-protocol';

export const targetProtocolCliInput = CliOneOfInput({
  values: TARGET_PROTOCOLS,
});
