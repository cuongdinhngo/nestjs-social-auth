# NestJS Social Auth Library

## Project Overview

This is an npm package/library that handles OAuth SSO via Social providers (Google, Facebook, LinkedIn, etc.) for NestJS applications.

## Project Structure

```
oauth/
├── oauth.controller.ts         # OAuth endpoints
├── oauth.service.ts            # OAuth business logic
├── oauth.module.ts             # OAuth module configuration
├── config/
│   └── providers.config.ts     # Provider configuration
├── guards/
│   └── oauth.guard.ts         # Dynamic OAuth guard (Google, Facebook, ...)
└── providers/
    ├── google.strategy.ts     # Google OAuth2 strategy
    └── facebook.strategy.ts   # Facebook OAuth2 strategy
```

## Endpoints

### Dynamic OAuth Endpoints

1. **`GET /oauth/:provider`**
   - Redirects to the provider's sign-in page
   - Example: `/oauth/google`, `/oauth/facebook`, `/oauth/linkedin`

2. **`GET /oauth/:provider/callback`**
   - Handles OAuth callback from provider
   - Returns provider response (profile, refreshToken, accessToken)
   - Example: `/oauth/google/callback`, `/oauth/facebook/callback`

## Technical Decisions

1. **Library Purpose**: This is a bridge/library that focuses on connecting social SSO providers to user projects. The user's project handles additional logic (JWT generation, user storage, etc.)
2. **Response Format**: Returns the OAuth provider's response directly (profile, refreshToken, accessToken)
3. **Configuration**: Environment variables for OAuth credentials

## Implementation Details

- Uses Passport.js with OAuth2 strategies
- Dynamic provider routing based on `:provider` parameter
- Supports multiple social providers (extensible architecture)
- Returns OAuth provider response directly (profile, refreshToken, accessToken)
- User projects handle additional logic (JWT generation, user persistence, etc.)

## Response Format

The callback endpoint returns the OAuth provider's response in the following format:

```json
{
  "profile": {
    // User profile information from the provider
  },
  "refreshToken": "provider-refresh-token",
  "accessToken": "provider-access-token"
}
```

## Environment Variables

The library will use environment variables for OAuth configuration. The format for each provider follows this pattern:

```
XXX_APP_ID=your-client-id
XXX_APP_SECRET=your-client-secret
XXX_CALLBACK_URL=http://localhost:3000/oauth/xxx/callback
```

Where `XXX` is the provider name in uppercase (e.g., `GOOGLE`, `FACEBOOK`, `LINKEDIN`).

### Examples:

**Google:**
```
GOOGLE_APP_ID=your-google-client-id
GOOGLE_APP_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback
```

**Facebook:**
```
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback
```

## Integration Command

The library provides an integration command that automatically sets up the OAuth module in a NestJS project.

### Usage

After installing the package:

```bash
npm install nestjs-social-auth
```

Run the integration command from your NestJS project directory:

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

### What the Integration Command Does

The `integrate` command automatically:

1. **Copies oauth directory** to `src/oauth` in your project
   - Includes all controllers, services, modules, guards, providers, and config files
   - Maintains the complete directory structure

2. **Installs required packages**:
   - Production dependencies:
     - `@nestjs/passport`
     - `passport`
     - `passport-google-oauth20`
     - `passport-facebook`
   - Dev dependencies:
     - `@types/passport-google-oauth20`
     - `@types/passport-facebook`

### Manual Steps After Integration

After running the integration command, you need to:

1. **Add OAuthModule to app.module.ts**:
   ```typescript
   import { OAuthModule } from './oauth/oauth.module';

   @Module({
     imports: [
       // ... other modules
       OAuthModule,
     ],
   })
   export class AppModule {}
   ```

2. **Configure environment variables** in your `.env` file:
   ```env
   GOOGLE_APP_ID=your-google-client-id
   GOOGLE_APP_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback
   ```

3. **Start your application** and test the endpoints

### Benefits of Integration Command

- ✅ **Quick setup**: One command to get started
- ✅ **Full control**: You own the code and can customize it
- ✅ **No version conflicts**: Code is part of your project
- ✅ **Easy to understand**: See exactly how OAuth works
- ✅ **Customizable**: Modify any part to fit your needs
