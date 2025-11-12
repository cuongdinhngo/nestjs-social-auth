import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from './oauth.service';
import * as providersConfig from './config/providers.config';

// Mock the providers config module
jest.mock('./config/providers.config', () => ({
  getSupportedProviders: jest.fn(),
  isProviderSupported: jest.fn(),
  getProviderConfig: jest.fn(),
}));

describe('OAuthService', () => {
  let service: OAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OAuthService],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSupportedProviders', () => {
    it('should return supported providers from config', () => {
      const mockProviders = ['google', 'facebook'];
      (providersConfig.getSupportedProviders as jest.Mock).mockReturnValue(
        mockProviders,
      );

      const result = service.getSupportedProviders();
      expect(result).toEqual(mockProviders);
      expect(providersConfig.getSupportedProviders).toHaveBeenCalled();
    });
  });

  describe('isProviderSupported', () => {
    it('should return true for supported provider', () => {
      (providersConfig.isProviderSupported as jest.Mock).mockReturnValue(true);

      const result = service.isProviderSupported('google');
      expect(result).toBe(true);
      expect(providersConfig.isProviderSupported).toHaveBeenCalledWith(
        'google',
      );
    });

    it('should return false for unsupported provider', () => {
      (providersConfig.isProviderSupported as jest.Mock).mockReturnValue(false);

      const result = service.isProviderSupported('linkedin');
      expect(result).toBe(false);
      expect(providersConfig.isProviderSupported).toHaveBeenCalledWith(
        'linkedin',
      );
    });
  });

  describe('getProviderConfig', () => {
    it('should return provider config', () => {
      const mockConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      };
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        mockConfig,
      );

      const result = service.getProviderConfig('google');
      expect(result).toEqual(mockConfig);
      expect(providersConfig.getProviderConfig).toHaveBeenCalledWith('google');
    });

    it('should return undefined for invalid provider', () => {
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        undefined,
      );

      const result = service.getProviderConfig('linkedin');
      expect(result).toBeUndefined();
      expect(providersConfig.getProviderConfig).toHaveBeenCalledWith(
        'linkedin',
      );
    });
  });
});
