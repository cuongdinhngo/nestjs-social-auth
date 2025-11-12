import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { OAuthModule } from './oauth.module';
import { OAuthService } from './oauth.service';
import { OAuthGuard } from './guards/oauth.guard';
import { GoogleStrategy } from './providers/google.strategy';
import { FacebookStrategy } from './providers/facebook.strategy';

// Mock the strategies to avoid constructor errors
jest.mock('./providers/google.strategy');
jest.mock('./providers/facebook.strategy');
jest.mock('./config/providers.config', () => ({
  getProviderConfig: jest.fn().mockReturnValue({
    clientId: 'test-id',
    clientSecret: 'test-secret',
    redirect: 'http://localhost:3000/oauth/test/callback',
  }),
}));

describe('OAuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PassportModule, OAuthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide OAuthService', () => {
    const service = module.get<OAuthService>(OAuthService);
    expect(service).toBeDefined();
  });

  it('should provide OAuthGuard', () => {
    const guard = module.get<OAuthGuard>(OAuthGuard);
    expect(guard).toBeDefined();
  });

  it('should register GoogleStrategy', () => {
    const strategy = module.get<GoogleStrategy>(GoogleStrategy);
    expect(strategy).toBeDefined();
  });

  it('should register FacebookStrategy', () => {
    const strategy = module.get<FacebookStrategy>(FacebookStrategy);
    expect(strategy).toBeDefined();
  });
});
