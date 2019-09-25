import { TerseError } from '@alwaysai/alwayscli';
import { AppJsonFile } from '../util/app-json-file';
import { TargetJsonFile } from '../util/target-json-file';
import {
  VENV_BIN_ACTIVATE,
  APP_JSON_FILE_NAME,
  ALWAYSAI_CLI_EXECUTABLE_NAME,
  VENV_SCRIPTS_ACTIVATE,
} from '../constants';
import { ALWAYSAI_HOME } from '../environment';
import { runForeground } from '../util/spawner-base/run-foreground';
import { platform } from 'os';

const BASH_INITIAL_ARGS = ['-o', 'onecmd', '-O', 'huponexit', '-c'];

export async function appStartComponent(props: { noSuperuser?: boolean } = {}) {
  const { noSuperuser } = props;
  const appJsonFile = AppJsonFile();
  const appJson = appJsonFile.read();
  const startScript = appJson.scripts && appJson.scripts.start;
  if (!startScript) {
    throw new TerseError(
      `This application does not define a "start" script in its application configuration file "${APP_JSON_FILE_NAME}"`,
    );
  }
  const targetJsonFile = TargetJsonFile();
  const targetJson = targetJsonFile.readIfExists();
  let exitCode: number | undefined;
  if (targetJson) {
    const spawner = targetJsonFile.readContainerSpawner();
    const { targetProtocol } = targetJson;
    switch (targetProtocol) {
      case 'docker:': {
        exitCode = await spawner.runForeground({
          exe: '/bin/bash',
          args: [...BASH_INITIAL_ARGS, `. ${VENV_BIN_ACTIVATE} && ${startScript}`],
          cwd: '.',
          tty: true,
          expose5000: true,
          superuser: !noSuperuser,
        });
        break;
      }

      // This case differs from "docker:"" only in the extra single quotes around the command
      case 'ssh+docker:': {
        exitCode = await spawner.runForeground({
          exe: '/bin/bash',
          args: [...BASH_INITIAL_ARGS, `'. ${VENV_BIN_ACTIVATE} && ${startScript}'`],
          cwd: '.',
          tty: true,
          expose5000: true,
          superuser: !noSuperuser,
        });
        break;
      }

      default: {
        throw new Error(`Unexpected target protocol "${targetProtocol}"`);
      }
    }
  } else {
    // There is no target json file
    if (!ALWAYSAI_HOME) {
      throw new TerseError(
        `Target configuration file not found. Did you run "${ALWAYSAI_CLI_EXECUTABLE_NAME} app deploy"?`,
      );
    }
    if (platform() === 'win32') {
      exitCode = await runForeground({
        exe: 'cmd.exe',
        args: ['/c', `${VENV_SCRIPTS_ACTIVATE} && ${startScript}`],
      });
    } else {
      exitCode = await runForeground({
        exe: '/bin/bash',
        args: ['-o', 'onecmd', '-c', `. ${VENV_BIN_ACTIVATE} && ${startScript}`],
      });
    }
  }

  return exitCode || 0;
}
