const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Core integration logic for OAuth module
 * This module contains the shared logic used by both:
 * - scripts/integrate.js (npx command)
 * - schematics/integration/index.js (nest generate command)
 */

// Required npm packages
const REQUIRED_PACKAGES = [
  '@nestjs/passport',
  'passport',
  'passport-google-oauth20',
  'passport-facebook',
  'passport-linkedin-oauth2',
  'passport-apple',
];

const REQUIRED_DEV_PACKAGES = [
  '@types/passport-google-oauth20',
  '@types/passport-facebook',
  '@types/passport-linkedin-oauth2',
];

/**
 * Find source oauth directory
 * @param {string} baseDir - Base directory (usually __dirname of the calling script)
 * @returns {string} Path to source oauth directory
 */
function findSourceOAuthDir(baseDir) {
  let sourceOAuthDir = path.join(baseDir, '../src/oauth');

  if (!fs.existsSync(sourceOAuthDir)) {
    // Try to resolve from package location (when installed as npm package)
    try {
      const packagePath = require.resolve('nestjs-social-auth/package.json');
      sourceOAuthDir = path.join(path.dirname(packagePath), 'src/oauth');
    } catch (error) {
      // If package resolution fails, try relative to base directory
      sourceOAuthDir = path.join(baseDir, '../src/oauth');
    }
  }

  return sourceOAuthDir;
}

/**
 * Recursively copy directory
 * @param {string} source - Source directory path
 * @param {string} target - Target directory path
 */
function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

/**
 * Validate project structure before integration
 * @param {string} projectPath - Path to the target project
 * @param {string} targetOAuthDir - Path where oauth directory will be created
 * @returns {{valid: boolean, error?: string}} Validation result
 */
function validateProject(projectPath, targetOAuthDir) {
  // Check if target project exists
  if (!fs.existsSync(projectPath)) {
    return {
      valid: false,
      error: `Target project path does not exist: ${projectPath}`,
    };
  }

  // Check if src directory exists
  const srcDir = path.join(projectPath, 'src');
  if (!fs.existsSync(srcDir)) {
    return {
      valid: false,
      error: `src directory not found in target project: ${srcDir}`,
    };
  }

  // Check if oauth directory already exists
  if (fs.existsSync(targetOAuthDir)) {
    return {
      valid: false,
      error: `OAuth directory already exists at: ${targetOAuthDir}`,
      hint: 'Please remove it first if you want to re-integrate.',
    };
  }

  return { valid: true };
}

/**
 * Install required packages
 * @param {string} projectPath - Path to the target project
 * @param {Object} logger - Logger object with info, warn, error methods
 * @returns {{success: boolean, error?: string}} Installation result
 */
function installPackages(projectPath, logger) {
  try {
    logger.info('   Installing production dependencies...');
    execSync(`npm install ${REQUIRED_PACKAGES.join(' ')}`, {
      cwd: projectPath,
      stdio: 'inherit',
    });

    logger.info('   Installing dev dependencies...');
    execSync(`npm install -D ${REQUIRED_DEV_PACKAGES.join(' ')}`, {
      cwd: projectPath,
      stdio: 'inherit',
    });

    logger.info('✅ All packages installed successfully!\n');
    return { success: true };
  } catch (error) {
    logger.warn('⚠️  Error installing packages. Please install manually:');
    logger.info(`   npm install ${REQUIRED_PACKAGES.join(' ')}`);
    logger.info(`   npm install -D ${REQUIRED_DEV_PACKAGES.join(' ')}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main integration function
 * @param {Object} options - Integration options
 * @param {string} options.projectPath - Path to the target project
 * @param {string} options.baseDir - Base directory for finding source files (usually __dirname)
 * @param {Object} options.logger - Logger object with info, warn, error methods
 * @returns {{success: boolean, error?: string}} Integration result
 */
function integrate(options) {
  const { projectPath, baseDir, logger } = options;

  // Find source oauth directory
  const sourceOAuthDir = findSourceOAuthDir(baseDir);

  // Verify source directory exists
  if (!fs.existsSync(sourceOAuthDir)) {
    return {
      success: false,
      error: `OAuth source directory not found at: ${sourceOAuthDir}`,
      hint: 'Please ensure the nestjs-social-auth package is properly installed.',
    };
  }

  const targetOAuthDir = path.join(projectPath, 'src/oauth');

  // Validate project structure
  const validation = validateProject(projectPath, targetOAuthDir);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      hint: validation.hint,
    };
  }

  logger.info('🚀 Integrating OAuth module into your NestJS project...\n');
  logger.info('📁 Step 1: Copying oauth directory to src/oauth...');

  // Copy directory
  try {
    copyDirectory(sourceOAuthDir, targetOAuthDir);
    logger.info('✅ OAuth directory copied successfully!\n');
  } catch (error) {
    return {
      success: false,
      error: `Error copying oauth directory: ${error.message}`,
    };
  }

  // Install required packages
  logger.info('📦 Step 2: Installing required packages...');
  const installResult = installPackages(projectPath, logger);

  if (!installResult.success) {
    // Installation failed but files were copied, so partial success
    logger.warn('⚠️  Integration partially complete. Files copied but package installation failed.');
  }

  logger.info('✨ Integration complete!\n');
  logger.info('📋 Next steps:');
  logger.info('1. Add OAuthModule to your app.module.ts:');
  logger.info('   import { OAuthModule } from \'./oauth/oauth.module\';');
  logger.info('   Add OAuthModule to the imports array');
  logger.info('2. Configure environment variables in your .env file');
  logger.info('3. Start your NestJS application: npm run start:dev\n');

  return { success: true };
}

module.exports = {
  integrate,
  REQUIRED_PACKAGES,
  REQUIRED_DEV_PACKAGES,
  findSourceOAuthDir,
  copyDirectory,
  validateProject,
  installPackages,
};
