export { OAuthModule } from './oauth/oauth.module';
export { OAuthService } from './oauth/oauth.service';
export { OAuthController } from './oauth/oauth.controller';
export { OAuthGuard } from './oauth/guards/oauth.guard';
export { GoogleStrategy } from './oauth/providers/google.strategy';
export { FacebookStrategy } from './oauth/providers/facebook.strategy';
export { LinkedInStrategy } from './oauth/providers/linkedin.strategy';
export { AppleStrategy } from './oauth/providers/apple.strategy';
export {
  getProvidersConfig,
  getSupportedProviders,
  getProviderConfig,
  isProviderSupported,
  type ProviderConfig,
  type ProvidersConfig,
} from './oauth/config/providers.config';
export {
  STRATEGY_REGISTRY,
  getStrategyClass,
  getAllStrategyClasses,
} from './oauth/config/strategy.registry';
