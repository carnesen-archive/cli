import { CliStringInput } from '@alwaysai/alwayscli';

export const targetHostnameCliInput = CliStringInput({
  description:
    'Hostname or IP address of target device (with optional username e.g. pi@1.2.3.4)',
});
