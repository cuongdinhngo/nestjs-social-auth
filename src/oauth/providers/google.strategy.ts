import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { getProviderConfig } from '../config/providers.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const config = getProviderConfig('google');

    if (!config) {
      throw new Error(
        'Google OAuth configuration is missing. Please set GOOGLE_APP_ID, GOOGLE_APP_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
      );
    }

    super({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.redirect,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
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
