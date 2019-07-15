import { createOneOfInput } from '@alwaysai/alwayscli';
import { TARGET_PROTOCOLS } from '../util/target-protocol';

export const targetProtocolCliInput = createOneOfInput({
  values: TARGET_PROTOCOLS,
});
