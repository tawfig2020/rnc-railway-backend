/**
 * RNC Application Deployment Script
 * 
 * This script automates the pre-deployment testing and build process for the RNC application.
 * It runs tests, builds the application, and prepares it for deployment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const config = {
  clientDir: path.join(__dirname, 'client'),
  serverDir: path.join(__dirname, 'server'),
  testingDir: path.join(__dirname, 'testing'),
  buildDir: path.join(__dirname, 'client', 'build'),
  logFile: path.join(__dirname, 'deployment-log.txt')
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Log message to console and file
 */
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}`;
  
  console.log(logMessage);
  fs.appendFileSync(config.logFile, logMessage + '\n');
}

/**
 * Execute shell command and return output
 */
function execCommand(command, cwd = __dirname) {
  try {
    log(`Executing: ${command}`, 'COMMAND');
    const output = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    return { success: true, output };
  } catch (error) {
    log(`Command failed: ${error.message}`, 'ERROR');
    return { success: false, output: error.message };
  }
}

/**
 * Run unit tests
 */
async function runUnitTests() {
  log('Running unit tests...', 'TEST');
  
  const result = execCommand('npm test -- --watchAll=false', config.clientDir);
  
  if (result.success) {
    log('Unit tests completed successfully', 'SUCCESS');
    return true;
  } else {
    log('Unit tests failed', 'ERROR');
    return false;
  }
}

/**
 * Check for linting errors
 */
function runLinting() {
  log('Running linting checks...', 'LINT');
  
  const result = execCommand('npm run lint', config.clientDir);
  
  if (result.success) {
    log('Linting checks passed', 'SUCCESS');
    return true;
  } else {
    log('Linting checks failed. Please fix linting errors before deployment.', 'ERROR');
    return false;
  }
}

/**
 * Build the application
 */
function buildApp() {
  log('Building application...', 'BUILD');
  
  const result = execCommand('npm run build', config.clientDir);
  
  if (result.success) {
    log('Application built successfully', 'SUCCESS');
    return true;
  } else {
    log('Application build failed', 'ERROR');
    return false;
  }
}

/**
 * Run end-to-end tests
 */
async function runE2ETests() {
  log('Running end-to-end tests...', 'TEST');
  
  // Check if the testing directory exists
  if (!fs.existsSync(config.testingDir)) {
    log('Testing directory not found. Skipping end-to-end tests.', 'WARNING');
    return true;
  }
  
  // Install testing dependencies
  execCommand('npm install', config.testingDir);
  
  const result = execCommand('node run-tests.js', config.testingDir);
  
  if (result.success) {
    log('End-to-end tests completed successfully', 'SUCCESS');
    return true;
  } else {
    log('End-to-end tests failed', 'ERROR');
    return false;
  }
}

/**
 * Check for broken links
 */
function checkLinks() {
  log('Checking for broken links...', 'CHECK');
  
  // This is a simplified check - in a real scenario, you might use a tool like broken-link-checker
  const routesFile = path.join(config.clientDir, 'src', 'App.js');
  
  if (!fs.existsSync(routesFile)) {
    log('Routes file not found. Skipping link check.', 'WARNING');
    return true;
  }
  
  const routesContent = fs.readFileSync(routesFile, 'utf-8');
  
  // Check for common route definition patterns
  const routeMatches = routesContent.match(/<Route[^>]*path="([^"]+)"[^>]*>/g);
  
  if (!routeMatches) {
    log('No routes found in App.js. This might be an issue.', 'WARNING');
    return true;
  }
  
  log(`Found ${routeMatches.length} routes in App.js`, 'INFO');
  
  // Extract route paths
  const routes = routeMatches.map(match => {
    const pathMatch = match.match(/path="([^"]+)"/);
    return pathMatch ? pathMatch[1] : null;
  }).filter(Boolean);
  
  log(`Routes found: ${routes.join(', ')}`, 'INFO');
  
  // Check for key routes
  const requiredRoutes = [
    '/',
    '/volunteer-application',
    '/partnership-application',
    '/register',
    '/login'
  ];
  
  const missingRoutes = requiredRoutes.filter(route => !routes.includes(route));
  
  if (missingRoutes.length > 0) {
    log(`Missing required routes: ${missingRoutes.join(', ')}`, 'WARNING');
    return false;
  }
  
  log('All required routes are defined', 'SUCCESS');
  return true;
}

/**
 * Verify form components
 */
function verifyForms() {
  log('Verifying form components...', 'CHECK');
  
  const formComponents = [
    { name: 'VolunteerApplication', path: path.join(config.clientDir, 'src', 'pages', 'VolunteerApplication.js') },
    { name: 'PersonalInfoForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'PersonalInfoForm.js') },
    { name: 'EducationForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'EducationForm.js') },
    { name: 'SkillsForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'SkillsForm.js') },
    { name: 'ExperienceForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'ExperienceForm.js') },
    { name: 'ContributionForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'ContributionForm.js') }
  ];
  
  const missingComponents = formComponents.filter(component => !fs.existsSync(component.path));
  
  if (missingComponents.length > 0) {
    log(`Missing form components: ${missingComponents.map(c => c.name).join(', ')}`, 'WARNING');
    return false;
  }
  
  log('All form components are present', 'SUCCESS');
  return true;
}

/**
 * Run the deployment process
 */
async function runDeployment() {
  log('Starting deployment process...', 'START');
  
  // Ask for confirmation
  rl.question('This will run tests and prepare the application for deployment. Continue? (y/n) ', async (answer) => {
    if (answer.toLowerCase() !== 'y') {
      log('Deployment cancelled by user', 'INFO');
      rl.close();
      return;
    }
    
    // Run checks
    const lintingPassed = runLinting();
    if (!lintingPassed) {
      log('Deployment aborted due to linting errors', 'ERROR');
      rl.close();
      return;
    }
    
    const unitTestsPassed = await runUnitTests();
    if (!unitTestsPassed) {
      rl.question('Unit tests failed. Continue anyway? (y/n) ', async (answer) => {
        if (answer.toLowerCase() !== 'y') {
          log('Deployment aborted due to failed unit tests', 'ERROR');
          rl.close();
          return;
        }
        continueDeployment();
      });
    } else {
      continueDeployment();
    }
  });
  
  async function continueDeployment() {
    const linksChecked = checkLinks();
    if (!linksChecked) {
      rl.question('Link check found issues. Continue anyway? (y/n) ', (answer) => {
        if (answer.toLowerCase() !== 'y') {
          log('Deployment aborted due to link issues', 'ERROR');
          rl.close();
          return;
        }
        continueWithForms();
      });
    } else {
      continueWithForms();
    }
  }
  
  function continueWithForms() {
    const formsVerified = verifyForms();
    if (!formsVerified) {
      rl.question('Form verification found issues. Continue anyway? (y/n) ', (answer) => {
        if (answer.toLowerCase() !== 'y') {
          log('Deployment aborted due to form issues', 'ERROR');
          rl.close();
          return;
        }
        finalizeDeployment();
      });
    } else {
      finalizeDeployment();
    }
  }
  
  async function finalizeDeployment() {
    const e2eTestsPassed = await runE2ETests();
    if (!e2eTestsPassed) {
      rl.question('End-to-end tests failed. Continue anyway? (y/n) ', (answer) => {
        if (answer.toLowerCase() !== 'y') {
          log('Deployment aborted due to failed end-to-end tests', 'ERROR');
          rl.close();
          return;
        }
        buildAndDeploy();
      });
    } else {
      buildAndDeploy();
    }
  }
  
  function buildAndDeploy() {
    const buildSuccessful = buildApp();
    if (!buildSuccessful) {
      log('Deployment aborted due to build failure', 'ERROR');
      rl.close();
      return;
    }
    
    log('Application is ready for deployment!', 'SUCCESS');
    log('To deploy, run the following command: npm run deploy', 'INFO');
    
    rl.close();
  }
}

// Initialize log file
fs.writeFileSync(config.logFile, `RNC Deployment Log - ${new Date().toISOString()}\n\n`);

// Start deployment process
runDeployment();
