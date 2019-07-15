import { join } from 'path';

import chalk from 'chalk';
import * as t from 'io-ts';

import { ConfigFile } from '@alwaysai/config-nodejs';
import { TerseError } from '@alwaysai/alwayscli';

import { DockerSpawner } from '../spawner/docker-spawner';
import { TargetProtocol } from './target-protocol';
import { SshDockerSpawner } from '../spawner/ssh-docker-spawner';

export const TARGET_CONFIG_FILE_NAME = 'alwaysai.target.json';

const sshDockerTarget = t.type(
  {
    protocol: t.literal(TargetProtocol['ssh+docker:']),
    hostname: t.string,
    path: t.string,
  },
  'SshDockerTarget',
);

const dockerTarget = t.type({
  protocol: t.literal(TargetProtocol['docker:']),
});

const targetConfigCodec = t.taggedUnion('protocol', [dockerTarget, sshDockerTarget]);
export type TargetConfig = t.TypeOf<typeof targetConfigCodec>;

const DID_YOU_RUN_APP_CONFIGURE = 'Did you run "alwaysai app configure"?';

const ENOENT = {
  message: `${TARGET_CONFIG_FILE_NAME} not found. ${DID_YOU_RUN_APP_CONFIGURE}`,
  code: 'TERSE',
};

export const targetConfigFile = TargetConfigFile();

function TargetConfigFile(dir = process.cwd()) {
  const filePath = join(dir, TARGET_CONFIG_FILE_NAME);
  const configFile = ConfigFile({ path: filePath, codec: targetConfigCodec, ENOENT });

  return {
    ...configFile,
    readSpawner,
    describe,
  };

  function describe() {
    const config = configFile.readIfExists();
    if (!config) {
      return `Target configuration file "${TARGET_CONFIG_FILE_NAME}" not found`;
    }
    const docker = chalk.bold('docker');
    switch (config.protocol) {
      case 'docker:': {
        return `Target: ${docker} container on this host`;
      }
      case 'ssh+docker:': {
        const hostname = chalk.bold(config.hostname);
        const path = chalk.bold(config.path);
        return `Target: ${docker} container on ${hostname}, path ${path}`;
      }
      default:
        throw new Error('Unexpected protocol');
    }
  }

  function readSpawner() {
    const config = configFile.read();
    switch (config.protocol) {
      case 'ssh+docker:': {
        if (!config.hostname) {
          throw new TerseError(
            `"hostname" is required for protocol "${
              config.protocol
            }". ${DID_YOU_RUN_APP_CONFIGURE}`,
          );
        }
        if (!config.path) {
          throw new TerseError(
            `"path" is required for protocol "${
              config.protocol
            }". ${DID_YOU_RUN_APP_CONFIGURE}`,
          );
        }
        const spawner = SshDockerSpawner({
          path: config.path,
          hostname: config.hostname,
        });
        return spawner;
      }

      case 'docker:': {
        return DockerSpawner();
      }

      default:
        throw new TerseError('Unsupported protocol');
    }
  }
}
