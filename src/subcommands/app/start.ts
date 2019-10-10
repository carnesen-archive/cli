import { CliLeaf, CliFlagInput, CliStringArrayInput } from '@alwaysai/alwayscli';

import { appStartComponent } from '../../components/app-start-component';

// Currently we run the "start" command as a superuser because otherwise we
// cannot connect to the NCS accelerator. It ~should~ be possible to connect to
// the NCS even without --privileged mode, but we need to do the work to set
// that up. See https://movidius.github.io/ncsdk/docker.html

export const appStartCliLeaf = CliLeaf({
  name: 'start',
  namedInputs: {
    'no-superuser': CliFlagInput({
      description:
        'If running in a container, do so as the login user instead of as the superuser "root"',
    }),
  },
  escapedInput: CliStringArrayInput({
    placeholder: '<args>',
    description: 'Arguments passed directly to the application',
  }),
  description: 'Run this application\'s "start" script',
  async action(_, opts, escaped) {
    const exitCode = await appStartComponent({
      noSuperuser: opts['no-superuser'],
      args: escaped,
    });
    process.exit(exitCode);
  },
});
