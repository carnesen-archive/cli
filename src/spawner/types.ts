import { Readable } from 'stream';

export type Cmd = {
  exe: string;
  args?: string[];
  cwd?: string;
  tty?: boolean;
  expose5000?: boolean;
  input?: Readable;
  superuser?: boolean;
};

export type Translate = (cmd: Cmd) => Cmd;

export type Spawner = {
  run: (cmd: Cmd) => Promise<string>;
  runForegroundSync: (cmd: Cmd) => void;
  runStreaming: (cmd: Cmd) => Promise<Readable>;
  resolvePath: (...paths: (string | undefined)[]) => string;
  readdir: (path?: string) => Promise<string[]>;
  mkdirp: (path?: string) => Promise<void>;
  rimraf: (path?: string) => Promise<void>;
  tar: (...paths: string[]) => Promise<Readable>;
  untar: (input: Readable, cwd?: string) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
};
