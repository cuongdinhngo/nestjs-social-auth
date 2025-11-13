# NestJS Social Auth

NestJS library for OAuth SSO via Social providers (Google, Facebook, LinkedIn, Apple, etc.)

## Installation

```bash
npm install nestjs-social-auth
```

## Usage Options

This library offers three ways to integrate OAuth into your NestJS project:

### Option 1: Integration Command (Recommended for Full Customization)

**Best for**: Users who want full control and customization of the OAuth implementation.

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

**What it does:**
1. ✅ **Copies oauth directory** to `src/oauth` in your project
2. ✅ **Installs all required packages**:
   - `@nestjs/passport`
   - `passport`
   - `passport-google-oauth20`
   - `passport-facebook`
   - `passport-linkedin-oauth2`
   - `passport-apple` (for Apple Sign In)
   - `@types/passport-google-oauth20` (dev)
   - `@types/passport-facebook` (dev)
   - `@types/passport-linkedin-oauth2` (dev)

**After integration:**
1. Add `OAuthModule` to your `app.module.ts`:
   ```typescript
   import { OAuthModule } from './oauth/oauth.module';

   @Module({
     imports: [OAuthModule],
   })
   export class AppModule {}
   ```

2. Configure environment variables in your `.env` file:
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

**Benefits:**
- ✅ Full control: You own the code and can customize everything
- ✅ No version conflicts: Code is part of your project
- ✅ Easy to understand: See exactly how OAuth works
- ✅ Customizable: Modify any part to fit your needs

### Option 2: Import OAuthModule (Automatic Endpoints)

**Best for**: Users who want OAuth endpoints without customization.

Simply import `OAuthModule` in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { OAuthModule } from 'nestjs-social-auth';

@Module({
  imports: [
    // ... other modules
    OAuthModule,
  ],
})
export class AppModule {}
```

**What you get:**
- ✅ Automatic endpoints:
  - `GET /oauth/:provider` - Redirects to provider's OAuth page
    - Supported providers: `google`, `facebook`, `linkedin`, `apple`
  - `GET /oauth/:provider/callback` - Handles OAuth callback
- ✅ No need to manually use `OAuthGuard` - it's already configured
- ✅ All strategies are automatically registered

**Setup:**
1. Configure environment variables in your `.env` file (same as Option 1)
2. Start your application

**Benefits:**
- ✅ Quick setup: Just import the module
- ✅ Automatic endpoints: No need to create controllers
- ✅ Less code: Everything is handled by the module

### Option 3: Use OAuthGuard Directly (Custom Implementation)

**Best for**: Users who want to create custom OAuth endpoints and logic.

Import `OAuthGuard` and use it in your own controllers:

```typescript
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { OAuthGuard } from 'nestjs-social-auth';

@Controller('auth')
export class CustomAuthController {
  @Get('login/:provider')
  @UseGuards(OAuthGuard)
  async login(@Param('provider') provider: string) {
    // OAuth guard handles the redirect
  }

  @Get('callback/:provider')
  @UseGuards(OAuthGuard)
  async callback(@Param('provider') provider: string, @Req() req: Request) {
    const user = (req as any).user;

    // Your custom logic here
    return {
      message: 'Login successful',
      user: user.profile,
    };
  }
}
```

**Setup:**
1. Import `OAuthModule` in your `app.module.ts` (to register strategies):
   ```typescript
   import { OAuthModule } from 'nestjs-social-auth';

   @Module({
     imports: [OAuthModule],
   })
   export class AppModule {}
   ```

2. Configure environment variables in your `.env` file

3. Use `OAuthGuard` in your custom controllers

**Benefits:**
- ✅ Maximum flexibility: Create your own endpoints
- ✅ Custom logic: Handle OAuth responses your way
- ✅ Full control: Design your authentication flow

## Testing Locally

If you want to test the library in a NestJS project before publishing:

### Using `file:` Protocol (Recommended - No Permission Issues)

This method installs the package directly from the local filesystem. **This is the easiest method and doesn't require global linking or special permissions.**

1. **Build the library**:
   ```bash
   npm run build
   ```

2. **Install in your test NestJS project**:
   ```bash
   npm install file:../nestjs-social-auth
   ```

   Replace `../nestjs-social-auth` with the relative or absolute path to your library.

3. **Run the integration command**:
   ```bash
   npx nestjs-social-auth-integrate
   ```

4. **Follow the setup steps**:
   - Add `OAuthModule` to `app.module.ts`
   - Configure environment variables in `.env`
   - Start your application

## Configuration

### Environment Variables

Configure your OAuth providers in `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/oauth/linkedin/callback

# Apple OAuth (Sign in with Apple)
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key-content
APPLE_CALLBACK_URL=http://localhost:3000/oauth/apple/callback
```

### Getting OAuth Credentials

- **Google**: [Google Cloud Console](https://console.cloud.google.com/)
- **Facebook**: [Facebook Developers](https://developers.facebook.com/)
- **LinkedIn**: [LinkedIn Developers](https://www.linkedin.com/developers/)
- **Apple**: [Apple Developer](https://developer.apple.com/)

## Endpoints

Depending on which option you chose:

### Option 1 & 2: Automatic Endpoints

When using the integration command or importing `OAuthModule`, these endpoints are automatically available:

- `GET /oauth/:provider` - Redirects to provider's OAuth page
  - Example: `GET /oauth/google`, `GET /oauth/facebook`, `GET /oauth/linkedin`, `GET /oauth/apple`

- `GET /oauth/:provider/callback` - OAuth callback handler
  - Returns: `{ profile, refreshToken, accessToken }`
  - Example: `GET /oauth/google/callback`, `GET /oauth/facebook/callback`, `GET /oauth/linkedin/callback`, `GET /oauth/apple/callback`

### Option 3: Custom Endpoints

When using `OAuthGuard` directly, you create your own endpoints with custom paths and logic.

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

## Testing

The library has comprehensive test coverage with unit tests, integration tests, and E2E tests.

### Running Tests

```bash
# Run all unit tests
npm test

# Watch mode (runs tests on file changes)
npm run test:watch

# Generate coverage report
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Test Structure

- Unit tests for services, guards, strategies, config, and controllers
- Integration tests for module registration
- E2E tests for HTTP endpoints

## CI/CD

This project uses GitHub Actions for continuous integration. The CI pipeline automatically:

- ✅ Runs on every push and pull request to `main`, `master`, and `develop` branches
- ✅ Tests on Node.js 18.x and 20.x
- ✅ Runs ESLint to check code quality
- ✅ Builds the project to ensure it compiles
- ✅ Runs all unit tests
- ✅ Runs E2E tests
- ✅ Generates test coverage reports

### CI Workflow

The CI workflow (`.github/workflows/ci.yml`) includes:

1. **Test Job**: Runs linting, builds, and tests on multiple Node.js versions
2. **Coverage Job**: Generates and optionally uploads test coverage to Codecov

### Status Badge

You can add a status badge to your README:

```markdown
![CI](https://github.com/cuongdinhngo/nestjs-social-auth/workflows/CI/badge.svg)
```

## Supported Providers

The library currently supports the following OAuth providers:

- ✅ **Google** - OAuth 2.0
- ✅ **Facebook** - OAuth 2.0
- ✅ **LinkedIn** - OAuth 2.0
- ✅ **Apple** - OAuth 2.0 (Sign in with Apple)

## Adding New Providers

1. Create a new strategy file in `src/oauth/providers/` (e.g., `twitter.strategy.ts`)
2. Add it to `src/oauth/config/strategy.registry.ts`
3. Update `src/oauth/config/providers.config.ts` to read environment variables
4. Add environment variables to your `.env` file
5. Export the new strategy from `src/index.ts`
6. Update `scripts/integrate.js` to include the new provider's packages and environment variables
7. Write tests for the new strategy

## Customization

After integration, you own the code! You can:
- Modify strategies
- Add custom logic
- Extend the module
- Add new providers

## Publishing Guide

### Pre-Publishing Checklist

#### 1. Update package.json

Before publishing, make sure to:

- ✅ Set `"private": false` (already done)
- ✅ Update license (change from UNLICENSED to MIT or ISC)
- ✅ Add author information
- ✅ Add repository URL (if you have one)
- ✅ Add keywords for better discoverability
- ✅ Add `files` field to specify what gets published

#### 2. Build the package

```bash
npm run build
```

#### 3. Test the package locally

You can test the package locally before publishing:

```bash
# Create a test directory
mkdir test-package
cd test-package
npm init -y

# Install your local package
npm install ../nestjs-social-auth

# Test the integration command
npx nestjs-social-auth-integrate
```

#### 4. Check package contents

```bash
# See what will be published
npm pack --dry-run
```

This shows you exactly what files will be included in the package.

### Publishing Steps

#### Step 1: Login to npm

If you don't have an npm account, create one at [npmjs.com](https://www.npmjs.com/signup)

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- OTP (if 2FA is enabled)

#### Step 2: Verify you're logged in

```bash
npm whoami
```

#### Step 3: Check package name availability

Make sure the package name `nestjs-social-auth` is available:

```bash
npm view nestjs-social-auth
```

If it returns 404, the name is available. If it shows package info, you may need to:
- Choose a different name
- Use scoped package: `@your-username/nestjs-social-auth`

#### Step 4: Final build

```bash
npm run build
```

#### Step 5: Publish

**For first-time publishing:**

```bash
npm publish --access public
```

**For updates (after changing version):**

```bash
npm version patch  # or minor, or major
npm publish
```

#### Step 6: Verify publication

Check your package on npm:
```
https://www.npmjs.com/package/nestjs-social-auth
```

### Version Management

Use semantic versioning:

- **Patch** (0.0.1 → 0.0.2): Bug fixes
- **Minor** (0.0.1 → 0.1.0): New features, backward compatible
- **Major** (0.0.1 → 1.0.0): Breaking changes

```bash
npm version patch   # 0.0.1 → 0.0.2
npm version minor   # 0.0.1 → 0.1.0
npm version major   # 0.0.1 → 1.0.0
```

### Important Notes

1. **Source files**: The `integrate` command needs access to `src/oauth` directory, so make sure it's included in the published package
2. **Scripts**: The `scripts/integrate.js` must be included
3. **Bin command**: Make sure the bin path works when installed from npm
4. **First publish**: Use `--access public` flag for scoped packages or if you want to be explicit

### Troubleshooting

#### Error: Package name already exists
- Choose a different name or use scoped package: `@your-username/nestjs-social-auth`

#### Error: You must verify your email
- Check your email and verify it on npmjs.com

#### Error: 2FA required
- Enable 2FA on npmjs.com and use OTP when publishing

#### Bin command not working after install
- Make sure `scripts/integrate.js` has `#!/usr/bin/env node` at the top
- Check that the file is included in the published package

## License

MIT
