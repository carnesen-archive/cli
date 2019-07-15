import { createStringInput } from '@alwaysai/alwayscli';

export const targetHostnameCliInput = createStringInput({
  description:
    'Hostname or IP address of target device (with optional username e.g. pi@1.2.3.4)',
});
