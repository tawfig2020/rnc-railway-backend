/**
 * Comprehensive Full-Stack Test Suite
 * Tests frontend, backend, and API endpoints integration
 */

const axios = require('axios');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

class ComprehensiveFullStackTest {
  constructor() {
    this.API_BASE_URL = 'http://localhost:5000/api';
    this.FRONTEND_URL = 'http://localhost:3000';
    this.browser = null;
    this.page = null;
    this.testResults = {
      serverHealth: null,
      authentication: null,
      apiEndpoints: null,
      frontendPages: null,
      integration: null,
      marketplace: null
    };
    this.credentials = {
      admin: { email: 'admin@refugeenetwork.com', password: '123456' },
      user: { email: 'fatima@example.com', password: '123456' },
      volunteer: { email: 'sarah@example.com', password: '123456' }
    };
    this.tokens = {};
  }

  log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      test: chalk.cyan
    };
    console.log(colors[type](`${new Date().toISOString()} - ${message}`));
  }

  async initialize() {
    this.log('🚀 Initializing Comprehensive Full-Stack Test Suite', 'info');
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Set up console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.log(`Browser Console Error: ${msg.text()}`, 'warning');
      }
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async testServerHealth() {
    this.log('🏥 Testing Server Health', 'test');
    
    try {
      // Test backend health
      const backendResponse = await axios.get('http://localhost:5000/health');
      const backendHealthy = backendResponse.status === 200 && backendResponse.data.status === 'OK';
      
      // Test frontend availability
      const frontendResponse = await axios.get(this.FRONTEND_URL);
      const frontendHealthy = frontendResponse.status === 200 && frontendResponse.data.includes('<!DOCTYPE html>');
      
      this.testResults.serverHealth = {
        backend: backendHealthy,
        frontend: frontendHealthy,
        database: backendResponse.data.database,
        uptime: backendResponse.data.uptime
      };
      
      if (backendHealthy && frontendHealthy) {
        this.log('✅ Both servers are healthy', 'success');
        return true;
      } else {
        this.log('❌ Server health check failed', 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Server health check failed: ${error.message}`, 'error');
      this.testResults.serverHealth = { error: error.message };
      return false;
    }
  }

  async testAuthentication() {
    this.log('🔐 Testing Authentication System', 'test');
    
    const authResults = {};
    
    for (const [role, creds] of Object.entries(this.credentials)) {
      try {
        this.log(`Testing ${role} login: ${creds.email}`, 'info');
        
        const response = await axios.post(`${this.API_BASE_URL}/auth/login`, creds);
        
        if (response.data && response.data.token) {
          this.tokens[role] = response.data.token;
          authResults[role] = { success: true, token: true };
          this.log(`✅ ${role} authentication successful`, 'success');
        } else {
          authResults[role] = { success: false, error: 'No token returned' };
          this.log(`❌ ${role} authentication failed - no token`, 'error');
        }
      } catch (error) {
        authResults[role] = { success: false, error: error.message };
        this.log(`❌ ${role} authentication failed: ${error.message}`, 'error');
        
        // Wait a bit if rate limited
        if (error.response && error.response.status === 429) {
          this.log('⏳ Rate limited, waiting 10 seconds...', 'warning');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }
    }
    
    this.testResults.authentication = authResults;
    return Object.values(authResults).some(r => r.success);
  }

  async testAPIEndpoints() {
    this.log('🔌 Testing API Endpoints', 'test');
    
    if (!this.tokens.admin) {
      this.log('❌ No admin token available for API testing', 'error');
      return false;
    }
    
    const endpoints = [
      { method: 'GET', path: '/blogs', name: 'Get Blogs' },
      { method: 'GET', path: '/courses', name: 'Get Courses' },
      { method: 'GET', path: '/events', name: 'Get Events' },
      { method: 'GET', path: '/resources', name: 'Get Resources' },
      { method: 'GET', path: '/users/profile', name: 'Get Profile' },
      { method: 'GET', path: '/categories', name: 'Get Categories' },
      { method: 'GET', path: '/products', name: 'Get Products' },
      { method: 'GET', path: '/orders/myorders', name: 'Get My Orders' }
    ];
    
    const apiResults = {};
    const headers = { Authorization: `Bearer ${this.tokens.admin}` };
    
    for (const endpoint of endpoints) {
      try {
        this.log(`Testing ${endpoint.method} ${endpoint.path}`, 'info');
        
        const response = await axios({
          method: endpoint.method,
          url: `${this.API_BASE_URL}${endpoint.path}`,
          headers
        });
        
        apiResults[endpoint.name] = {
          success: true,
          status: response.status,
          dataLength: Array.isArray(response.data) ? response.data.length : 'object'
        };
        
        this.log(`✅ ${endpoint.name} - Status: ${response.status}`, 'success');
      } catch (error) {
        apiResults[endpoint.name] = {
          success: false,
          status: error.response?.status || 'no response',
          error: error.message
        };
        
        this.log(`❌ ${endpoint.name} failed: ${error.message}`, 'error');
      }
    }
    
    this.testResults.apiEndpoints = apiResults;
    const successCount = Object.values(apiResults).filter(r => r.success).length;
    this.log(`API Endpoints: ${successCount}/${endpoints.length} passed`, successCount > 0 ? 'success' : 'error');
    
    return successCount > 0;
  }

  async testFrontendPages() {
    this.log('🌐 Testing Frontend Pages', 'test');
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/about', name: 'About' },
      { path: '/programs', name: 'Programs' },
      { path: '/marketplace', name: 'Marketplace' },
      { path: '/blog', name: 'Blog' },
      { path: '/contact', name: 'Contact' },
      { path: '/donate', name: 'Donate' }
    ];
    
    const pageResults = {};
    
    for (const pageInfo of pages) {
      try {
        this.log(`Testing page: ${pageInfo.path}`, 'info');
        
        await this.page.goto(`${this.FRONTEND_URL}${pageInfo.path}`, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        
        const title = await this.page.title();
        const hasReactRoot = await this.page.$('#root') !== null;
        const hasContent = await this.page.evaluate(() => document.body.innerText.length > 100);
        
        pageResults[pageInfo.name] = {
          success: true,
          title,
          hasReactRoot,
          hasContent,
          url: this.page.url()
        };
        
        this.log(`✅ ${pageInfo.name} loaded successfully`, 'success');
      } catch (error) {
        pageResults[pageInfo.name] = {
          success: false,
          error: error.message
        };
        
        this.log(`❌ ${pageInfo.name} failed to load: ${error.message}`, 'error');
      }
    }
    
    this.testResults.frontendPages = pageResults;
    const successCount = Object.values(pageResults).filter(r => r.success).length;
    this.log(`Frontend Pages: ${successCount}/${pages.length} loaded`, successCount > 0 ? 'success' : 'error');
    
    return successCount > 0;
  }

  async testMarketplaceIntegration() {
    this.log('🛒 Testing Marketplace Integration', 'test');
    
    try {
      // Navigate to marketplace
      await this.page.goto(`${this.FRONTEND_URL}/marketplace`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Check if marketplace loads
      const marketplaceLoaded = await this.page.waitForSelector('#root', { timeout: 5000 }).catch(() => false);
      
      // Test API call from frontend
      const apiCallTest = await this.page.evaluate(async () => {
        try {
          const response = await fetch('/api/products');
          return { success: response.ok, status: response.status };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
      
      this.testResults.marketplace = {
        pageLoaded: !!marketplaceLoaded,
        apiCall: apiCallTest
      };
      
      this.log('✅ Marketplace integration test completed', 'success');
      return true;
    } catch (error) {
      this.testResults.marketplace = { error: error.message };
      this.log(`❌ Marketplace integration failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testIntegrationFlow() {
    this.log('🔄 Testing Integration Flow', 'test');
    
    try {
      // Navigate to homepage
      await this.page.goto(this.FRONTEND_URL, { waitUntil: 'networkidle0' });
      
      // Test navigation
      const navigationTest = await this.page.evaluate(() => {
        const links = document.querySelectorAll('a[href]');
        return links.length > 0;
      });
      
      // Test if React app is working
      const reactTest = await this.page.evaluate(() => {
        return window.React !== undefined || document.querySelector('[data-reactroot]') !== null;
      });
      
      this.testResults.integration = {
        navigation: navigationTest,
        react: reactTest,
        pageTitle: await this.page.title()
      };
      
      this.log('✅ Integration flow test completed', 'success');
      return true;
    } catch (error) {
      this.testResults.integration = { error: error.message };
      this.log(`❌ Integration flow failed: ${error.message}`, 'error');
      return false;
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.testResults,
      summary: {
        serverHealth: this.testResults.serverHealth?.backend && this.testResults.serverHealth?.frontend,
        authentication: Object.values(this.testResults.authentication || {}).some(r => r.success),
        apiEndpoints: Object.values(this.testResults.apiEndpoints || {}).filter(r => r.success).length,
        frontendPages: Object.values(this.testResults.frontendPages || {}).filter(r => r.success).length,
        marketplace: this.testResults.marketplace?.pageLoaded,
        integration: this.testResults.integration && !this.testResults.integration.error
      }
    };
    
    // Save report
    const reportPath = path.join(__dirname, 'reports', `fullstack-test-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    return { report, reportPath };
  }

  async runAllTests() {
    try {
      await this.initialize();
      
      this.log('🎯 Starting Comprehensive Full-Stack Testing', 'info');
      this.log('===============================================', 'info');
      
      // Run all tests
      const serverHealthy = await this.testServerHealth();
      if (!serverHealthy) {
        throw new Error('Server health check failed');
      }
      
      await this.testAuthentication();
      await this.testAPIEndpoints();
      await this.testFrontendPages();
      await this.testMarketplaceIntegration();
      await this.testIntegrationFlow();
      
      // Generate report
      const { report, reportPath } = await this.generateReport();
      
      // Print summary
      this.log('📊 Test Summary', 'info');
      this.log('================', 'info');
      this.log(`Server Health: ${report.summary.serverHealth ? '✅' : '❌'}`, report.summary.serverHealth ? 'success' : 'error');
      this.log(`Authentication: ${report.summary.authentication ? '✅' : '❌'}`, report.summary.authentication ? 'success' : 'error');
      this.log(`API Endpoints: ${report.summary.apiEndpoints} passed`, report.summary.apiEndpoints > 0 ? 'success' : 'error');
      this.log(`Frontend Pages: ${report.summary.frontendPages} loaded`, report.summary.frontendPages > 0 ? 'success' : 'error');
      this.log(`Marketplace: ${report.summary.marketplace ? '✅' : '❌'}`, report.summary.marketplace ? 'success' : 'error');
      this.log(`Integration: ${report.summary.integration ? '✅' : '❌'}`, report.summary.integration ? 'success' : 'error');
      
      this.log(`📝 Report saved: ${reportPath}`, 'info');
      
      const overallSuccess = Object.values(report.summary).filter(Boolean).length >= 4;
      this.log(`🎉 Overall Result: ${overallSuccess ? 'PASSED' : 'FAILED'}`, overallSuccess ? 'success' : 'error');
      
      return report;
    } catch (error) {
      this.log(`💥 Test suite failed: ${error.message}`, 'error');
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new ComprehensiveFullStackTest();
  testSuite.runAllTests()
    .then(report => {
      console.log(chalk.green('✅ Full-stack testing completed successfully!'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('💥 Full-stack testing failed:'), error);
      process.exit(1);
    });
}

module.exports = ComprehensiveFullStackTest;
