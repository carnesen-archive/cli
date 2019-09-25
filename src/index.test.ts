import * as mainModule from './index';

describe('index file', () => {
  it('does not export anything', async () => {
    expect(mainModule).toEqual({});
  });
});
