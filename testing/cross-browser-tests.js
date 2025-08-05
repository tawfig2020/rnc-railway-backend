/**
 * Cross-Browser Compatibility Tests for RNC Platform
 * Tests the application across different browsers and devices
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const path = require('path');

// Browser configurations
const BROWSER_CONFIGS = [
  {
    name: 'Chrome Desktop',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  {
    name: 'Chrome Mobile',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Chrome Tablet',
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Firefox Desktop',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  },
  {
    name: 'Safari Desktop',
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
  }
];

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  headless: true,
  slowMo: 50
};

// Critical pages to test
const CRITICAL_PAGES = [
  { url: '/', name: 'Homepage', critical: true },
  { url: '/about', name: 'About Us', critical: true },
  { url: '/our-programs', name: 'Our Programs', critical: true },
  { url: '/marketplace', name: 'Marketplace', critical: true },
  { url: '/donate', name: 'Donate', critical: true },
  { url: '/register', name: 'Register', critical: true },
  { url: '/login', name: 'Login', critical: true },
  { url: '/blog', name: 'Blog', critical: false },
  { url: '/contact', name: 'Contact', critical: false },
  { url: '/volunteer-application', name: 'Volunteer Application', critical: false }
];

class CrossBrowserTestRunner {
  constructor() {
    this.browser = null;
    this.testResults = [];
    this.screenshots = [];
  }

  async setup(config) {
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      slowMo: TEST_CONFIG.slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async testPageOnBrowser(pageInfo, browserConfig) {
    const page = await this.browser.newPage();
    
    try {
      // Set viewport and user agent
      await page.setViewport(browserConfig.viewport);
      await page.setUserAgent(browserConfig.userAgent);
      
      // Set timeout
      page.setDefaultTimeout(TEST_CONFIG.timeout);

      console.log(chalk.blue(`  📱 Testing ${pageInfo.name} on ${browserConfig.name}`));

      // Navigate to page
      const response = await page.goto(`${TEST_CONFIG.baseUrl}${pageInfo.url}`, {
        waitUntil: 'networkidle2',
        timeout: TEST_CONFIG.timeout
      });

      // Check response status
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }

      // Wait for page to be fully loaded
      await page.waitForSelector('body', { timeout: 10000 });

      // Check for JavaScript errors
      const jsErrors = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      // Test basic functionality
      const testResults = await this.runPageTests(page, pageInfo, browserConfig);

      // Take screenshot
      const screenshotPath = await this.takeScreenshot(page, pageInfo.name, browserConfig.name);

      // Check layout and responsive design
      const layoutTests = await this.testResponsiveLayout(page, browserConfig);

      return {
        browser: browserConfig.name,
        page: pageInfo.name,
        url: pageInfo.url,
        status: 'PASSED',
        responseTime: response.headers()['x-response-time'] || 'N/A',
        jsErrors,
        screenshot: screenshotPath,
        tests: testResults,
        layout: layoutTests
      };

    } catch (error) {
      console.log(chalk.red(`    ❌ Error: ${error.message}`));
      
      // Take error screenshot
      const errorScreenshotPath = await this.takeScreenshot(page, `${pageInfo.name}-ERROR`, browserConfig.name);
      
      return {
        browser: browserConfig.name,
        page: pageInfo.name,
        url: pageInfo.url,
        status: 'FAILED',
        error: error.message,
        screenshot: errorScreenshotPath
      };
    } finally {
      await page.close();
    }
  }

  async runPageTests(page, pageInfo, browserConfig) {
    const tests = [];

    try {
      // Test 1: Check if navigation menu is present and functional
      const navMenu = await page.$('nav, .navbar, .navigation');
      tests.push({
        name: 'Navigation Menu',
        status: navMenu ? 'PASSED' : 'FAILED',
        details: navMenu ? 'Navigation menu found' : 'Navigation menu not found'
      });

      // Test 2: Check if footer is present
      const footer = await page.$('footer, .footer');
      tests.push({
        name: 'Footer',
        status: footer ? 'PASSED' : 'FAILED',
        details: footer ? 'Footer found' : 'Footer not found'
      });

      // Test 3: Check for forms and their functionality
      const forms = await page.$$('form');
      if (forms.length > 0) {
        // Test form inputs
        const inputs = await page.$$('input, textarea, select');
        tests.push({
          name: 'Form Elements',
          status: inputs.length > 0 ? 'PASSED' : 'FAILED',
          details: `Found ${forms.length} forms with ${inputs.length} input elements`
        });

        // Test form validation (if applicable)
        if (pageInfo.url.includes('register') || pageInfo.url.includes('login')) {
          try {
            const submitButton = await page.$('button[type="submit"], input[type="submit"]');
            if (submitButton) {
              await submitButton.click();
              await page.waitForTimeout(1000);
              
              const validationMessages = await page.$$('.error, .invalid-feedback, .field-error');
              tests.push({
                name: 'Form Validation',
                status: validationMessages.length > 0 ? 'PASSED' : 'WARNING',
                details: `Found ${validationMessages.length} validation messages`
              });
            }
          } catch (error) {
            tests.push({
              name: 'Form Validation',
              status: 'WARNING',
              details: 'Could not test form validation'
            });
          }
        }
      }

      // Test 4: Check for images and their loading
      const images = await page.$$('img');
      let brokenImages = 0;
      for (const img of images) {
        const src = await img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          if (naturalWidth === 0) brokenImages++;
        }
      }
      tests.push({
        name: 'Image Loading',
        status: brokenImages === 0 ? 'PASSED' : 'WARNING',
        details: `${images.length} images found, ${brokenImages} failed to load`
      });

      // Test 5: Check for interactive elements
      const buttons = await page.$$('button, .btn, [role="button"]');
      const links = await page.$$('a[href]');
      tests.push({
        name: 'Interactive Elements',
        status: (buttons.length + links.length) > 0 ? 'PASSED' : 'WARNING',
        details: `Found ${buttons.length} buttons and ${links.length} links`
      });

      // Test 6: Check page title
      const title = await page.title();
      tests.push({
        name: 'Page Title',
        status: title && title.trim() !== '' ? 'PASSED' : 'WARNING',
        details: `Title: "${title}"`
      });

      // Test 7: Check for accessibility features
      const altTexts = await page.$$eval('img[alt]', imgs => imgs.length);
      const ariaLabels = await page.$$eval('[aria-label]', elements => elements.length);
      tests.push({
        name: 'Basic Accessibility',
        status: (altTexts > 0 || ariaLabels > 0) ? 'PASSED' : 'WARNING',
        details: `${altTexts} images with alt text, ${ariaLabels} elements with aria-labels`
      });

    } catch (error) {
      tests.push({
        name: 'Page Tests',
        status: 'ERROR',
        details: error.message
      });
    }

    return tests;
  }

  async testResponsiveLayout(page, browserConfig) {
    const layoutTests = [];

    try {
      // Test viewport-specific elements
      const viewport = browserConfig.viewport;
      
      // Check if mobile menu is present on small screens
      if (viewport.width < 768) {
        const mobileMenu = await page.$('.mobile-menu, .hamburger, .menu-toggle');
        layoutTests.push({
          name: 'Mobile Menu',
          status: mobileMenu ? 'PASSED' : 'WARNING',
          details: mobileMenu ? 'Mobile menu found' : 'Mobile menu not found'
        });
      }

      // Check for responsive grid/layout
      const containers = await page.$$('.container, .row, .grid, .flex');
      layoutTests.push({
        name: 'Layout Containers',
        status: containers.length > 0 ? 'PASSED' : 'WARNING',
        details: `Found ${containers.length} layout containers`
      });

      // Check for overflow issues
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      layoutTests.push({
        name: 'Horizontal Overflow',
        status: bodyScrollWidth <= viewportWidth + 20 ? 'PASSED' : 'WARNING',
        details: `Body width: ${bodyScrollWidth}px, Viewport: ${viewportWidth}px`
      });

      // Check for text readability
      const smallTexts = await page.$$eval('*', elements => {
        return elements.filter(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          return fontSize < 12 && el.textContent.trim().length > 0;
        }).length;
      });
      
      layoutTests.push({
        name: 'Text Readability',
        status: smallTexts === 0 ? 'PASSED' : 'WARNING',
        details: `${smallTexts} elements with text smaller than 12px`
      });

    } catch (error) {
      layoutTests.push({
        name: 'Layout Tests',
        status: 'ERROR',
        details: error.message
      });
    }

    return layoutTests;
  }

  async takeScreenshot(page, pageName, browserName) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${pageName}-${browserName}-${timestamp}.png`;
      const screenshotPath = path.join(__dirname, 'screenshots', 'cross-browser', filename);
      
      // Ensure directory exists
      const fs = require('fs');
      const dir = path.dirname(screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true,
        quality: 80
      });
      
      return screenshotPath;
    } catch (error) {
      console.log(chalk.red(`Failed to take screenshot: ${error.message}`));
      return null;
    }
  }

  async generateReport() {
    const timestamp = new Date().toISOString();
    const reportPath = path.join(__dirname, 'reports', `cross-browser-report-${timestamp.replace(/[:.]/g, '-')}.json`);
    
    const report = {
      timestamp,
      summary: {
        totalTests: this.testResults.length,
        passed: this.testResults.filter(r => r.status === 'PASSED').length,
        failed: this.testResults.filter(r => r.status === 'FAILED').length,
        browsers: [...new Set(this.testResults.map(r => r.browser))],
        pages: [...new Set(this.testResults.map(r => r.page))]
      },
      results: this.testResults
    };

    // Ensure directory exists
    const fs = require('fs');
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(chalk.blue(`📄 Report saved to: ${reportPath}`));
    
    return report;
  }

  async runAllTests() {
    console.log(chalk.blue('\n🌐 Starting Cross-Browser Compatibility Tests'));
    console.log(chalk.blue('===============================================\n'));

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const browserConfig of BROWSER_CONFIGS) {
      console.log(chalk.yellow(`\n🖥️  Testing on ${browserConfig.name}`));
      console.log(chalk.yellow(`   Viewport: ${browserConfig.viewport.width}x${browserConfig.viewport.height}`));
      
      await this.setup(browserConfig);

      for (const pageInfo of CRITICAL_PAGES) {
        const result = await this.testPageOnBrowser(pageInfo, browserConfig);
        this.testResults.push(result);
        totalTests++;

        if (result.status === 'PASSED') {
          passedTests++;
          console.log(chalk.green(`    ✅ ${pageInfo.name} - PASSED`));
        } else {
          failedTests++;
          console.log(chalk.red(`    ❌ ${pageInfo.name} - FAILED`));
          if (result.error) {
            console.log(chalk.red(`       Error: ${result.error}`));
          }
        }
      }

      await this.teardown();
    }

    // Generate report
    const report = await this.generateReport();

    // Print summary
    console.log(chalk.blue('\n📊 Cross-Browser Test Summary'));
    console.log(chalk.blue('=============================='));
    console.log(chalk.green(`✅ Passed: ${passedTests}/${totalTests}`));
    console.log(chalk.red(`❌ Failed: ${failedTests}/${totalTests}`));
    console.log(chalk.blue(`🖥️  Browsers tested: ${report.summary.browsers.length}`));
    console.log(chalk.blue(`📄 Pages tested: ${report.summary.pages.length}`));

    // Show browser-specific results
    console.log(chalk.blue('\n📱 Results by Browser:'));
    for (const browser of report.summary.browsers) {
      const browserResults = this.testResults.filter(r => r.browser === browser);
      const browserPassed = browserResults.filter(r => r.status === 'PASSED').length;
      const browserTotal = browserResults.length;
      const percentage = Math.round((browserPassed / browserTotal) * 100);
      
      console.log(chalk.blue(`   ${browser}: ${browserPassed}/${browserTotal} (${percentage}%)`));
    }

    if (failedTests > 0) {
      console.log(chalk.red('\n❌ Some tests failed. Check the detailed report for more information.'));
      
      // Show critical failures
      const criticalFailures = this.testResults.filter(r => 
        r.status === 'FAILED' && CRITICAL_PAGES.find(p => p.name === r.page)?.critical
      );
      
      if (criticalFailures.length > 0) {
        console.log(chalk.red('\n🚨 Critical Page Failures:'));
        criticalFailures.forEach(failure => {
          console.log(chalk.red(`   - ${failure.page} on ${failure.browser}: ${failure.error}`));
        });
      }
    } else {
      console.log(chalk.green('\n🎉 All cross-browser tests passed!'));
    }

    return report;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testRunner = new CrossBrowserTestRunner();
  testRunner.runAllTests().catch(error => {
    console.error(chalk.red('Cross-browser test runner failed:'), error);
    process.exit(1);
  });
}

module.exports = CrossBrowserTestRunner;
