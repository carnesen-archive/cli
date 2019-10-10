import * as mainModule from './exports';

describe('exports file', () => {
  it('Exports an "aai" argv interface', async () => {
    expect(Object.keys(mainModule)).toEqual(['aai']);
  });
});
