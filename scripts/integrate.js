#!/usr/bin/env node

/**
 * Integrate OAuth module to a NestJS project
 * Usage: npx nestjs-social-auth-integrate
 *
 * This command:
 * 1. Copies oauth directory to /src
 * 2. Installs all related packages
 */

const { integrate } = require('./integrate-core');

const targetProjectPath = process.cwd();

// Create logger interface for console output
const logger = {
  info: (message) => console.log(message),
  warn: (message) => console.log(message),
  error: (message) => console.error(message),
};

// Run integration
const result = integrate({
  projectPath: targetProjectPath,
  baseDir: __dirname,
  logger,
});

if (!result.success) {
  console.error(`❌ Error: ${result.error}`);
  if (result.hint) {
    console.log(`💡 ${result.hint}`);
  }
  process.exit(1);
}
