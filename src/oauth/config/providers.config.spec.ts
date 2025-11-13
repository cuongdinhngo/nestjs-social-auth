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
      delete process.env.LINKEDIN_CLIENT_ID;
      delete process.env.LINKEDIN_CLIENT_SECRET;
      delete process.env.LINKEDIN_CALLBACK_URL;
      delete process.env.APPLE_CLIENT_ID;
      delete process.env.APPLE_TEAM_ID;
      delete process.env.APPLE_KEY_ID;
      delete process.env.APPLE_PRIVATE_KEY;
      delete process.env.APPLE_TEAM_ID;
      delete process.env.APPLE_KEY_ID;
      delete process.env.APPLE_PRIVATE_KEY;
      delete process.env.APPLE_CALLBACK_URL;

      const config = getProvidersConfig();
      expect(config).toEqual({});
    });

    it('should return Google config when Google env vars are set', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL =
        'http://localhost:3000/oauth/google/callback';

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
      process.env.FACEBOOK_CALLBACK_URL =
        'http://localhost:3000/oauth/facebook/callback';

      const config = getProvidersConfig();
      expect(config.facebook).toEqual({
        clientId: 'test-facebook-id',
        clientSecret: 'test-facebook-secret',
        redirect: 'http://localhost:3000/oauth/facebook/callback',
      });
    });

    it('should return LinkedIn config when LinkedIn env vars are set', () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';

      const config = getProvidersConfig();
      expect(config.linkedin).toEqual({
        clientId: 'test-linkedin-id',
        clientSecret: 'test-linkedin-secret',
        redirect: 'http://localhost:3000/oauth/linkedin/callback',
      });
    });

    it('should return Apple config when Apple env vars are set', () => {
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const config = getProvidersConfig();
      expect(config.apple).toEqual({
        clientId: 'test-apple-service-id',
        teamId: 'test-team-id',
        keyId: 'test-key-id',
        privateKey: 'test-private-key',
        redirect: 'http://localhost:3000/oauth/apple/callback',
      });
    });

    it('should return all configs when all providers are configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL =
        'http://localhost:3000/oauth/google/callback';
      process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
      process.env.FACEBOOK_CALLBACK_URL =
        'http://localhost:3000/oauth/facebook/callback';
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const config = getProvidersConfig();
      expect(config.google).toBeDefined();
      expect(config.facebook).toBeDefined();
      expect(config.linkedin).toBeDefined();
      expect(config.apple).toBeDefined();
      expect(Object.keys(config).length).toBe(4);
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
      process.env.FACEBOOK_CALLBACK_URL =
        'http://localhost:3000/oauth/facebook/callback';

      const config = getProvidersConfig();
      expect(config.facebook).toBeUndefined();
    });

    it('should not include LinkedIn if any env var is missing', () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      delete process.env.LINKEDIN_CLIENT_SECRET;
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';

      const config = getProvidersConfig();
      expect(config.linkedin).toBeUndefined();
    });

    it('should not include Apple if any env var is missing', () => {
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      delete process.env.APPLE_KEY_ID;
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const config = getProvidersConfig();
      expect(config.apple).toBeUndefined();
    });
  });

  describe('getSupportedProviders', () => {
    it('should return empty array when no providers are configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.FACEBOOK_CLIENT_ID;
      delete process.env.LINKEDIN_CLIENT_ID;

      const providers = getSupportedProviders();
      expect(providers).toEqual([]);
    });

    it('should return Google when only Google is configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
      process.env.GOOGLE_CALLBACK_URL =
        'http://localhost:3000/oauth/google/callback';
      delete process.env.FACEBOOK_CLIENT_ID;

      const providers = getSupportedProviders();
      expect(providers).toEqual(['google']);
    });

    it('should return Facebook when only Facebook is configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      process.env.FACEBOOK_CLIENT_ID = 'test-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-secret';
      process.env.FACEBOOK_CALLBACK_URL =
        'http://localhost:3000/oauth/facebook/callback';

      const providers = getSupportedProviders();
      expect(providers).toEqual(['facebook']);
    });

    it('should return LinkedIn when only LinkedIn is configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.FACEBOOK_CLIENT_ID;
      process.env.LINKEDIN_CLIENT_ID = 'test-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';

      const providers = getSupportedProviders();
      expect(providers).toEqual(['linkedin']);
    });

    it('should return Apple when only Apple is configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.FACEBOOK_CLIENT_ID;
      delete process.env.LINKEDIN_CLIENT_ID;
      process.env.APPLE_CLIENT_ID = 'test-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const providers = getSupportedProviders();
      expect(providers).toEqual(['apple']);
    });

    it('should return all providers when all are configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL =
        'http://localhost:3000/oauth/google/callback';
      process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
      process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
      process.env.FACEBOOK_CALLBACK_URL =
        'http://localhost:3000/oauth/facebook/callback';
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const providers = getSupportedProviders();
      expect(providers).toContain('google');
      expect(providers).toContain('facebook');
      expect(providers).toContain('linkedin');
      expect(providers).toContain('apple');
      expect(providers.length).toBe(4);
    });
  });

  describe('getProviderConfig', () => {
    beforeEach(() => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL =
        'http://localhost:3000/oauth/google/callback';
    });

    it('should return config for valid provider', () => {
      const config = getProviderConfig('google');
      expect(config).toEqual({
        clientId: 'test-google-id',
        clientSecret: 'test-google-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      });
    });

    it('should return config for LinkedIn provider', () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';

      const config = getProviderConfig('linkedin');
      expect(config).toEqual({
        clientId: 'test-linkedin-id',
        clientSecret: 'test-linkedin-secret',
        redirect: 'http://localhost:3000/oauth/linkedin/callback',
      });
    });

    it('should return config for Apple provider', () => {
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const config = getProviderConfig('apple');
      expect(config).toEqual({
        clientId: 'test-apple-service-id',
        teamId: 'test-team-id',
        keyId: 'test-key-id',
        privateKey: 'test-private-key',
        redirect: 'http://localhost:3000/oauth/apple/callback',
      });
    });

    it('should return undefined for invalid provider', () => {
      const config = getProviderConfig('twitter');
      expect(config).toBeUndefined();
    });

    it('should be case-insensitive', () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      const config1 = getProviderConfig('GOOGLE');
      const config2 = getProviderConfig('Google');
      const config3 = getProviderConfig('google');
      const linkedin1 = getProviderConfig('LINKEDIN');
      const linkedin2 = getProviderConfig('LinkedIn');
      const linkedin3 = getProviderConfig('linkedin');
      const apple1 = getProviderConfig('APPLE');
      const apple2 = getProviderConfig('Apple');
      const apple3 = getProviderConfig('apple');

      expect(config1).toBeDefined();
      expect(config2).toBeDefined();
      expect(config3).toBeDefined();
      expect(config1).toEqual(config2);
      expect(config2).toEqual(config3);
      expect(linkedin1).toBeDefined();
      expect(linkedin2).toBeDefined();
      expect(linkedin3).toBeDefined();
      expect(linkedin1).toEqual(linkedin2);
      expect(linkedin2).toEqual(linkedin3);
      expect(apple1).toBeDefined();
      expect(apple2).toBeDefined();
      expect(apple3).toBeDefined();
      expect(apple1).toEqual(apple2);
      expect(apple2).toEqual(apple3);
    });
  });

  describe('isProviderSupported', () => {
    beforeEach(() => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
      process.env.GOOGLE_CALLBACK_URL =
        'http://localhost:3000/oauth/google/callback';
    });

    it('should return true for supported provider', () => {
      expect(isProviderSupported('google')).toBe(true);
    });

    it('should return true for LinkedIn when configured', () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';

      expect(isProviderSupported('linkedin')).toBe(true);
    });

    it('should return true for Apple when configured', () => {
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      expect(isProviderSupported('apple')).toBe(true);
    });

    it('should return false for unsupported provider', () => {
      expect(isProviderSupported('twitter')).toBe(false);
    });

    it('should be case-insensitive', () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
      process.env.LINKEDIN_CALLBACK_URL =
        'http://localhost:3000/oauth/linkedin/callback';
      process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
      process.env.APPLE_TEAM_ID = 'test-team-id';
      process.env.APPLE_KEY_ID = 'test-key-id';
      process.env.APPLE_PRIVATE_KEY = 'test-private-key';
      process.env.APPLE_CALLBACK_URL =
        'http://localhost:3000/oauth/apple/callback';

      expect(isProviderSupported('GOOGLE')).toBe(true);
      expect(isProviderSupported('Google')).toBe(true);
      expect(isProviderSupported('google')).toBe(true);
      expect(isProviderSupported('LINKEDIN')).toBe(true);
      expect(isProviderSupported('LinkedIn')).toBe(true);
      expect(isProviderSupported('linkedin')).toBe(true);
      expect(isProviderSupported('APPLE')).toBe(true);
      expect(isProviderSupported('Apple')).toBe(true);
      expect(isProviderSupported('apple')).toBe(true);
    });

    it('should return false when provider is not configured', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      expect(isProviderSupported('google')).toBe(false);
    });
  });
});
