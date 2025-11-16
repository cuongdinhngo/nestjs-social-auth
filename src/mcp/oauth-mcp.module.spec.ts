import { OAuthMcpModule } from './oauth-mcp.module';

// Mock the MCP module and decorators
jest.mock('@omnihash/nestjs-mcp', () => ({
  McpModule: {
    forRoot: jest.fn().mockReturnValue({
      module: class MockMcpModule {},
      providers: [],
      exports: [],
    }),
  },
  McpTool: jest.fn(() => () => {}),
  McpTools: jest.fn(() => () => {}),
}));

describe('OAuthMcpModule', () => {
  it('should be defined', () => {
    expect(OAuthMcpModule).toBeDefined();
  });

  it('should return a dynamic module with default options', () => {
    const dynamicModule = OAuthMcpModule.forRoot();
    expect(dynamicModule).toBeDefined();
    expect(dynamicModule.module).toBe(OAuthMcpModule);
    expect(dynamicModule.imports).toBeDefined();
    expect(dynamicModule.providers).toBeDefined();
    expect(dynamicModule.exports).toBeDefined();
  });

  it('should return a dynamic module with custom options', () => {
    const customOptions = {
      name: 'custom-mcp-server',
      version: '2.0.0',
      description: 'Custom MCP server description',
    };
    const dynamicModule = OAuthMcpModule.forRoot(customOptions);
    expect(dynamicModule).toBeDefined();
    expect(dynamicModule.module).toBe(OAuthMcpModule);
  });

  it('should include OAuthMcpToolsService in providers', () => {
    const dynamicModule = OAuthMcpModule.forRoot();
    expect(dynamicModule.providers).toContain(
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
      require('./oauth-mcp-tools.service').OAuthMcpToolsService,
    );
  });

  it('should export OAuthMcpToolsService', () => {
    const dynamicModule = OAuthMcpModule.forRoot();
    expect(dynamicModule.exports).toContain(
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
      require('./oauth-mcp-tools.service').OAuthMcpToolsService,
    );
  });
});
