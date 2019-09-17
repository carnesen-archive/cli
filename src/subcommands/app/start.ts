import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { appStartComponent } from '../../components/app-start-component';

// Currently we run the "start" command as a superuser because otherwise we
// cannot connect to the NCS accelerator. It ~should~ be possible to connect to
// the NCS even without --privileged mode, but we need to do the work to set
// that up. See https://movidius.github.io/ncsdk/docker.html

export const appStartCliLeaf = createLeaf({
  name: 'start',
  options: {
    'no-superuser': createFlagInput({
      description:
        'Launch the application as the login user rather than as the superuser "root"',
    }),
  },
  description: 'Run this application "start" script on the target',
  async action(_, opts) {
    const exitCode = await appStartComponent({ superuser: !opts['no-superuser'] });
    process.exit(exitCode);
  },
});
