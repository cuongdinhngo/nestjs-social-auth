import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-linkedin-oauth2';
import { getProviderConfig, ProviderConfig } from '../config/providers.config';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    const config = getProviderConfig('linkedin') as ProviderConfig | undefined;

    if (!config) {
      throw new Error('LinkedIn OAuth configuration is missing.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.redirect,
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: unknown, user: unknown, info?: unknown) => void,
  ): void {
    const { id, name, emails, photos } = profile as {
      id: string;
      name?: { givenName?: string; familyName?: string };
      emails?: Array<{ value?: string }>;
      photos?: Array<{ value?: string }>;
    };
    const user = {
      profile: {
        id,
        email: emails?.[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos?.[0]?.value,
        provider: 'linkedin',
      },
      accessToken,
      refreshToken: refreshToken || null,
    };
    done(null, user);
  }
}
