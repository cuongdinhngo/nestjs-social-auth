import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { getProviderConfig, ProviderConfig } from '../config/providers.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const config = getProviderConfig('google') as ProviderConfig | undefined;

    if (!config) {
      throw new Error('Google OAuth configuration is missing.');
    }

    super({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.redirect,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      name: { givenName: string; familyName: string };
      emails: Array<{ value: string }>;
      photos: Array<{ value: string }>;
    },
    done: VerifyCallback,
  ): void {
    const { id, name, emails, photos } = profile;
    const user = {
      profile: {
        id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        provider: 'google',
      },
      accessToken,
      refreshToken: refreshToken || null,
    };
    done(null, user);
  }
}
