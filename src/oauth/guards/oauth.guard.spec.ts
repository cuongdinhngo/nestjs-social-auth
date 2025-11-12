import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { OAuthGuard } from './oauth.guard';
import * as providersConfig from '../config/providers.config';

// Mock the providers config module
jest.mock('../config/providers.config', () => ({
  getProviderConfig: jest.fn(),
}));

// Mock AuthGuard
jest.mock('@nestjs/passport', () => {
  return {
    AuthGuard: jest.fn((strategy: string) => {
      return class MockAuthGuard {
        async canActivate(context: ExecutionContext): Promise<boolean> {
          return true;
        }
      };
    }),
  };
});

describe('OAuthGuard', () => {
  let guard: OAuthGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new OAuthGuard();
    jest.clearAllMocks();

    // Create mock execution context
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          params: {},
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should throw BadRequestException when provider is not specified', async () => {
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        BadRequestException,
      );
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        'Provider not specified',
      );
    });

    it('should throw BadRequestException for unsupported provider', async () => {
      mockExecutionContext.switchToHttp().getRequest().params.provider = 'linkedin';
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue(undefined);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        BadRequestException,
      );
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        'Provider linkedin is not supported',
      );
    });

    it('should return true for supported provider', async () => {
      mockExecutionContext.switchToHttp().getRequest().params.provider = 'google';
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      });

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
      expect(providersConfig.getProviderConfig).toHaveBeenCalledWith('google');
    });

    it('should handle lowercase provider names', async () => {
      mockExecutionContext.switchToHttp().getRequest().params.provider = 'GOOGLE';
      (providersConfig.getProviderConfig as jest.Mock).mockReturnValue({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        redirect: 'http://localhost:3000/oauth/google/callback',
      });

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
      expect(providersConfig.getProviderConfig).toHaveBeenCalledWith('google');
    });
  });
});
