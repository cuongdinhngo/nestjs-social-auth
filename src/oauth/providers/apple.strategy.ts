import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-apple';
import {
  getProviderConfig,
  AppleProviderConfig,
} from '../config/providers.config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    const config = getProviderConfig('apple') as
      | AppleProviderConfig
      | undefined;

    if (!config) {
      throw new Error(
        'Apple OAuth configuration is missing. Please set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY, and APPLE_CALLBACK_URL environment variables.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: config.clientId,
      teamID: config.teamId,
      keyID: config.keyId,
      privateKeyString: config.privateKey,
      callbackURL: config.redirect,
      scope: ['name', 'email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: {
      id?: string;
      email?: string;
      name?: {
        firstName?: string;
        lastName?: string;
      };
    },
    done: (err: any, user: any, info?: any) => void,
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
