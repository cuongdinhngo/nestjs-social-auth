import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isProviderSupported } from '../config/providers.config';

@Injectable()
export class OAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const provider = request.params?.provider?.toLowerCase();

    if (!provider) {
      throw new UnauthorizedException('Provider not specified');
    }

    // Check if provider is supported using providers config
    if (!isProviderSupported(provider)) {
      throw new UnauthorizedException(`Provider ${provider} is not supported`);
    }

    const GuardClass = this.createGuardClass(provider);
    const guard = new GuardClass();
    return guard.canActivate(context) as Promise<boolean>;
  }

  private createGuardClass(strategyName: string): new () => CanActivate {
    return class extends AuthGuard(strategyName) { };
  }
}
