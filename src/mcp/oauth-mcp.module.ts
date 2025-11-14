import { DynamicModule, Module } from '@nestjs/common';
import { McpModule } from '@omnihash/nestjs-mcp';
import { OAuthModule } from '../oauth/oauth.module';
import { OAuthMcpToolsService } from './oauth-mcp-tools.service';

export interface OAuthMcpModuleOptions {
  name?: string;
  version?: string;
  description?: string;
}

@Module({})
export class OAuthMcpModule {
  static forRoot(options?: OAuthMcpModuleOptions): DynamicModule {
    return {
      module: OAuthMcpModule,
      imports: [
        OAuthModule,
        McpModule.forRoot({
          name: options?.name || 'nestjs-social-auth',
          version: options?.version || '1.0.0',
          description:
            options?.description ||
            'MCP server for NestJS Social Auth - OAuth SSO via Social providers',
        }),
      ],
      providers: [OAuthMcpToolsService],
      exports: [OAuthMcpToolsService],
    };
  }
}

