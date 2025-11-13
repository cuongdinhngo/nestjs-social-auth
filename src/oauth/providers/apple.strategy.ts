import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OAuth2Strategy, VerifyCallback } from 'passport-oauth2';
import { getProviderConfig } from '../config/providers.config';

@Injectable()
export class AppleStrategy extends PassportStrategy(OAuth2Strategy, 'apple') {
  constructor() {
    const config = getProviderConfig('apple');

    if (!config) {
      throw new Error('Apple OAuth configuration is missing.');
    }

    super({
      authorizationURL: 'https://appleid.apple.com/auth/authorize',
      tokenURL: 'https://appleid.apple.com/auth/token',
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.redirect,
      scope: ['email', 'name'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id?: string;
      email?: string;
      name?: {
        firstName?: string;
        lastName?: string;
      };
    },
    done: VerifyCallback,
  ): void {
    const user = {
      profile: {
        id: profile.id || '',
        email: profile.email,
        firstName: profile.name?.firstName,
        lastName: profile.name?.lastName,
        picture: null,
        provider: 'apple',
      },
      accessToken,
      refreshToken: refreshToken || null,
    };
    done(null, user);
  }
}
