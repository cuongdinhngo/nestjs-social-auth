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
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

   # FACEBOOK OAuth
   FACEBOOK_CLIENT_ID=your-facebook-client-id
   FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
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
