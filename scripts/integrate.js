#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Integrate OAuth module to a NestJS project
 * Usage: npm run integrate nestjs-social-auth
 *
 * This command:
 * 1. Copies oauth directory to /src
 * 2. Installs all related packages
 */

const args = process.argv.slice(2);
const targetProjectPath = process.cwd();

// Find source oauth directory - could be in node_modules or in development
let SOURCE_OAUTH_DIR = path.join(__dirname, '../src/oauth');
if (!fs.existsSync(SOURCE_OAUTH_DIR)) {
  // Try node_modules path (when installed as package)
  SOURCE_OAUTH_DIR = path.join(__dirname, '../../nestjs-social-auth/src/oauth');
  if (!fs.existsSync(SOURCE_OAUTH_DIR)) {
    // Try another possible location
    SOURCE_OAUTH_DIR = path.join(require.resolve('nestjs-social-auth'), '../src/oauth');
  }
}
const TARGET_OAUTH_DIR = path.join(targetProjectPath, 'src/oauth');

// Required npm packages
const REQUIRED_PACKAGES = [
  '@nestjs/passport',
  'passport',
  'passport-google-oauth20',
  'passport-facebook',
];

const REQUIRED_DEV_PACKAGES = [
  '@types/passport-google-oauth20',
  '@types/passport-facebook',
];

console.log('🚀 Integrating OAuth module into your NestJS project...\n');

// Check if target project exists
if (!fs.existsSync(targetProjectPath)) {
  console.error(`❌ Error: Target project path does not exist: ${targetProjectPath}`);
  process.exit(1);
}

// Check if src directory exists
const srcDir = path.join(targetProjectPath, 'src');
if (!fs.existsSync(srcDir)) {
  console.error(`❌ Error: src directory not found in target project: ${srcDir}`);
  process.exit(1);
}

// Check if oauth directory already exists
if (fs.existsSync(TARGET_OAUTH_DIR)) {
  console.error(`❌ Error: OAuth directory already exists at: ${TARGET_OAUTH_DIR}`);
  console.log('💡 Please remove it first if you want to re-integrate.');
  process.exit(1);
}

// Step 1: Copy oauth directory
console.log('📁 Step 1: Copying oauth directory to src/oauth...');
try {
  copyDirectory(SOURCE_OAUTH_DIR, TARGET_OAUTH_DIR);
  console.log('✅ OAuth directory copied successfully!\n');
} catch (error) {
  console.error(`❌ Error copying oauth directory: ${error.message}`);
  process.exit(1);
}

// Step 2: Install required packages
console.log('📦 Step 2: Installing required packages...');
try {
  console.log('   Installing production dependencies...');
  execSync(`npm install ${REQUIRED_PACKAGES.join(' ')}`, {
    cwd: targetProjectPath,
    stdio: 'inherit',
  });

  console.log('   Installing dev dependencies...');
  execSync(`npm install -D ${REQUIRED_DEV_PACKAGES.join(' ')}`, {
    cwd: targetProjectPath,
    stdio: 'inherit',
  });

  console.log('✅ All packages installed successfully!\n');
} catch (error) {
  console.error(`❌ Error installing packages: ${error.message}`);
  console.log('⚠️  Please install packages manually:');
  console.log(`   npm install ${REQUIRED_PACKAGES.join(' ')}`);
  console.log(`   npm install -D ${REQUIRED_DEV_PACKAGES.join(' ')}`);
}

console.log('✨ Integration complete!\n');
console.log('📋 Next steps:');
console.log('1. Add OAuthModule to your app.module.ts:');
console.log('   import { OAuthModule } from \'./oauth/oauth.module\';');
console.log('   Add OAuthModule to the imports array');
console.log('2. Configure environment variables in your .env file:');
console.log('   GOOGLE_APP_ID=your-google-client-id');
console.log('   GOOGLE_APP_SECRET=your-google-client-secret');
console.log('   GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback');
console.log('   FACEBOOK_APP_ID=your-facebook-app-id');
console.log('   FACEBOOK_APP_SECRET=your-facebook-app-secret');
console.log('   FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth/facebook/callback');
console.log('3. Start your NestJS application: npm run start:dev');
console.log('4. Test OAuth endpoints:');
console.log('   - GET http://localhost:3000/oauth/google');
console.log('   - GET http://localhost:3000/oauth/facebook\n');

/**
 * Recursively copy directory
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
