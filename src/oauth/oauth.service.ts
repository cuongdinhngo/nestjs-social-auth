import { Injectable } from '@nestjs/common';
import {
  getSupportedProviders,
  isProviderSupported as checkProviderSupported,
  getProviderConfig,
} from './config/providers.config';

@Injectable()
export class OAuthService {
  getSupportedProviders(): string[] {
    return getSupportedProviders();
  }

  isProviderSupported(provider: string): boolean {
    return checkProviderSupported(provider);
  }

  getProviderConfig(provider: string) {
    return getProviderConfig(provider);
  }
}
