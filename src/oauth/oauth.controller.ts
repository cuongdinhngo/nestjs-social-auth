import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { OAuthGuard } from './guards/oauth.guard';
import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get(':provider')
  @UseGuards(OAuthGuard)
  oauth(@Param('provider') provider: string) {
    const providerLower = provider.toLowerCase();

    if (!this.oauthService.isProviderSupported(providerLower)) {
      throw new BadRequestException(`Provider ${provider} is not supported`);
    }

    // The OAuth guard will handle the redirect to the provider
  }

  @Get(':provider/callback')
  @UseGuards(OAuthGuard)
  oauthCallback(@Param('provider') _provider: string, @Req() req: Request) {
    interface OAuthUser {
      profile: {
        id: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        picture?: string;
        provider: string;
      };
      refreshToken: string | null;
      accessToken: string;
    }

    const user = (req as Request & { user?: OAuthUser }).user;

    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    return {
      profile: user.profile,
      refreshToken: user.refreshToken,
      accessToken: user.accessToken,
    };
  }
}
