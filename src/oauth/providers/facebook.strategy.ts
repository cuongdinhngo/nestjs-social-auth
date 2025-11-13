import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import {
  getProviderConfig,
  ProviderConfig,
} from '../config/providers.config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    const config = getProviderConfig('facebook') as ProviderConfig | undefined;

    if (!config) {
      throw new Error('Facebook OAuth configuration is missing.');
    }

    super({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.redirect,
      scope: ['email'],
      profileFields: ['emails', 'name', 'picture'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): void {
    const { id, name, emails, photos } = profile;
    const user = {
      profile: {
        id,
        email: emails?.[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos?.[0]?.value,
        provider: 'facebook',
      },
      accessToken,
      refreshToken: refreshToken || null,
    };
    done(null, user);
  }
}
