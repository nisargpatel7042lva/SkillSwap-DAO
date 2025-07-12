#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up SkillSwap DAO development environment...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n${colors.cyan}▶ ${step}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function checkPrerequisites() {
  logStep('Checking prerequisites...');
  
  // Check Node.js version
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 18) {
      logError(`Node.js 18+ required. Current version: ${nodeVersion}`);
      process.exit(1);
    }
    logSuccess(`Node.js version: ${nodeVersion}`);
  } catch (error) {
    logError('Could not determine Node.js version');
    process.exit(1);
  }

  // Check npm/yarn
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logSuccess(`npm version: ${npmVersion}`);
  } catch (error) {
    logError('npm not found. Please install Node.js and npm.');
    process.exit(1);
  }

  // Check Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    logSuccess(`Git version: ${gitVersion}`);
  } catch (error) {
    logWarning('Git not found. Some features may not work properly.');
  }
}

function installDependencies() {
  logStep('Installing dependencies...');
  
  try {
    log('Installing npm packages...');
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    process.exit(1);
  }
}

function setupEnvironment() {
  logStep('Setting up environment variables...');
  
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  
  if (fs.existsSync(envPath)) {
    logWarning('.env file already exists. Skipping environment setup.');
    return;
  }

  if (!fs.existsSync(envExamplePath)) {
    logError('env.example file not found. Please create it first.');
    process.exit(1);
  }

  try {
    fs.copyFileSync(envExamplePath, envPath);
    logSuccess('.env file created from template');
    logWarning('Please update .env file with your actual values');
  } catch (error) {
    logError('Failed to create .env file');
    process.exit(1);
  }
}

function setupGitHooks() {
  logStep('Setting up Git hooks...');
  
  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  
  if (!fs.existsSync(hooksDir)) {
    logWarning('Git repository not found. Skipping Git hooks setup.');
    return;
  }

  try {
    const preCommitHook = `#!/bin/sh
# Pre-commit hook for SkillSwap DAO

echo "🔍 Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix the issues before committing."
  exit 1
fi

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix the issues before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed"
`;

    fs.writeFileSync(preCommitPath, preCommitHook);
    fs.chmodSync(preCommitPath, '755');
    logSuccess('Git hooks configured');
  } catch (error) {
    logWarning('Failed to setup Git hooks');
  }
}

function compileContracts() {
  logStep('Compiling smart contracts...');
  
  try {
    execSync('npx hardhat compile', { stdio: 'inherit' });
    logSuccess('Smart contracts compiled successfully');
  } catch (error) {
    logError('Failed to compile smart contracts');
    process.exit(1);
  }
}

function runTypeCheck() {
  logStep('Running TypeScript type check...');
  
  try {
    execSync('npm run type-check', { stdio: 'inherit' });
    logSuccess('TypeScript type check passed');
  } catch (error) {
    logError('TypeScript type check failed');
    process.exit(1);
  }
}

function runLinting() {
  logStep('Running ESLint...');
  
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    logSuccess('ESLint passed');
  } catch (error) {
    logWarning('ESLint found issues. Run "npm run lint:fix" to auto-fix some issues.');
  }
}

function displayNextSteps() {
  logStep('Setup completed! Next steps:');
  
  console.log(`
${colors.green}🎉 Development environment setup completed successfully!${colors.reset}

${colors.cyan}📋 Next steps:${colors.reset}

1. ${colors.yellow}Configure Environment Variables:${colors.reset}
   - Edit the .env file with your actual values
   - Set up your Supabase project credentials
   - Configure your blockchain RPC endpoints

2. ${colors.yellow}Deploy Smart Contracts:${colors.reset}
   - Get some Sepolia testnet ETH from a faucet
   - Run: ${colors.bright}npm run deploy:contracts${colors.reset}

3. ${colors.yellow}Setup Database:${colors.reset}
   - Create a Supabase project
   - Run: ${colors.bright}npm run setup:database${colors.reset}
   - Optional: ${colors.bright}npm run setup:sample-data${colors.reset}

4. ${colors.yellow}Start Development:${colors.reset}
   - Run: ${colors.bright}npm run dev${colors.reset}
   - Visit: ${colors.bright}http://localhost:5173${colors.reset}

${colors.cyan}🔧 Useful Commands:${colors.reset}
- ${colors.bright}npm run dev${colors.reset} - Start development server
- ${colors.bright}npm run build${colors.reset} - Build for production
- ${colors.bright}npm run test${colors.reset} - Run tests
- ${colors.bright}npm run lint:fix${colors.reset} - Fix linting issues
- ${colors.bright}npm run deploy:contracts${colors.reset} - Deploy smart contracts
- ${colors.bright}npm run setup:database${colors.reset} - Setup database

${colors.cyan}📚 Documentation:${colors.reset}
- README.md - Complete setup and usage guide
- contracts/ - Smart contract documentation
- src/ - Frontend code documentation

${colors.green}Happy coding! 🚀${colors.reset}
`);
}

async function main() {
  try {
    checkPrerequisites();
    installDependencies();
    setupEnvironment();
    setupGitHooks();
    compileContracts();
    runTypeCheck();
    runLinting();
    displayNextSteps();
  } catch (error) {
    logError('Setup failed with error: ' + error.message);
    process.exit(1);
  }
}

// Run the setup
main(); 