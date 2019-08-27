import { writeFileSync, existsSync } from 'fs';
import ora = require('ora');
import { compare, valid } from 'semver';
import download = require('download');

import {
  DOCKERFILE,
  DOCKER_HUB_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
} from '../constants';
import { confirmWriteFileComponent } from './confirm-write-file-component';
import { TerseError } from '@alwaysai/alwayscli';
import { MissingFilePleaseRunAppConfigureMessage } from '../util/missing-file-please-run-app-configure-message';

const WRITE_MESSAGE = `Write ${DOCKERFILE}`;
const FOUND_MESSAGE = `Found ${DOCKERFILE}`;
const fileName = DOCKERFILE;
export async function findOrWriteDockerfileComponent(props: {
  yes: boolean;
  weAreInAppConfigure: boolean;
}) {
  const { yes, weAreInAppConfigure } = props;
  if (existsSync(fileName)) {
    ora(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    if (yes && !weAreInAppConfigure) {
      throw new TerseError(MissingFilePleaseRunAppConfigureMessage(fileName));
    }
    await confirmWriteFileComponent({ yes, fileName });
    // At this point we are either yes or confirmed
    const spinner = ora(WRITE_MESSAGE).start();
    const buffer = await download(
      `https://registry.hub.docker.com/v1/repositories/${DOCKER_HUB_EDGEIQ_REPOSITORY_NAME}/tags`,
    );
    const serialized = buffer.toString('utf8');
    const parsed: { layer: ''; name: string }[] = JSON.parse(serialized);
    const names = parsed.map(({ name }) => name);
    const semverNames = names.filter(name => Boolean(valid(name)));
    const sortedSemverNames = semverNames.sort(compare);
    const greatestSemver = sortedSemverNames.slice(-1)[0] || DOCKER_FALLBACK_TAG_NAME;
    try {
      writeFileSync(
        fileName,
        `FROM ${DOCKER_HUB_EDGEIQ_REPOSITORY_NAME}:${greatestSemver}\n`,
        {
          flag: 'wx',
        },
      );
      spinner.succeed();
    } catch (exception) {
      if (exception.code === 'EEXIST') {
        // Unlikely scenario that the file did not exist but now does
        spinner.succeed(FOUND_MESSAGE);
      } else {
        spinner.fail();
        throw exception;
      }
    }
  }
}
