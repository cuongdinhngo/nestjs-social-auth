import { FacebookStrategy } from './facebook.strategy';
import * as providersConfig from '../config/providers.config';

// Mock the providers config module
jest.mock('../config/providers.config', () => ({
  getProviderConfig: jest.fn(),
}));

// Mock PassportStrategy
jest.mock('@nestjs/passport', () => {
  return {
    PassportStrategy: jest.fn((Strategy, name) => {
      return class MockPassportStrategy {
        constructor(options: any) {}
        validate(...args: any[]) {}
      };
    }),
  };
});

describe('FacebookStrategy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should throw error when config is missing', () => {
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(undefined);

      expect(() => new FacebookStrategy()).toThrow(
        'Facebook OAuth configuration is missing',
      );
    });

    it('should initialize successfully with valid config', () => {
      const mockConfig = {
        clientId: 'test-facebook-id',
        clientSecret: 'test-facebook-secret',
        redirect: 'http://localhost:3000/oauth/facebook/callback',
      };
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        mockConfig,
      );

      expect(() => new FacebookStrategy()).not.toThrow();
    });
  });

  describe('validate', () => {
    let strategy: FacebookStrategy;
    let mockDone: jest.Mock;

    beforeEach(() => {
      const mockConfig = {
        clientId: 'test-facebook-id',
        clientSecret: 'test-facebook-secret',
        redirect: 'http://localhost:3000/oauth/facebook/callback',
      };
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        mockConfig,
      );

      strategy = new FacebookStrategy();
      mockDone = jest.fn();
    });

    it('should format user data correctly', async () => {
      const mockProfile = {
        id: '123456789',
        name: {
          givenName: 'Jane',
          familyName: 'Smith',
        },
        emails: [{ value: 'jane.smith@example.com' }],
        photos: [{ value: 'https://example.com/photo.jpg' }],
      };

      await strategy.validate('access-token', 'refresh-token', mockProfile, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, {
        profile: {
          id: '123456789',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          picture: 'https://example.com/photo.jpg',
          provider: 'facebook',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should handle missing optional fields', async () => {
      const mockProfile = {
        id: '123456789',
        name: {
          givenName: 'Jane',
          familyName: 'Smith',
        },
        emails: undefined,
        photos: undefined,
      };

      await strategy.validate('access-token', null, mockProfile, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, expect.objectContaining({
        profile: expect.objectContaining({
          email: undefined,
          picture: undefined,
        }),
        refreshToken: null,
      }));
    });
  });
});
