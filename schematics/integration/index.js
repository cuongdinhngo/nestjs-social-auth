const { integrate } = require('../../scripts/integrate-core');

/**
 * Schematic to integrate OAuth module into NestJS project
 * Usage: nest generate nestjs-social-auth:integration
 * Or shorthand: nest g nestjs-social-auth:integration
 */
function integrateOAuth() {
  return (tree, context) => {
    const projectPath = process.cwd();

    // Create logger interface for schematic context
    const logger = {
      info: (message) => context.logger.info(message),
      warn: (message) => context.logger.warn(message),
      error: (message) => context.logger.error(message),
    };

    // Run integration
    const result = integrate({
      projectPath,
      baseDir: __dirname,
      logger,
    });

    if (!result.success) {
      context.logger.error(`❌ ${result.error}`);
      if (result.hint) {
        context.logger.info(`💡 ${result.hint}`);
      }
      return tree;
    }

    return tree;
  };
}

module.exports = { integrateOAuth };
