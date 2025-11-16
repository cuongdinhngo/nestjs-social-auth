# NestJS Social Auth Library

## AI Agent Communication Guidelines

### Critical Rules for AI Agents

**1. Always Report Exact Numbers**

❌ **NEVER say:** "Tests are passing" or "All tests pass"

✅ **ALWAYS say:**
```
Unit Tests: 106 passed, 0 failed
E2E Tests: 3 passed, 0 failed
Linter: 0 errors
Total: 109 passed, 0 failed
```

**2. Stop on ANY Failure**

If ANY test fails, STOP immediately and report:
```
⚠️ FAILURE DETECTED

Command: npm test
Exit Code: 1
Failed Tests: 4
First Failure: [paste full error]

Should I fix these before continuing?
```

**3. Show Raw Output, Not Summaries**

Always show actual command output instead of interpretations.

**4. Complete Verification Before "Done"**

Before saying "done", run this EXACT sequence:
```bash
npm test          # Expect: 106 passed, 0 failed
npm run test:e2e  # Expect: 3 passed, 0 failed
npm run lint      # Expect: 0 errors
```

---

## Quick Navigation

- [Communication Guidelines](#ai-agent-communication-guidelines) - Rules for AI agents
- [Project Overview](#project-overview) - What this library does
- [Testing](#testing) - Test counts, commands, verification
- [MCP Support](#mcp-model-context-protocol-support) - MCP philosophy and tools
- [Common Pitfalls](#common-pitfalls) - Mistakes to avoid
- [Definition of Done](#definition-of-done) - Completion checklist

---

## Last Known Good State

- **Last Verified**: 2025-11-16
- **Total Tests**: 109 (106 unit + 3 e2e)
- **Node Versions**: 18.x, 20.x
- **Supported Providers**: Google, Facebook, LinkedIn, Apple
- **All Tests Passing**: ✅
- **Linter Clean**: ✅

---

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
mcp/
├── oauth-mcp.module.ts        # MCP module configuration
└── oauth-mcp-tools.service.ts # MCP tools service (exposes OAuth functionality via MCP)
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

### Test Overview

- **Total Tests**: 109
- **Unit Tests**: 106 tests across all components
- **E2E Tests**: 3 tests for HTTP endpoints

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

### Verification Checklist

Before committing changes, always verify:

```bash
# 1. Run all unit tests (106 tests should pass)
npm test

# 2. Run e2e tests (3 tests should pass)
npm run test:e2e

# 3. Run linter
npm run lint

# 4. Check test coverage (optional)
npm run test:cov
```

**Expected output:**
- Unit tests: `Test Suites: X passed, X total` and `Tests: 106 passed, 106 total`
- E2E tests: `Test Suites: 1 passed, 1 total` and `Tests: 3 passed, 3 total`
- Linter: No errors or warnings

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

## MCP (Model Context Protocol) Support

The library includes optional MCP support for exposing OAuth functionality to AI assistants and MCP clients. MCP provides static, library-level information to help developers understand and configure OAuth providers.

### MCP Philosophy

MCP tools in this library focus on **static configuration guidance**, not runtime state:
- ✅ **What providers does the library support?** (static - based on strategy registry)
- ✅ **What configuration is required?** (static - environment variable names and examples)
- ❌ **Is a provider configured in this deployment?** (deployment-specific - not exposed via MCP)

This approach makes MCP useful as a **setup assistant** rather than a runtime monitor.

### MCP Module Structure

- **`mcp/oauth-mcp.module.ts`**: MCP module that wraps `@omnihash/nestjs-mcp` and provides OAuth-specific MCP tools
- **`mcp/oauth-mcp-tools.service.ts`**: Service that defines MCP tools for OAuth operations

### MCP Tools

The MCP module exposes the following tools:

#### 1. `get_supported_providers`
Returns list of all OAuth providers with built-in strategies in this library.

**Returns:**
- `providers`: Array of provider names (e.g., `['google', 'facebook', 'linkedin', 'apple']`)
- `note`: Helper text explaining that providers need environment configuration

**Validation:** Based on `STRATEGY_REGISTRY` (static), not environment variables (dynamic)

#### 2. `check_provider_support`
Checks if the library has a built-in strategy for a specific provider.

**Parameters:**
- `provider`: Provider name to check

**Returns:**
- `supported`: Boolean indicating if strategy exists
- `provider`: Provider name (echoed back)
- `message`: Helpful message indicating support status and available providers

**Validation:** Based on `STRATEGY_REGISTRY` (static)

#### 3. `get_provider_config_keys`
Returns the required environment variable keys and example values for configuring a provider.

**Parameters:**
- `provider`: Provider name

**Returns:**
- `provider`: Provider name (echoed back)
- `supported`: Boolean indicating if provider has a strategy
- `requiredEnvVars`: Array of environment variable names needed (e.g., `['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL']`)
- `example`: Object with example values (not actual secrets)
- `message`: Error message if provider not supported

**Example for Google:**
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

**Example for Apple (different structure):**
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

### Key Functions in providers.config.ts

The MCP implementation uses two distinct validation approaches:

| Function | Purpose | Data Source | Used By | Returns |
|----------|---------|-------------|---------|---------|
| `isProviderSupported(provider)` | Library capability discovery | `STRATEGY_REGISTRY` (static) | MCP tools | `true` for google/facebook/linkedin/apple (regardless of env vars) |
| `isProviderConfigured(provider)` | Deployment validation | Environment variables (dynamic) | Guards, services, runtime | `true` only if all required env vars are present |
| `getAllSupportedProviders()` | List all providers with strategies | `STRATEGY_REGISTRY` (static) | MCP tools | `['google', 'facebook', 'linkedin', 'apple']` (always) |
| `getConfiguredProviders()` | List configured providers | Environment variables (dynamic) | Application runtime | Array of configured providers (varies by deployment) |
| `getSupportedProviders()` | Alias for getAllSupportedProviders | `STRATEGY_REGISTRY` (static) | Public API | Same as `getAllSupportedProviders()` |
| `getProviderConfig(provider)` | Get provider env vars | Environment variables (dynamic) | Guards, strategies | Provider config object or undefined |

**Critical distinction**:
- **Supported** = Has a strategy class in the library (static)
- **Configured** = Has environment variables set in deployment (dynamic)

### Dependencies

MCP support requires:
- `@omnihash/nestjs-mcp`: NestJS MCP integration package
- `zod`: Schema validation for MCP tool parameters

### Usage

Users can optionally import `OAuthMcpModule` to enable MCP support:

```typescript
import { OAuthMcpModule } from 'nestjs-social-auth';

@Module({
  imports: [
    OAuthModule, // Required
    OAuthMcpModule.forRoot({
      name: 'my-oauth-mcp-server',
      version: '1.0.0',
    }),
  ],
})
export class AppModule {}
```

### Use Cases

MCP tools are designed to help AI assistants with:
- **Setup assistance**: "What do I need to configure for Google OAuth?"
- **Library discovery**: "What providers does this library support?"
- **Configuration guidance**: "Show me example environment variables"

MCP tools are **not** designed for:
- ❌ Runtime monitoring: "Is Google OAuth working right now?"
- ❌ Deployment status: "Which providers are configured on server X?"
- ❌ Endpoint generation: "What are the OAuth URLs for this deployment?"

### Testing MCP

When adding or modifying MCP tools:
- ✅ Create unit tests for `OAuthMcpToolsService`
- ✅ Test each MCP tool method
- ✅ Test error handling (unsupported providers)
- ✅ Test all provider types (standard OAuth vs Apple)
- ✅ Test module registration
- ✅ Verify tools return static data (not deployment-specific)

## Common Pitfalls

### 1. Confusing "Supported" vs "Configured"
❌ **Wrong**: Using `isProviderConfigured()` in MCP tools
✅ **Right**: Using `isProviderSupported()` in MCP tools (checks strategy registry)

❌ **Wrong**: Using `isProviderSupported()` in OAuthGuard
✅ **Right**: Using `getProviderConfig()` in OAuthGuard (checks env vars)

### 2. Test Environment Variables
❌ **Wrong**: Only setting env vars for providers you test
✅ **Right**: Setting env vars for ALL providers with strategies (Google, Facebook, LinkedIn, Apple)

**Why**: OAuthModule automatically instantiates ALL strategies from `STRATEGY_REGISTRY`. If any strategy's env vars are missing, the constructor will throw an error during module initialization.

### 3. getSupportedProviders() Bug
❌ **Wrong**: `getSupportedProviders()` returning `getConfiguredProviders()`
✅ **Right**: `getSupportedProviders()` returning `getAllSupportedProviders()`

**Why**: The function documentation says "providers with strategy implementations", which is static (strategy registry), not dynamic (env vars).

### 4. Test Reporting
❌ **Wrong**: Saying "all tests pass" when you haven't verified the exact count
✅ **Right**: Reporting exact numbers: "106 unit tests passed, 3 e2e tests passed"

### 5. MCP Tool Design
❌ **Wrong**: MCP tools returning deployment-specific data (actual env vars, endpoint URLs)
✅ **Right**: MCP tools returning setup guidance (required env var names, examples)

**Why**: MCP is a "setup assistant", not a "runtime monitor"

## Implementation Status

### Completed Features ✅

- [x] **Google OAuth2** - Full implementation with tests
- [x] **Facebook OAuth2** - Full implementation with tests
- [x] **LinkedIn OAuth2** - Full implementation with tests
- [x] **Apple Sign In** - Full implementation with tests (different auth structure)
- [x] **MCP Support** - Static configuration guidance (setup assistant)
- [x] **Integration Command** - Both npx and NestJS CLI schematic
- [x] **CI/CD Pipeline** - GitHub Actions for automated testing

### Architecture Patterns ✅

- [x] **Dual-Validation Pattern**
  - `isProviderSupported()` - checks STRATEGY_REGISTRY (static)
  - `isProviderConfigured()` - checks environment variables (dynamic)
- [x] **Strategy Registry Pattern** - Centralized provider-to-strategy mapping
- [x] **Dynamic OAuth Guard** - Single guard handles all providers
- [x] **Environment-Based Configuration** - All credentials via env vars
- [x] **MCP as Setup Assistant** - Returns config requirements, not runtime state

### Test Coverage ✅

- [x] **106 Unit Tests** - All components covered
- [x] **3 E2E Tests** - HTTP endpoint validation
- [x] **Integration Tests** - Module registration
- [x] **Strategy Tests** - All 4 providers tested
- [x] **Config Tests** - Dual-validation pattern verified

---

## Definition of Done

Before marking any task as complete, verify:

- [ ] All unit tests pass (106/106)
- [ ] All e2e tests pass (3/3)
- [ ] Linter passes with no errors
- [ ] Code changes match the architectural patterns (dual-validation, strategy registry)
- [ ] Tests are updated to reflect code changes
- [ ] Documentation is updated if public API changed
- [ ] No actual secrets or deployment-specific data in MCP tools
- [ ] Verified test output manually (not just assumed)
