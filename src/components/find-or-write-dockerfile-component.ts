import { writeFileSync, existsSync } from 'fs';
import { compare, valid } from 'semver';
import download = require('download');
import {
  DOCKERFILE,
  DOCKER_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
} from '../constants';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { CliTerseError } from '@alwaysai/alwayscli';
import { UnableToProceedWithoutMessage } from '../util/unable-to-proceed-without-message';
import { Spinner } from '../util/spinner';

const WRITE_MESSAGE = `Write ${DOCKERFILE}`;
const FOUND_MESSAGE = `Found ${DOCKERFILE}`;
export async function findOrWriteDockerfileComponent(props: { yes: boolean }) {
  const { yes } = props;
  if (existsSync(DOCKERFILE)) {
    Spinner(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    const confirmed =
      yes || (await confirmWriteFilePromptComponent({ fileName: DOCKERFILE }));
    if (!confirmed) {
      throw new CliTerseError(UnableToProceedWithoutMessage(DOCKERFILE));
    }
    const spinner = Spinner(WRITE_MESSAGE);
    const buffer = await download(
      `https://registry.hub.docker.com/v1/repositories/${DOCKER_EDGEIQ_REPOSITORY_NAME}/tags`,
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
        `FROM ${DOCKER_EDGEIQ_REPOSITORY_NAME}:${greatestSemver}\n`,
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
