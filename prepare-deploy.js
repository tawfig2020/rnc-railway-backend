/**
 * Deployment Preparation Script for RNC Malaysia Website
 * This script prepares the project for deployment by:
 * 1. Building the React frontend
 * 2. Checking for required environment variables
 * 3. Ensuring the connection between frontend and backend is configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const colors = require('colors');

// Configuration
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET'
];

// Console styling
colors.setTheme({
  info: 'brightBlue',
  success: 'brightGreen',
  error: 'brightRed',
  warning: 'brightYellow',
  highlight: 'brightCyan'
});

/**
 * Main execution function
 */
async function prepareForDeployment() {
  console.log('\n🚀 PREPARING RNC MALAYSIA WEBSITE FOR DEPLOYMENT 🚀\n'.success.bold);
  
  try {
    // Step 1: Check environment variables
    checkEnvironmentVariables();
    
    // Step 2: Build React frontend
    buildReactFrontend();
    
    // Step 3: Prepare for backend deployment
    prepareBackend();
    
    // Step 4: Final checklist
    deploymentChecklist();
    
    console.log('\n✅ DEPLOYMENT PREPARATION COMPLETE! ✅\n'.success.bold);
    console.log('You can now deploy your application using the instructions in deployment-guide.md'.info);
  } catch (error) {
    console.error(`\n❌ DEPLOYMENT PREPARATION FAILED: ${error.message}\n`.error.bold);
    process.exit(1);
  }
}

/**
 * Check for required environment variables
 */
function checkEnvironmentVariables() {
  console.log('📝 Checking environment variables...'.highlight);
  
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found. Using .env.example as template...'.warning);
    console.log('⚠️  Please remember to create a proper .env file with real values before deploying!'.warning);
  } else {
    console.log('✅ .env file found'.success);
    
    // Basic validation of .env file
    const envContent = fs.readFileSync(envPath, 'utf8');
    const missingVars = [];
    
    requiredEnvVars.forEach(varName => {
      if (!envContent.includes(`${varName}=`)) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`.warning);
    } else {
      console.log('✅ All required environment variables found'.success);
    }
  }
}

/**
 * Build React frontend for production
 */
function buildReactFrontend() {
  console.log('\n🔨 Building React frontend...'.highlight);
  
  const clientPath = path.join(__dirname, 'client');
  
  if (!fs.existsSync(clientPath)) {
    throw new Error('Client directory not found');
  }
  
  try {
    console.log('Installing client dependencies...');
    execSync('npm install', { cwd: clientPath, stdio: 'inherit' });
    
    console.log('Building production version of React app...');
    execSync('npm run build', { cwd: clientPath, stdio: 'inherit' });
    
    console.log('✅ Frontend build successful'.success);
  } catch (error) {
    throw new Error(`Frontend build failed: ${error.message}`);
  }
}

/**
 * Prepare backend for deployment
 */
function prepareBackend() {
  console.log('\n🔧 Preparing backend for deployment...'.highlight);
  
  try {
    // Check if server.js exists and has the required code to serve static files
    const serverPath = path.join(__dirname, 'server.js');
    if (!fs.existsSync(serverPath)) {
      throw new Error('server.js not found');
    }
    
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Check if server.js is set up to serve static files in production
    if (!serverContent.includes('express.static') || 
        !serverContent.includes('client/build')) {
      console.log('⚠️  Warning: server.js may not be configured to serve the React build folder.'.warning);
      console.log('   Please ensure your server.js contains code to serve static files:'.warning);
      console.log(`   if (process.env.NODE_ENV === 'production') {\n     app.use(express.static(path.join(__dirname, '/client/build')));\n     app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));\n   }`.info);
    } else {
      console.log('✅ Backend is configured to serve static files'.success);
    }
    
    console.log('Installing backend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('✅ Backend preparation successful'.success);
  } catch (error) {
    throw new Error(`Backend preparation failed: ${error.message}`);
  }
}

/**
 * Final deployment checklist
 */
function deploymentChecklist() {
  console.log('\n📋 Final Deployment Checklist:'.highlight);
  
  // Check for configuration files
  const hasVercelConfig = fs.existsSync(path.join(__dirname, 'vercel.json'));
  const hasNetlifyConfig = fs.existsSync(path.join(__dirname, 'netlify.toml'));
  const hasDeployGuide = fs.existsSync(path.join(__dirname, 'deployment-guide.md'));
  
  console.log(`- Vercel configuration: ${hasVercelConfig ? '✅' : '❌'}`);
  console.log(`- Netlify configuration: ${hasNetlifyConfig ? '✅' : '❌'}`);
  console.log(`- Deployment guide: ${hasDeployGuide ? '✅' : '❌'}`);
  
  // Check for build artifacts
  const clientBuildPath = path.join(__dirname, 'client', 'build');
  const hasBuildFolder = fs.existsSync(clientBuildPath);
  
  console.log(`- Frontend build: ${hasBuildFolder ? '✅' : '❌'}`);
  
  if (!hasBuildFolder) {
    console.log('⚠️  Frontend build folder not found. Run this script again to create it.'.warning);
  }
  
  // Final checklist items
  console.log('\nBefore deploying, ensure you have:'.info);
  console.log('1. Updated all environment variables in your deployment platform');
  console.log('2. Set up a MongoDB database (Atlas recommended for production)');
  console.log('3. Tested the application locally in production mode');
  console.log('4. Committed all changes to your Git repository');
}

// Run the script
prepareForDeployment();
