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
│   ├── providers.config.ts     # Provider configuration (env vars)
│   └── strategy.registry.ts    # Strategy registry (maps providers to strategies)
├── guards/
│   └── oauth.guard.ts         # Dynamic OAuth guard (Google, Facebook, ...)
└── providers/
    ├── google.strategy.ts     # Google OAuth2 strategy
    ├── facebook.strategy.ts   # Facebook OAuth2 strategy
    ├── linkedin.strategy.ts   # LinkedIn OAuth2 strategy
    └── apple.strategy.ts       # Apple OAuth2 strategy
```

## Endpoints

### Dynamic OAuth Endpoints

1. **`GET /oauth/:provider`**
   - Redirects to the provider's sign-in page
   - Example: `/oauth/google`, `/oauth/facebook`, `/oauth/linkedin`, `/oauth/apple`

2. **`GET /oauth/:provider/callback`**
   - Handles OAuth callback from provider
   - Returns provider response (profile, refreshToken, accessToken)
   - Example: `/oauth/google/callback`, `/oauth/facebook/callback`, `/oauth/linkedin/callback`, `/oauth/apple/callback`

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
- **Strategy Registration**: All strategies are always registered in `OAuthModule` (via `strategy.registry.ts`), but strategies throw errors in constructor if environment variables are missing
- **Guard Logic**: `OAuthGuard` uses `getProviderConfig()` to check if provider is supported and throws `BadRequestException` for invalid/missing providers
- **Strategy Registry**: Centralized registry (`strategy.registry.ts`) maps provider names to strategy classes for dynamic loading

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
XXX_CLIENT_ID=your-client-id
XXX_CLIENT_SECRET=your-client-secret
XXX_CALLBACK_URL=http://localhost:3000/oauth/xxx/callback
```

Where `XXX` is the provider name in uppercase (e.g., `GOOGLE`, `FACEBOOK`, `LINKEDIN`).

### Examples:

**Google:**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback
```

**Facebook:**
```
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback
```

**LinkedIn:**
```
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/oauth/linkedin/callback
```

**Apple:**
```
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key-content
APPLE_CALLBACK_URL=http://localhost:3000/oauth/apple/callback
```

## Usage Options

The library offers three ways to integrate OAuth into a NestJS project:

### Option 1: Integration Command (Full Customization)

**Best for**: Users who want full control and customization.

1. Install the package:
   ```bash
   npm install nestjs-social-auth
   ```

2. Run the integration command using one of these methods:

   **Method 1: Using npx command (Recommended)**
   ```bash
   npx nestjs-social-auth-integrate
   ```

   **Method 2: Using NestJS CLI Schematic**
   ```bash
   nest g integration --collection nestjs-social-auth
   ```

3. **What it does**:
   - ✅ Copies `oauth` directory to `src/oauth` in your project
   - ✅ Installs required packages (production and dev dependencies)

4. **Manual steps after integration**:
   - Add `OAuthModule` to `app.module.ts`
   - Configure environment variables in `.env` file

**Benefits**: Full control, no version conflicts, customizable

### Option 2: Import OAuthModule (Automatic Endpoints)

**Best for**: Users who want OAuth endpoints without customization.

Simply import `OAuthModule` in your `app.module.ts`:
```typescript
import { OAuthModule } from 'nestjs-social-auth';

@Module({
  imports: [OAuthModule],
})
export class AppModule {}
```

**Benefits**: Quick setup, automatic endpoints, less code

### Option 3: Use OAuthGuard Directly (Custom Implementation)

**Best for**: Users who want custom OAuth endpoints and logic.

Import `OAuthGuard` and use it in your own controllers:
```typescript
import { OAuthGuard } from 'nestjs-social-auth';

@Controller('auth')
export class CustomAuthController {
  @Get('login/:provider')
  @UseGuards(OAuthGuard)
  async login(@Param('provider') provider: string) {
    // Custom logic
  }
}
```

**Note**: Still need to import `OAuthModule` to register strategies.

**Benefits**: Maximum flexibility, custom logic, full control

## Integration Command Details

### Available Integration Commands

The library provides two ways to run the integration:

1. **npx Command** (Recommended):
   ```bash
   npx nestjs-social-auth-integrate
   ```
   - Standalone command
   - Uses `scripts/integrate.js`

2. **NestJS CLI Schematic**:
   ```bash
   nest g integration --collection nestjs-social-auth
   ```
   - Integrated with NestJS CLI workflow
   - Uses `schematics/integration/index.js`

Both commands use the same core logic from `scripts/integrate-core.js` to ensure consistency.

### What the Integration Command Does

The integration command automatically:

1. **Copies oauth directory** to `src/oauth` in your project
   - Includes all controllers, services, modules, guards, providers, and config files
   - Maintains the complete directory structure including `strategy.registry.ts`

2. **Installs required packages**:
   - Production dependencies:
     - `@nestjs/passport`
     - `passport`
     - `passport-google-oauth20`
     - `passport-facebook`
     - `passport-linkedin-oauth2`
     - `passport-apple`
   - Dev dependencies:
     - `@types/passport-google-oauth20`
     - `@types/passport-facebook`
     - `@types/passport-linkedin-oauth2`

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
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

   FACEBOOK_CLIENT_ID=your-facebook-client-id
   FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
   FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback

   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   LINKEDIN_CALLBACK_URL=http://localhost:3000/oauth/linkedin/callback

   APPLE_CLIENT_ID=your-apple-service-id
   APPLE_TEAM_ID=your-apple-team-id
   APPLE_KEY_ID=your-apple-key-id
   APPLE_PRIVATE_KEY=your-apple-private-key-content
   APPLE_CALLBACK_URL=http://localhost:3000/oauth/apple/callback
   ```

3. **Start your application** and test the endpoints

## Testing

### Test Commands

```bash
npm test          # Run all unit tests
npm run test:watch # Watch mode
npm run test:cov   # Coverage report
npm run test:e2e   # E2E tests
```

### Test Structure

- Unit tests for all components (services, guards, strategies, config, controllers, modules)
- Integration tests for module registration
- E2E tests for HTTP endpoints

### Testing Rules

When making changes to core configuration files, you **MUST** update the corresponding tests:

1. **`providers.config.ts` updates**:
   - ✅ Update `providers.config.spec.ts` to cover new functionality
   - ✅ Test new environment variable patterns
   - ✅ Test new provider configurations
   - ✅ Ensure all helper functions (`getProviderConfig`, `isProviderSupported`, etc.) are tested

2. **`strategy.registry.ts` updates**:
   - ✅ Update `strategy.registry.spec.ts` to include new strategies
   - ✅ Test `getStrategyClass()` with new provider names
   - ✅ Verify `getAllStrategyClasses()` returns all registered strategies
   - ✅ Test case-insensitive provider lookup

3. **Adding new strategy to `providers/` directory**:
   - ✅ Create `{provider}.strategy.spec.ts` test file
   - ✅ Test constructor validation (missing config, valid config)
   - ✅ Test `validate()` method with mock profile data
   - ✅ Test error handling for missing optional fields
   - ✅ Add the new strategy to `strategy.registry.ts`
   - ✅ Update `strategy.registry.spec.ts` to include the new strategy
   - ✅ Add provider configuration to `providers.config.ts`
   - ✅ Update `providers.config.spec.ts` to test the new provider config
   - ✅ Export the new strategy from `src/index.ts`
   - ✅ Update `scripts/integrate-core.js` (shared core logic):
     - Add required passport package to `REQUIRED_PACKAGES` (if new package needed)
     - Add type definitions to `REQUIRED_DEV_PACKAGES` (if available)
     - Add environment variable examples in the instructions section
     - Add endpoint to the test endpoints list
   - ✅ Note: Both `schematics/integration/index.js` and `scripts/integrate.js` use the shared core, so updating `integrate-core.js` automatically updates both commands

**Important**: All tests must pass before committing changes. Run `npm test` to verify.
