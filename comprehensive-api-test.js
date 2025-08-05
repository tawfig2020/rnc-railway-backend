/**
 * Comprehensive API Testing Script
 * 
 * This script tests all API endpoints to verify functionality and integration
 * Run with: node comprehensive-api-test.js
 * 
 * Make sure the server is running before executing this script
 */
const axios = require('axios');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

// Import test modules
const authTests = require('./testing/auth-tests');
const profileTests = require('./testing/profile-tests');
const healthTests = require('./testing/health-tests');
const supportTests = require('./testing/support-tests');
const blogTests = require('./testing/blog-tests');
const courseTests = require('./testing/course-tests');
const eventTests = require('./testing/event-tests');
const resourceTests = require('./testing/resource-tests');
const productTests = require('./testing/product-tests');
const vendorTests = require('./testing/vendor-tests');
const orderTests = require('./testing/order-tests');
const campaignTests = require('./testing/campaign-tests');
const donationTests = require('./testing/donation-tests');
const serviceTests = require('./testing/service-tests');
const categoryTests = require('./testing/category-tests');
const discountTests = require('./testing/discount-tests');
const addressTests = require('./testing/address-tests');

// Configuration
const API_URL = 'http://localhost:5001/api';
let authToken = null;

// Test credentials - using seeded admin user
const TEST_USER = {
  email: 'admin@refugeenetwork.com',
  password: '123456'
};

// Test data storage for sharing between test modules
const testData = {
  userId: null,
  profileId: null,
  healthId: null,
  blogId: null,
  courseId: null,
  eventId: null,
  resourceId: null,
  productId: null,
  vendorId: null,
  orderId: null,
  campaignId: null,
  donationId: null,
  serviceId: null,
  categoryId: null,
  discountId: null,
  addressId: null,
  supportId: null
};

// Helper function for colored console output
const logSuccess = (msg) => console.log(`✓ SUCCESS: ${msg}`.green);
const logError = (msg) => console.error(`✗ ERROR: ${msg}`.red);
const logInfo = (msg) => console.log(`ℹ INFO: ${msg}`.blue);
const logWarning = (msg) => console.log(`⚠ WARNING: ${msg}`.yellow);

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, auth = false) {
  try {
    const headers = auth && authToken ? { 'x-auth-token': authToken } : {};
    const config = { headers };
    
    let response;
    if (method === 'get') {
      response = await axios.get(`${API_URL}${endpoint}`, config);
    } else if (method === 'post') {
      response = await axios.post(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'put') {
      response = await axios.put(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'delete') {
      response = await axios.delete(`${API_URL}${endpoint}`, config);
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

// Ensure test directory exists
const testingDir = path.join(__dirname, 'testing');
if (!fs.existsSync(testingDir)) {
  fs.mkdirSync(testingDir);
}

// Run all tests
async function runTests() {
  console.log('\n==== COMPREHENSIVE API ENDPOINT TESTING ====\n'.yellow);
  
  try {
    // Authentication is required for most tests
    authToken = await authTests.runTests(apiRequest, TEST_USER, testData);
    
    if (authToken) {
      logSuccess('Authentication successful, proceeding with other tests');
      
      // Core profile and health tests
      await profileTests.runTests(apiRequest, testData);
      await healthTests.runTests(apiRequest, testData);
      await supportTests.runTests(apiRequest, testData);
      
      // Content tests
      await blogTests.runTests(apiRequest, testData);
      await courseTests.runTests(apiRequest, testData);
      await eventTests.runTests(apiRequest, testData);
      await resourceTests.runTests(apiRequest, testData);
      
      // Marketplace tests
      await productTests.runTests(apiRequest, testData);
      await vendorTests.runTests(apiRequest, testData);
      await orderTests.runTests(apiRequest, testData);
      
      // Fundraising tests
      await campaignTests.runTests(apiRequest, testData);
      await donationTests.runTests(apiRequest, testData);
      
      // Service and category tests
      await serviceTests.runTests(apiRequest, testData);
      await categoryTests.runTests(apiRequest, testData);
      
      // Latest features tests
      await discountTests.runTests(apiRequest, testData);
      await addressTests.runTests(apiRequest, testData);
      
      // Generate summary report
      generateTestReport();
    } else {
      logError('Authentication failed, cannot proceed with other tests');
    }
    
    console.log('\n==== TESTS COMPLETED ====\n'.yellow);
  } catch (error) {
    logError(`Test execution error: ${error.message}`);
  }
}

// Generate a summary report of all tests
function generateTestReport() {
  logInfo('Generating test summary report...');
  
  const successCount = global.successCount || 0;
  const errorCount = global.errorCount || 0;
  const totalTests = successCount + errorCount;
  
  console.log('\n==== TEST SUMMARY ===='.yellow);
  console.log(`Total tests executed: ${totalTests}`);
  console.log(`Successful tests: ${successCount}`.green);
  console.log(`Failed tests: ${errorCount}`.red);
  console.log(`Success rate: ${(successCount/totalTests*100).toFixed(2)}%`);
  console.log('====================='.yellow);
}

// Export API request helper for test modules
module.exports = {
  apiRequest,
  logSuccess,
  logError,
  logInfo,
  logWarning,
  API_URL
};

// Execute tests if this script is run directly
if (require.main === module) {
  // Initialize counters
  global.successCount = 0;
  global.errorCount = 0;
  
  runTests();
}
