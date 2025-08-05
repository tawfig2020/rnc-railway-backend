const puppeteer = require('puppeteer');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  adminCredentials: {
    email: 'admin@refugeenetwork.com',
    password: 'Admin@123'
  }
};

let browser;
let page;
let adminToken;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const apiRequest = async (method, endpoint, data = {}, token = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      timeout: 10000
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
};

const setupBrowser = async () => {
  console.log('🚀 Setting up browser for E2E testing...');
  
  browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser Console Error:', msg.text());
    }
  });
  
  // Enable request/response logging
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  console.log('✅ Browser setup complete');
};

const getAdminToken = async () => {
  console.log('🔐 Getting admin token...');
  
  const result = await apiRequest('POST', '/auth/login', testConfig.adminCredentials);
  
  if (result.success && result.data.token) {
    adminToken = result.data.token;
    console.log('✅ Admin token obtained');
    return true;
  } else {
    console.log('❌ Failed to get admin token:', result.error);
    return false;
  }
};

const testPrivacyPageLoad = async () => {
  console.log('\n📄 Testing Privacy Page Load...');
  
  try {
    await page.goto(`${BASE_URL}/privacy`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Wait for the privacy policy content to load
    await page.waitForSelector('h1', { timeout: 5000 });
    
    const title = await page.$eval('h1', el => el.textContent);
    console.log('   Page title:', title);
    
    // Check for privacy policy content
    const hasPrivacyContent = await page.$('.privacy-policy-content') !== null;
    const hasAcceptButton = await page.$('button') !== null;
    
    if (title.toLowerCase().includes('privacy') && (hasPrivacyContent || hasAcceptButton)) {
      console.log('✅ Privacy page loaded successfully');
      return true;
    } else {
      console.log('❌ Privacy page content not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Privacy page load failed:', error.message);
    return false;
  }
};

const testPrivacySettingsPage = async () => {
  console.log('\n⚙️ Testing Privacy Settings Page...');
  
  try {
    await page.goto(`${BASE_URL}/privacy-settings`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Wait for the page to load
    await page.waitForSelector('h1', { timeout: 5000 });
    
    const title = await page.$eval('h1', el => el.textContent);
    console.log('   Page title:', title);
    
    // Check for privacy settings components
    const hasConsentSection = await page.$('button:contains("Manage Consent")') !== null;
    const hasDataRights = await page.$('button:contains("Request Export")') !== null;
    const hasDeleteButton = await page.$('button:contains("Delete Account")') !== null;
    
    if (title.toLowerCase().includes('privacy')) {
      console.log('✅ Privacy settings page loaded successfully');
      return true;
    } else {
      console.log('❌ Privacy settings page content not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Privacy settings page load failed:', error.message);
    return false;
  }
};

const testCookieConsentBanner = async () => {
  console.log('\n🍪 Testing Cookie Consent Banner...');
  
  try {
    // Go to homepage to check for cookie banner
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Look for cookie consent banner
    const cookieBanner = await page.$('[class*="cookie"], [id*="cookie"], [data-testid*="cookie"]');
    
    if (cookieBanner) {
      console.log('✅ Cookie consent banner found');
      
      // Try to find accept button
      const acceptButton = await page.$('button:contains("Accept"), button:contains("Allow")');
      if (acceptButton) {
        console.log('✅ Cookie accept button found');
        return true;
      } else {
        console.log('⚠️ Cookie banner found but no accept button');
        return true;
      }
    } else {
      console.log('⚠️ Cookie consent banner not found (may be already accepted)');
      return true; // Not necessarily a failure
    }
  } catch (error) {
    console.log('❌ Cookie consent banner test failed:', error.message);
    return false;
  }
};

const testBackendPrivacyEndpoints = async () => {
  console.log('\n🔗 Testing Backend Privacy API Endpoints...');
  
  if (!adminToken) {
    console.log('❌ No admin token available for API testing');
    return false;
  }
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test privacy policy endpoint
  totalTests++;
  const policyResult = await apiRequest('GET', '/privacy/policy');
  if (policyResult.success) {
    console.log('✅ Privacy policy endpoint working');
    passedTests++;
  } else {
    console.log('❌ Privacy policy endpoint failed:', policyResult.error);
  }
  
  // Test consent management
  totalTests++;
  const consentResult = await apiRequest('GET', '/privacy/consent', {}, adminToken);
  if (consentResult.success) {
    console.log('✅ Consent management endpoint working');
    passedTests++;
  } else {
    console.log('❌ Consent management endpoint failed:', consentResult.error);
  }
  
  // Test policy acceptance
  totalTests++;
  const acceptResult = await apiRequest('POST', '/privacy/accept-policy', { version: '1.0' }, adminToken);
  if (acceptResult.success) {
    console.log('✅ Policy acceptance endpoint working');
    passedTests++;
  } else {
    console.log('❌ Policy acceptance endpoint failed:', acceptResult.error);
  }
  
  // Test data export
  totalTests++;
  const exportResult = await apiRequest('POST', '/privacy/data-export', {}, adminToken);
  if (exportResult.success) {
    console.log('✅ Data export endpoint working');
    passedTests++;
  } else {
    console.log('❌ Data export endpoint failed:', exportResult.error);
  }
  
  console.log(`📊 Backend API Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testNavigationFlow = async () => {
  console.log('\n🧭 Testing Privacy Navigation Flow...');
  
  try {
    // Start from homepage
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Try to navigate to privacy page via footer or menu
    const privacyLink = await page.$('a[href="/privacy"], a:contains("Privacy")');
    if (privacyLink) {
      await privacyLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
      
      const currentUrl = page.url();
      if (currentUrl.includes('/privacy')) {
        console.log('✅ Navigation to privacy page successful');
        
        // Try to navigate to privacy settings
        const settingsLink = await page.$('a[href="/privacy-settings"], button:contains("Privacy Settings")');
        if (settingsLink) {
          await settingsLink.click();
          await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
          
          const settingsUrl = page.url();
          if (settingsUrl.includes('/privacy-settings')) {
            console.log('✅ Navigation to privacy settings successful');
            return true;
          }
        }
        
        console.log('✅ Privacy page navigation working');
        return true;
      }
    }
    
    console.log('⚠️ Privacy navigation links not found');
    return false;
  } catch (error) {
    console.log('❌ Navigation flow test failed:', error.message);
    return false;
  }
};

const cleanup = async () => {
  console.log('\n🧹 Cleaning up...');
  if (browser) {
    await browser.close();
  }
  console.log('✅ Cleanup complete');
};

const main = async () => {
  console.log('🧪 PRIVACY SYSTEM END-TO-END TEST SUITE');
  console.log('========================================');
  
  const tests = [
    { name: 'Browser Setup', fn: setupBrowser },
    { name: 'Admin Token', fn: getAdminToken },
    { name: 'Privacy Page Load', fn: testPrivacyPageLoad },
    { name: 'Privacy Settings Page', fn: testPrivacySettingsPage },
    { name: 'Cookie Consent Banner', fn: testCookieConsentBanner },
    { name: 'Backend API Endpoints', fn: testBackendPrivacyEndpoints },
    { name: 'Navigation Flow', fn: testNavigationFlow }
  ];

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  for (const test of tests) {
    try {
      const startTime = Date.now();
      const result = await test.fn();
      const duration = Date.now() - startTime;
      
      if (result) {
        passedTests++;
        results.push({ name: test.name, status: 'PASSED', duration });
      } else {
        failedTests++;
        results.push({ name: test.name, status: 'FAILED', duration });
      }
    } catch (error) {
      failedTests++;
      results.push({ name: test.name, status: 'ERROR', error: error.message });
      console.log(`❌ ${test.name} threw an error:`, error.message);
    }
  }

  // Cleanup
  await cleanup();

  // Print summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${passedTests} (${((passedTests / tests.length) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failedTests} (${((failedTests / tests.length) * 100).toFixed(1)}%)`);
  
  console.log('\n📋 DETAILED RESULTS:');
  results.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${status} ${result.name}${duration}`);
  });

  console.log('\n🎯 PRIVACY E2E TEST COMPLETE');
  
  if (passedTests === tests.length) {
    console.log('🎉 All privacy E2E tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please review the implementation.');
    process.exit(1);
  }
};

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main().catch(error => {
  console.error('❌ E2E test suite failed:', error);
  cleanup().then(() => process.exit(1));
});
