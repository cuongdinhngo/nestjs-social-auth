import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthGuard } from './guards/oauth.guard';
import { getAllStrategyClasses } from './config/strategy.registry';

const createProviders = () => {
  const providers: Array<
    | typeof OAuthService
    | typeof OAuthGuard
    | ReturnType<typeof getAllStrategyClasses>[number]
  > = [OAuthService, OAuthGuard];

  const allStrategies = getAllStrategyClasses();
  providers.push(...allStrategies);

  return providers;
};

@Module({
  imports: [PassportModule],
  controllers: [OAuthController],
  providers: createProviders(),
  exports: [OAuthService, OAuthGuard],
})
export class OAuthModule {}
