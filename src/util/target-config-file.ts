import { join } from 'path';

import chalk from 'chalk';
import * as t from 'io-ts';

import { ConfigFile } from '@alwaysai/config-nodejs';
import { TerseError, TERSE } from '@alwaysai/alwayscli';

import { DockerSpawner } from './spawner/docker-spawner';
import { TargetProtocol } from './target-protocol';
import { SshDockerSpawner } from './spawner/ssh-docker-spawner';
import { SshSpawner } from './spawner/ssh-spawner';
import { JsSpawner } from './spawner/js-spawner';
import { TARGET_JSON_FILE_NAME } from '../constants';

const sshDockerTarget = t.type(
  {
    targetProtocol: t.literal(TargetProtocol['ssh+docker:']),
    targetHostname: t.string,
    targetPath: t.string,
    dockerImageId: t.string,
  },
  'SshDockerTarget',
);

const dockerTarget = t.type({
  targetProtocol: t.literal(TargetProtocol['docker:']),
  dockerImageId: t.string,
});

const targetConfigCodec = t.taggedUnion('protocol', [dockerTarget, sshDockerTarget]);
export type TargetConfig = t.TypeOf<typeof targetConfigCodec>;

const DID_YOU_RUN_APP_CONFIGURE = 'Did you run "alwaysai app configure"?';

const ENOENT = {
  message: `${TARGET_JSON_FILE_NAME} not found. ${DID_YOU_RUN_APP_CONFIGURE}`,
  code: TERSE,
};

export const targetConfigFile = TargetConfigFile();

function TargetConfigFile(dir = process.cwd()) {
  const filePath = join(dir, TARGET_JSON_FILE_NAME);
  const configFile = ConfigFile({ path: filePath, codec: targetConfigCodec, ENOENT });

  return {
    ...configFile,
    readContainerSpawner,
    readHostSpawner,
    describe,
  };

  function describe() {
    const config = configFile.readIfExists();
    if (!config) {
      return `Target configuration file "${TARGET_JSON_FILE_NAME}" not found`;
    }
    const docker = chalk.bold('docker');
    switch (config.targetProtocol) {
      case 'docker:': {
        return `Target: ${docker} container on this host`;
      }
      case 'ssh+docker:': {
        const hostname = chalk.bold(config.targetHostname);
        const path = chalk.bold(config.targetPath);
        return `Target: ${docker} container on ${hostname}, path ${path}`;
      }
      default:
        throw new Error('Unexpected protocol');
    }
  }

  function readContainerSpawner() {
    const targetConfiguration = configFile.read();
    switch (targetConfiguration.targetProtocol) {
      case 'ssh+docker:': {
        const { targetHostname, targetPath, dockerImageId } = targetConfiguration;
        return SshDockerSpawner({
          dockerImageId,
          targetPath,
          targetHostname,
        });
      }

      case 'docker:': {
        const { dockerImageId } = targetConfiguration;
        return DockerSpawner({ dockerImageId });
      }

      default:
        throw new TerseError('Unsupported protocol');
    }
  }

  function readHostSpawner() {
    const targetConfiguration = configFile.read();
    switch (targetConfiguration.targetProtocol) {
      case 'ssh+docker:': {
        const { targetPath, targetHostname } = targetConfiguration;
        return SshSpawner({
          targetHostname,
          targetPath,
        });
      }

      case 'docker:': {
        return JsSpawner();
      }

      default:
        throw new TerseError('Unsupported protocol');
    }
  }
}
