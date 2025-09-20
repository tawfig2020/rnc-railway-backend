/**
 * Netlify Deployment Preparation Script for RNC Malaysia Website
 * This script prepares the React frontend for Netlify deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Console styling helper
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Log with color
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Main execution function
 */
async function prepareForNetlifyDeployment() {
  log('\n🚀 PREPARING RNC MALAYSIA FRONTEND FOR NETLIFY DEPLOYMENT 🚀\n', colors.bright + colors.green);
  
  try {
    // Step 1: Check environment variables
    checkEnvironmentVariables();
    
    // Step 2: Ensure dependencies are installed
    installDependencies();
    
    // Step 3: Build React frontend
    buildReactFrontend();
    
    // Step 4: Final checklist
    deploymentChecklist();
    
    log('\n✅ NETLIFY DEPLOYMENT PREPARATION COMPLETE! ✅\n', colors.bright + colors.green);
    log('You can now deploy your application to Netlify using:', colors.blue);
    log('1. Netlify CLI: Run "netlify deploy" from the client directory', colors.blue);
    log('2. Netlify UI: Drag and drop the "build" folder to Netlify\'s deploy area', colors.blue);
    log('3. Netlify Git Integration: Connect your repository to Netlify', colors.blue);
  } catch (error) {
    log(`\n❌ DEPLOYMENT PREPARATION FAILED: ${error.message}\n`, colors.bright + colors.red);
    process.exit(1);
  }
}

/**
 * Check for required environment variables
 */
function checkEnvironmentVariables() {
  log('📝 Checking environment variables...', colors.cyan);
  
  const envProdPath = path.join(__dirname, '.env.production');
  
  if (!fs.existsSync(envProdPath)) {
    log('⚠️  .env.production file not found. Creating from template...', colors.yellow);
    
    // Create a basic .env.production file
    const envContent = `# Production environment variables for React app

# API URL for production - update with your actual backend URL
REACT_APP_API_URL=https://rnc-malaysia-api.onrender.com/api

# Set to production mode
NODE_ENV=production

# Disable source maps in production for better performance
GENERATE_SOURCEMAP=false
`;
    
    fs.writeFileSync(envProdPath, envContent);
    log('✅ Created .env.production file', colors.green);
  } else {
    log('✅ .env.production file found', colors.green);
    
    // Basic validation of .env.production file
    const envContent = fs.readFileSync(envProdPath, 'utf8');
    
    if (!envContent.includes('REACT_APP_API_URL=')) {
      log('⚠️  Missing REACT_APP_API_URL in .env.production', colors.yellow);
    } else {
      log('✅ REACT_APP_API_URL found in .env.production', colors.green);
    }
  }
}

/**
 * Install dependencies
 */
function installDependencies() {
  log('\n📦 Installing dependencies...', colors.cyan);
  
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    log('✅ Dependencies installed successfully', colors.green);
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

/**
 * Build React frontend for production
 */
function buildReactFrontend() {
  log('\n🔨 Building React frontend...', colors.cyan);
  
  try {
    // Create production build
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if build directory exists
    const buildPath = path.join(__dirname, 'build');
    if (!fs.existsSync(buildPath)) {
      throw new Error('Build directory not found after build process');
    }
    
    log('✅ React frontend built successfully', colors.green);
  } catch (error) {
    throw new Error(`Failed to build React frontend: ${error.message}`);
  }
}

/**
 * Final deployment checklist
 */
function deploymentChecklist() {
  log('\n📋 Deployment Checklist:', colors.cyan);
  
  // Check for build directory
  const buildPath = path.join(__dirname, 'build');
  if (fs.existsSync(buildPath)) {
    log('✅ Build directory exists', colors.green);
  } else {
    log('❌ Build directory not found', colors.red);
  }
  
  // Check for index.html in build
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    log('✅ index.html exists in build directory', colors.green);
  } else {
    log('❌ index.html not found in build directory', colors.red);
  }
  
  // Check for netlify.toml
  const netlifyConfigPath = path.join(__dirname, '..', 'netlify.toml');
  if (fs.existsSync(netlifyConfigPath)) {
    log('✅ netlify.toml configuration file exists', colors.green);
  } else {
    log('❌ netlify.toml configuration file not found', colors.red);
  }
  
  log('\n📝 Netlify Deployment Notes:', colors.cyan);
  log('1. Make sure your backend API is deployed and accessible', colors.blue);
  log('2. Verify the REACT_APP_API_URL in .env.production points to your backend', colors.blue);
  log('3. Ensure all redirects in netlify.toml are correctly configured', colors.blue);
}

// Run the script
prepareForNetlifyDeployment();
