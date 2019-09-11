import { resolve, join, posix } from 'path';
import { homedir } from 'os';

export const CLI_NAME = 'alwaysai';
export const PACKAGE_DIR = resolve(__dirname, '..');
export const DOT_ALWAYSAI_DIR = join(homedir(), '.alwaysai');
export const MODEL_PACKAGE_CACHE_DIR = join(DOT_ALWAYSAI_DIR, 'model-package-cache');
export const LOCAL_MODEL_VERSION_PACKAGE_NUMBER = 0;
export const APP_PY_FILE_NAME = 'app.py';
export const TARGET_JSON_FILE_NAME = 'alwaysai.target.json';

export const DOCKERFILE = 'Dockerfile';
export const DOCKER_HUB_EDGEIQ_REPOSITORY_NAME = 'alwaysai/edgeiq';
export const DOCKER_FALLBACK_TAG_NAME = 'latest';
export const DOCKER_IMAGE_ID_INITIAL_VALUE = `${DOCKER_HUB_EDGEIQ_REPOSITORY_NAME}:${DOCKER_FALLBACK_TAG_NAME}`;
export const DOCKER_TEST_IMAGE_ID = 'busybox';

export const VENV = 'venv';
export const VENV_BIN_ACTIVATE = posix.join(VENV, 'bin', 'activate');
export const APP_JSON_FILE_NAME = 'alwaysai.app.json';

export const DOT_SSH_DIR = join(homedir(), '.ssh');
export const PRIVATE_KEY_FILE_NAME = 'alwaysai.id_rsa';
export const PRIVATE_KEY_FILE_PATH = join(DOT_SSH_DIR, PRIVATE_KEY_FILE_NAME);
export const PRIVATE_KEY_FILE_PRETTY_PATH = `~/.ssh/${PRIVATE_KEY_FILE_NAME}`;
export const PUBLIC_KEY_FILE_PATH = `${PRIVATE_KEY_FILE_PATH}.pub`;
export const PUBLIC_KEY_FILE_PRETTY_PATH = `${PRIVATE_KEY_FILE_PRETTY_PATH}.pub`;

// From https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export const VALID_EMAIL_REGULAR_EXPRESSION = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const THIS_SHOULD_NEVER_HAPPEN_MESSAGE =
  'An unexpected condition has been encountered. Please report this error message to support@alwaysai.co';
