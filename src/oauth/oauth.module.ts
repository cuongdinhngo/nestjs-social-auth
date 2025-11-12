import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthGuard } from './guards/oauth.guard';
import { getSupportedProviders } from './config/providers.config';
import { getStrategyClass } from './config/strategy.registry';

const createProviders = () => {
  const providers: Array<
    | typeof OAuthService
    | typeof OAuthGuard
    | ReturnType<typeof getStrategyClass>
  > = [OAuthService, OAuthGuard];

  // Only register strategies for providers that have valid config
  const supportedProviders = getSupportedProviders();
  supportedProviders.forEach((provider) => {
    const strategyClass = getStrategyClass(provider);
    if (strategyClass) {
      providers.push(strategyClass);
    }
  });

  return providers;
};

@Module({
  imports: [PassportModule],
  controllers: [OAuthController],
  providers: createProviders(),
  exports: [OAuthService, OAuthGuard],
})
export class OAuthModule {}
