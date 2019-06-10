import { Choice } from 'prompts';
import ora = require('ora');

import { UsageError } from '@alwaysai/alwayscli';

import { prompt } from '../../../../util/prompt';
import { TargetProtocol } from '../../../../util/target-protocol';
import { SshSpawner } from '../../../../spawner/ssh-spawner';
import { echo } from '../../../../util/echo';

import { validatePath, options } from './options';
import { confirmSave } from './confirm-save';

export async function promptForProtocol(initialProtocol: TargetProtocol) {
  const choices: Choice[] = [
    { title: 'On a remote host accessible via ssh', value: TargetProtocol['ssh:'] },
    { title: 'In a docker container on this host', value: TargetProtocol['docker:'] },
    {
      title: 'In a docker container on a remote host accessible via ssh',
      value: TargetProtocol['ssh+docker:'],
    },
  ];

  const initial = choices.findIndex(choice => choice.value === initialProtocol);
  if (initial === -1) {
    throw new Error('Invalid initial value');
  }

  const answer = await prompt([
    {
      type: 'select',
      name: 'protocol',
      message: 'Where do you want to run the application?',
      initial,
      choices,
    },
  ]);

  const protocol: TargetProtocol = answer.protocol;
  return protocol;
}

const RequiredWithYesMessage = (optionName: string) =>
  `--${optionName} is required with --yes when the target protocol is "ssh:"`;

export async function promptForHostname(initialValue: string, yes: boolean) {
  let hostname: string;
  if (yes) {
    if (!initialValue) {
      throw new UsageError(RequiredWithYesMessage('hostname'));
    }
    hostname = initialValue;
  } else {
    const answer = await prompt([
      {
        type: 'text',
        name: 'hostname',
        message: options.hostname.getDescription(),
        initial: initialValue,
        validate: value => (!value ? 'Value is required' : true),
      },
    ]);
    ({ hostname } = answer);
  }
  let connected = false;
  const spinner = ora('Check connectivity').start();
  try {
    const spawner = SshSpawner({ hostname, path: '/tmp' });
    await spawner.run({ exe: 'ls' });
    connected = true;
    spinner.succeed();
  } catch (ex) {
    spinner.fail('Connection to target host failed');
    if (ex.message) {
      echo(ex.message);
    }
    await confirmSave(yes);
  }
  return { connected, hostname };
}

export async function promptForPath(
  initialValue: string,
  hostname: string | undefined,
  yes: boolean,
) {
  let path: string;
  if (yes) {
    if (!initialValue) {
      throw new UsageError(RequiredWithYesMessage('path'));
    }
    path = initialValue;
  } else {
    const answer = await prompt([
      {
        type: 'text',
        name: 'path',
        message: options.path.getDescription(),
        initial: initialValue,
        validate: value => validatePath(value) || true,
      },
    ]);

    path = answer.path;
  }

  if (hostname) {
    const spinner = ora('Check filesystem permissions').start();
    try {
      const spawner = SshSpawner({ hostname, path });
      await spawner.mkdirp();
      spinner.succeed();
    } catch (ex) {
      spinner.fail('Failed to create application directory on target system');
      if (ex.message) {
        echo(ex.message);
      }
      await confirmSave(yes);
    }
  }

  return path;
}
