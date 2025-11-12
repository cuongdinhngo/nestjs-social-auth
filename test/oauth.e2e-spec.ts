import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { OAuthModule } from '../src/oauth/oauth.module';

describe('OAuth (e2e)', () => {
  let app: INestApplication;
  const originalEnv = process.env;

  beforeAll(async () => {
    // Set up test environment variables
    process.env.GOOGLE_CLIENT_ID = 'test-google-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
    process.env.GOOGLE_CALLBACK_URL =
      'http://localhost:3000/oauth/google/callback';
    process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
    process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
    process.env.FACEBOOK_CALLBACK_URL =
      'http://localhost:3000/oauth/facebook/callback';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OAuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    process.env = originalEnv;
  });

  describe('/oauth/:provider (GET)', () => {
    it('should return 400 for unsupported provider', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/oauth/linkedin')
        .expect(400)
        .expect((res: request.Response) => {
          expect((res.body as { message?: string }).message).toContain(
            'not supported',
          );
        });
    });

    it('should return 400 when provider is missing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer()).get('/oauth/').expect(404); // NestJS returns 404 for missing route params
    });

    // Note: Actual OAuth redirects are hard to test in E2E without mocking Passport
    // These tests verify the endpoint exists and handles errors correctly
  });

  describe('/oauth/:provider/callback (GET)', () => {
    it('should return 400 for unsupported provider callback', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(app.getHttpServer())
        .get('/oauth/linkedin/callback')
        .expect(400)
        .expect((res: request.Response) => {
          expect((res.body as { message?: string }).message).toContain(
            'not supported',
          );
        });
    });

    // Note: OAuth callback endpoint with Passport typically redirects (302)
    // or requires authentication, so testing the actual callback flow
    // would require mocking Passport's authentication flow
  });
});
