/**
 * RNC Application Test Runner
 * 
 * This script runs a series of tests to verify that all components, routes,
 * links, forms, and functionality are working correctly before deployment.
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:3000',
  headless: false, // Set to true for CI environments
  slowMo: 50, // Slow down operations for better visibility during testing
  viewportWidth: 1280,
  viewportHeight: 800,
  testResultsPath: path.join(__dirname, 'test-results.md')
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  results: []
};

/**
 * Log test result
 */
function logResult(testName, status, notes = '') {
  const timestamp = new Date().toISOString();
  const result = {
    testName,
    status,
    timestamp,
    notes
  };
  
  testResults.results.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(chalk.green(`✓ PASS: ${testName}`));
  } else if (status === 'FAIL') {
    testResults.failed++;
    console.log(chalk.red(`✗ FAIL: ${testName} - ${notes}`));
  } else {
    testResults.skipped++;
    console.log(chalk.yellow(`⚠ SKIP: ${testName} - ${notes}`));
  }
}

/**
 * Save test results to file
 */
function saveTestResults() {
  let content = `# RNC Application Test Results\n\n`;
  content += `Test run completed at: ${new Date().toISOString()}\n\n`;
  content += `## Summary\n\n`;
  content += `- Total tests: ${testResults.passed + testResults.failed + testResults.skipped}\n`;
  content += `- Passed: ${testResults.passed}\n`;
  content += `- Failed: ${testResults.failed}\n`;
  content += `- Skipped: ${testResults.skipped}\n\n`;
  content += `## Detailed Results\n\n`;
  content += `| Test | Status | Timestamp | Notes |\n`;
  content += `|------|--------|-----------|-------|\n`;
  
  testResults.results.forEach(result => {
    const status = result.status === 'PASS' 
      ? 'PASS ✓' 
      : result.status === 'FAIL' 
        ? 'FAIL ✗' 
        : 'SKIP ⚠';
    content += `| ${result.testName} | ${status} | ${result.timestamp} | ${result.notes} |\n`;
  });
  
  fs.writeFileSync(config.testResultsPath, content);
  console.log(chalk.blue(`\nTest results saved to ${config.testResultsPath}`));
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(chalk.blue('Starting RNC Application Tests'));
  console.log(chalk.blue('==============================\n'));
  
  const browser = await puppeteer.launch({ 
    headless: config.headless,
    slowMo: config.slowMo
  });
  
  const page = await browser.newPage();
  await page.setViewport({ 
    width: config.viewportWidth, 
    height: config.viewportHeight 
  });
  
  try {
    // Test 1: Homepage loads correctly
    try {
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('h1');
      const title = await page.$eval('h1', el => el.textContent);
      
      if (title.includes('Empowering Refugees')) {
        logResult('Homepage loads correctly', 'PASS');
      } else {
        logResult('Homepage loads correctly', 'FAIL', 'Title not found or incorrect');
      }
    } catch (error) {
      logResult('Homepage loads correctly', 'FAIL', error.message);
    }
    
    // Test 2: Navigation links work
    try {
      // Test About Us link
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      await page.click('a[href="/about"]');
      await page.waitForSelector('h1');
      const aboutTitle = await page.$eval('h1', el => el.textContent);
      
      if (aboutTitle.includes('About')) {
        logResult('About Us navigation link works', 'PASS');
      } else {
        logResult('About Us navigation link works', 'FAIL', 'About page title not found or incorrect');
      }
    } catch (error) {
      logResult('About Us navigation link works', 'FAIL', error.message);
    }
    
    // Test 3: Volunteer button links to volunteer application
    try {
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      const volunteerButton = await page.$('a[href="/volunteer-application"]');
      
      if (volunteerButton) {
        await volunteerButton.click();
        await page.waitForSelector('h1');
        const volunteerTitle = await page.$eval('h1', el => el.textContent);
        
        if (volunteerTitle.includes('Volunteer Application')) {
          logResult('Volunteer button links to volunteer application', 'PASS');
        } else {
          logResult('Volunteer button links to volunteer application', 'FAIL', 'Volunteer application title not found or incorrect');
        }
      } else {
        logResult('Volunteer button links to volunteer application', 'FAIL', 'Volunteer button not found');
      }
    } catch (error) {
      logResult('Volunteer button links to volunteer application', 'FAIL', error.message);
    }
    
    // Test 4: Partner button links to partnership application
    try {
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      const partnerButton = await page.$('a[href="/partnership-application"]');
      
      if (partnerButton) {
        await partnerButton.click();
        await page.waitForSelector('h1');
        const partnerTitle = await page.$eval('h1', el => el.textContent);
        
        if (partnerTitle.includes('Partnership Application')) {
          logResult('Partner button links to partnership application', 'PASS');
        } else {
          logResult('Partner button links to partnership application', 'FAIL', 'Partnership application title not found or incorrect');
        }
      } else {
        logResult('Partner button links to partnership application', 'FAIL', 'Partner button not found');
      }
    } catch (error) {
      logResult('Partner button links to partnership application', 'FAIL', error.message);
    }
    
    // Test 5: Volunteer application form works
    try {
      await page.goto(`${config.baseUrl}/volunteer-application`, { waitUntil: 'networkidle0' });
      
      // Fill out personal information
      await page.type('input[name="firstName"]', 'John');
      await page.type('input[name="lastName"]', 'Doe');
      await page.type('input[name="email"]', 'john.doe@example.com');
      await page.type('input[name="phone"]', '1234567890');
      
      // Click Next button
      await page.click('button[type="button"]:not([disabled]):has-text("Next")');
      await page.waitForTimeout(500);
      
      // Check if we moved to the next step (Education)
      const educationTitle = await page.$eval('h2', el => el.textContent);
      
      if (educationTitle.includes('Education Background')) {
        logResult('Volunteer application form navigation works', 'PASS');
      } else {
        logResult('Volunteer application form navigation works', 'FAIL', 'Could not navigate to next step');
      }
    } catch (error) {
      logResult('Volunteer application form navigation works', 'FAIL', error.message);
    }
    
    // Test 6: Static cards display correctly
    try {
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      
      // Check if static cards are displayed
      const cardTitles = ['Education & Training', 'Career Development', 'Social Integration', 'Marketplace'];
      let allCardsFound = true;
      
      for (const title of cardTitles) {
        const cardTitle = await page.$(`text/${title}`);
        if (!cardTitle) {
          allCardsFound = false;
          break;
        }
      }
      
      if (allCardsFound) {
        logResult('Static cards display correctly', 'PASS');
      } else {
        logResult('Static cards display correctly', 'FAIL', 'Not all card titles found');
      }
    } catch (error) {
      logResult('Static cards display correctly', 'FAIL', error.message);
    }
    
    // Test 7: Responsive design
    try {
      // Test mobile view
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      
      // Check if mobile menu button is visible
      const mobileMenuButton = await page.$('button[aria-label="menu"]');
      
      if (mobileMenuButton) {
        logResult('Responsive design - Mobile view', 'PASS');
      } else {
        logResult('Responsive design - Mobile view', 'FAIL', 'Mobile menu button not found');
      }
      
      // Test tablet view
      await page.setViewport({ width: 768, height: 1024 });
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      
      // Reset viewport
      await page.setViewport({ 
        width: config.viewportWidth, 
        height: config.viewportHeight 
      });
    } catch (error) {
      logResult('Responsive design test', 'FAIL', error.message);
    }
    
    // Add more tests as needed...
    
  } catch (error) {
    console.error(chalk.red(`Test execution error: ${error.message}`));
  } finally {
    await browser.close();
    
    // Print summary
    console.log(chalk.blue('\nTest Summary:'));
    console.log(chalk.green(`Passed: ${testResults.passed}`));
    console.log(chalk.red(`Failed: ${testResults.failed}`));
    console.log(chalk.yellow(`Skipped: ${testResults.skipped}`));
    
    // Save results
    saveTestResults();
  }
}

// Run the tests
runTests().catch(console.error);
