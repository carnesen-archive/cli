import { join } from 'path';

import * as t from 'io-ts';
import { ConfigFile } from '@alwaysai/config-nodejs';
import { APP_DOT_PY } from '../constants';
import chalk from 'chalk';

export const APP_CONFIG_FILE_NAME = 'alwaysai.app.json';

const codec = t.partial({
  models: t.record(t.string, t.any, 'models'),
  scripts: t.record(t.string, t.string, 'scripts'),
});

export type AppConfig = t.TypeOf<typeof codec>;

const ENOENT = {
  message: `${APP_CONFIG_FILE_NAME} not found. Did you run "alwaysai app configure"?`,
  code: 'TERSE',
};

export function AppConfigFile(dir = process.cwd()) {
  const configFile = ConfigFile({
    path: join(dir, APP_CONFIG_FILE_NAME),
    codec,
    ENOENT,
    initialValue: {
      models: {},
      scripts: {
        start: `python ${APP_DOT_PY}`,
      },
    },
  });

  return {
    ...configFile,
    addModel(id: string, version: number) {
      return configFile.update(config => {
        config.models = config.models || {};
        config.models[id] = version;
      });
    },
    removeModel(id: string) {
      return configFile.update(config => {
        if (config.models) {
          delete config.models[id];
        }
      });
    },
    describeModels() {
      const config = configFile.readIfExists();
      const MODELS_COLON = 'Models:';
      if (!config) {
        return `${MODELS_COLON} "${APP_CONFIG_FILE_NAME}" not found`;
      }
      let description = `${MODELS_COLON} ${chalk.bold('None')}`;
      if (config.models) {
        const entries = Object.entries(config.models);
        if (entries.length > 0) {
          description = `${MODELS_COLON}\n${entries
            .map(([modelId, modelVersion]) => `  ${modelId}@${modelVersion}`)
            .join('\n')}`;
        }
      }
      return description;
    },

    describeScripts() {
      const config = configFile.readIfExists();
      const SCRIPTS_COLON = 'Scripts:';
      if (!config) {
        return `${SCRIPTS_COLON} "${APP_CONFIG_FILE_NAME}" not found`;
      }
      let description = `${SCRIPTS_COLON} ${chalk.bold('None')}`;
      if (config.scripts) {
        const entries = Object.entries(config.scripts);
        if (entries.length > 0) {
          description = `${SCRIPTS_COLON}\n${entries
            .map(([scriptName, scriptValue]) => `  ${scriptName} => "${scriptValue}"`)
            .join('\n')}`;
        }
      }
      return description;
    },
  };
}

export const appConfigFile = AppConfigFile();
