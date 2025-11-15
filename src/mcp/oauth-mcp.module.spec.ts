import { Test, TestingModule } from '@nestjs/testing';
import { OAuthMcpModule } from './oauth-mcp.module';
import { OAuthModule } from '../oauth/oauth.module';

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
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        OAuthModule,
        OAuthMcpModule.forRoot({
          name: 'test-mcp-server',
          version: '1.0.0',
          description: 'Test MCP server',
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide OAuthMcpToolsService', () => {
    // Import here to avoid decorator issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const { OAuthMcpToolsService } = require('./oauth-mcp-tools.service');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const service = module.get(OAuthMcpToolsService);
    expect(service).toBeDefined();
  });

  it('should use default options when not provided', () => {
    const dynamicModule = OAuthMcpModule.forRoot();
    expect(dynamicModule).toBeDefined();
    expect(dynamicModule.module).toBe(OAuthMcpModule);
  });

  it('should use custom options when provided', () => {
    const customOptions = {
      name: 'custom-mcp-server',
      version: '2.0.0',
      description: 'Custom MCP server description',
    };
    const dynamicModule = OAuthMcpModule.forRoot(customOptions);
    expect(dynamicModule).toBeDefined();
  });
});
