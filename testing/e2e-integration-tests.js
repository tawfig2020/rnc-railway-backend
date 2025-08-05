/**
 * End-to-End Integration Tests for RNC Platform
 * Tests complete user flows: registration, purchasing, donation
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:5000',
  timeout: 30000,
  viewport: { width: 1280, height: 720 },
  headless: false, // Set to true for CI/CD
  slowMo: 100 // Slow down actions for better visibility
};

// Test data
const TEST_DATA = {
  user: {
    firstName: 'Test',
    lastName: 'User',
    email: `test.user.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    phone: '+1234567890',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    country: 'Test Country'
  },
  donation: {
    amount: '25',
    cardNumber: '4242424242424242',
    expiryDate: '12/25',
    cvc: '123',
    cardholderName: 'Test User'
  },
  product: {
    name: 'Test Product',
    price: 15.99
  }
};

class E2ETestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
  }

  async setup() {
    console.log(chalk.blue('🚀 Setting up E2E test environment...'));
    
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      slowMo: TEST_CONFIG.slowMo,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport(TEST_CONFIG.viewport);
    
    // Set longer timeout for all operations
    this.page.setDefaultTimeout(TEST_CONFIG.timeout);
    
    // Listen for console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(chalk.red(`Console Error: ${msg.text()}`));
      }
    });

    // Listen for page errors
    this.page.on('pageerror', error => {
      console.log(chalk.red(`Page Error: ${error.message}`));
    });
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runTest(testName, testFunction) {
    console.log(chalk.yellow(`\n🧪 Running test: ${testName}`));
    const startTime = Date.now();
    
    try {
      await testFunction();
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✅ ${testName} - PASSED (${duration}ms)`));
      this.testResults.push({ name: testName, status: 'PASSED', duration });
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(chalk.red(`❌ ${testName} - FAILED (${duration}ms)`));
      console.log(chalk.red(`Error: ${error.message}`));
      this.testResults.push({ name: testName, status: 'FAILED', duration, error: error.message });
      return false;
    }
  }

  // Helper methods
  async waitForNavigation(url) {
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    const currentUrl = this.page.url();
    if (url && !currentUrl.includes(url)) {
      throw new Error(`Expected to navigate to ${url}, but went to ${currentUrl}`);
    }
  }

  async fillForm(formData) {
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.type(selector, value);
    }
  }

  async takeScreenshot(name) {
    const screenshotPath = path.join(__dirname, 'screenshots', `${name}-${Date.now()}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(chalk.blue(`📸 Screenshot saved: ${screenshotPath}`));
  }

  // Test: Complete User Registration Flow
  async testUserRegistration() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/register`);
    await this.page.waitForSelector('form');

    // Fill registration form
    const formData = {
      'input[name="firstName"]': TEST_DATA.user.firstName,
      'input[name="lastName"]': TEST_DATA.user.lastName,
      'input[name="email"]': TEST_DATA.user.email,
      'input[name="password"]': TEST_DATA.user.password,
      'input[name="confirmPassword"]': TEST_DATA.user.password,
      'input[name="phone"]': TEST_DATA.user.phone
    };

    await this.fillForm(formData);
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await this.page.waitForSelector('.success-message, .alert-success', { timeout: 10000 });
    
    await this.takeScreenshot('registration-success');
  }

  // Test: User Login Flow
  async testUserLogin() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/login`);
    await this.page.waitForSelector('form');

    // Fill login form
    await this.page.type('input[name="email"]', TEST_DATA.user.email);
    await this.page.type('input[name="password"]', TEST_DATA.user.password);
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect to profile or dashboard
    await this.waitForNavigation();
    
    // Verify user is logged in (check for logout button or user menu)
    await this.page.waitForSelector('[data-testid="user-menu"], .logout-button, .user-profile', { timeout: 10000 });
    
    await this.takeScreenshot('login-success');
  }

  // Test: Donation Flow
  async testDonationFlow() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/donate`);
    await this.page.waitForSelector('.donation-form, form');

    // Select donation amount
    await this.page.click(`input[value="${TEST_DATA.donation.amount}"], button[data-amount="${TEST_DATA.donation.amount}"]`);
    
    // Fill donor information if required
    const donorInfoExists = await this.page.$('input[name="donorName"]');
    if (donorInfoExists) {
      await this.page.type('input[name="donorName"]', `${TEST_DATA.user.firstName} ${TEST_DATA.user.lastName}`);
      await this.page.type('input[name="donorEmail"]', TEST_DATA.user.email);
    }

    // Proceed to payment
    await this.page.click('button[type="submit"], .proceed-payment, .donate-button');
    
    // Wait for payment form or Stripe/PayPal integration
    await this.page.waitForSelector('.payment-form, #card-element, .paypal-buttons', { timeout: 15000 });
    
    await this.takeScreenshot('donation-payment-form');
    
    // Note: We won't complete actual payment in tests, but verify form loads
    console.log(chalk.blue('💳 Payment form loaded successfully'));
  }

  // Test: Marketplace Product Purchase Flow
  async testMarketplacePurchase() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/marketplace`);
    await this.page.waitForSelector('.product-card, .marketplace-item');

    // Click on first product
    const firstProduct = await this.page.$('.product-card:first-child, .marketplace-item:first-child');
    if (firstProduct) {
      await firstProduct.click();
      await this.waitForNavigation();
    } else {
      // If no products, go to a specific product page
      await this.page.goto(`${TEST_CONFIG.baseUrl}/marketplace/products/1`);
    }

    // Add to cart
    const addToCartButton = await this.page.$('button:contains("Add to Cart"), .add-to-cart, button[data-action="add-to-cart"]');
    if (addToCartButton) {
      await addToCartButton.click();
      
      // Wait for cart update confirmation
      await this.page.waitForSelector('.cart-notification, .success-message', { timeout: 5000 });
    }

    // Go to cart
    await this.page.goto(`${TEST_CONFIG.baseUrl}/cart`);
    await this.page.waitForSelector('.cart-item, .shopping-cart');

    // Proceed to checkout
    const checkoutButton = await this.page.$('button:contains("Checkout"), .checkout-button');
    if (checkoutButton) {
      await checkoutButton.click();
      await this.waitForNavigation();
      
      // Fill shipping information
      const shippingForm = await this.page.$('.shipping-form, .checkout-form');
      if (shippingForm) {
        const shippingData = {
          'input[name="address"]': TEST_DATA.user.address,
          'input[name="city"]': TEST_DATA.user.city,
          'input[name="state"]': TEST_DATA.user.state,
          'input[name="zipCode"]': TEST_DATA.user.zipCode
        };
        
        await this.fillForm(shippingData);
        await this.takeScreenshot('checkout-form');
      }
    }

    console.log(chalk.blue('🛒 Marketplace purchase flow completed'));
  }

  // Test: Volunteer Application Flow
  async testVolunteerApplication() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/volunteer-application`);
    await this.page.waitForSelector('form, .volunteer-form');

    // Fill basic information
    const basicInfo = {
      'input[name="firstName"]': TEST_DATA.user.firstName,
      'input[name="lastName"]': TEST_DATA.user.lastName,
      'input[name="email"]': TEST_DATA.user.email,
      'input[name="phone"]': TEST_DATA.user.phone
    };

    await this.fillForm(basicInfo);

    // Navigate through form steps if it's a multi-step form
    const nextButton = await this.page.$('button:contains("Next"), .next-button');
    if (nextButton) {
      await nextButton.click();
      await this.page.waitForTimeout(1000);
    }

    // Submit application
    const submitButton = await this.page.$('button[type="submit"], .submit-button');
    if (submitButton) {
      await submitButton.click();
      await this.page.waitForSelector('.success-message, .confirmation', { timeout: 10000 });
    }

    await this.takeScreenshot('volunteer-application-success');
  }

  // Test: Navigation and Links
  async testNavigation() {
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/about', name: 'About' },
      { url: '/our-programs', name: 'Our Programs' },
      { url: '/marketplace', name: 'Marketplace' },
      { url: '/blog', name: 'Blog' },
      { url: '/contact', name: 'Contact' }
    ];

    for (const pageInfo of pages) {
      await this.page.goto(`${TEST_CONFIG.baseUrl}${pageInfo.url}`);
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      // Check if page loaded without errors
      const title = await this.page.title();
      console.log(chalk.blue(`📄 ${pageInfo.name}: ${title}`));
      
      // Check for common error indicators
      const errorElements = await this.page.$$('.error, .not-found, [data-testid="error"]');
      if (errorElements.length > 0) {
        throw new Error(`Error elements found on ${pageInfo.name} page`);
      }
    }
  }

  // Test: Form Validations
  async testFormValidations() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/register`);
    await this.page.waitForSelector('form');

    // Try to submit empty form
    await this.page.click('button[type="submit"]');
    
    // Check for validation messages
    await this.page.waitForSelector('.error, .invalid-feedback, .field-error', { timeout: 5000 });
    
    // Fill invalid email
    await this.page.type('input[name="email"]', 'invalid-email');
    await this.page.click('button[type="submit"]');
    
    // Check for email validation
    const emailError = await this.page.$('.email-error, [data-field="email"] .error');
    if (!emailError) {
      throw new Error('Email validation not working');
    }

    await this.takeScreenshot('form-validation');
  }

  // Main test runner
  async runAllTests() {
    console.log(chalk.blue('\n🎯 Starting End-to-End Integration Tests'));
    console.log(chalk.blue('==========================================\n'));

    await this.setup();

    const tests = [
      { name: 'Navigation and Page Loading', fn: () => this.testNavigation() },
      { name: 'User Registration Flow', fn: () => this.testUserRegistration() },
      { name: 'User Login Flow', fn: () => this.testUserLogin() },
      { name: 'Form Validations', fn: () => this.testFormValidations() },
      { name: 'Donation Flow', fn: () => this.testDonationFlow() },
      { name: 'Marketplace Purchase Flow', fn: () => this.testMarketplacePurchase() },
      { name: 'Volunteer Application Flow', fn: () => this.testVolunteerApplication() }
    ];

    let passedTests = 0;
    let failedTests = 0;

    for (const test of tests) {
      const result = await this.runTest(test.name, test.fn);
      if (result) {
        passedTests++;
      } else {
        failedTests++;
      }
    }

    await this.teardown();

    // Print summary
    console.log(chalk.blue('\n📊 Test Summary'));
    console.log(chalk.blue('================'));
    console.log(chalk.green(`✅ Passed: ${passedTests}`));
    console.log(chalk.red(`❌ Failed: ${failedTests}`));
    console.log(chalk.blue(`📈 Total: ${passedTests + failedTests}`));

    if (failedTests > 0) {
      console.log(chalk.red('\n❌ Some tests failed. Check the logs above for details.'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n🎉 All tests passed!'));
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testRunner = new E2ETestRunner();
  testRunner.runAllTests().catch(error => {
    console.error(chalk.red('Test runner failed:'), error);
    process.exit(1);
  });
}

module.exports = E2ETestRunner;
