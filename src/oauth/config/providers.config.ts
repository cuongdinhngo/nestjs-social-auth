export interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  redirect: string;
}

export interface AppleProviderConfig {
  clientId: string; // Service ID
  teamId: string; // Team ID
  keyId: string; // Key ID
  privateKey: string; // Private key content (as string, not file path)
  redirect: string;
}

export interface ProvidersConfig {
  [provider: string]: ProviderConfig | AppleProviderConfig;
}

export function getProvidersConfig(): ProvidersConfig {
  const config: ProvidersConfig = {};

  // Google configuration
  if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL
  ) {
    config.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirect: process.env.GOOGLE_CALLBACK_URL,
    };
  }

  // Facebook configuration
  if (
    process.env.FACEBOOK_CLIENT_ID &&
    process.env.FACEBOOK_CLIENT_SECRET &&
    process.env.FACEBOOK_CALLBACK_URL
  ) {
    config.facebook = {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect: process.env.FACEBOOK_CALLBACK_URL,
    };
  }

  // LinkedIn configuration
  if (
    process.env.LINKEDIN_CLIENT_ID &&
    process.env.LINKEDIN_CLIENT_SECRET &&
    process.env.LINKEDIN_CALLBACK_URL
  ) {
    config.linkedin = {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect: process.env.LINKEDIN_CALLBACK_URL,
    };
  }

  // Apple configuration
  if (
    process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID &&
    process.env.APPLE_PRIVATE_KEY &&
    process.env.APPLE_CALLBACK_URL
  ) {
    config.apple = {
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
      redirect: process.env.APPLE_CALLBACK_URL,
    } as AppleProviderConfig;
  }

  return config;
}

/**
 * Get list of all providers that are currently configured via environment variables
 */
export function getConfiguredProviders(): string[] {
  const config = getProvidersConfig();
  return Object.keys(config);
}

/**
 * Get list of all providers supported by this library (have strategy implementations)
 */
export function getSupportedProviders(): string[] {
  return getConfiguredProviders();
}

export function getProviderConfig(
  provider: string,
): ProviderConfig | AppleProviderConfig | undefined {
  const config = getProvidersConfig();
  return config[provider.toLowerCase()];
}

/**
 * Check if a provider has a strategy implementation in this library
 */
export function isProviderSupported(provider: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const { getStrategyClass } = require('./strategy.registry');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return !!getStrategyClass(provider);
}

/**
 * Check if a provider is configured via environment variables
 */
export function isProviderConfigured(provider: string): boolean {
  const config = getProvidersConfig();
  return provider.toLowerCase() in config;
}

/**
 * Get list of all providers with strategies (regardless of configuration)
 */
export function getAllSupportedProviders(): string[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const { STRATEGY_REGISTRY } = require('./strategy.registry');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.keys(STRATEGY_REGISTRY);
}
