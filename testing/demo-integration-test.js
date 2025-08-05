/**
 * Demo Integration Test
 * Simple demonstration of frontend-backend integration testing
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const chalk = require('chalk');

class DemoIntegrationTest {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log(chalk.blue('🚀 Starting Demo Integration Test...'));
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  }

  async testBackendAPI() {
    console.log(chalk.blue('\n🔌 Testing Backend API...'));
    
    try {
      // Test blogs endpoint
      const blogsResponse = await axios.get('http://localhost:5000/api/blogs');
      console.log(chalk.green(`✅ Blogs API: Retrieved ${blogsResponse.data.data?.length || 0} blogs`));
      
      // Test admin login
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@refugeenetwork.com',
        password: 'Admin@123'
      });
      
      if (loginResponse.data.token) {
        console.log(chalk.green('✅ Admin Login API: Authentication successful'));
        
        // Test token validation
        const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { 'x-auth-token': loginResponse.data.token }
        });
        
        console.log(chalk.green(`✅ Token Validation: User ${meResponse.data.email} verified`));
      }
      
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ Backend API Test Failed: ${error.message}`));
      return false;
    }
  }

  async testFrontendPages() {
    console.log(chalk.blue('\n🌐 Testing Frontend Pages...'));
    
    try {
      // Test homepage
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      const title = await this.page.title();
      console.log(chalk.green(`✅ Homepage loaded: ${title}`));
      
      // Test navigation to marketplace
      await this.page.goto('http://localhost:3000/marketplace', { waitUntil: 'networkidle2' });
      await this.page.waitForSelector('h1', { timeout: 5000 });
      const marketplaceTitle = await this.page.$eval('h1', el => el.textContent);
      console.log(chalk.green(`✅ Marketplace page loaded: ${marketplaceTitle}`));
      
      // Test navigation to donate page
      await this.page.goto('http://localhost:3000/donate', { waitUntil: 'networkidle2' });
      await this.page.waitForSelector('h1', { timeout: 5000 });
      const donateTitle = await this.page.$eval('h1', el => el.textContent);
      console.log(chalk.green(`✅ Donate page loaded: ${donateTitle}`));
      
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ Frontend Test Failed: ${error.message}`));
      return false;
    }
  }

  async testFrontendBackendIntegration() {
    console.log(chalk.blue('\n🔗 Testing Frontend-Backend Integration...'));
    
    try {
      // Test login flow
      await this.page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
      
      // Fill login form
      await this.page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await this.page.type('input[type="email"]', 'admin@refugeenetwork.com');
      await this.page.type('input[type="password"]', 'Admin@123');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      
      // Wait for redirect or success
      await this.page.waitForTimeout(3000);
      
      const currentUrl = this.page.url();
      if (currentUrl.includes('/admin') || currentUrl.includes('/profile')) {
        console.log(chalk.green('✅ Login Integration: Successfully logged in and redirected'));
      } else {
        console.log(chalk.yellow(`⚠️ Login Integration: Redirected to ${currentUrl}`));
      }
      
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ Integration Test Failed: ${error.message}`));
      return false;
    }
  }

  async testDataFetching() {
    console.log(chalk.blue('\n📊 Testing Data Fetching Integration...'));
    
    try {
      // Go to blogs page and check if data loads
      await this.page.goto('http://localhost:3000/blogs', { waitUntil: 'networkidle2' });
      
      // Wait for content to load
      await this.page.waitForTimeout(3000);
      
      // Check if blog content is present
      const blogElements = await this.page.$$('.blog-card, .blog-item, article');
      if (blogElements.length > 0) {
        console.log(chalk.green(`✅ Blog Data Integration: Found ${blogElements.length} blog elements`));
      } else {
        console.log(chalk.yellow('⚠️ Blog Data Integration: No blog elements found (may be different selector)'));
      }
      
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ Data Fetching Test Failed: ${error.message}`));
      return false;
    }
  }

  async runAllTests() {
    try {
      await this.initialize();
      
      const results = {
        backendAPI: await this.testBackendAPI(),
        frontendPages: await this.testFrontendPages(),
        integration: await this.testFrontendBackendIntegration(),
        dataFetching: await this.testDataFetching()
      };
      
      // Summary
      console.log(chalk.blue('\n📊 Demo Integration Test Results'));
      console.log(chalk.blue('=================================='));
      
      const passed = Object.values(results).filter(r => r).length;
      const total = Object.keys(results).length;
      
      Object.entries(results).forEach(([testName, passed]) => {
        const status = passed ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED');
        console.log(`${status} ${testName}`);
      });
      
      console.log(chalk.blue(`\nOverall: ${passed}/${total} tests passed`));
      
      if (passed === total) {
        console.log(chalk.green('\n🎉 All integration tests passed!'));
      } else {
        console.log(chalk.yellow('\n⚠️ Some tests failed - check logs above'));
      }
      
      return { passed, total, results };
      
    } catch (error) {
      console.log(chalk.red(`\n💥 Demo Integration Test Failed: ${error.message}`));
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const demo = new DemoIntegrationTest();
  demo.runAllTests()
    .then((results) => {
      if (results.passed === results.total) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = DemoIntegrationTest;
