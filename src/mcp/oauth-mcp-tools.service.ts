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
    description: 'Get list of supported OAuth providers (Google, Facebook, LinkedIn, Apple)',
    schema: z.object({}),
  })
  async getSupportedProviders(): Promise<{ providers: string[] }> {
    const providers = this.oauthService.getSupportedProviders();
    return { providers };
  }

  @McpTool({
    name: 'check_provider_support',
    description: 'Check if a specific OAuth provider is supported and configured',
    schema: z.object({
      provider: z
        .string()
        .describe('OAuth provider name (e.g., google, facebook, linkedin, apple)'),
    }),
  })
  async checkProviderSupport({
    provider,
  }: {
    provider: string;
  }): Promise<{ supported: boolean; provider: string }> {
    const supported = this.oauthService.isProviderSupported(provider);
    return { supported, provider };
  }

  @McpTool({
    name: 'get_provider_config',
    description: 'Get configuration for a specific OAuth provider (without sensitive data)',
    schema: z.object({
      provider: z
        .string()
        .describe('OAuth provider name (e.g., google, facebook, linkedin, apple)'),
    }),
  })
  async getProviderConfig({
    provider,
  }: {
    provider: string;
  }): Promise<{
    provider: string;
    configured: boolean;
    hasClientId: boolean;
    hasClientSecret: boolean;
    callbackUrl?: string;
  }> {
    const config = this.oauthService.getProviderConfig(provider);

    if (!config) {
      return {
        provider,
        configured: false,
        hasClientId: false,
        hasClientSecret: false,
      };
    }

    return {
      provider,
      configured: true,
      hasClientId: !!config.clientId,
      hasClientSecret: !!('clientSecret' in config ? config.clientSecret : false),
      callbackUrl: config.redirect,
    };
  }

  @McpTool({
    name: 'get_oauth_endpoints',
    description: 'Get OAuth endpoints for initiating authentication flow',
    schema: z.object({
      provider: z
        .string()
        .describe('OAuth provider name (e.g., google, facebook, linkedin, apple)'),
      baseUrl: z
        .string()
        .optional()
        .describe('Base URL of your application (defaults to http://localhost:3000)'),
    }),
  })
  async getOAuthEndpoints({
    provider,
    baseUrl = 'http://localhost:3000',
  }: {
    provider: string;
    baseUrl?: string;
  }): Promise<{
    provider: string;
    authUrl: string;
    callbackUrl: string;
    supported: boolean;
  }> {
    const supported = this.oauthService.isProviderSupported(provider);

    if (!supported) {
      return {
        provider,
        authUrl: '',
        callbackUrl: '',
        supported: false,
      };
    }

    const authUrl = `${baseUrl}/oauth/${provider}`;
    const callbackUrl = `${baseUrl}/oauth/${provider}/callback`;

    return {
      provider,
      authUrl,
      callbackUrl,
      supported: true,
    };
  }
}

