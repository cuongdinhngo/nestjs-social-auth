# NestJS Social Auth

NestJS library for OAuth SSO via Social providers (Google, Facebook, LinkedIn, etc.)

## Installation

```bash
npm install nestjs-social-auth
```

## Quick Start

After installation, run the integration command from your NestJS project:

```bash
npx nestjs-social-auth-integrate
```

Or add it to your `package.json` scripts:

```json
{
  "scripts": {
    "integrate:oauth": "nestjs-social-auth-integrate"
  }
}
```

Then run:
```bash
npm run integrate:oauth
```

## What the Integration Command Does

The `integrate` command automatically:

1. ✅ **Copies oauth directory** to `src/oauth` in your project
2. ✅ **Installs all required packages**:
   - `@nestjs/passport`
   - `passport`
   - `passport-google-oauth20`
   - `passport-facebook`
   - `@types/passport-google-oauth20` (dev)
   - `@types/passport-facebook` (dev)
3. ✅ **Updates .env file** with all provider environment variables:
   ```env
   # OAuth Configuration

   # GOOGLE OAuth
   GOOGLE_APP_ID=your-google-client-id
   GOOGLE_APP_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

   # FACEBOOK OAuth
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback
   ```
4. ✅ **Updates app.module.ts** to import and add `OAuthModule`

## Manual Setup (Alternative)

If you prefer to set up manually:

1. Copy the `oauth` directory from `node_modules/nestjs-social-auth/src/oauth` to your `src/` directory
2. Install dependencies:
   ```bash
   npm install @nestjs/passport passport passport-google-oauth20 passport-facebook
   npm install -D @types/passport-google-oauth20 @types/passport-facebook
   ```
3. Add environment variables to your `.env` file
4. Import `OAuthModule` in your `app.module.ts`:
   ```typescript
   import { OAuthModule } from './oauth/oauth.module';

   @Module({
     imports: [OAuthModule],
     // ...
   })
   ```

## Configuration

### Environment Variables

Configure your OAuth providers in `.env`:

```env
# Google OAuth
GOOGLE_APP_ID=your-google-client-id
GOOGLE_APP_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback
```

### Getting OAuth Credentials

- **Google**: [Google Cloud Console](https://console.cloud.google.com/)
- **Facebook**: [Facebook Developers](https://developers.facebook.com/)

## Usage

### Endpoints

Once integrated, the following endpoints are available:

- `GET /oauth/:provider` - Redirects to provider's OAuth page
  - Example: `GET /oauth/google`, `GET /oauth/facebook`

- `GET /oauth/:provider/callback` - OAuth callback handler
  - Returns: `{ profile, refreshToken, accessToken }`

### Response Format

```json
{
  "profile": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "picture": "https://...",
    "provider": "google"
  },
  "refreshToken": "provider-refresh-token",
  "accessToken": "provider-access-token"
}
```

## Adding New Providers

1. Create a new strategy file in `src/oauth/providers/` (e.g., `linkedin.strategy.ts`)
2. Add it to `src/oauth/config/strategy.registry.ts`
3. Update `src/oauth/config/providers.config.ts` to read environment variables
4. Add environment variables to your `.env` file

## Customization

After integration, you own the code! You can:
- Modify strategies
- Add custom logic
- Extend the module
- Add new providers

## License

UNLICENSED
