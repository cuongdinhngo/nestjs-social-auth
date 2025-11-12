import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

describe('OAuthController', () => {
  let controller: OAuthController;

  const mockOAuthService = {
    isProviderSupported: jest.fn(),
    getSupportedProviders: jest.fn(),
    getProviderConfig: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuthController],
      providers: [
        {
          provide: OAuthService,
          useValue: mockOAuthService,
        },
      ],
    }).compile();

    controller = module.get<OAuthController>(OAuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('oauth', () => {
    it('should throw BadRequestException for unsupported provider', () => {
      mockOAuthService.isProviderSupported.mockReturnValue(false);

      expect(() => controller.oauth('linkedin')).toThrow(BadRequestException);
      expect(mockOAuthService.isProviderSupported).toHaveBeenCalledWith(
        'linkedin',
      );
    });

    it('should not throw for supported provider', () => {
      mockOAuthService.isProviderSupported.mockReturnValue(true);

      expect(() => controller.oauth('google')).not.toThrow();
    });
  });

  describe('oauthCallback', () => {
    it('should throw UnauthorizedException when user is not authenticated', () => {
      const mockReq = {
        params: { provider: 'google' },
        user: null,
      } as { params: { provider: string }; user: null };

      expect(() =>
        controller.oauthCallback('google', mockReq as never),
      ).toThrow(UnauthorizedException);
      expect(() =>
        controller.oauthCallback('google', mockReq as never),
      ).toThrow('Authentication failed');
    });

    it('should return user data when authenticated', () => {
      const mockUser = {
        profile: {
          id: '123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          picture: 'https://example.com/photo.jpg',
          provider: 'google',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      const mockReq = {
        params: { provider: 'google' },
        user: mockUser,
      } as { params: { provider: string }; user: typeof mockUser };

      const result = controller.oauthCallback('google', mockReq as never);

      expect(result).toEqual({
        profile: mockUser.profile,
        refreshToken: mockUser.refreshToken,
        accessToken: mockUser.accessToken,
      });
    });
  });
});
