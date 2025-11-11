export interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  redirect: string;
}

export interface ProvidersConfig {
  [provider: string]: ProviderConfig;
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

  return config;
}

export function getSupportedProviders(): string[] {
  const config = getProvidersConfig();
  return Object.keys(config);
}

export function getProviderConfig(provider: string): ProviderConfig | undefined {
  const config = getProvidersConfig();
  return config[provider.toLowerCase()];
}

export function isProviderSupported(provider: string): boolean {
  const config = getProvidersConfig();
  return provider.toLowerCase() in config;
}
