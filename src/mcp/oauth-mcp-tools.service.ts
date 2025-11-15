import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { McpTool, McpTools } from '@omnihash/nestjs-mcp';
import { OAuthService } from '../oauth/oauth.service';

@Injectable()
@McpTools('oauth')
export class OAuthMcpToolsService {
  constructor(private readonly oauthService: OAuthService) {}

  @McpTool({
    name: 'get_supported_providers',
    description:
      'Get list of all OAuth providers supported by this library (with built-in strategies). ' +
      'These providers have strategy implementations: Google, Facebook, LinkedIn, Apple. ' +
      'Note: Providers must still be configured with environment variables to use at runtime.',
    schema: z.object({}),
  })
  getSupportedProviders(): Promise<{
    providers: string[];
    note: string;
  }> {
    const providers = this.oauthService.getSupportedProviders();
    return Promise.resolve({
      providers,
      note: 'These providers have built-in strategies. Configure via environment variables to enable.',
    });
  }

  @McpTool({
    name: 'check_provider_support',
    description:
      'Check if this library has built-in support for a specific OAuth provider. ' +
      'Returns true if the provider has a strategy implementation (google, facebook, linkedin, apple). ' +
      'Note: Provider must still be configured with environment variables to use at runtime.',
    schema: z.object({
      provider: z
        .string()
        .describe(
          'OAuth provider name (e.g., google, facebook, linkedin, apple)',
        ),
    }),
  })
  checkProviderSupport({ provider }: { provider: string }): Promise<{
    supported: boolean;
    provider: string;
    message: string;
  }> {
    const supported = this.oauthService.isProviderSupported(provider);
    const allProviders = this.oauthService.getSupportedProviders();

    return Promise.resolve({
      supported,
      provider,
      message: supported
        ? `Provider '${provider}' is supported by this library. Configure environment variables to enable.`
        : `Provider '${provider}' is not supported by this library. Supported providers: ${allProviders.join(', ')}`,
    });
  }

  @McpTool({
    name: 'get_provider_config_keys',
    description:
      'Get the required environment variable keys for configuring a specific OAuth provider. ' +
      'Returns the list of environment variables needed and example values (not actual secrets). ' +
      'This helps developers understand what configuration is required.',
    schema: z.object({
      provider: z
        .string()
        .describe(
          'OAuth provider name (e.g., google, facebook, linkedin, apple)',
        ),
    }),
  })
  getProviderConfigKeys({ provider }: { provider: string }): Promise<{
    provider: string;
    supported: boolean;
    requiredEnvVars?: string[];
    example?: Record<string, string>;
    message?: string;
  }> {
    const supported = this.oauthService.isProviderSupported(provider);
    const allProviders = this.oauthService.getSupportedProviders();

    if (!supported) {
      return Promise.resolve({
        provider,
        supported: false,
        message: `Provider '${provider}' is not supported. Supported providers: ${allProviders.join(', ')}`,
      });
    }

    // Define required env vars based on provider
    const providerLower = provider.toLowerCase();

    if (providerLower === 'apple') {
      return Promise.resolve({
        provider,
        supported: true,
        requiredEnvVars: [
          'APPLE_CLIENT_ID',
          'APPLE_TEAM_ID',
          'APPLE_KEY_ID',
          'APPLE_PRIVATE_KEY',
          'APPLE_CALLBACK_URL',
        ],
        example: {
          APPLE_CLIENT_ID: 'your-apple-service-id',
          APPLE_TEAM_ID: 'your-apple-team-id',
          APPLE_KEY_ID: 'your-apple-key-id',
          APPLE_PRIVATE_KEY: 'your-apple-private-key-content',
          APPLE_CALLBACK_URL: 'http://localhost:3000/oauth/apple/callback',
        },
      });
    }

    // Standard OAuth providers (Google, Facebook, LinkedIn)
    const upperProvider = provider.toUpperCase();
    return Promise.resolve({
      provider,
      supported: true,
      requiredEnvVars: [
        `${upperProvider}_CLIENT_ID`,
        `${upperProvider}_CLIENT_SECRET`,
        `${upperProvider}_CALLBACK_URL`,
      ],
      example: {
        [`${upperProvider}_CLIENT_ID`]: `your-${providerLower}-client-id`,
        [`${upperProvider}_CLIENT_SECRET`]: `your-${providerLower}-client-secret`,
        [`${upperProvider}_CALLBACK_URL`]: `http://localhost:3000/oauth/${providerLower}/callback`,
      },
    });
  }
}
