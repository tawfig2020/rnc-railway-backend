/**
 * RNC Application Pre-Deployment Test Runner
 * 
 * This script orchestrates all tests needed before deployment:
 * - API endpoint tests
 * - Component tests
 * - Integration tests
 * - Pre-deployment checklist verification
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// Import chalk with CommonJS compatibility
const chalk = require('chalk');
const log = {
  blue: (text) => console.log('\x1b[34m%s\x1b[0m', text),
  green: (text) => console.log('\x1b[32m%s\x1b[0m', text),
  red: (text) => console.log('\x1b[31m%s\x1b[0m', text),
  yellow: (text) => console.log('\x1b[33m%s\x1b[0m', text)
};

// Configuration
const config = {
  testDir: path.join(__dirname),
  reportsDir: path.join(__dirname, 'reports'),
  finalReportPath: path.join(__dirname, 'reports', 'pre-deployment-report.md'),
  testTimeoutMs: 120000 // 2 minutes timeout per test suite
};

// Ensure reports directory exists
if (!fs.existsSync(config.reportsDir)) {
  fs.mkdirSync(config.reportsDir, { recursive: true });
}

// Track overall results
const results = {
  apiTests: { passed: 0, failed: 0, skipped: 0 },
  componentTests: { passed: 0, failed: 0, skipped: 0 },
  integrationTests: { passed: 0, failed: 0, skipped: 0 },
  checklistItems: { passed: 0, failed: 0, skipped: 0 }
};

/**
 * Run a command with timeout and return result
 */
function runCommandWithTimeout(command, cwd = config.testDir, timeoutMs = config.testTimeoutMs) {
  try {
    console.log(log.blue(`Running: ${command}`));
    const output = execSync(command, { 
      cwd, 
      stdio: 'inherit',
      timeout: timeoutMs
    });
    return { success: true, output };
  } catch (error) {
    console.error(log.red(`Error running command: ${error.message}`));
    return { success: false, error: error.message };
  }
}

/**
 * Parse test results from file
 */
function parseTestResults(filePath) {
  if (!fs.existsSync(filePath)) {
    return { passed: 0, failed: 0, skipped: 0 };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const summaryMatch = content.match(/- Passed: (\d+)[\s\S]*?- Failed: (\d+)[\s\S]*?- Skipped: (\d+)/);
  
  if (summaryMatch) {
    return {
      passed: parseInt(summaryMatch[1], 10),
      failed: parseInt(summaryMatch[2], 10),
      skipped: parseInt(summaryMatch[3], 10)
    };
  }
  
  return { passed: 0, failed: 0, skipped: 0 };
}

/**
 * Verify pre-deployment checklist
 */
function verifyPreDeploymentChecklist() {
  console.log(log.blue('\nVerifying Pre-Deployment Checklist...'));
  
  const checklistPath = path.join(config.testDir, 'pre-deployment-checklist.md');
  if (!fs.existsSync(checklistPath)) {
    console.error(log.red('Pre-deployment checklist file not found!'));
    return { passed: 0, failed: 1, skipped: 0, message: 'Checklist file missing' };
  }
  
  const checklist = fs.readFileSync(checklistPath, 'utf-8');
  const checkItems = checklist.match(/- \[ \] .+/g) || [];
  const checkedItems = checklist.match(/- \[x\] .+/g) || [];
  
  console.log(log.yellow(`Found ${checkItems.length + checkedItems.length} checklist items, ${checkedItems.length} are completed`));
  
  return { 
    passed: checkedItems.length,
    failed: checkItems.length,
    skipped: 0,
    message: `${checkedItems.length}/${checkItems.length + checkedItems.length} checklist items completed`
  };
}

/**
 * Generate final report
 */
function generateFinalReport() {
  const timestamp = new Date().toISOString();
  let report = `# RNC Pre-Deployment Test Report\n\n`;
  report += `Report generated: ${timestamp}\n\n`;
  
  // Overall summary
  const totalPassed = results.apiTests.passed + results.componentTests.passed + results.integrationTests.passed + results.checklistItems.passed;
  const totalFailed = results.apiTests.failed + results.componentTests.failed + results.integrationTests.failed + results.checklistItems.failed;
  const totalSkipped = results.apiTests.skipped + results.componentTests.skipped + results.integrationTests.skipped + results.checklistItems.skipped;
  
  report += `## Overall Summary\n\n`;
  report += `- Total Passed: ${totalPassed}\n`;
  report += `- Total Failed: ${totalFailed}\n`;
  report += `- Total Skipped: ${totalSkipped}\n\n`;
  
  // Deployment readiness
  const isReadyForDeployment = totalFailed === 0;
  report += `## Deployment Readiness\n\n`;
  report += isReadyForDeployment 
    ? `✅ **READY FOR DEPLOYMENT** - All tests passed!\n\n` 
    : `❌ **NOT READY FOR DEPLOYMENT** - ${totalFailed} tests failed. Please fix issues before deploying.\n\n`;
  
  // Detailed results by category
  report += `## API Endpoint Tests\n\n`;
  report += `- Passed: ${results.apiTests.passed}\n`;
  report += `- Failed: ${results.apiTests.failed}\n`;
  report += `- Skipped: ${results.apiTests.skipped}\n\n`;
  
  report += `## Component Tests\n\n`;
  report += `- Passed: ${results.componentTests.passed}\n`;
  report += `- Failed: ${results.componentTests.failed}\n`;
  report += `- Skipped: ${results.componentTests.skipped}\n\n`;
  
  report += `## Integration Tests\n\n`;
  report += `- Passed: ${results.integrationTests.passed}\n`;
  report += `- Failed: ${results.integrationTests.failed}\n`;
  report += `- Skipped: ${results.integrationTests.skipped}\n\n`;
  
  report += `## Pre-Deployment Checklist\n\n`;
  report += `- Completed Items: ${results.checklistItems.passed}\n`;
  report += `- Incomplete Items: ${results.checklistItems.failed}\n\n`;
  
  // Next steps
  report += `## Next Steps\n\n`;
  if (isReadyForDeployment) {
    report += `1. Run the deployment command: \`node deploy.js\`\n`;
    report += `2. Verify the deployment was successful\n`;
    report += `3. Test the live application\n`;
  } else {
    report += `1. Fix failed tests (see detailed reports in the \`testing/reports\` directory)\n`;
    report += `2. Complete any remaining checklist items\n`;
    report += `3. Run this test suite again\n`;
  }
  
  fs.writeFileSync(config.finalReportPath, report);
  console.log(log.blue(`\nFinal report saved to ${config.finalReportPath}`));
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(log.blue('=== RNC Pre-Deployment Testing Suite ==='));
  console.log(log.blue(`Starting tests at: ${new Date().toISOString()}`));
  
  // Step 1: Run API endpoint tests
  console.log(log.blue('\n1. Running API Endpoint Tests...'));
  const apiTestResult = runCommandWithTimeout('node api-endpoint-tests.js');
  if (apiTestResult.success) {
    results.apiTests = parseTestResults(path.join(config.testDir, 'api-test-results.md'));
    console.log(log.green('✓ API tests completed'));
  } else {
    console.log(log.red('✗ API tests failed to run'));
    results.apiTests.failed += 1;
  }
  
  // Step 2: Run component integration tests
  console.log(log.blue('\n2. Running Component Integration Tests...'));
  const componentTestResult = runCommandWithTimeout('node component-integration-tests.js');
  if (componentTestResult.success) {
    results.integrationTests = parseTestResults(path.join(config.testDir, 'component-test-results.md'));
    console.log(log.green('✓ Component integration tests completed'));
  } else {
    console.log(log.red('✗ Component integration tests failed to run'));
    results.integrationTests.failed += 1;
  }
  
  // Step 3: Verify pre-deployment checklist
  console.log(log.blue('\n3. Verifying Pre-Deployment Checklist...'));
  results.checklistItems = verifyPreDeploymentChecklist();
  if (results.checklistItems.failed === 0) {
    console.log(log.green(`✓ All checklist items completed`));
  } else {
    console.log(log.yellow(`⚠ ${results.checklistItems.message}`));
  }
  
  // Generate final report
  console.log(log.blue('\nGenerating final pre-deployment report...'));
  generateFinalReport();
  
  // Final summary
  const totalFailed = results.apiTests.failed + results.componentTests.failed + 
                      results.integrationTests.failed + results.checklistItems.failed;
  
  if (totalFailed === 0) {
    console.log(log.green('\n✅ SUCCESS! The application is ready for deployment!'));
  } else {
    console.log(log.red(`\n❌ FAILURE! ${totalFailed} tests or checklist items failed. Please fix issues before deploying.`));
  }
}

// Run all tests
runAllTests().catch(console.error);
