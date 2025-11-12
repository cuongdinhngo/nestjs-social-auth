import {
  getProvidersConfig,
  getSupportedProviders,
  getProviderConfig,
  isProviderSupported,
} from './providers.config';

describe('ProvidersConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getProvidersConfig', () => {
    it('should return empty config when no env vars are set', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;
      delete process.env.GOOGLE_CALLBACK_URL;
      delete process.env.FACEBOOK_CLIENT_ID;
      delete process.env.FACEBOOK_CLIENT_SECRET;
      delete process.env.FACEBOOK_CALLBACK_URL;

      const config = getProvidersConfig();
      expect(config).toEqual({});
    });

    it('should return Google config when Google env vars are set', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';

      const config = getProvidersConfig();
      expect(config.google).toEqual({
        clientId: 'test-google-id',
        clientSecret: 'test-google-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      });
    });

    it('should return Facebook config when Facebook env vars are set', () => {
      process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
      process.env.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/oauth/facebook/callback';

      const config = getProvidersConfig();
      expect(config.facebook).toEqual({
        clientId: 'test-facebook-id',
        clientSecret: 'test-facebook-secret',
        redirect: 'http://localhost:3000/oauth/facebook/callback',
      });
    });

    it('should return both configs when both providers are configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';
      process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
      process.env.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/oauth/facebook/callback';

      const config = getProvidersConfig();
      expect(config.google).toBeDefined();
      expect(config.facebook).toBeDefined();
      expect(Object.keys(config).length).toBe(2);
    });

    it('should not include Google if any env var is missing', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      delete process.env.GOOGLE_CALLBACK_URL;

      const config = getProvidersConfig();
      expect(config.google).toBeUndefined();
    });

    it('should not include Facebook if any env var is missing', () => {
      process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
      delete process.env.FACEBOOK_CLIENT_SECRET;
      process.env.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/oauth/facebook/callback';

      const config = getProvidersConfig();
      expect(config.facebook).toBeUndefined();
    });
  });

  describe('getSupportedProviders', () => {
    it('should return empty array when no providers are configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.FACEBOOK_CLIENT_ID;

      const providers = getSupportedProviders();
      expect(providers).toEqual([]);
    });

    it('should return Google when only Google is configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';
      delete process.env.FACEBOOK_CLIENT_ID;

      const providers = getSupportedProviders();
      expect(providers).toEqual(['google']);
    });

    it('should return Facebook when only Facebook is configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      process.env.FACEBOOK_CLIENT_ID = 'test-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-secret';
      process.env.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/oauth/facebook/callback';

      const providers = getSupportedProviders();
      expect(providers).toEqual(['facebook']);
    });

    it('should return both providers when both are configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';
      process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
      process.env.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/oauth/facebook/callback';

      const providers = getSupportedProviders();
      expect(providers).toContain('google');
      expect(providers).toContain('facebook');
      expect(providers.length).toBe(2);
    });
  });

  describe('getProviderConfig', () => {
    beforeEach(() => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';
    });

    it('should return config for valid provider', () => {
      const config = getProviderConfig('google');
      expect(config).toEqual({
        clientId: 'test-google-id',
        clientSecret: 'test-google-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      });
    });

    it('should return undefined for invalid provider', () => {
      const config = getProviderConfig('linkedin');
      expect(config).toBeUndefined();
    });

    it('should be case-insensitive', () => {
      const config1 = getProviderConfig('GOOGLE');
      const config2 = getProviderConfig('Google');
      const config3 = getProviderConfig('google');

      expect(config1).toBeDefined();
      expect(config2).toBeDefined();
      expect(config3).toBeDefined();
      expect(config1).toEqual(config2);
      expect(config2).toEqual(config3);
    });
  });

  describe('isProviderSupported', () => {
    beforeEach(() => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';
    });

    it('should return true for supported provider', () => {
      expect(isProviderSupported('google')).toBe(true);
    });

    it('should return false for unsupported provider', () => {
      expect(isProviderSupported('linkedin')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isProviderSupported('GOOGLE')).toBe(true);
      expect(isProviderSupported('Google')).toBe(true);
      expect(isProviderSupported('google')).toBe(true);
    });

    it('should return false when provider is not configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      expect(isProviderSupported('google')).toBe(false);
    });
  });
});
