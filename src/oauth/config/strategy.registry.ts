import { Type } from '@nestjs/common';
import { GoogleStrategy } from '../providers/google.strategy';
import { FacebookStrategy } from '../providers/facebook.strategy';
import { LinkedInStrategy } from '../providers/linkedin.strategy';

export const STRATEGY_REGISTRY: Record<string, Type<any>> = {
  google: GoogleStrategy,
  facebook: FacebookStrategy,
  linkedin: LinkedInStrategy,
};

/**
 * Get strategy class for a provider
 */
export function getStrategyClass(provider: string): Type<any> | undefined {
  return STRATEGY_REGISTRY[provider.toLowerCase()];
}

/**
 * Get all registered strategy classes
 */
export function getAllStrategyClasses(): Type<any>[] {
  return Object.values(STRATEGY_REGISTRY);
}
