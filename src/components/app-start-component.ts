import { TerseError } from '@alwaysai/alwayscli';
import { AppJsonFile } from '../util/app-json-file';
import { TargetJsonFile } from '../util/target-json-file';
import {
  VENV_BIN_ACTIVATE,
  APP_JSON_FILE_NAME,
  ALWAYSAI_CLI_EXECUTABLE_NAME,
} from '../constants';
import { ALWAYSAI_HOME } from '../environment';

export async function appStartComponent(props: { superuser: boolean }) {
  const { superuser } = props;
  const appJsonFile = AppJsonFile();
  const appJson = appJsonFile.read();
  const script = appJson.scripts && appJson.scripts.start;
  if (!script) {
    throw new TerseError(
      `This application does not define a "start" script in its application configuration file "${APP_JSON_FILE_NAME}"`,
    );
  }
  const targetJsonFile = TargetJsonFile();
  const spawner = targetJsonFile.readContainerSpawner();
  const targetJson = targetJsonFile.readIfExists();
  if (targetJson) {
    const { targetProtocol } = targetJson;
    switch (targetProtocol) {
      case 'docker:': {
        const exitCode = await spawner.runForeground({
          exe: '/bin/bash',
          args: [
            '-o',
            'onecmd',
            '-O',
            'huponexit',
            '-c',
            `. ${VENV_BIN_ACTIVATE} && ${script}`,
          ],
          cwd: '.',
          tty: true,
          expose5000: true,
          superuser,
        });
        return exitCode || 0;
      }

      // This case differs from "docker:"" only in the extra single quotes around the command
      case 'ssh+docker:': {
        const exitCode = await spawner.runForeground({
          exe: '/bin/bash',
          args: [
            '-o',
            'onecmd',
            '-O',
            'huponexit',
            '-c',
            `'. ${VENV_BIN_ACTIVATE} && ${script}'`,
          ],
          cwd: '.',
          tty: true,
          expose5000: true,
          superuser,
        });
        return exitCode || 0;
      }

      default: {
        throw new Error(`Unexpected target protocol "${targetProtocol}"`);
      }
    }
  }

  // There is no target json file
  if (ALWAYSAI_HOME) {
    // run the app
  } else {
    throw new TerseError(
      `Target configuration file not found. Did you run "${ALWAYSAI_CLI_EXECUTABLE_NAME} app deploy"?`,
    );
  }

  return 0;
}
