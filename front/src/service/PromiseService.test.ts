global.fetch = jest.fn(() =>
    Promise.resolve({
        json: jest.fn(),
    }),
) as jest.Mock;

const BASE_URL = 'baseurl';

describe('fetchJson', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules() // Most important - it clears the cache
      process.env = { ...OLD_ENV, ENV_API_URL: BASE_URL }; // Make a copy
    });
  
    afterAll(() => {
      process.env = OLD_ENV; // Restore old environment
    });

    it('should use the right url', async () => {
        // Given
        const {fetchJson} = require('./PromiseService')
        const apiPath = "api/test";

        // When
        const teams = await fetchJson(apiPath);

        // Then
        expect(global.fetch).toHaveBeenCalledWith(BASE_URL+apiPath);
    })
})
