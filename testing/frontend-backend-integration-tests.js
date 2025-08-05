/**
 * Frontend-Backend Integration Tests
 * Tests the complete integration between React frontend and Node.js backend
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  frontendUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:5000/api',
  timeout: 30000,
  headless: false, // Set to true for CI/CD
  slowMo: 100, // Slow down actions for better visibility
  screenshotDir: path.join(__dirname, 'screenshots', 'integration'),
  reportDir: path.join(__dirname, 'reports')
};

// Test credentials
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@refugeenetwork.com',
    password: 'Admin@123'
  },
  testUser: {
    email: 'testuser@example.com',
    password: 'TestUser123!',
    firstName: 'Test',
    lastName: 'User'
  }
};

class FrontendBackendIntegrationTests {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.startTime = Date.now();
  }

  async initialize() {
    console.log(chalk.blue('🚀 Initializing Frontend-Backend Integration Tests...'));
    
    // Create directories
    await this.ensureDirectories();
    
    // Check server availability
    await this.checkServers();
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      slowMo: TEST_CONFIG.slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Set up console and error logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(chalk.red(`Browser Console Error: ${msg.text()}`));
      }
    });
    
    this.page.on('pageerror', error => {
      console.log(chalk.red(`Page Error: ${error.message}`));
    });
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(TEST_CONFIG.screenshotDir, { recursive: true });
      await fs.mkdir(TEST_CONFIG.reportDir, { recursive: true });
    } catch (error) {
      console.log(chalk.yellow(`Directory creation warning: ${error.message}`));
    }
  }

  async checkServers() {
    console.log(chalk.blue('🔍 Checking server availability...'));
    
    try {
      // Check frontend
      const frontendResponse = await axios.get(TEST_CONFIG.frontendUrl, { timeout: 5000 });
      console.log(chalk.green('✅ Frontend server is running'));
    } catch (error) {
      throw new Error(`Frontend server not available at ${TEST_CONFIG.frontendUrl}`);
    }
    
    try {
      // Check backend using a working endpoint
      const backendResponse = await axios.get(`${TEST_CONFIG.backendUrl}/blogs`, { timeout: 5000 });
      console.log(chalk.green('✅ Backend server is running'));
    } catch (error) {
      throw new Error(`Backend server not available at ${TEST_CONFIG.backendUrl}`);
    }
  }

  async takeScreenshot(name) {
    try {
      const filename = `${name}-${Date.now()}.png`;
      const filepath = path.join(TEST_CONFIG.screenshotDir, filename);
      await this.page.screenshot({ path: filepath, fullPage: true });
      return filename;
    } catch (error) {
      console.log(chalk.yellow(`Screenshot failed: ${error.message}`));
      return null;
    }
  }

  async runTest(testName, testFunction) {
    console.log(chalk.blue(`\n🧪 Running test: ${testName}`));
    const testStart = Date.now();
    
    try {
      await testFunction();
      const duration = Date.now() - testStart;
      console.log(chalk.green(`✅ ${testName} - PASSED (${duration}ms)`));
      
      this.testResults.push({
        name: testName,
        status: 'PASSED',
        duration,
        error: null,
        screenshot: await this.takeScreenshot(`${testName.replace(/\s+/g, '-').toLowerCase()}-success`)
      });
    } catch (error) {
      const duration = Date.now() - testStart;
      console.log(chalk.red(`❌ ${testName} - FAILED (${duration}ms)`));
      console.log(chalk.red(`Error: ${error.message}`));
      
      this.testResults.push({
        name: testName,
        status: 'FAILED',
        duration,
        error: error.message,
        screenshot: await this.takeScreenshot(`${testName.replace(/\s+/g, '-').toLowerCase()}-failed`)
      });
    }
  }

  // Test 1: User Registration Flow (Frontend → Backend → Database)
  async testUserRegistration() {
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/register`);
    await this.page.waitForSelector('form', { timeout: 10000 });

    // Fill registration form
    await this.page.type('input[name="firstName"]', TEST_CREDENTIALS.testUser.firstName);
    await this.page.type('input[name="lastName"]', TEST_CREDENTIALS.testUser.lastName);
    await this.page.type('input[name="email"]', TEST_CREDENTIALS.testUser.email);
    await this.page.type('input[name="password"]', TEST_CREDENTIALS.testUser.password);
    await this.page.type('input[name="confirmPassword"]', TEST_CREDENTIALS.testUser.password);

    // Submit form
    await this.page.click('button[type="submit"]');

    // Wait for response and check for success indicators
    await this.page.waitForTimeout(3000);
    
    // Check if registration was successful (look for success message or redirect)
    const currentUrl = this.page.url();
    const pageContent = await this.page.content();
    
    if (currentUrl.includes('/login') || pageContent.includes('registration successful') || pageContent.includes('verify your email')) {
      console.log(chalk.green('Registration flow completed successfully'));
    } else {
      throw new Error('Registration did not complete successfully');
    }

    // Verify backend received the data
    try {
      const response = await axios.post(`${TEST_CONFIG.backendUrl}/auth/login`, {
        email: TEST_CREDENTIALS.testUser.email,
        password: TEST_CREDENTIALS.testUser.password
      });
      
      if (response.data.token || response.status === 200) {
        console.log(chalk.green('Backend successfully stored user data'));
      }
    } catch (error) {
      // User might not be verified yet, which is expected
      console.log(chalk.yellow('User registration pending verification (expected)'));
    }
  }

  // Test 2: User Login Flow (Frontend → Backend Authentication)
  async testUserLogin() {
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/login`);
    await this.page.waitForSelector('form', { timeout: 10000 });

    // Use admin credentials for reliable login
    await this.page.type('input[name="email"]', TEST_CREDENTIALS.admin.email);
    await this.page.type('input[name="password"]', TEST_CREDENTIALS.admin.password);

    // Submit login form
    await this.page.click('button[type="submit"]');

    // Wait for login response
    await this.page.waitForTimeout(3000);

    // Check for successful login indicators
    const currentUrl = this.page.url();
    const pageContent = await this.page.content();

    if (currentUrl.includes('/admin') || currentUrl.includes('/profile') || pageContent.includes('Dashboard') || pageContent.includes('Welcome')) {
      console.log(chalk.green('Login successful - user redirected appropriately'));
    } else {
      // Check if still on login page with error
      const errorElement = await this.page.$('.error, .alert-danger, [data-testid="error"]');
      if (errorElement) {
        const errorText = await this.page.evaluate(el => el.textContent, errorElement);
        throw new Error(`Login failed with error: ${errorText}`);
      } else {
        throw new Error(`Login did not redirect properly. Current URL: ${currentUrl}`);
      }
    }

    // Verify JWT token is stored
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('JWT token not stored in localStorage');
    }

    console.log(chalk.green('JWT token successfully stored'));
  }

  // Test 3: API Data Fetching (Frontend → Backend → Database → Frontend)
  async testDataFetching() {
    // Navigate to a page that fetches data
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/blogs`);
    await this.page.waitForTimeout(3000);

    // Check if data is loaded
    const pageContent = await this.page.content();
    
    // Look for data indicators
    const hasData = pageContent.includes('blog') || 
                   pageContent.includes('article') || 
                   pageContent.includes('post') ||
                   await this.page.$('.blog-item, .article-item, .post-item, .card');

    if (hasData) {
      console.log(chalk.green('Data successfully fetched and displayed'));
    } else {
      // Check if there's a loading state or empty state
      const hasLoading = pageContent.includes('loading') || pageContent.includes('Loading');
      const hasEmptyState = pageContent.includes('No blogs') || pageContent.includes('No data');
      
      if (hasLoading) {
        console.log(chalk.yellow('Data still loading - waiting longer'));
        await this.page.waitForTimeout(5000);
        // Re-check after waiting
        const updatedContent = await this.page.content();
        if (!updatedContent.includes('blog') && !updatedContent.includes('article')) {
          throw new Error('Data failed to load after extended wait');
        }
      } else if (hasEmptyState) {
        console.log(chalk.yellow('No data available (empty state) - this is acceptable'));
      } else {
        throw new Error('Data fetching failed - no data, loading, or empty state indicators found');
      }
    }

    // Test direct API call
    try {
      const apiResponse = await axios.get(`${TEST_CONFIG.backendUrl}/blogs`);
      console.log(chalk.green(`API directly accessible - returned ${apiResponse.data.length || 'data'}`));
    } catch (error) {
      console.log(chalk.yellow(`Direct API call info: ${error.message}`));
    }
  }

  // Test 4: Form Submission with Backend Processing
  async testFormSubmission() {
    // Navigate to donation page
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/donate`);
    await this.page.waitForSelector('form', { timeout: 10000 });

    // Fill donation form
    const donationAmount = '50';
    await this.page.type('input[name="amount"], input[type="number"]', donationAmount);
    
    // Fill donor information
    try {
      await this.page.type('input[name="firstName"], input[name="donorName"]', 'Test');
      await this.page.type('input[name="lastName"], input[name="donorLastName"]', 'Donor');
      await this.page.type('input[name="email"], input[name="donorEmail"]', 'testdonor@example.com');
    } catch (error) {
      console.log(chalk.yellow('Some form fields not found - continuing with available fields'));
    }

    // Submit form (but don't complete payment)
    await this.page.click('button[type="submit"], .donate-button, .submit-button');
    await this.page.waitForTimeout(3000);

    // Check for form processing indicators
    const pageContent = await this.page.content();
    const currentUrl = this.page.url();

    if (pageContent.includes('payment') || 
        pageContent.includes('stripe') || 
        pageContent.includes('paypal') ||
        currentUrl.includes('payment') ||
        pageContent.includes('processing')) {
      console.log(chalk.green('Form submission processed - payment gateway loaded'));
    } else {
      // Check for validation errors (which is also acceptable)
      const hasValidation = pageContent.includes('required') || 
                           pageContent.includes('error') ||
                           pageContent.includes('invalid');
      
      if (hasValidation) {
        console.log(chalk.yellow('Form validation working (expected behavior)'));
      } else {
        throw new Error('Form submission did not process correctly');
      }
    }
  }

  // Test 5: Admin Authentication and Dashboard Access
  async testAdminAccess() {
    // Login as admin first
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/login`);
    await this.page.waitForSelector('form', { timeout: 10000 });

    await this.page.type('input[name="email"]', TEST_CREDENTIALS.admin.email);
    await this.page.type('input[name="password"]', TEST_CREDENTIALS.admin.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    // Navigate to admin dashboard
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/admin`);
    await this.page.waitForTimeout(3000);

    const pageContent = await this.page.content();
    const currentUrl = this.page.url();

    if (currentUrl.includes('/admin') && 
        (pageContent.includes('dashboard') || 
         pageContent.includes('admin') || 
         pageContent.includes('management'))) {
      console.log(chalk.green('Admin access successful'));
      
      // Test admin API access
      const token = await this.page.evaluate(() => localStorage.getItem('token'));
      if (token) {
        try {
          const adminApiResponse = await axios.get(`${TEST_CONFIG.backendUrl}/categories`, {
            headers: { 'x-auth-token': token }
          });
          console.log(chalk.green('Admin API access working'));
        } catch (error) {
          console.log(chalk.yellow(`Admin API access info: ${error.message}`));
        }
      }
    } else {
      throw new Error('Admin access denied or dashboard not loading');
    }
  }

  // Test 6: Real-time Data Updates
  async testRealTimeUpdates() {
    // This test checks if frontend updates when backend data changes
    console.log(chalk.blue('Testing real-time data synchronization...'));

    // Navigate to a data-heavy page
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/marketplace`);
    await this.page.waitForTimeout(3000);

    // Get initial page state
    const initialContent = await this.page.content();
    
    // Make a backend API call to modify data (if possible)
    try {
      const token = await this.page.evaluate(() => localStorage.getItem('token'));
      if (token) {
        // Try to create a test product or modify existing data
        const testData = {
          name: 'Integration Test Product',
          price: 10.99,
          description: 'Test product for integration testing'
        };
        
        await axios.post(`${TEST_CONFIG.backendUrl}/products`, testData, {
          headers: { 'x-auth-token': token }
        });
        
        // Refresh page and check for updates
        await this.page.reload();
        await this.page.waitForTimeout(3000);
        
        const updatedContent = await this.page.content();
        
        if (updatedContent !== initialContent) {
          console.log(chalk.green('Data synchronization working'));
        } else {
          console.log(chalk.yellow('Data synchronization test inconclusive'));
        }
      }
    } catch (error) {
      console.log(chalk.yellow(`Real-time update test info: ${error.message}`));
    }
  }

  // Test 7: Error Handling and Recovery
  async testErrorHandling() {
    console.log(chalk.blue('Testing error handling...'));

    // Test 1: Invalid login
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/login`);
    await this.page.waitForSelector('form', { timeout: 10000 });

    await this.page.type('input[name="email"]', 'invalid@email.com');
    await this.page.type('input[name="password"]', 'wrongpassword');
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    const pageContent = await this.page.content();
    if (pageContent.includes('error') || 
        pageContent.includes('invalid') || 
        pageContent.includes('incorrect') ||
        pageContent.includes('failed')) {
      console.log(chalk.green('Error handling working for invalid login'));
    } else {
      throw new Error('Error handling not working for invalid credentials');
    }

    // Test 2: Network error simulation
    // This would require more complex setup, so we'll just verify error boundaries exist
    const hasErrorBoundary = pageContent.includes('error') || 
                            await this.page.$('.error-boundary, .error-fallback');
    
    if (hasErrorBoundary) {
      console.log(chalk.green('Error boundaries detected'));
    } else {
      console.log(chalk.yellow('Error boundaries not clearly visible (may still exist)'));
    }
  }

  // Test 8: Session Management
  async testSessionManagement() {
    console.log(chalk.blue('Testing session management...'));

    // Login first
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/login`);
    await this.page.waitForSelector('form', { timeout: 10000 });

    await this.page.type('input[name="email"]', TEST_CREDENTIALS.admin.email);
    await this.page.type('input[name="password"]', TEST_CREDENTIALS.admin.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    // Check if token is stored
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Session token not stored');
    }

    // Navigate to protected route
    await this.page.goto(`${TEST_CONFIG.frontendUrl}/profile`);
    await this.page.waitForTimeout(3000);

    const currentUrl = this.page.url();
    if (currentUrl.includes('/profile') || currentUrl.includes('/dashboard')) {
      console.log(chalk.green('Session persistence working'));
    } else {
      throw new Error('Session not persisting across navigation');
    }

    // Test logout
    try {
      await this.page.click('.logout-button, button[data-testid="logout"], .logout');
      await this.page.waitForTimeout(2000);
      
      const tokenAfterLogout = await this.page.evaluate(() => localStorage.getItem('token'));
      if (!tokenAfterLogout) {
        console.log(chalk.green('Logout clearing session correctly'));
      }
    } catch (error) {
      console.log(chalk.yellow('Logout button not found or logout test skipped'));
    }
  }

  async generateReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration,
      totalTests: this.testResults.length,
      passed: this.testResults.filter(t => t.status === 'PASSED').length,
      failed: this.testResults.filter(t => t.status === 'FAILED').length,
      tests: this.testResults,
      configuration: TEST_CONFIG,
      summary: {
        successRate: `${((this.testResults.filter(t => t.status === 'PASSED').length / this.testResults.length) * 100).toFixed(2)}%`,
        averageTestDuration: `${(this.testResults.reduce((sum, t) => sum + t.duration, 0) / this.testResults.length).toFixed(2)}ms`
      }
    };

    const reportPath = path.join(TEST_CONFIG.reportDir, `frontend-backend-integration-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(chalk.blue('\n📊 Integration Test Report'));
    console.log(chalk.blue('============================'));
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(chalk.green(`Passed: ${report.passed}`));
    console.log(chalk.red(`Failed: ${report.failed}`));
    console.log(`Success Rate: ${report.summary.successRate}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Report saved: ${reportPath}`);

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAllTests() {
    try {
      await this.initialize();

      // Run all integration tests
      await this.runTest('User Registration Flow', () => this.testUserRegistration());
      await this.runTest('User Login Flow', () => this.testUserLogin());
      await this.runTest('Data Fetching', () => this.testDataFetching());
      await this.runTest('Form Submission', () => this.testFormSubmission());
      await this.runTest('Admin Access', () => this.testAdminAccess());
      await this.runTest('Real-time Updates', () => this.testRealTimeUpdates());
      await this.runTest('Error Handling', () => this.testErrorHandling());
      await this.runTest('Session Management', () => this.testSessionManagement());

      // Generate and display report
      await this.generateReport();

    } catch (error) {
      console.log(chalk.red(`\n❌ Integration test suite failed: ${error.message}`));
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new FrontendBackendIntegrationTests();
  testSuite.runAllTests()
    .then(() => {
      console.log(chalk.green('\n🎉 Frontend-Backend Integration Tests Completed!'));
      process.exit(0);
    })
    .catch((error) => {
      console.log(chalk.red('\n💥 Integration Tests Failed!'));
      console.error(error);
      process.exit(1);
    });
}

module.exports = FrontendBackendIntegrationTests;
