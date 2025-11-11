import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { OAuthGuard } from './guards/oauth.guard';
import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) { }

  @Get(':provider')
  @UseGuards(OAuthGuard)
  async oauth(
    @Param('provider') provider: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const providerLower = provider.toLowerCase();

    if (!this.oauthService.isProviderSupported(providerLower)) {
      throw new BadRequestException(`Provider ${provider} is not supported`);
    }

    // The OAuth guard will handle the redirect to the provider
  }

  @Get(':provider/callback')
  @UseGuards(OAuthGuard)
  async oauthCallback(@Param('provider') provider: string, @Req() req: Request) {
    const user = (req as any).user;

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
