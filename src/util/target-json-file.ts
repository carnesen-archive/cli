import { join } from 'path';

import chalk from 'chalk';
import * as t from 'io-ts';

import { ConfigFile } from '@alwaysai/config-nodejs';
import { CliTerseError, CLI_TERSE_ERROR } from '@alwaysai/alwayscli';

import { DockerSpawner } from './spawner/docker-spawner';
import { TargetProtocol } from './target-protocol';
import { SshDockerSpawner } from './spawner/ssh-docker-spawner';
import { SshSpawner } from './spawner/ssh-spawner';
import { JsSpawner } from './spawner/js-spawner';
import { TARGET_JSON_FILE_NAME } from '../constants';

const sshDockerTargetJsonCodec = t.type(
  {
    targetProtocol: t.literal(TargetProtocol['ssh+docker:']),
    targetHostname: t.string,
    targetPath: t.string,
    dockerImageId: t.string,
  },
  'SshDockerTarget',
);

const dockerTargetJsonCodec = t.type({
  targetProtocol: t.literal(TargetProtocol['docker:']),
  dockerImageId: t.string,
});

const targetJsonCodec = t.taggedUnion('protocol', [
  dockerTargetJsonCodec,
  sshDockerTargetJsonCodec,
]);

export type TargetJson = t.TypeOf<typeof targetJsonCodec>;

const DID_YOU_RUN_APP_CONFIGURE = 'Did you run "alwaysai app configure"?';

const ENOENT = {
  message: `${TARGET_JSON_FILE_NAME} not found. ${DID_YOU_RUN_APP_CONFIGURE}`,
  code: CLI_TERSE_ERROR,
};

export function TargetJsonFile(cwd = process.cwd()) {
  const filePath = join(cwd, TARGET_JSON_FILE_NAME);
  const configFile = ConfigFile({ path: filePath, codec: targetJsonCodec, ENOENT });

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
    const targetJson = configFile.read();
    switch (targetJson.targetProtocol) {
      case 'ssh+docker:': {
        const { targetHostname, targetPath, dockerImageId } = targetJson;
        return SshDockerSpawner({
          dockerImageId,
          targetPath,
          targetHostname,
        });
      }

      case 'docker:': {
        const { dockerImageId } = targetJson;
        return DockerSpawner({ dockerImageId });
      }

      default:
        throw new CliTerseError('Unsupported protocol');
    }
  }

  function readHostSpawner() {
    const targetJson = configFile.read();
    switch (targetJson.targetProtocol) {
      case 'ssh+docker:': {
        const { targetPath, targetHostname } = targetJson;
        return SshSpawner({
          targetHostname,
          targetPath,
        });
      }

      case 'docker:': {
        return JsSpawner();
      }

      default:
        throw new CliTerseError('Unsupported protocol');
    }
  }
}
