import { writeFileSync, existsSync } from 'fs';
import ora = require('ora');
import { compare, valid } from 'semver';
import download = require('download');
import {
  DOCKERFILE,
  DOCKER_HUB_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
} from '../constants';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { TerseError } from '@alwaysai/alwayscli';
import { UnableToProceedWithoutMessage } from '../util/unable-to-proceed-without-message';

const WRITE_MESSAGE = `Write ${DOCKERFILE}`;
const FOUND_MESSAGE = `Found ${DOCKERFILE}`;

export async function findOrWriteDockerfileComponent(props: { yes: boolean }) {
  const { yes } = props;
  if (existsSync(DOCKERFILE)) {
    ora(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    const confirmed =
      yes || (await confirmWriteFilePromptComponent({ fileName: DOCKERFILE }));
    if (!confirmed) {
      throw new TerseError(UnableToProceedWithoutMessage(DOCKERFILE));
    }
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
        DOCKERFILE,
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