import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

describe('OAuthController', () => {
  let controller: OAuthController;
  let service: OAuthService;

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
    service = module.get<OAuthService>(OAuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('oauth', () => {
    it('should throw BadRequestException for unsupported provider', async () => {
      mockOAuthService.isProviderSupported.mockReturnValue(false);

      const mockReq = {
        params: { provider: 'linkedin' },
      } as any;
      const mockRes = {} as any;

      await expect(
        controller.oauth('linkedin', mockReq, mockRes),
      ).rejects.toThrow(BadRequestException);
      expect(mockOAuthService.isProviderSupported).toHaveBeenCalledWith('linkedin');
    });

    it('should not throw for supported provider', async () => {
      mockOAuthService.isProviderSupported.mockReturnValue(true);

      const mockReq = {
        params: { provider: 'google' },
      } as any;
      const mockRes = {} as any;

      await expect(
        controller.oauth('google', mockReq, mockRes),
      ).resolves.not.toThrow();
    });
  });

  describe('oauthCallback', () => {
    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const mockReq = {
        params: { provider: 'google' },
        user: null,
      } as any;

      await expect(
        controller.oauthCallback('google', mockReq),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        controller.oauthCallback('google', mockReq),
      ).rejects.toThrow('Authentication failed');
    });

    it('should return user data when authenticated', async () => {
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
      } as any;

      const result = await controller.oauthCallback('google', mockReq);

      expect(result).toEqual({
        profile: mockUser.profile,
        refreshToken: mockUser.refreshToken,
        accessToken: mockUser.accessToken,
      });
    });
  });
});
