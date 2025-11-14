import { Test, TestingModule } from '@nestjs/testing';
import { OAuthMcpToolsService } from './oauth-mcp-tools.service';
import { OAuthService } from '../oauth/oauth.service';

describe('OAuthMcpToolsService', () => {
  let service: OAuthMcpToolsService;
  let oauthService: jest.Mocked<OAuthService>;

  beforeEach(async () => {
    const mockOAuthService = {
      getSupportedProviders: jest.fn(),
      isProviderSupported: jest.fn(),
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
    it('should return list of supported providers', async () => {
      const mockProviders = ['google', 'facebook', 'linkedin'];
      oauthService.getSupportedProviders.mockReturnValue(mockProviders);

      const result = await service.getSupportedProviders();

      expect(result).toEqual({ providers: mockProviders });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.getSupportedProviders).toHaveBeenCalled();
    });

    it('should return empty array when no providers are configured', async () => {
      oauthService.getSupportedProviders.mockReturnValue([]);

      const result = await service.getSupportedProviders();

      expect(result).toEqual({ providers: [] });
    });
  });

  describe('checkProviderSupport', () => {
    it('should return true for supported provider', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);

      const result = await service.checkProviderSupport({ provider: 'google' });

      expect(result).toEqual({ supported: true, provider: 'google' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.isProviderSupported).toHaveBeenCalledWith('google');
    });

    it('should return false for unsupported provider', async () => {
      oauthService.isProviderSupported.mockReturnValue(false);

      const result = await service.checkProviderSupport({
        provider: 'twitter',
      });

      expect(result).toEqual({ supported: false, provider: 'twitter' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.isProviderSupported).toHaveBeenCalledWith('twitter');
    });
  });

  describe('getProviderConfig', () => {
    it('should return config for configured provider', async () => {
      const mockConfig = {
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      };
      oauthService.getProviderConfig.mockReturnValue(mockConfig);

      const result = await service.getProviderConfig({ provider: 'google' });

      expect(result).toEqual({
        provider: 'google',
        configured: true,
        hasClientId: true,
        hasClientSecret: true,
        callbackUrl: 'http://localhost:3000/oauth/google/callback',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.getProviderConfig).toHaveBeenCalledWith('google');
    });

    it('should return unconfigured status when config is missing', async () => {
      oauthService.getProviderConfig.mockReturnValue(null);

      const result = await service.getProviderConfig({ provider: 'twitter' });

      expect(result).toEqual({
        provider: 'twitter',
        configured: false,
        hasClientId: false,
        hasClientSecret: false,
      });
    });

    it('should handle Apple provider config (no clientSecret)', async () => {
      const mockAppleConfig = {
        clientId: 'test-service-id',
        teamId: 'test-team-id',
        keyId: 'test-key-id',
        privateKey: 'test-private-key',
        redirect: 'http://localhost:3000/oauth/apple/callback',
      };
      oauthService.getProviderConfig.mockReturnValue(mockAppleConfig);

      const result = await service.getProviderConfig({ provider: 'apple' });

      expect(result).toEqual({
        provider: 'apple',
        configured: true,
        hasClientId: true,
        hasClientSecret: false, // Apple doesn't have clientSecret
        callbackUrl: 'http://localhost:3000/oauth/apple/callback',
      });
    });
  });

  describe('getOAuthEndpoints', () => {
    it('should return endpoints for supported provider with default baseUrl', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);

      const result = await service.getOAuthEndpoints({ provider: 'google' });

      expect(result).toEqual({
        provider: 'google',
        authUrl: 'http://localhost:3000/oauth/google',
        callbackUrl: 'http://localhost:3000/oauth/google/callback',
        supported: true,
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(oauthService.isProviderSupported).toHaveBeenCalledWith('google');
    });

    it('should return endpoints with custom baseUrl', async () => {
      oauthService.isProviderSupported.mockReturnValue(true);

      const result = await service.getOAuthEndpoints({
        provider: 'facebook',
        baseUrl: 'https://example.com',
      });

      expect(result).toEqual({
        provider: 'facebook',
        authUrl: 'https://example.com/oauth/facebook',
        callbackUrl: 'https://example.com/oauth/facebook/callback',
        supported: true,
      });
    });

    it('should return empty endpoints for unsupported provider', async () => {
      oauthService.isProviderSupported.mockReturnValue(false);

      const result = await service.getOAuthEndpoints({ provider: 'twitter' });

      expect(result).toEqual({
        provider: 'twitter',
        authUrl: '',
        callbackUrl: '',
        supported: false,
      });
    });
  });
});
