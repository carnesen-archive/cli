import { CliTerseError } from '@alwaysai/alwayscli';
import { AppJsonFile } from '../util/app-json-file';
import { TargetJsonFile } from '../util/target-json-file';
import {
  VENV_BIN_ACTIVATE,
  APP_JSON_FILE_NAME,
  ALWAYSAI_CLI_EXECUTABLE_NAME,
  VENV_SCRIPTS_ACTIVATE,
} from '../constants';
import { ALWAYSAI_HOME, ALWAYSAI_OS_PLATFORM } from '../environment';
import { runForeground } from '../util/spawner-base/run-foreground';
import { existsSync } from 'fs';

const BASH_INITIAL_ARGS = ['-o', 'onecmd', '-O', 'huponexit', '-c'];

export async function appStartComponent(
  props: { noSuperuser?: boolean; args?: string[] } = {},
) {
  const { noSuperuser, args = [] } = props;
  const appJsonFile = AppJsonFile();
  const appJson = appJsonFile.read();
  const startScript = appJson.scripts && appJson.scripts.start;
  if (!startScript) {
    throw new CliTerseError(
      `This application does not define a "start" script in its application configuration file "${APP_JSON_FILE_NAME}"`,
    );
  }
  const targetJsonFile = TargetJsonFile();
  const targetJson = targetJsonFile.readIfExists();
  let exitCode: number | undefined;
  const quotedArgsString = args.map(arg => `'${arg}'`).join(' ');
  if (targetJson) {
    const spawner = targetJsonFile.readContainerSpawner();
    const { targetProtocol } = targetJson;
    switch (targetProtocol) {
      case 'docker:': {
        exitCode = await spawner.runForeground({
          exe: '/bin/bash',
          args: [
            ...BASH_INITIAL_ARGS,
            `. ${VENV_BIN_ACTIVATE} && ${startScript} ${quotedArgsString}`,
          ],
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
          args: [
            ...BASH_INITIAL_ARGS,
            `'. ${VENV_BIN_ACTIVATE} && ${startScript} ${quotedArgsString}'`,
          ],
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
      throw new CliTerseError(
        `Target configuration file not found. Did you run "${ALWAYSAI_CLI_EXECUTABLE_NAME} app deploy"?`,
      );
    }
    if (ALWAYSAI_OS_PLATFORM === 'win32') {
      if (!existsSync(VENV_SCRIPTS_ACTIVATE)) {
        throw new CliTerseError(
          `File not found "${VENV_SCRIPTS_ACTIVATE}". Did you run "${ALWAYSAI_CLI_EXECUTABLE_NAME} app install"?`,
        );
      }
      exitCode = await runForeground({
        exe: 'cmd.exe',
        args: ['/c', `${VENV_SCRIPTS_ACTIVATE} && ${startScript} ${args.join(' ')}`],
      });
    } else {
      if (!existsSync(VENV_BIN_ACTIVATE)) {
        throw new CliTerseError(
          `File not found "${VENV_BIN_ACTIVATE}". Did you run "${ALWAYSAI_CLI_EXECUTABLE_NAME} app install"?`,
        );
      }
      exitCode = await runForeground({
        exe: '/bin/bash',
        args: [
          '-o',
          'onecmd',
          '-c',
          `. ${VENV_BIN_ACTIVATE} && ${startScript} ${quotedArgsString}`,
        ],
      });
    }
  }

  return exitCode || 0;
}
