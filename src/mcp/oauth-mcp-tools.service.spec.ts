import { Test, TestingModule } from '@nestjs/testing';
import { OAuthMcpToolsService } from './oauth-mcp-tools.service';
import { OAuthService } from '../oauth/oauth.service';

describe('OAuthMcpToolsService', () => {
  let service: OAuthMcpToolsService;
  let oauthService: jest.Mocked<OAuthService>;

  beforeEach(async () => {
    const mockOAuthService = {
      getSupportedProviders: jest.fn(),
      getConfiguredProviders: jest.fn(),
      isProviderSupported: jest.fn(),
      isProviderConfigured: jest.fn(),
      getProviderConfig: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthMcpToolsService,
        {
          provide: OAuthService,
          useValue: mockOAuthService,
        },
      ],
    }).compile();

    service = module.get<OAuthMcpToolsService>(OAuthMcpToolsService);
    oauthService = module.get(OAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSupportedProviders', () => {
    it('should return list of all supported providers with strategies', async () => {
      const mockProviders = ['google', 'facebook', 'linkedin', 'apple'];
      oauthService.getSupportedProviders.mockReturnValue(mockProviders);

      const result = await service.getSupportedProviders();

      expect(result).toEqual({
        providers: mockProviders,
        note: 'These providers have built-in strategies. Configure via environment variables to enable.',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.getSupportedProviders).toHaveBeenCalled();
    });

    it('should always return all providers (strategy-based)', async () => {
      // Even with no configured providers, should return all strategies
      const mockProviders = ['google', 'facebook', 'linkedin', 'apple'];
      oauthService.getSupportedProviders.mockReturnValue(mockProviders);

      const result = await service.getSupportedProviders();

      expect(result.providers.length).toBe(4);
      expect(result.note).toBeDefined();
    });
  });

  describe('checkProviderSupport', () => {
    it('should return true with message for supported provider', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);
      oauthService.getSupportedProviders.mockReturnValue([
        'google',
        'facebook',
        'linkedin',
        'apple',
      ]);

      const result = await service.checkProviderSupport({ provider: 'google' });

      expect(result).toEqual({
        supported: true,
        provider: 'google',
        message:
          "Provider 'google' is supported by this library. Configure environment variables to enable.",
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.isProviderSupported).toHaveBeenCalledWith('google');
    });

    it('should return false with helpful message for unsupported provider', async () => {
      oauthService.isProviderSupported.mockReturnValue(false);
      oauthService.getSupportedProviders.mockReturnValue([
        'google',
        'facebook',
        'linkedin',
        'apple',
      ]);

      const result = await service.checkProviderSupport({
        provider: 'twitter',
      });

      expect(result).toEqual({
        supported: false,
        provider: 'twitter',
        message:
          "Provider 'twitter' is not supported by this library. Supported providers: google, facebook, linkedin, apple",
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.isProviderSupported).toHaveBeenCalledWith('twitter');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.getSupportedProviders).toHaveBeenCalled();
    });
  });

  describe('getProviderConfigKeys', () => {
    it('should return required env vars for Google', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);
      oauthService.getSupportedProviders.mockReturnValue([
        'google',
        'facebook',
        'linkedin',
        'apple',
      ]);

      const result = await service.getProviderConfigKeys({
        provider: 'google',
      });

      expect(result).toEqual({
        provider: 'google',
        supported: true,
        requiredEnvVars: [
          'GOOGLE_CLIENT_ID',
          'GOOGLE_CLIENT_SECRET',
          'GOOGLE_CALLBACK_URL',
        ],
        example: {
          GOOGLE_CLIENT_ID: 'your-google-client-id',
          GOOGLE_CLIENT_SECRET: 'your-google-client-secret',
          GOOGLE_CALLBACK_URL: 'http://localhost:3000/oauth/google/callback',
        },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.isProviderSupported).toHaveBeenCalledWith('google');
    });

    it('should return required env vars for Facebook', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);
      oauthService.getSupportedProviders.mockReturnValue([
        'google',
        'facebook',
        'linkedin',
        'apple',
      ]);

      const result = await service.getProviderConfigKeys({
        provider: 'facebook',
      });

      expect(result).toEqual({
        provider: 'facebook',
        supported: true,
        requiredEnvVars: [
          'FACEBOOK_CLIENT_ID',
          'FACEBOOK_CLIENT_SECRET',
          'FACEBOOK_CALLBACK_URL',
        ],
        example: {
          FACEBOOK_CLIENT_ID: 'your-facebook-client-id',
          FACEBOOK_CLIENT_SECRET: 'your-facebook-client-secret',
          FACEBOOK_CALLBACK_URL:
            'http://localhost:3000/oauth/facebook/callback',
        },
      });
    });

    it('should return required env vars for Apple (different structure)', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);
      oauthService.getSupportedProviders.mockReturnValue([
        'google',
        'facebook',
        'linkedin',
        'apple',
      ]);

      const result = await service.getProviderConfigKeys({ provider: 'apple' });

      expect(result).toEqual({
        provider: 'apple',
        supported: true,
        requiredEnvVars: [
          'APPLE_CLIENT_ID',
          'APPLE_TEAM_ID',
          'APPLE_KEY_ID',
          'APPLE_PRIVATE_KEY',
          'APPLE_CALLBACK_URL',
        ],
        example: {
          APPLE_CLIENT_ID: 'your-apple-service-id',
          APPLE_TEAM_ID: 'your-apple-team-id',
          APPLE_KEY_ID: 'your-apple-key-id',
          APPLE_PRIVATE_KEY: 'your-apple-private-key-content',
          APPLE_CALLBACK_URL: 'http://localhost:3000/oauth/apple/callback',
        },
      });
    });

    it('should return error for unsupported provider', async () => {
      oauthService.isProviderSupported.mockReturnValue(false);
      oauthService.getSupportedProviders.mockReturnValue([
        'google',
        'facebook',
        'linkedin',
        'apple',
      ]);

      const result = await service.getProviderConfigKeys({
        provider: 'twitter',
      });

      expect(result).toEqual({
        provider: 'twitter',
        supported: false,
        message:
          "Provider 'twitter' is not supported. Supported providers: google, facebook, linkedin, apple",
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.getSupportedProviders).toHaveBeenCalled();
    });
  });
});
