# NestJS Social Auth

NestJS library for OAuth SSO via Social providers (Google, Facebook, LinkedIn, Apple, etc.)

## Installation

```bash
npm install nestjs-social-auth
```

## Quick Start (2 Minutes)

The fastest way to get started with OAuth:

**1. Install the package:**
```bash
npm install nestjs-social-auth
```

**2. Import in your `app.module.ts`:**
```typescript
import { Module } from '@nestjs/common';
import { OAuthModule } from 'nestjs-social-auth';

@Module({
  imports: [OAuthModule],
})
export class AppModule {}
```

**3. Add ONE provider to your `.env` file:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback
```

**4. Start your app and visit:**
```
http://localhost:3000/oauth/google
```

That's it! You now have Google OAuth working.

**Next steps:** [Configure more providers](#configuration) or [explore usage options](#usage-options) below.

---

## Usage Options

This library offers three ways to integrate OAuth into your NestJS project:

### Option 1: Integration Command (Recommended for Full Customization)

**Best for**: Users who want full control and customization of the OAuth implementation.

After installation, run the integration command from your NestJS project using one of these methods:

**Method 1: Using npx command (Recommended)**
```bash
npx nestjs-social-auth-integrate
```

**Method 2: Using NestJS CLI Schematic**
```bash
nest g integration --collection nestjs-social-auth
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

3. **Run the integration command** (choose one):
   ```bash
   # Using npx command
   npx nestjs-social-auth-integrate

   # Or using NestJS CLI schematic
   nest g integration --collection nestjs-social-auth
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

## Supported Providers

The library currently supports the following OAuth providers:

- ✅ **Google** - OAuth 2.0
- ✅ **Facebook** - OAuth 2.0
- ✅ **LinkedIn** - OAuth 2.0
- ✅ **Apple** - OAuth 2.0 (Sign in with Apple)

## MCP (Model Context Protocol) Support

The library includes optional MCP support, allowing AI assistants and MCP clients to discover OAuth provider capabilities and configuration requirements. MCP tools focus on **static configuration guidance** rather than deployment-specific runtime state.

### MCP Philosophy

MCP in this library serves as a **setup assistant**, helping developers understand:
- ✅ What providers are supported by the library
- ✅ What environment variables are needed
- ✅ Example configuration values

MCP does **not** provide runtime monitoring of specific deployments.

### Installation

MCP support requires additional dependencies:

```bash
npm install @omnihash/nestjs-mcp zod
```

### Setup

#### Step 1: Enable MCP in Your NestJS App

Import `OAuthMcpModule` in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { OAuthModule } from 'nestjs-social-auth';
import { OAuthMcpModule } from 'nestjs-social-auth';

@Module({
  imports: [
    OAuthModule, // Required - provides OAuth functionality
    OAuthMcpModule.forRoot({
      name: 'my-oauth-mcp-server',
      version: '1.0.0',
      description: 'OAuth MCP server for my application',
    }),
  ],
})
export class AppModule {}
```

#### Step 2: Start Your NestJS Application

```bash
npm run start:dev
```

Your MCP server will be available at:
- **SSE Endpoint**: `http://localhost:3000/sse`
- **Messages Endpoint**: `http://localhost:3000/messages`

#### Step 3: Configure MCP Client

Now configure your MCP client (AI assistant) to connect to your NestJS app.

### Configuring MCP Clients

#### Option 1: Claude Desktop App (Recommended)

If you're using [Claude Desktop](https://claude.ai/download), configure it to connect to your MCP server:

**1. Locate your Claude Desktop config file:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**2. Add your MCP server configuration:**

```json
{
  "mcpServers": {
    "nestjs-oauth": {
      "command": "node",
      "args": [
        "-e",
        "const http = require('http'); const EventSource = require('eventsource'); const es = new EventSource('http://localhost:3000/sse'); es.onmessage = (e) => console.log(e.data); es.onerror = (e) => console.error(e);"
      ],
      "env": {
        "MCP_SERVER_URL": "http://localhost:3000"
      }
    }
  }
}
```

**Alternative (using npx with MCP proxy):**

```json
{
  "mcpServers": {
    "nestjs-oauth": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-everything",
        "http://localhost:3000"
      ]
    }
  }
}
```

**3. Restart Claude Desktop**

After updating the config file, restart Claude Desktop for the changes to take effect.

**4. Verify Connection**

In Claude Desktop, you should see the MCP server connected. Try asking:
```
"What OAuth providers are supported by nestjs-social-auth?"
```

Claude will use the `get_supported_providers` MCP tool to answer.

#### Option 2: VS Code with Claude Extension

If you're using VS Code with a Claude extension that supports MCP:

**1. Install the Claude extension** (if not already installed)

**2. Configure MCP settings** in your VS Code `settings.json`:

```json
{
  "claude.mcpServers": {
    "nestjs-oauth": {
      "url": "http://localhost:3000",
      "endpoints": {
        "sse": "/sse",
        "messages": "/messages"
      }
    }
  }
}
```

**3. Restart VS Code**

#### Option 3: Custom MCP Client

If you're building your own MCP client or using a different AI assistant:

**Connection Details:**
- **Server URL**: `http://localhost:3000`
- **SSE Endpoint**: `http://localhost:3000/sse`
- **Messages Endpoint**: `http://localhost:3000/messages` (POST)
- **Protocol**: MCP over HTTP with Server-Sent Events

**Example using Node.js:**

```typescript
import { EventSource } from 'eventsource';

// Connect to SSE endpoint
const eventSource = new EventSource('http://localhost:3000/sse');

eventSource.onmessage = (event) => {
  console.log('MCP Message:', event.data);
};

eventSource.onerror = (error) => {
  console.error('MCP Error:', error);
};

// Send MCP tool request
const response = await fetch('http://localhost:3000/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'get_supported_providers',
      arguments: {},
    },
  }),
});

const result = await response.json();
console.log('Supported Providers:', result);
```

### Testing MCP Connection

Once your MCP client is configured, test the connection:

**1. Check if MCP server is running:**
```bash
curl http://localhost:3000/sse
```

**2. Test MCP tool directly:**
```bash
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_supported_providers",
      "arguments": {}
    }
  }'
```

Expected response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "providers": ["google", "facebook", "linkedin", "apple"],
    "note": "These providers have built-in strategies. Configure via environment variables to enable."
  }
}
```

### Production Deployment

For production deployments:

**1. Use HTTPS:**
```json
{
  "mcpServers": {
    "nestjs-oauth": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-everything",
        "https://your-domain.com"
      ]
    }
  }
}
```

**2. Add Authentication:**

Enable guards in your MCP module:
```typescript
OAuthMcpModule.forRoot({
  name: 'my-oauth-mcp-server',
  version: '1.0.0',
  guards: [AuthGuard], // Protect MCP endpoints
})
```

**3. Configure CORS** (if needed):

```typescript
// main.ts
app.enableCors({
  origin: ['https://claude.ai', 'https://your-client-domain.com'],
  credentials: true,
});
```

### Available MCP Tools

The MCP module exposes three tools focused on library capabilities and configuration requirements:

#### 1. `get_supported_providers`

Get a list of all OAuth providers supported by this library (with built-in strategies).

**Returns:**
```json
{
  "providers": ["google", "facebook", "linkedin", "apple"],
  "note": "These providers have built-in strategies. Configure via environment variables to enable."
}
```

**Note:** This returns all providers with strategies in the library, regardless of whether they're configured in your deployment.

#### 2. `check_provider_support`

Check if the library has a built-in strategy for a specific OAuth provider.

**Parameters:**
- `provider` (string): OAuth provider name (e.g., "google", "facebook", "linkedin", "apple")

**Returns for supported provider:**
```json
{
  "supported": true,
  "provider": "google",
  "message": "Provider 'google' is supported by this library. Configure environment variables to enable."
}
```

**Returns for unsupported provider:**
```json
{
  "supported": false,
  "provider": "twitter",
  "message": "Provider 'twitter' is not supported by this library. Supported providers: google, facebook, linkedin, apple"
}
```

#### 3. `get_provider_config_keys`

Get the required environment variable keys and example values for configuring a provider.

**Parameters:**
- `provider` (string): OAuth provider name

**Returns for Google (standard OAuth provider):**
```json
{
  "provider": "google",
  "supported": true,
  "requiredEnvVars": [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL"
  ],
  "example": {
    "GOOGLE_CLIENT_ID": "your-google-client-id",
    "GOOGLE_CLIENT_SECRET": "your-google-client-secret",
    "GOOGLE_CALLBACK_URL": "http://localhost:3000/oauth/google/callback"
  }
}
```

**Returns for Apple (different auth structure):**
```json
{
  "provider": "apple",
  "supported": true,
  "requiredEnvVars": [
    "APPLE_CLIENT_ID",
    "APPLE_TEAM_ID",
    "APPLE_KEY_ID",
    "APPLE_PRIVATE_KEY",
    "APPLE_CALLBACK_URL"
  ],
  "example": {
    "APPLE_CLIENT_ID": "your-apple-service-id",
    "APPLE_TEAM_ID": "your-apple-team-id",
    "APPLE_KEY_ID": "your-apple-key-id",
    "APPLE_PRIVATE_KEY": "your-apple-private-key-content",
    "APPLE_CALLBACK_URL": "http://localhost:3000/oauth/apple/callback"
  }
}
```

**Returns for unsupported provider:**
```json
{
  "provider": "twitter",
  "supported": false,
  "message": "Provider 'twitter' is not supported. Supported providers: google, facebook, linkedin, apple"
}
```

### MCP Endpoints

When `OAuthMcpModule` is imported, the MCP server exposes endpoints that can be accessed by MCP clients:

- **SSE Endpoint**: `/sse` - Server-Sent Events endpoint for real-time communication
- **Messages Endpoint**: `/messages` - HTTP endpoint for MCP message handling

### Security

To secure MCP endpoints, you can apply NestJS guards:

```typescript
import { Module } from '@nestjs/common';
import { OAuthMcpModule } from 'nestjs-social-auth';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    OAuthMcpModule.forRoot({
      name: 'my-oauth-mcp-server',
      version: '1.0.0',
      guards: [AuthGuard], // Apply guards here
    }),
  ],
})
export class AppModule {}
```

### Example AI Assistant Conversation

Here's how an AI assistant might use these MCP tools:

```
User: "I want to add Google OAuth to my app"

AI: [Calls get_provider_config_keys with provider='google']

AI: "To add Google OAuth, you need to set these environment variables:
     - GOOGLE_CLIENT_ID=your-google-client-id
     - GOOGLE_CLIENT_SECRET=your-google-client-secret
     - GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback

     Would you like help getting these credentials from Google Cloud Console?"
```

### What MCP Does vs. Doesn't Do

**MCP tools provide (static library information):**
- ✅ List of supported providers (google, facebook, linkedin, apple)
- ✅ Required environment variable names for each provider
- ✅ Example configuration values
- ✅ Validation that a provider has a built-in strategy

**MCP tools do NOT provide (deployment-specific runtime state):**
- ❌ Whether a provider is configured in a specific deployment
- ❌ Actual environment variable values or secrets
- ❌ Runtime status or health checks
- ❌ Deployment-specific endpoint URLs

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

# Test the integration command (choose one)
npx nestjs-social-auth-integrate
# Or: nest g integration --collection nestjs-social-auth
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

### Publishing Troubleshooting

#### Error: Package name already exists
- Choose a different name or use scoped package: `@your-username/nestjs-social-auth`

#### Error: You must verify your email
- Check your email and verify it on npmjs.com

#### Error: 2FA required
- Enable 2FA on npmjs.com and use OTP when publishing

#### Bin command not working after install
- Make sure `scripts/integrate.js` has `#!/usr/bin/env node` at the top
- Check that the file is included in the published package

## Troubleshooting

### Error: "Provider not supported"

**Problem:** Getting 400 error when visiting `/oauth/:provider`

**Solutions:**
1. Check that the provider is supported by this library
   - **Supported providers**: `google`, `facebook`, `linkedin`, `apple`
   - **Not supported yet**: `twitter`, `github`, etc.
2. Verify environment variables are configured for that provider
3. Restart your application after adding env vars

### Error: "Strategy requires a clientID"

**Problem:** Application crashes on startup with missing strategy configuration

**Solutions:**
1. **For Google/Facebook/LinkedIn:** Ensure all 3 env vars are set:
   ```env
   PROVIDER_CLIENT_ID=your-id
   PROVIDER_CLIENT_SECRET=your-secret
   PROVIDER_CALLBACK_URL=http://localhost:3000/oauth/provider/callback
   ```

2. **For Apple:** Ensure all 5 env vars are set:
   ```env
   APPLE_CLIENT_ID=your-apple-service-id
   APPLE_TEAM_ID=your-team-id
   APPLE_KEY_ID=your-key-id
   APPLE_PRIVATE_KEY=your-private-key-content
   APPLE_CALLBACK_URL=http://localhost:3000/oauth/apple/callback
   ```

3. Check for typos in environment variable names (must be uppercase)

### Tests Failing After Integration

**Problem:** Tests fail after running the integration command

**Solution:**
When using `OAuthModule`, ALL provider strategies are instantiated. If any provider is missing environment variables, tests will fail.

**Fix:** Set test environment variables for ALL providers:
```typescript
// In your test setup (e.g., beforeAll)
process.env.GOOGLE_CLIENT_ID = 'test-google-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/oauth/google/callback';

process.env.FACEBOOK_CLIENT_ID = 'test-facebook-id';
process.env.FACEBOOK_CLIENT_SECRET = 'test-facebook-secret';
process.env.FACEBOOK_CALLBACK_URL = 'http://localhost:3000/oauth/facebook/callback';

process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id';
process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret';
process.env.LINKEDIN_CALLBACK_URL = 'http://localhost:3000/oauth/linkedin/callback';

process.env.APPLE_CLIENT_ID = 'test-apple-service-id';
process.env.APPLE_TEAM_ID = 'test-team-id';
process.env.APPLE_KEY_ID = 'test-key-id';
process.env.APPLE_PRIVATE_KEY = 'test-private-key-content';
process.env.APPLE_CALLBACK_URL = 'http://localhost:3000/oauth/apple/callback';
```

### OAuth Redirect Not Working

**Problem:** OAuth redirect doesn't happen or returns error

**Solutions:**
1. Verify callback URL in provider's developer console matches your `.env` file
2. Ensure your app is running on the correct port
3. For production, update callback URLs to use HTTPS
4. Check provider's developer console for error messages

### Environment Variables Not Loading

**Problem:** App can't read environment variables

**Solutions:**
1. Install `dotenv` if not already installed:
   ```bash
   npm install dotenv
   ```

2. Load environment variables in `main.ts`:
   ```typescript
   import { config } from 'dotenv';
   config(); // Load .env file

   async function bootstrap() {
     // ... rest of your bootstrap code
   }
   ```

3. Verify `.env` file is in the root directory (not in `src/`)

## Test Coverage

This library has comprehensive test coverage:

- **Total Tests**: 109
- **Unit Tests**: 106 (all components tested)
- **E2E Tests**: 3 (HTTP endpoint validation)
- **Coverage**: All core components, strategies, guards, config, and services

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

### What's Tested

✅ **OAuth Strategies** - All 4 providers (Google, Facebook, LinkedIn, Apple)
✅ **Provider Configuration** - Environment variable parsing and validation
✅ **Strategy Registry** - Provider-to-strategy mapping
✅ **OAuth Guard** - Dynamic provider routing
✅ **OAuth Service** - Business logic and provider queries
✅ **OAuth Controller** - HTTP endpoint handling
✅ **MCP Tools** - All 3 MCP tool methods
✅ **Module Registration** - Proper dependency injection

## License

MIT
