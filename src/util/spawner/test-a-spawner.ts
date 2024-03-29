import { posix } from 'path';

import { Spawner } from './types';
import { RandomString } from '../random-string';

type SpawnerFactory<T extends any[]> = (...args: T) => Spawner;

const { join } = posix;

export function testASpawner<T extends any[]>(factory: SpawnerFactory<T>, ...args: T) {
  const spawner = factory(...args);
  const {
    resolvePath,
    mkdirp,
    rimraf,
    run,
    readdir,
    runForegroundSync,
    runForeground,
    tar,
    exists,
    untar,
    readFile,
    writeFile,
  } = spawner;

  describe(factory.name, () => {
    describe(resolvePath.name, () => {
      it('returns the context path of the spawner if no args are passed', () => {
        const contextPath = resolvePath();
        expect(typeof contextPath).toBe('string');
      });

      it('resolves a context-path-relative path', () => {
        const contextPath = resolvePath();
        const path = resolvePath('foo');
        expect(path).toBe(join(contextPath, 'foo'));
      });

      it('resolves absolute paths to themselves', () => {
        const path = resolvePath('/foo');
        expect(path).toBe('/foo');
      });

      it('acts like path.resolve (i.e. `cd x && cd y && cd z`) for multiple paths', () => {
        const path = resolvePath('foo', '/bar', 'baz');
        expect(path).toBe('/bar/baz');
      });
    });

    describe(mkdirp.name, () => {
      it('makes the context path directory if no args are provided', async () => {
        await spawner.mkdirp();
        expect(await spawner.exists(resolvePath())).toBe(true);
      });

      it('makes a context-path-relative directory if one is provided', async () => {
        const tmpId = RandomString();
        await spawner.mkdirp(tmpId);
        expect(await spawner.exists(join(resolvePath(), tmpId))).toBe(true);
      });
    });

    describe(rimraf.name, () => {
      it('removes an context-relative directory if one is provided', async () => {
        const tmpId = RandomString();
        await spawner.mkdirp(tmpId);
        expect(await spawner.exists(join(resolvePath(), tmpId))).toBe(true);
        await spawner.rimraf(tmpId);
        expect(await spawner.exists(join(resolvePath(), tmpId))).toBe(false);
      });
    });

    describe(readdir.name, () => {
      it('reads files and dot file names in a context-path-relative path if one is provided', async () => {
        await mkdirp('foo');
        await run({ exe: 'touch', args: ['foo/a'], cwd: '.' });
        expect(await readdir('foo')).toEqual(['a']);
      });

      it('reads files and dot file names in an absolute path if one is provided', async () => {
        expect((await readdir('/')).length > 0).toBe(true);
      });
    });

    describe(runForegroundSync.name, () => {
      it('runs a command synchronously with inherited I/O', async () => {
        const tmpDir = await run({ exe: 'mktemp', args: ['-d'] });
        runForegroundSync({ exe: 'ls', cwd: tmpDir });
      });
    });

    describe(runForeground.name, () => {
      it('runs a command synchronously with inherited I/O', async () => {
        const tmpDir = await run({ exe: 'mktemp', args: ['-d'] });
        await runForeground({ exe: 'ls', cwd: tmpDir });
      });
    });

    describe(`${tar.name} and ${untar.name}`, () => {
      it('does tarring and untarring', async () => {
        const tmpDir0 = RandomString();
        const tmpDir1 = RandomString();
        await mkdirp(tmpDir0);
        await mkdirp(tmpDir1);
        await run({ exe: 'touch', args: ['foo'], cwd: tmpDir0 });
        const stream = await tar(tmpDir0);
        await untar(stream, tmpDir1);
        const fileNames = await readdir(tmpDir1);
        expect(fileNames).toEqual([tmpDir0]);
      });
    });

    describe(`${readFile.name} and ${writeFile.name}`, () => {
      it('reads and writes', async () => {
        const path = RandomString();
        const data = RandomString();
        await writeFile(path, data);
        expect(await exists(path)).toBe(true);
        expect(await readFile(path)).toBe(data);
      });
    });
  });
}
