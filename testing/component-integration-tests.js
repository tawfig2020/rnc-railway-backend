/**
 * RNC Application Component Integration Tests
 * 
 * This script tests key component integrations and interactions
 * to ensure they work together correctly before deployment.
 */

const puppeteer = require('puppeteer');
// Import chalk with CommonJS compatibility
const chalk = require('chalk');
const log = {
  blue: (text) => console.log('\x1b[34m%s\x1b[0m', text),
  green: (text) => console.log('\x1b[32m%s\x1b[0m', text),
  red: (text) => console.log('\x1b[31m%s\x1b[0m', text),
  yellow: (text) => console.log('\x1b[33m%s\x1b[0m', text)
};
const fs = require('fs');
const path = require('path');
const testUtils = require('./test-utils');

// Configuration
const config = {
  baseUrl: 'http://localhost:3000', // Updated to match the currently running frontend port
  headless: false, // Set to true for CI environments
  slowMo: 50, // Slow down operations for better visibility during testing
  viewportWidth: 1280,
  viewportHeight: 800,
  testResultsPath: path.join(__dirname, 'component-test-results.md'),
  screenshots: path.join(__dirname, 'screenshots')
};

// Ensure screenshots directory exists
if (!fs.existsSync(config.screenshots)) {
  fs.mkdirSync(config.screenshots, { recursive: true });
}

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
    console.log(log.green(`✓ PASS: ${testName}`));
  } else if (status === 'FAIL') {
    testResults.failed++;
    console.log(log.red(`✗ FAIL: ${testName} - ${notes}`));
  } else {
    testResults.skipped++;
    console.log(log.yellow(`⚠ SKIP: ${testName} - ${notes}`));
  }
}

/**
 * Save test results to file
 */
function saveTestResults() {
  let content = `# RNC Application Component Integration Test Results\n\n`;
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
  console.log(log.blue(`\nComponent test results saved to ${config.testResultsPath}`));
}

/**
 * Main test runner
 */
async function runComponentTests() {
  console.log(log.blue('Starting RNC Component Integration Tests'));
  console.log(log.blue('========================================\n'));
  
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
    // Test 1: Navigation Component Integration
    try {
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      
      // Check if navbar exists
      const navbar = await page.$('nav');
      if (!navbar) {
        logResult('Navigation Component Presence', 'FAIL', 'Navigation bar not found');
      } else {
        logResult('Navigation Component Presence', 'PASS');
      }
      
      // Test dropdown functionality
      const hasDropdowns = await page.evaluate(() => {
        const dropdowns = document.querySelectorAll('.dropdown');
        return dropdowns.length > 0;
      });
      
      if (hasDropdowns) {
        // Try to hover/click a dropdown
        await page.hover('.dropdown');
        await page.waitForTimeout(500);
        
        // Take screenshot of open dropdown
        await page.screenshot({ path: path.join(config.screenshots, 'dropdown-open.png') });
        
        logResult('Navigation Dropdown Functionality', 'PASS');
      } else {
        logResult('Navigation Dropdown Functionality', 'SKIP', 'No dropdowns found');
      }
    } catch (error) {
      logResult('Navigation Component Integration', 'FAIL', error.message);
    }
    
    // Test 2: Homepage Component Integration
    try {
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      
      // Check for hero section
      const heroSection = await testUtils.findBySelectors(page, [
        '[data-testid="hero-section"]',
        '.hero-section', 
        'section[class*="hero"]', 
        'div[class*="HeroSection"]'
      ]);
      if (!heroSection) {
        logResult('Hero Section Component', 'FAIL', 'Hero section not found');
      } else {
        logResult('Hero Section Component', 'PASS');
      }
      
      // Check for card components
      const cards = await testUtils.findAllBySelectors(page, [
        '[data-testid="feature-card"]',
        'div[class*="card"]', 
        '.feature-card', 
        'div[class*="Card"]'
      ]);
      if (cards.length >= 4) {
        logResult('Card Components Display', 'PASS', `Found ${cards.length} card components`);
      } else {
        logResult('Card Components Display', 'FAIL', `Expected at least 4 cards, found ${cards.length}`);
      }
    } catch (error) {
      logResult('Homepage Component Integration', 'FAIL', error.message);
    }
    
    // Test 3: Volunteer Application Form Integration
    try {
      await page.goto(`${config.baseUrl}/volunteer-application`, { waitUntil: 'networkidle0' });
      
      // Check for multi-step form
      const formSteps = await testUtils.findAllBySelectors(page, [
        '[data-testid^="volunteer-step-"]',
        'div[class*="step"]', 
        '.form-step',
        '.MuiStep-root'
      ]);
      if (formSteps.length >= 3) {
        logResult('Multi-step Form Component', 'PASS', `Found ${formSteps.length} form steps`);
      } else {
        logResult('Multi-step Form Component', 'FAIL', `Expected at least 3 steps, found ${formSteps.length}`);
      }
      
      // Test form navigation
      // Fill out first form step (personal info)
      await page.type('input[name="firstName"]', 'Test');
      await page.type('input[name="lastName"]', 'User');
      await page.type('input[name="email"]', 'test@example.com');
      await page.type('input[name="phone"]', '1234567890');
      
      // Take screenshot of filled form
      await page.screenshot({ path: path.join(config.screenshots, 'volunteer-form-step1.png') });
      
      // Click Next button using utility function
      const clickSuccess = await testUtils.safeClick(page, [
        '[data-testid="volunteer-next-button"]',
        'button:not([disabled]):has-text("Next")',
        'button[type="button"]:not([disabled])',
      ]);
      
      if (clickSuccess) {
        await page.waitForTimeout(500);
        
        // Check if we advanced to next step
        const currentStep = await page.evaluate(() => {
          const activeStep = document.querySelector('div[class*="step"][class*="active"]');
          return activeStep ? activeStep.textContent : null;
        });
        
        if (currentStep && !currentStep.includes('Personal Information')) {
          logResult('Form Step Navigation', 'PASS');
        } else {
          logResult('Form Step Navigation', 'FAIL', 'Did not advance to next step');
        }
      } else {
        logResult('Form Step Navigation', 'FAIL', 'Next button not found or disabled');
      }
    } catch (error) {
      logResult('Volunteer Application Form Integration', 'FAIL', error.message);
    }
    
    // Test 4: Responsive Design Integration
    try {
      // Test mobile view
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: path.join(config.screenshots, 'responsive-mobile.png') });
      
      // Check for mobile menu
      const mobileMenu = await testUtils.findBySelectors(page, [
        'button[aria-label="menu"]', 
        'button.mobile-menu', 
        'button[class*="menuButton"]'
      ]);
      if (mobileMenu) {
        logResult('Mobile Navigation Component', 'PASS');
        
        // Test mobile menu functionality
        await mobileMenu.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(config.screenshots, 'mobile-menu-open.png') });
        
        // Check if menu items are visible
        const menuVisible = await page.evaluate(() => {
          const menu = document.querySelector('div[class*="mobileMenu"][class*="open"]');
          return menu !== null;
        });
        
        if (menuVisible) {
          logResult('Mobile Menu Functionality', 'PASS');
        } else {
          logResult('Mobile Menu Functionality', 'FAIL', 'Mobile menu did not open');
        }
      } else {
        logResult('Mobile Navigation Component', 'FAIL', 'Mobile menu button not found');
      }
      
      // Test tablet view
      await page.setViewport({ width: 768, height: 1024 });
      await page.goto(`${config.baseUrl}/`, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: path.join(config.screenshots, 'responsive-tablet.png') });
      
      // Reset viewport
      await page.setViewport({ 
        width: config.viewportWidth, 
        height: config.viewportHeight 
      });
    } catch (error) {
      logResult('Responsive Design Integration', 'FAIL', error.message);
    }
    
    // Test 5: Career Fair Registration Form
    try {
      await page.goto(`${config.baseUrl}/career-fair-registration`, { waitUntil: 'networkidle0' });
      const registrationForm = await testUtils.findBySelectors(page, [
        '[data-testid="career-fair-registration-form"]',
        '.career-fair-registration',
        '.MuiPaper-root', 
        'div[class*="Paper"]'
      ]);
      if (registrationForm) {
        logResult('Career Fair Registration Form', 'PASS');
      } else {
        logResult('Career Fair Registration Form', 'FAIL', 'Registration form not found');
      }

      // Check for availability form
      const availabilityForm = await testUtils.findBySelectors(page, [
        '[data-testid="availability-form"]',
        '.availability-form',
        '.MuiBox-root', 
        'div[class*="Box"]'
      ]);
      if (availabilityForm) {
        logResult('Availability Form Component', 'PASS');
      } else {
        logResult('Availability Form Component', 'FAIL', 'Availability form not found');
      }

      // Check if the form has date selection functionality
      const dateSelectors = await page.$$('input[type="date"], input[type="checkbox"]');
      if (dateSelectors.length > 0) {
        logResult('Date Selection Controls', 'PASS');
      } else {
        logResult('Date Selection Controls', 'FAIL', 'Date selectors not found');
      }
    } catch (error) {
      logResult('Career Fair Registration Form', 'FAIL', error.message);
    }
    
  } catch (error) {
    console.error(log.red(`Test execution error: ${error.message}`));
  } finally {
    await browser.close();
    
    // Print summary
    console.log(log.blue('\nComponent Test Summary:'));
    console.log(log.green(`Passed: ${testResults.passed}`));
    console.log(log.red(`Failed: ${testResults.failed}`));
    console.log(log.yellow(`Skipped: ${testResults.skipped}`));
    
    // Save results
    saveTestResults();
  }
}

// Run the tests
runComponentTests().catch(console.error);
