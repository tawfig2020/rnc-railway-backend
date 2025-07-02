/**
 * RNC Application Test Runner
 * 
 * This script runs all tests for the RNC application and generates a report.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  clientDir: path.join(__dirname, '..', 'client'),
  reportDir: path.join(__dirname, 'reports'),
  reportFile: path.join(__dirname, 'reports', 'test-report.md')
};

// Ensure reports directory exists
if (!fs.existsSync(config.reportDir)) {
  fs.mkdirSync(config.reportDir, { recursive: true });
}

// Initialize report
const startTime = new Date();
let report = `# RNC Application Test Report\n\n`;
report += `Test run started at: ${startTime.toISOString()}\n\n`;

/**
 * Run a command and return the result
 */
function runCommand(command, cwd = config.clientDir) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

/**
 * Run unit tests for components
 */
function runUnitTests() {
  console.log('\n=== Running Unit Tests ===\n');
  report += `## Unit Tests\n\n`;
  
  const result = runCommand('npm test -- --watchAll=false');
  
  if (result.success) {
    console.log('✅ Unit tests passed');
    report += `✅ Unit tests passed\n\n`;
  } else {
    console.log('❌ Unit tests failed');
    report += `❌ Unit tests failed\n\n`;
    report += '```\n' + result.output + '\n```\n\n';
  }
  
  return result.success;
}

/**
 * Check for broken links in the application
 */
function checkLinks() {
  console.log('\n=== Checking Links ===\n');
  report += `## Link Checking\n\n`;
  
  // Check App.js for routes
  const appJsPath = path.join(config.clientDir, 'src', 'App.js');
  if (!fs.existsSync(appJsPath)) {
    console.log('❌ App.js not found');
    report += `❌ App.js not found\n\n`;
    return false;
  }
  
  const appJsContent = fs.readFileSync(appJsPath, 'utf-8');
  
  // Check for routes
  const routeMatches = appJsContent.match(/<Route[^>]*path="([^"]+)"[^>]*>/g);
  if (!routeMatches) {
    console.log('❌ No routes found in App.js');
    report += `❌ No routes found in App.js\n\n`;
    return false;
  }
  
  // Extract route paths
  const routes = routeMatches.map(match => {
    const pathMatch = match.match(/path="([^"]+)"/);
    return pathMatch ? pathMatch[1] : null;
  }).filter(Boolean);
  
  console.log(`Found ${routes.length} routes in App.js`);
  report += `Found ${routes.length} routes in App.js\n\n`;
  report += `Routes:\n${routes.map(r => `- ${r}`).join('\n')}\n\n`;
  
  // Check for required routes
  const requiredRoutes = [
    '/',
    '/volunteer-application',
    '/partnership-application',
    '/register',
    '/login'
  ];
  
  const missingRoutes = requiredRoutes.filter(route => !routes.includes(route));
  
  if (missingRoutes.length > 0) {
    console.log(`❌ Missing required routes: ${missingRoutes.join(', ')}`);
    report += `❌ Missing required routes: ${missingRoutes.join(', ')}\n\n`;
    return false;
  }
  
  console.log('✅ All required routes are defined');
  report += `✅ All required routes are defined\n\n`;
  return true;
}

/**
 * Check if all required components exist
 */
function checkComponents() {
  console.log('\n=== Checking Components ===\n');
  report += `## Component Checking\n\n`;
  
  const requiredComponents = [
    { name: 'HomePage', path: path.join(config.clientDir, 'src', 'pages', 'HomePage.js') },
    { name: 'VolunteerApplication', path: path.join(config.clientDir, 'src', 'pages', 'VolunteerApplication.js') },
    { name: 'PersonalInfoForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'PersonalInfoForm.js') },
    { name: 'EducationForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'EducationForm.js') },
    { name: 'SkillsForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'SkillsForm.js') },
    { name: 'ExperienceForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'ExperienceForm.js') },
    { name: 'ContributionForm', path: path.join(config.clientDir, 'src', 'components', 'volunteer', 'ContributionForm.js') }
  ];
  
  const missingComponents = requiredComponents.filter(component => !fs.existsSync(component.path));
  
  if (missingComponents.length > 0) {
    console.log(`❌ Missing components: ${missingComponents.map(c => c.name).join(', ')}`);
    report += `❌ Missing components: ${missingComponents.map(c => c.name).join(', ')}\n\n`;
    return false;
  }
  
  console.log('✅ All required components are present');
  report += `✅ All required components are present\n\n`;
  
  // Check component imports in VolunteerApplication.js
  const volunteerAppPath = path.join(config.clientDir, 'src', 'pages', 'VolunteerApplication.js');
  const volunteerAppContent = fs.readFileSync(volunteerAppPath, 'utf-8');
  
  const requiredImports = [
    'PersonalInfoForm',
    'EducationForm',
    'SkillsForm',
    'ExperienceForm',
    'ContributionForm'
  ];
  
  const missingImports = requiredImports.filter(imp => !volunteerAppContent.includes(`import ${imp}`));
  
  if (missingImports.length > 0) {
    console.log(`❌ Missing imports in VolunteerApplication.js: ${missingImports.join(', ')}`);
    report += `❌ Missing imports in VolunteerApplication.js: ${missingImports.join(', ')}\n\n`;
    return false;
  }
  
  console.log('✅ All required imports are present in VolunteerApplication.js');
  report += `✅ All required imports are present in VolunteerApplication.js\n\n`;
  
  return true;
}

/**
 * Check if the application builds successfully
 */
function checkBuild() {
  console.log('\n=== Checking Build ===\n');
  report += `## Build Check\n\n`;
  
  const result = runCommand('npm run build');
  
  if (result.success) {
    console.log('✅ Application builds successfully');
    report += `✅ Application builds successfully\n\n`;
  } else {
    console.log('❌ Application build failed');
    report += `❌ Application build failed\n\n`;
    report += '```\n' + result.output + '\n```\n\n';
  }
  
  return result.success;
}

/**
 * Run all tests and generate report
 */
function runAllTests() {
  console.log('Starting RNC Application Tests');
  console.log('==============================\n');
  
  const results = {
    unitTests: runUnitTests(),
    links: checkLinks(),
    components: checkComponents(),
    build: checkBuild()
  };
  
  // Generate summary
  const endTime = new Date();
  const duration = (endTime - startTime) / 1000;
  
  report += `## Summary\n\n`;
  report += `- Test run completed at: ${endTime.toISOString()}\n`;
  report += `- Duration: ${duration} seconds\n\n`;
  
  report += `| Test | Result |\n`;
  report += `|------|--------|\n`;
  report += `| Unit Tests | ${results.unitTests ? '✅ PASS' : '❌ FAIL'} |\n`;
  report += `| Links | ${results.links ? '✅ PASS' : '❌ FAIL'} |\n`;
  report += `| Components | ${results.components ? '✅ PASS' : '❌ FAIL'} |\n`;
  report += `| Build | ${results.build ? '✅ PASS' : '❌ FAIL'} |\n\n`;
  
  // Overall result
  const allPassed = Object.values(results).every(Boolean);
  
  report += `## Overall Result\n\n`;
  if (allPassed) {
    report += `✅ All tests passed. The application is ready for deployment!\n`;
    console.log('\n✅ All tests passed. The application is ready for deployment!');
  } else {
    report += `❌ Some tests failed. Please fix the issues before deployment.\n`;
    console.log('\n❌ Some tests failed. Please fix the issues before deployment.');
  }
  
  // Save report
  fs.writeFileSync(config.reportFile, report);
  console.log(`\nTest report saved to ${config.reportFile}`);
  
  return allPassed;
}

// Run all tests
runAllTests();
