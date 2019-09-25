export type Cmd = {
  exe: string;
  args?: string[];
  cwd?: string;
  tty?: boolean;
  expose5000?: boolean;
  input?: NodeJS.ReadableStream;
  superuser?: boolean;
};

export type Translate = (cmd: Cmd) => Cmd;

export type Spawner = {
  run: (cmd: Cmd) => Promise<string>;
  runForegroundSync: (cmd: Cmd) => void;
  runForeground: (cmd: Cmd) => Promise<number | undefined>;
  runStreaming: (cmd: Cmd) => Promise<NodeJS.ReadableStream>;
  resolvePath: (...paths: (string | undefined)[]) => string;
  readdir: (path?: string) => Promise<string[]>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, data: string) => Promise<void>;
  mkdirp: (path?: string) => Promise<void>;
  rename: (oldPath: string, newPath: string) => Promise<void>;
  rimraf: (path?: string) => Promise<void>;
  tar: (...paths: string[]) => Promise<NodeJS.ReadableStream>;
  untar: (input: NodeJS.ReadableStream, cwd?: string) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
};
