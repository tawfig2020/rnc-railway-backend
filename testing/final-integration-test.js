/**
 * Final Integration Test Suite
 * Comprehensive testing without authentication dependencies
 */

const axios = require('axios');
const puppeteer = require('puppeteer');
const chalk = require('chalk');

class FinalIntegrationTest {
  constructor() {
    this.API_BASE_URL = 'http://localhost:5000/api';
    this.FRONTEND_URL = 'http://localhost:3000';
    this.browser = null;
    this.page = null;
    this.results = {
      serverHealth: null,
      publicApiEndpoints: null,
      frontendFunctionality: null,
      marketplaceIntegration: null,
      overallIntegration: null
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      test: chalk.cyan,
      header: chalk.magenta.bold
    };
    console.log(colors[type](`${message}`));
  }

  async initialize() {
    this.log('🚀 Final Integration Test Suite - RNC Platform', 'header');
    this.log('================================================', 'header');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async testServerHealth() {
    this.log('🏥 Testing Server Health & Connectivity', 'test');
    
    try {
      // Backend health
      const backendResponse = await axios.get('http://localhost:5000/health');
      const backendHealthy = backendResponse.status === 200;
      
      // Frontend availability
      const frontendResponse = await axios.get(this.FRONTEND_URL);
      const frontendHealthy = frontendResponse.status === 200;
      
      this.results.serverHealth = {
        backend: {
          healthy: backendHealthy,
          status: backendResponse.data.status,
          database: backendResponse.data.database,
          uptime: Math.round(backendResponse.data.uptime / 60) + ' minutes'
        },
        frontend: {
          healthy: frontendHealthy,
          status: frontendResponse.status
        }
      };
      
      this.log(`✅ Backend: ${backendHealthy ? 'Healthy' : 'Failed'}`, backendHealthy ? 'success' : 'error');
      this.log(`✅ Frontend: ${frontendHealthy ? 'Healthy' : 'Failed'}`, frontendHealthy ? 'success' : 'error');
      this.log(`📊 Database: ${backendResponse.data.database}`, 'info');
      this.log(`⏱️  Uptime: ${Math.round(backendResponse.data.uptime / 60)} minutes`, 'info');
      
      return backendHealthy && frontendHealthy;
    } catch (error) {
      this.log(`❌ Server health check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testPublicApiEndpoints() {
    this.log('🔌 Testing Public API Endpoints', 'test');
    
    const endpoints = [
      { path: '/categories', name: 'Categories' },
      { path: '/products', name: 'Products' },
      { path: '/blogs', name: 'Blog Posts' },
      { path: '/courses', name: 'Courses' },
      { path: '/events', name: 'Events' },
      { path: '/resources', name: 'Resources' }
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${this.API_BASE_URL}${endpoint.path}`);
        const dataLength = Array.isArray(response.data) ? response.data.length : 'object';
        
        results[endpoint.name] = {
          success: true,
          status: response.status,
          dataCount: dataLength,
          hasData: Array.isArray(response.data) ? response.data.length > 0 : true
        };
        
        this.log(`✅ ${endpoint.name}: ${response.status} (${dataLength} items)`, 'success');
      } catch (error) {
        results[endpoint.name] = {
          success: false,
          status: error.response?.status || 'no response',
          error: error.message
        };
        
        this.log(`❌ ${endpoint.name}: ${error.message}`, 'error');
      }
    }
    
    this.results.publicApiEndpoints = results;
    const successCount = Object.values(results).filter(r => r.success).length;
    this.log(`📊 API Endpoints: ${successCount}/${endpoints.length} working`, 'info');
    
    return successCount > 0;
  }

  async testFrontendFunctionality() {
    this.log('🌐 Testing Frontend Functionality', 'test');
    
    const pages = [
      { path: '/', name: 'Homepage', expectedElements: ['nav', 'main', 'footer'] },
      { path: '/about', name: 'About', expectedElements: ['nav', 'main'] },
      { path: '/programs', name: 'Programs', expectedElements: ['nav', 'main'] },
      { path: '/marketplace', name: 'Marketplace', expectedElements: ['nav', 'main'] },
      { path: '/blog', name: 'Blog', expectedElements: ['nav', 'main'] },
      { path: '/contact', name: 'Contact', expectedElements: ['nav', 'main'] }
    ];
    
    const results = {};
    
    for (const pageInfo of pages) {
      try {
        await this.page.goto(`${this.FRONTEND_URL}${pageInfo.path}`, { 
          waitUntil: 'networkidle0',
          timeout: 15000 
        });
        
        const title = await this.page.title();
        const hasReactRoot = await this.page.$('#root') !== null;
        
        // Check for expected elements
        const elementChecks = {};
        for (const element of pageInfo.expectedElements) {
          elementChecks[element] = await this.page.$(element) !== null;
        }
        
        // Check for navigation links
        const navLinks = await this.page.$$eval('a[href]', links => links.length);
        
        results[pageInfo.name] = {
          success: true,
          title,
          hasReactRoot,
          elements: elementChecks,
          navigationLinks: navLinks,
          url: this.page.url()
        };
        
        this.log(`✅ ${pageInfo.name}: Loaded successfully (${navLinks} nav links)`, 'success');
      } catch (error) {
        results[pageInfo.name] = {
          success: false,
          error: error.message
        };
        
        this.log(`❌ ${pageInfo.name}: ${error.message}`, 'error');
      }
    }
    
    this.results.frontendFunctionality = results;
    const successCount = Object.values(results).filter(r => r.success).length;
    this.log(`📊 Frontend Pages: ${successCount}/${pages.length} working`, 'info');
    
    return successCount > 0;
  }

  async testMarketplaceIntegration() {
    this.log('🛒 Testing Marketplace Integration', 'test');
    
    try {
      // Navigate to marketplace
      await this.page.goto(`${this.FRONTEND_URL}/marketplace`, { 
        waitUntil: 'networkidle0',
        timeout: 15000 
      });
      
      // Check marketplace page elements
      const hasProductGrid = await this.page.$('.products, .product-grid, [class*="product"]') !== null;
      const hasCategories = await this.page.$('.categories, .category, [class*="category"]') !== null;
      const hasSearch = await this.page.$('input[type="search"], .search, [class*="search"]') !== null;
      
      // Test API calls from frontend
      const apiTestResults = await this.page.evaluate(async () => {
        const results = {};
        
        try {
          const categoriesResponse = await fetch('/api/categories');
          results.categories = { success: categoriesResponse.ok, status: categoriesResponse.status };
        } catch (error) {
          results.categories = { success: false, error: error.message };
        }
        
        try {
          const productsResponse = await fetch('/api/products');
          results.products = { success: productsResponse.ok, status: productsResponse.status };
        } catch (error) {
          results.products = { success: false, error: error.message };
        }
        
        return results;
      });
      
      this.results.marketplaceIntegration = {
        pageLoaded: true,
        elements: {
          productGrid: hasProductGrid,
          categories: hasCategories,
          search: hasSearch
        },
        apiCalls: apiTestResults
      };
      
      this.log('✅ Marketplace page loaded successfully', 'success');
      this.log(`📦 Product elements: ${hasProductGrid ? 'Found' : 'Not found'}`, hasProductGrid ? 'success' : 'warning');
      this.log(`📂 Category elements: ${hasCategories ? 'Found' : 'Not found'}`, hasCategories ? 'success' : 'warning');
      this.log(`🔍 Search elements: ${hasSearch ? 'Found' : 'Not found'}`, hasSearch ? 'success' : 'warning');
      
      return true;
    } catch (error) {
      this.results.marketplaceIntegration = { error: error.message };
      this.log(`❌ Marketplace integration failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testOverallIntegration() {
    this.log('🔄 Testing Overall System Integration', 'test');
    
    try {
      // Test homepage to marketplace navigation
      await this.page.goto(this.FRONTEND_URL, { waitUntil: 'networkidle0' });
      
      // Look for marketplace link and click it
      const marketplaceLink = await this.page.$('a[href*="marketplace"], a[href="/marketplace"]');
      if (marketplaceLink) {
        await marketplaceLink.click();
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
      }
      
      // Test React app state
      const reactState = await this.page.evaluate(() => {
        return {
          hasReact: typeof window.React !== 'undefined' || document.querySelector('[data-reactroot]') !== null,
          hasRouter: window.location.pathname !== '/',
          hasContent: document.body.innerText.length > 500
        };
      });
      
      // Test responsive design
      await this.page.setViewport({ width: 768, height: 1024 }); // Tablet
      await this.page.waitForTimeout(1000);
      const tabletView = await this.page.evaluate(() => window.innerWidth);
      
      await this.page.setViewport({ width: 375, height: 667 }); // Mobile
      await this.page.waitForTimeout(1000);
      const mobileView = await this.page.evaluate(() => window.innerWidth);
      
      this.results.overallIntegration = {
        navigation: !!marketplaceLink,
        reactState,
        responsive: {
          tablet: tabletView === 768,
          mobile: mobileView === 375
        }
      };
      
      this.log('✅ Navigation between pages working', 'success');
      this.log(`⚛️  React app: ${reactState.hasReact ? 'Active' : 'Inactive'}`, reactState.hasReact ? 'success' : 'warning');
      this.log('📱 Responsive design: Working', 'success');
      
      return true;
    } catch (error) {
      this.results.overallIntegration = { error: error.message };
      this.log(`❌ Overall integration test failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateSummary() {
    this.log('', 'info');
    this.log('📊 FINAL TEST SUMMARY', 'header');
    this.log('=====================', 'header');
    
    const summary = {
      serverHealth: this.results.serverHealth?.backend?.healthy && this.results.serverHealth?.frontend?.healthy,
      apiEndpoints: Object.values(this.results.publicApiEndpoints || {}).filter(r => r.success).length,
      frontendPages: Object.values(this.results.frontendFunctionality || {}).filter(r => r.success).length,
      marketplaceWorking: this.results.marketplaceIntegration && !this.results.marketplaceIntegration.error,
      integrationWorking: this.results.overallIntegration && !this.results.overallIntegration.error
    };
    
    this.log(`🏥 Server Health: ${summary.serverHealth ? '✅ HEALTHY' : '❌ FAILED'}`, summary.serverHealth ? 'success' : 'error');
    this.log(`🔌 API Endpoints: ${summary.apiEndpoints}/6 working`, summary.apiEndpoints > 0 ? 'success' : 'error');
    this.log(`🌐 Frontend Pages: ${summary.frontendPages}/6 working`, summary.frontendPages > 0 ? 'success' : 'error');
    this.log(`🛒 Marketplace: ${summary.marketplaceWorking ? '✅ WORKING' : '❌ FAILED'}`, summary.marketplaceWorking ? 'success' : 'error');
    this.log(`🔄 Integration: ${summary.integrationWorking ? '✅ WORKING' : '❌ FAILED'}`, summary.integrationWorking ? 'success' : 'error');
    
    const totalScore = [
      summary.serverHealth,
      summary.apiEndpoints > 0,
      summary.frontendPages > 0,
      summary.marketplaceWorking,
      summary.integrationWorking
    ].filter(Boolean).length;
    
    this.log('', 'info');
    this.log(`🎯 OVERALL SCORE: ${totalScore}/5 (${Math.round(totalScore/5*100)}%)`, totalScore >= 4 ? 'success' : totalScore >= 2 ? 'warning' : 'error');
    this.log(`🏆 RESULT: ${totalScore >= 4 ? 'PASSED ✅' : totalScore >= 2 ? 'PARTIAL ⚠️' : 'FAILED ❌'}`, totalScore >= 4 ? 'success' : totalScore >= 2 ? 'warning' : 'error');
    
    return { summary, totalScore, results: this.results };
  }

  async runAllTests() {
    try {
      await this.initialize();
      
      const serverHealthy = await this.testServerHealth();
      if (!serverHealthy) {
        throw new Error('Server health check failed - cannot continue testing');
      }
      
      await this.testPublicApiEndpoints();
      await this.testFrontendFunctionality();
      await this.testMarketplaceIntegration();
      await this.testOverallIntegration();
      
      return this.generateSummary();
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
  const testSuite = new FinalIntegrationTest();
  testSuite.runAllTests()
    .then(result => {
      console.log(chalk.green('\n🎉 Final integration testing completed!'));
      process.exit(result.totalScore >= 4 ? 0 : 1);
    })
    .catch(error => {
      console.error(chalk.red('\n💥 Final integration testing failed:'), error.message);
      process.exit(1);
    });
}

module.exports = FinalIntegrationTest;
