import { AppleStrategy } from './apple.strategy';
import * as providersConfig from '../config/providers.config';

// Mock the providers config module
jest.mock('../config/providers.config', () => ({
  getProviderConfig: jest.fn(),
}));

// Mock PassportStrategy
jest.mock('@nestjs/passport', () => {
  return {
    PassportStrategy: jest.fn((_Strategy, _name) => {
      return class MockPassportStrategy {
        constructor(_options: unknown) { }
        validate(..._args: unknown[]) { }
      };
    }),
  };
});

describe('AppleStrategy', () => {
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
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        undefined,
      );

      expect(() => new AppleStrategy()).toThrow(
        'Apple OAuth configuration is missing',
      );
    });

    it('should initialize successfully with valid config', () => {
      const mockConfig = {
        clientId: 'test-apple-service-id',
        teamId: 'test-team-id',
        keyId: 'test-key-id',
        privateKey: 'test-private-key',
        redirect: 'http://localhost:3000/oauth/apple/callback',
      };
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        mockConfig,
      );

      expect(() => new AppleStrategy()).not.toThrow();
    });
  });

  describe('validate', () => {
    let strategy: AppleStrategy;
    let mockDone: jest.Mock;

    beforeEach(() => {
      const mockConfig = {
        clientId: 'test-apple-service-id',
        teamId: 'test-team-id',
        keyId: 'test-key-id',
        privateKey: 'test-private-key',
        redirect: 'http://localhost:3000/oauth/apple/callback',
      };
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(
        mockConfig,
      );

      strategy = new AppleStrategy();
      mockDone = jest.fn();
    });

    it('should format user data correctly', () => {
      const mockProfile = {
        id: '001234.567890abcdef.1234',
        email: 'user@example.com',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      strategy.validate(
        'access-token',
        'refresh-token',
        'id-token',
        mockProfile,
        mockDone,
      );

      expect(mockDone).toHaveBeenCalledWith(null, {
        profile: {
          id: '001234.567890abcdef.1234',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          picture: null,
          provider: 'apple',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should handle missing optional fields', () => {
      const mockProfile = {
        id: '001234.567890abcdef.1234',
      };

      strategy.validate(
        'access-token',
        null,
        'id-token',
        mockProfile,
        mockDone,
      );

      expect(mockDone).toHaveBeenCalledWith(null, {
        profile: {
          id: '001234.567890abcdef.1234',
          email: undefined,
          firstName: undefined,
          lastName: undefined,
          picture: null,
          provider: 'apple',
        },
        accessToken: 'access-token',
        refreshToken: null,
      });
    });

    it('should handle missing refresh token', () => {
      const mockProfile = {
        id: '001234.567890abcdef.1234',
        email: 'user@example.com',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      strategy.validate(
        'access-token',
        null,
        'id-token',
        mockProfile,
        mockDone,
      );

      expect(mockDone).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          refreshToken: null,
        }),
      );
    });

    it('should handle missing id', () => {
      const mockProfile = {
        email: 'user@example.com',
      };

      strategy.validate(
        'access-token',
        'refresh-token',
        'id-token',
        mockProfile,
        mockDone,
      );

      expect(mockDone).toHaveBeenCalledWith(null, {
        profile: {
          id: '',
          email: 'user@example.com',
          firstName: undefined,
          lastName: undefined,
          picture: null,
          provider: 'apple',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
