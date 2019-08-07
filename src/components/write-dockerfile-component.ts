import { writeFileSync, existsSync } from 'fs';
import ora = require('ora');
import {
  DOCKERFILE,
  DOCKER_HUB_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
} from '../constants';
import { compare, valid } from 'semver';
import download = require('download');

export async function writeDockerfileComponent() {
  if (!existsSync(DOCKERFILE)) {
    const spinner = ora(`Write ${DOCKERFILE}`);
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
      if (exception.code !== 'EEXIST') {
        spinner.fail();
        throw exception;
      }
      spinner.succeed(`Found ${DOCKERFILE}`);
    }
  } else {
    ora(`Found ${DOCKERFILE}`).succeed();
  }
}
