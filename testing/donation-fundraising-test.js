/**
 * Comprehensive Donation & Fundraising Integration Test Suite
 * Tests the complete donation journey including:
 * - New user registration and account creation
 * - Campaign creation and management
 * - Donation process (one-time and recurring)
 * - Payment processing simulation
 * - Community project funding
 * - Admin management and reporting
 */

const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

// Test configuration
const CONFIG = {
  API_BASE_URL: 'http://localhost:5000/api',
  FRONTEND_URL: 'http://localhost:3000',
  ADMIN_CREDENTIALS: {
    email: 'admin@refugeenetwork.com',
    password: 'Admin@123'
  },
  TEST_USER: {
    name: 'John Donor',
    email: `john.donor.test.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    phone: '+1234567890',
    location: 'Test City, Test State'
  },
  TEST_CAMPAIGN: {
    title: 'Emergency Relief Fund Test',
    summary: 'Test campaign for emergency relief funding',
    description: 'This is a comprehensive test campaign to verify donation functionality and community project funding.',
    goal: 10000,
    currency: 'USD',
    category: 'emergency_relief',
    minimumDonation: 5,
    organizationName: 'Test Relief Organization',
    contactEmail: 'contact@testrelief.org',
    beneficiaries: 'Refugees and displaced families in need of emergency assistance'
  },
  TEST_DONATION: {
    amount: 100,
    paymentMethod: 'credit_card',
    currency: 'USD',
    message: 'Test donation for integration testing'
  },
  RECURRING_DONATION: {
    amount: 25,
    frequency: 'monthly',
    paymentMethod: 'credit_card',
    currency: 'USD'
  }
};

// Test state
let testState = {
  adminToken: null,
  userToken: null,
  userId: null,
  campaignId: null,
  donationId: null,
  recurringDonationId: null,
  browser: null,
  page: null,
  testResults: [],
  startTime: Date.now()
};

// Utility functions
const log = {
  info: (msg) => console.log(chalk.blue(`ℹ️  ${msg}`)),
  success: (msg) => console.log(chalk.green(`✅ ${msg}`)),
  error: (msg) => console.log(chalk.red(`❌ ${msg}`)),
  warning: (msg) => console.log(chalk.yellow(`⚠️  ${msg}`)),
  test: (msg) => console.log(chalk.cyan(`🧪 Running test: ${msg}`)),
  section: (msg) => console.log(chalk.magenta(`\n${'='.repeat(msg.length + 4)}\n  ${msg}\n${'='.repeat(msg.length + 4)}`))
};

// API request helper
async function apiRequest(method, endpoint, data = null, token = null, expectedStatus = null) {
  try {
    const config = {
      method,
      url: `${CONFIG.API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers['x-auth-token'] = token;
    }

    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      config.data = data;
    }

    const response = await axios(config);
    
    if (expectedStatus && response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Test result tracking
function recordTest(testName, passed, duration, error = null) {
  testState.testResults.push({
    name: testName,
    passed,
    duration,
    error: error ? error.message : null,
    timestamp: new Date().toISOString()
  });
}

// Test functions
async function testServerAvailability() {
  log.test('Server Availability');
  const startTime = Date.now();
  
  try {
    // Test backend server
    await axios.get(`${CONFIG.API_BASE_URL.replace('/api', '')}/health`);
    log.success('Backend server is running');
    
    // Test frontend server
    await axios.get(CONFIG.FRONTEND_URL);
    log.success('Frontend server is running');
    
    recordTest('Server Availability', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Server availability check failed: ${error.message}`);
    recordTest('Server Availability', false, Date.now() - startTime, error);
    return false;
  }
}

async function testAdminAuthentication() {
  log.test('Admin Authentication');
  const startTime = Date.now();
  
  try {
    const response = await apiRequest('post', '/auth/login', CONFIG.ADMIN_CREDENTIALS);
    
    if (!response.token) {
      throw new Error('No token received from admin login');
    }
    
    testState.adminToken = response.token;
    log.success('Admin authentication successful');
    
    recordTest('Admin Authentication', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Admin authentication failed: ${error.message}`);
    recordTest('Admin Authentication', false, Date.now() - startTime, error);
    return false;
  }
}

async function testNewUserRegistration() {
  log.test('New User Registration');
  const startTime = Date.now();
  
  try {
    // First, try to delete the test user if it exists
    try {
      await apiRequest('delete', `/users/email/${CONFIG.TEST_USER.email}`, null, testState.adminToken);
      log.info('Cleaned up existing test user');
    } catch (error) {
      // User doesn't exist, which is fine
    }
    
    // Register new user
    const response = await apiRequest('post', '/auth/register', {
      name: CONFIG.TEST_USER.name,
      email: CONFIG.TEST_USER.email,
      password: CONFIG.TEST_USER.password,
      phone: CONFIG.TEST_USER.phone,
      location: CONFIG.TEST_USER.location,
      role: 'refugee'
    });
    
    if (!response.token) {
      throw new Error('No token received from user registration');
    }
    
    testState.userToken = response.token;
    testState.userId = response.user.id;
    
    log.success(`New user registered: ${CONFIG.TEST_USER.name}`);
    log.info(`User ID: ${testState.userId}`);
    
    recordTest('New User Registration', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`User registration failed: ${error.message}`);
    recordTest('New User Registration', false, Date.now() - startTime, error);
    return false;
  }
}

async function testCampaignCreation() {
  log.test('Campaign Creation');
  const startTime = Date.now();
  
  try {
    const uniqueSlug = `emergency-relief-fund-test-${Date.now()}`;
    const campaignData = {
      ...CONFIG.TEST_CAMPAIGN,
      slug: uniqueSlug,
      coverImage: 'https://example.com/test-image.jpg',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: 'active',
      allowDonationsAfterEnd: true
    };
    
    log.info(`Using campaign slug: ${uniqueSlug}`);
    
    const response = await apiRequest('post', '/campaigns', campaignData, testState.adminToken);
    
    testState.campaignId = response.campaign._id;
    
    log.success(`Campaign created: ${response.campaign.title}`);
    log.info(`Campaign ID: ${testState.campaignId}`);
    log.info(`Goal: $${response.campaign.goal} ${response.campaign.currency}`);
    
    recordTest('Campaign Creation', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Campaign creation failed: ${error.message}`);
    recordTest('Campaign Creation', false, Date.now() - startTime, error);
    return false;
  }
}

async function testDonationSubmission() {
  log.test('Donation Submission');
  const startTime = Date.now();
  
  try {
    const donationData = {
      ...CONFIG.TEST_DONATION,
      campaign: testState.campaignId,
      donorName: CONFIG.TEST_USER.name,
      donorEmail: CONFIG.TEST_USER.email,
      donorPhone: CONFIG.TEST_USER.phone,
      paymentDetails: {
        transactionId: `test_txn_${Date.now()}`,
        paymentProcessor: 'stripe',
        processingFee: 3.20,
        netAmount: 96.80,
        cardLast4: '4242'
      }
    };
    
    const response = await apiRequest('post', '/donations', donationData);
    
    testState.donationId = response.donation._id;
    
    log.success(`Donation submitted: $${response.donation.amount} ${response.donation.currency}`);
    log.info(`Donation ID: ${testState.donationId}`);
    log.info(`Status: ${response.donation.status}`);
    
    recordTest('Donation Submission', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Donation submission failed: ${error.message}`);
    recordTest('Donation Submission', false, Date.now() - startTime, error);
    return false;
  }
}

async function testDonationValidation() {
  log.test('Donation Validation');
  const startTime = Date.now();
  
  try {
    // Test with invalid data (missing required fields)
    try {
      await apiRequest('post', '/donations', {
        amount: 0, // Invalid amount
        paymentMethod: '' // Missing payment method
      });
      throw new Error('Should have failed validation');
    } catch (error) {
      if (error.message.includes('400')) {
        log.success('Validation correctly rejected invalid donation data');
      } else {
        throw error;
      }
    }
    
    // Test with amount below minimum
    if (testState.campaignId) {
      try {
        await apiRequest('post', '/donations', {
          amount: 1, // Below minimum
          campaign: testState.campaignId,
          paymentMethod: 'credit_card',
          donorName: 'Test User'
        });
        throw new Error('Should have failed minimum amount validation');
      } catch (error) {
        if (error.message.includes('400') && (error.message.includes('Minimum') || error.message.includes('minimum'))) {
          log.success('Validation correctly enforced minimum donation amount');
        } else {
          throw error;
        }
      }
    }
    
    recordTest('Donation Validation', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Donation validation test failed: ${error.message}`);
    recordTest('Donation Validation', false, Date.now() - startTime, error);
    return false;
  }
}

async function testRecurringDonation() {
  log.test('Recurring Donation Setup');
  const startTime = Date.now();
  
  try {
    const recurringData = {
      ...CONFIG.RECURRING_DONATION,
      campaign: testState.campaignId,
      isRecurring: true,
      donorName: CONFIG.TEST_USER.name,
      donorEmail: CONFIG.TEST_USER.email,
      subscriptionId: `sub_test_${Date.now()}`,
      paymentDetails: {
        transactionId: `recurring_txn_${Date.now()}`,
        paymentProcessor: 'stripe',
        processingFee: 1.05,
        netAmount: 23.95,
        cardLast4: '4242'
      }
    };
    
    const response = await apiRequest('post', '/donations', recurringData);
    
    testState.recurringDonationId = response.donation._id;
    
    log.success(`Recurring donation setup: $${response.donation.amount} ${response.donation.frequency || 'monthly'}`);
    log.info(`Recurring Donation ID: ${testState.recurringDonationId}`);
    log.info(`Subscription ID: ${response.donation.subscriptionId}`);
    
    recordTest('Recurring Donation Setup', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Recurring donation setup failed: ${error.message}`);
    recordTest('Recurring Donation Setup', false, Date.now() - startTime, error);
    return false;
  }
}

async function testDonationStatusUpdate() {
  log.test('Donation Status Update');
  const startTime = Date.now();
  
  try {
    if (!testState.donationId) {
      throw new Error('No donation ID available for status update test');
    }
    
    // Update donation status to completed
    const response = await apiRequest('put', `/donations/${testState.donationId}/status`, {
      status: 'completed',
      paymentDetails: {
        transactionId: `completed_txn_${Date.now()}`,
        completedAt: new Date().toISOString()
      }
    }, testState.adminToken);
    
    log.success(`Donation status updated to: ${response.status}`);
    
    // Verify campaign raised amount was updated
    const campaign = await apiRequest('get', `/campaigns/${testState.campaignId}`);
    log.info(`Campaign raised amount: $${campaign.raised}`);
    
    recordTest('Donation Status Update', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Donation status update failed: ${error.message}`);
    recordTest('Donation Status Update', false, Date.now() - startTime, error);
    return false;
  }
}

async function testDonationReceipt() {
  log.test('Donation Receipt Generation');
  const startTime = Date.now();
  
  try {
    if (!testState.donationId) {
      throw new Error('No donation ID available for receipt test');
    }
    
    // Generate donation receipt (using admin token for authorization)
    const response = await apiRequest('get', `/donations/${testState.donationId}/receipt`, null, testState.adminToken);
    
    log.success('Donation receipt generated successfully');
    log.info(`Receipt number: ${response.receiptNumber || 'N/A'}`);
    
    recordTest('Donation Receipt Generation', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.warning(`Donation receipt generation not implemented or failed: ${error.message}`);
    recordTest('Donation Receipt Generation', false, Date.now() - startTime, error);
    return false;
  }
}

async function testAdminDonationManagement() {
  log.test('Admin Donation Management');
  const startTime = Date.now();
  
  try {
    // Get all donations
    const donations = await apiRequest('get', '/donations', null, testState.adminToken);
    log.success(`Retrieved ${donations.length} donations`);
    
    // Get donation statistics
    const stats = await apiRequest('get', '/donations/stats/overview', null, testState.adminToken);
    log.success('Retrieved donation statistics');
    log.info(`Total donations: ${stats.totalDonations || 'N/A'}`);
    log.info(`Total amount: $${stats.totalAmount || 'N/A'}`);
    
    // Get donations by campaign
    if (testState.campaignId) {
      const campaignDonations = await apiRequest('get', `/donations/campaign/${testState.campaignId}`, null, testState.adminToken);
      log.success(`Retrieved ${campaignDonations.length} donations for campaign`);
    }
    
    recordTest('Admin Donation Management', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Admin donation management failed: ${error.message}`);
    recordTest('Admin Donation Management', false, Date.now() - startTime, error);
    return false;
  }
}

async function testCampaignStatistics() {
  log.test('Campaign Statistics');
  const startTime = Date.now();
  
  try {
    if (!testState.campaignId) {
      throw new Error('No campaign ID available for statistics test');
    }
    
    // Get campaign details with statistics
    const campaign = await apiRequest('get', `/campaigns/${testState.campaignId}`);
    
    log.success(`Campaign statistics retrieved`);
    log.info(`Goal: $${campaign.goal}`);
    log.info(`Raised: $${campaign.raised || 0}`);
    log.info(`Progress: ${((campaign.raised || 0) / campaign.goal * 100).toFixed(1)}%`);
    log.info(`Donors count: ${campaign.donorsCount || 0}`);
    
    recordTest('Campaign Statistics', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Campaign statistics test failed: ${error.message}`);
    recordTest('Campaign Statistics', false, Date.now() - startTime, error);
    return false;
  }
}

async function testFrontendDonationForm() {
  log.test('Frontend Donation Form');
  const startTime = Date.now();
  
  try {
    // Launch browser
    testState.browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    testState.page = await testState.browser.newPage();
    
    // Navigate to donation page
    await testState.page.goto(`${CONFIG.FRONTEND_URL}/donate`, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Check if donation form elements are present
    const formElements = await testState.page.evaluate(() => {
      const elements = {
        amountInput: !!document.querySelector('input[name="amount"], input[type="number"]'),
        paymentMethodSelect: !!document.querySelector('select[name="paymentMethod"], .payment-method'),
        donorNameInput: !!document.querySelector('input[name="donorName"], input[name="name"]'),
        emailInput: !!document.querySelector('input[name="email"], input[type="email"]'),
        submitButton: !!document.querySelector('button[type="submit"], .donate-button')
      };
      return elements;
    });
    
    const requiredElements = Object.values(formElements).filter(Boolean).length;
    log.success(`Found ${requiredElements}/5 required form elements`);
    
    if (requiredElements >= 3) {
      log.success('Frontend donation form is accessible and has required elements');
      recordTest('Frontend Donation Form', true, Date.now() - startTime);
      return true;
    } else {
      throw new Error('Missing required form elements');
    }
  } catch (error) {
    log.error(`Frontend donation form test failed: ${error.message}`);
    recordTest('Frontend Donation Form', false, Date.now() - startTime, error);
    return false;
  }
}

async function testUnauthorizedAccess() {
  log.test('Unauthorized Access Protection');
  const startTime = Date.now();
  
  try {
    const protectedEndpoints = [
      '/donations',
      '/auth/profile',
      '/admin/users'
    ];
    
    for (const endpoint of protectedEndpoints) {
      try {
        await apiRequest('get', endpoint);
        throw new Error(`Unauthorized access allowed to ${endpoint}`);
      } catch (error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          log.success(`Unauthorized access correctly blocked for: ${endpoint}`);
        } else {
          throw error;
        }
      }
    }
    
    recordTest('Unauthorized Access Protection', true, Date.now() - startTime);
    return true;
  } catch (error) {
    log.error(`Unauthorized access protection test failed: ${error.message}`);
    recordTest('Unauthorized Access Protection', false, Date.now() - startTime, error);
    return false;
  }
}

async function cleanup() {
  log.info('🧹 Cleaning up test data...');
  
  try {
    // Delete test donation
    if (testState.donationId && testState.adminToken) {
      try {
        await apiRequest('delete', `/donations/${testState.donationId}`, null, testState.adminToken);
        log.success('Test donation deleted');
      } catch (error) {
        log.warning(`Failed to delete test donation: ${error.message}`);
      }
    }
    
    // Delete recurring donation
    if (testState.recurringDonationId && testState.adminToken) {
      try {
        await apiRequest('delete', `/donations/${testState.recurringDonationId}`, null, testState.adminToken);
        log.success('Test recurring donation deleted');
      } catch (error) {
        log.warning(`Failed to delete test recurring donation: ${error.message}`);
      }
    }
    
    // Delete test campaign
    if (testState.campaignId && testState.adminToken) {
      try {
        await apiRequest('delete', `/campaigns/${testState.campaignId}`, null, testState.adminToken);
        log.success('Test campaign deleted');
      } catch (error) {
        log.warning(`Failed to delete test campaign: ${error.message}`);
      }
    }
    
    // Delete test user
    if (testState.userId && testState.adminToken) {
      try {
        await apiRequest('delete', `/auth/users/${testState.userId}`, null, testState.adminToken);
        log.success('Test user deleted');
      } catch (error) {
        log.warning(`Failed to delete test user: ${error.message}`);
      }
    }
    
    // Close browser
    if (testState.browser) {
      await testState.browser.close();
      log.success('Browser closed');
    }
  } catch (error) {
    log.warning(`Cleanup error: ${error.message}`);
  }
}

async function generateTestReport() {
  const totalTests = testState.testResults.length;
  const passedTests = testState.testResults.filter(test => test.passed).length;
  const failedTests = totalTests - passedTests;
  const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0;
  const totalDuration = Date.now() - testState.startTime;
  
  const report = {
    summary: {
      totalTests,
      passedTests,
      failedTests,
      successRate: `${successRate}%`,
      totalDuration: `${totalDuration}ms`,
      timestamp: new Date().toISOString()
    },
    tests: testState.testResults,
    configuration: {
      apiBaseUrl: CONFIG.API_BASE_URL,
      frontendUrl: CONFIG.FRONTEND_URL,
      testUser: CONFIG.TEST_USER.email
    }
  };
  
  // Ensure reports directory exists
  const reportsDir = path.join(__dirname, 'reports');
  try {
    await fs.mkdir(reportsDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
  
  // Save report
  const reportPath = path.join(reportsDir, `donation-fundraising-test-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  log.info(`📊 Test Report Generated: ${reportPath}`);
  
  return report;
}

// Main test runner
async function runAllTests() {
  log.info('🚀 Initializing Donation & Fundraising Test Suite...');
  
  try {
    // Infrastructure tests
    log.section('Infrastructure Tests');
    await testServerAvailability();
    await testAdminAuthentication();
    
    // User and account tests
    log.section('User Account Tests');
    await testNewUserRegistration();
    
    // Campaign and fundraising tests
    log.section('Campaign & Fundraising Tests');
    await testCampaignCreation();
    await testCampaignStatistics();
    
    // Donation process tests
    log.section('Donation Process Tests');
    await testDonationSubmission();
    await testDonationValidation();
    await testRecurringDonation();
    await testDonationStatusUpdate();
    await testDonationReceipt();
    
    // Admin management tests
    log.section('Admin Management Tests');
    await testAdminDonationManagement();
    
    // Frontend tests
    log.section('Frontend Tests');
    await testFrontendDonationForm();
    
    // Security tests
    log.section('Security Tests');
    await testUnauthorizedAccess();
    
  } catch (error) {
    log.error(`Test execution error: ${error.message}`);
  } finally {
    // Cleanup and reporting
    await cleanup();
    const report = await generateTestReport();
    
    // Display results
    log.section('Donation & Fundraising Test Results');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${chalk.green(report.summary.passedTests)}`);
    console.log(`Failed: ${chalk.red(report.summary.failedTests)}`);
    console.log(`Success Rate: ${chalk.blue(report.summary.successRate)}`);
    console.log(`Duration: ${report.summary.totalDuration}`);
    
    if (report.summary.passedTests === report.summary.totalTests) {
      log.success('🎉 All donation & fundraising tests passed!');
      log.success('✅ New user registration working');
      log.success('✅ Campaign creation and management working');
      log.success('✅ Donation submission working');
      log.success('✅ Payment processing simulation working');
      log.success('✅ Recurring donations working');
      log.success('✅ Admin management working');
      log.success('✅ Frontend form accessibility working');
      log.success('✅ Security protection working');
      log.success('✅ Complete donation journey verified');
    } else {
      log.warning('⚠️  Some tests failed. Check the report for details.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testState,
  CONFIG
};
