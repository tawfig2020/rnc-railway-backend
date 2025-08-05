/**
 * Vendor Management Integration Test
 * 
 * This script tests the complete vendor management lifecycle including:
 * - Vendor registration
 * - Vendor approval process
 * - Vendor profile management
 * - Vendor reviews and ratings
 * - Featured vendor management
 * - Vendor product management
 * - Admin dashboard statistics
 * 
 * Run with: node testing/vendor-management-test.js
 */

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@refugeenetwork.com';
const ADMIN_PASSWORD = 'Admin@123';
const VENDOR_EMAIL = 'testvendor@example.com';
const VENDOR_PASSWORD = 'Vendor@123';
const USER_EMAIL = 'testuser@example.com';
const USER_PASSWORD = 'Test@123';

// Debug flag - set to true for additional logging
const DEBUG = true;

// Test results tracking
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// Store tokens and IDs for use across tests
const testData = {
  adminToken: null,
  vendorToken: null,
  userToken: null,
  vendorId: null,
  vendorUserId: null,
  productId: null,
  reviewId: null,
  testImagePath: path.join(__dirname, '../uploads/test-logo.png')
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to log requests in debug mode
api.interceptors.request.use(request => {
  if (DEBUG) {
    console.log(`Request: ${request.method.toUpperCase()} ${request.baseURL}${request.url}`);
  }
  return request;
});

// Add response interceptor to log responses in debug mode
api.interceptors.response.use(
  response => {
    if (DEBUG) {
      console.log(`Response: ${response.status} ${response.statusText}`);
    }
    return response;
  },
  error => {
    if (DEBUG && error.response) {
      console.log(`Error response: ${error.response.status} ${error.response.statusText}`);
      console.log(`Error data: ${JSON.stringify(error.response.data)}`);
    }
    return Promise.reject(error);
  }
);

// Function to check if server is running
async function checkServerStatus() {
  try {
    await api.get('/auth/status');
    return true;
  } catch (error) {
    if (error.response) {
      // Even a 404 or 401 means the server is running
      return true;
    }
    return false;
  }
}

// Helper functions
const logSuccess = (message) => console.log(chalk.green(`✓ ${message}`));
const logError = (message, error) => {
  console.log(chalk.red(`✗ ${message}`));
  if (error) {
    console.log(chalk.red(`  Error: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`  Status: ${error.response.status}`));
      console.log(chalk.red(`  Data: ${JSON.stringify(error.response.data)}`));
    }
  }
};
const logInfo = (message) => console.log(chalk.blue(`ℹ ${message}`));
const logWarning = (message) => console.log(chalk.yellow(`⚠ ${message}`));
const logSection = (title) => console.log(chalk.cyan(`\n=== ${title} ===`));

// Run a test and handle errors
async function runTest(name, testFn) {
  logInfo(`Running test: ${name}`);
  
  try {
    await testFn();
    passedTests++;
    logSuccess(`Test passed: ${name}`);
    return true;
  } catch (error) {
    failedTests++;
    logError(`Test failed: ${name}`, error);
    return false;
  }
}

// Create a test image if it doesn't exist
function createTestImage() {
  const testImageDir = path.dirname(testData.testImagePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(testImageDir)) {
    fs.mkdirSync(testImageDir, { recursive: true });
  }
  
  // Create a simple test image if it doesn't exist
  if (!fs.existsSync(testData.testImagePath)) {
    // This is a minimal valid PNG file
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x00, 0x00,
      0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testData.testImagePath, pngHeader);
    logInfo(`Created test image at ${testData.testImagePath}`);
  }
}

// Main test sequence
async function runVendorManagementTests() {
  console.log('=== VENDOR MANAGEMENT INTEGRATION TEST ===');
  logInfo('Testing RNC Marketplace Vendor Management API endpoints and frontend integration');
  
  // Check if server is running
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    logError('Server is not running. Please start the server and try again.');
    return;
  }
  
  // Create test image
  createTestImage();
  
  // 1. Authentication
  logSection('AUTHENTICATION');
  
  // 1.1 Admin login
  await runTest('Admin Authentication', async () => {
    logInfo(`Attempting to login with ${ADMIN_EMAIL}`);
    
    const response = await api.post('/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    testData.adminToken = response.data.token;
    
    if (!testData.adminToken) {
      throw new Error('No token received from admin login');
    }
    
    logSuccess('Admin login successful');
  });
  
  // 1.2 Create vendor user if needed
  await runTest('Create Vendor User (if needed)', async () => {
    try {
      // Try to login as vendor user
      const loginResponse = await api.post('/auth/login', {
        email: VENDOR_EMAIL,
        password: VENDOR_PASSWORD
      });
      
      testData.vendorToken = loginResponse.data.token;
      testData.vendorUserId = loginResponse.data.user._id;
      logSuccess('Vendor user login successful');
    } catch (error) {
      // If login fails, create a new vendor user
      logInfo('Creating new vendor user');
      
      // Set admin token for user creation
      api.defaults.headers.common['x-auth-token'] = testData.adminToken;
      
      const registerResponse = await api.post('/users', {
        name: 'Test Vendor',
        email: VENDOR_EMAIL,
        password: VENDOR_PASSWORD,
        role: 'user', // Start as regular user, will be promoted to vendor
        emailVerified: true
      });
      
      // Login as the new vendor user
      const loginResponse = await api.post('/auth/login', {
        email: VENDOR_EMAIL,
        password: VENDOR_PASSWORD
      });
      
      testData.vendorToken = loginResponse.data.token;
      testData.vendorUserId = loginResponse.data.user._id;
      logSuccess('Vendor user created and logged in');
    }
    
    if (!testData.vendorToken) {
      throw new Error('No token received from vendor login');
    }
  });
  
  // 1.3 Create regular user if needed
  await runTest('Create Regular User (if needed)', async () => {
    try {
      // Try to login as regular user
      const loginResponse = await api.post('/auth/login', {
        email: USER_EMAIL,
        password: USER_PASSWORD
      });
      
      testData.userToken = loginResponse.data.token;
      logSuccess('Regular user login successful');
    } catch (error) {
      // If login fails, create a new regular user
      logInfo('Creating new regular user');
      
      // Set admin token for user creation
      api.defaults.headers.common['x-auth-token'] = testData.adminToken;
      
      const registerResponse = await api.post('/users', {
        name: 'Test User',
        email: USER_EMAIL,
        password: USER_PASSWORD,
        role: 'user',
        emailVerified: true
      });
      
      // Login as the new regular user
      const loginResponse = await api.post('/auth/login', {
        email: USER_EMAIL,
        password: USER_PASSWORD
      });
      
      testData.userToken = loginResponse.data.token;
      logSuccess('Regular user created and logged in');
    }
    
    if (!testData.userToken) {
      throw new Error('No token received from user login');
    }
  });
  
  // 2. Vendor Registration
  logSection('VENDOR REGISTRATION');
  
  // 2.1 Register as a vendor
  await runTest('Register as Vendor', async () => {
    // Set vendor token for registration
    api.defaults.headers.common['x-auth-token'] = testData.vendorToken;
    
    // Create form data for multipart/form-data request (for file uploads)
    const formData = new FormData();
    formData.append('businessName', 'Test Vendor Business');
    formData.append('description', 'This is a test vendor for integration testing');
    formData.append('contactEmail', VENDOR_EMAIL);
    formData.append('contactPhone', '123-456-7890');
    formData.append('website', 'https://testvendor.example.com');
    formData.append('categories', 'crafts,art');
    formData.append('storyOfBusiness', 'This business was started for integration testing');
    
    // Add address as JSON string
    const address = {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      postalCode: '12345'
    };
    formData.append('address', JSON.stringify(address));
    
    // Add social media links
    formData.append('facebook', 'https://facebook.com/testvendor');
    formData.append('instagram', 'https://instagram.com/testvendor');
    
    // Add logo image
    const logoFile = fs.createReadStream(testData.testImagePath);
    formData.append('logo', logoFile);
    
    // Make the request
    const response = await api.post('/vendors', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    testData.vendorId = response.data.vendor._id;
    
    if (!testData.vendorId) {
      throw new Error('Failed to register as vendor');
    }
    
    logSuccess(`Registered as vendor with ID: ${testData.vendorId}`);
  });
  
  // 3. Vendor Approval Process
  logSection('VENDOR APPROVAL PROCESS');
  
  // 3.1 Get pending vendor applications (as admin)
  await runTest('Get Pending Vendor Applications', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    const response = await api.get('/vendors?status=pending');
    
    if (!response.data || !response.data.vendors) {
      throw new Error('Failed to get pending vendor applications');
    }
    
    // Verify our test vendor is in the list
    const foundVendor = response.data.vendors.find(vendor => vendor._id === testData.vendorId);
    
    if (!foundVendor) {
      throw new Error('Test vendor not found in pending applications');
    }
    
    logSuccess(`Retrieved ${response.data.vendors.length} pending vendor applications`);
  });
  
  // 3.2 Approve vendor application
  await runTest('Approve Vendor Application', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    await api.put(`/vendors/${testData.vendorId}/approval`, {
      status: 'approved'
    });
    
    // Verify approval
    const vendorResponse = await api.get(`/vendors/${testData.vendorId}`);
    
    if (vendorResponse.data.vendor.approvalStatus !== 'approved') {
      throw new Error(`Vendor status not updated. Expected 'approved' but got '${vendorResponse.data.vendor.approvalStatus}'`);
    }
    
    logSuccess('Vendor application approved successfully');
  });
  
  // 4. Vendor Profile Management
  logSection('VENDOR PROFILE MANAGEMENT');
  
  // 4.1 Update vendor profile (as vendor)
  await runTest('Update Vendor Profile', async () => {
    // Set vendor token
    api.defaults.headers.common['x-auth-token'] = testData.vendorToken;
    
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append('businessName', 'Updated Test Vendor');
    formData.append('description', 'This description has been updated');
    
    // Make the request
    const response = await api.put(`/vendors/${testData.vendorId}`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    // Verify update
    if (response.data.vendor.businessName !== 'Updated Test Vendor') {
      throw new Error('Vendor profile not updated correctly');
    }
    
    logSuccess('Vendor profile updated successfully');
  });
  
  // 4.2 Set vendor as featured (as admin)
  await runTest('Set Vendor as Featured', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append('featured', 'true');
    
    // Make the request
    await api.put(`/vendors/${testData.vendorId}`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    // Verify featured status
    const vendorResponse = await api.get(`/vendors/${testData.vendorId}`);
    
    if (vendorResponse.data.vendor.featured !== true) {
      throw new Error('Vendor featured status not updated correctly');
    }
    
    logSuccess('Vendor set as featured successfully');
  });
  
  // 5. Vendor Listings and Search
  logSection('VENDOR LISTINGS AND SEARCH');
  
  // 5.1 Get all vendors (public)
  await runTest('Get All Vendors', async () => {
    // Clear auth token for public request
    delete api.defaults.headers.common['x-auth-token'];
    
    const response = await api.get('/vendors');
    
    if (!response.data || !response.data.vendors) {
      throw new Error('Failed to get vendors');
    }
    
    // Verify our test vendor is in the list (should be approved now)
    const foundVendor = response.data.vendors.find(vendor => vendor._id === testData.vendorId);
    
    if (!foundVendor) {
      throw new Error('Test vendor not found in vendors list');
    }
    
    logSuccess(`Retrieved ${response.data.vendors.length} vendors`);
  });
  
  // 5.2 Search vendors by category
  await runTest('Search Vendors by Category', async () => {
    const response = await api.get('/vendors?category=art');
    
    if (!response.data || !response.data.vendors) {
      throw new Error('Failed to search vendors by category');
    }
    
    logSuccess(`Found ${response.data.vendors.length} vendors in 'art' category`);
  });
  
  // 5.3 Get featured vendors
  await runTest('Get Featured Vendors', async () => {
    const response = await api.get('/vendors?featured=true');
    
    if (!response.data || !response.data.vendors) {
      throw new Error('Failed to get featured vendors');
    }
    
    // Verify our test vendor is in the featured list
    const foundVendor = response.data.vendors.find(vendor => vendor._id === testData.vendorId);
    
    if (!foundVendor) {
      throw new Error('Test vendor not found in featured vendors list');
    }
    
    logSuccess(`Retrieved ${response.data.vendors.length} featured vendors`);
  });
  
  // 6. Vendor Products
  logSection('VENDOR PRODUCTS');
  
  // 6.1 Create a product for the vendor
  await runTest('Create Vendor Product', async () => {
    // Set vendor token
    api.defaults.headers.common['x-auth-token'] = testData.vendorToken;
    
    const productData = {
      name: 'Test Vendor Product',
      description: 'This is a test product for the vendor',
      price: 29.99,
      stock: 100,
      status: 'active',
      vendor: testData.vendorId,
      images: ['https://via.placeholder.com/300']
    };
    
    const response = await api.post('/products', productData);
    testData.productId = response.data._id;
    
    if (!testData.productId) {
      throw new Error('Failed to create vendor product');
    }
    
    logSuccess(`Created vendor product with ID: ${testData.productId}`);
  });
  
  // 6.2 Get vendor products
  await runTest('Get Vendor Products', async () => {
    // This endpoint might be implemented differently depending on your API
    // Try both common implementations
    
    try {
      // Option 1: Direct vendor products endpoint
      const response = await api.get(`/vendors/${testData.vendorId}/products`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format for vendor products');
      }
      
      logSuccess(`Retrieved ${response.data.length} products for vendor`);
    } catch (error) {
      // Option 2: Filter products by vendor ID
      const response = await api.get(`/products?vendor=${testData.vendorId}`);
      
      if (!response.data || !response.data.products) {
        throw new Error('Failed to get vendor products');
      }
      
      // Verify our test product is in the list
      const foundProduct = response.data.products.find(product => product._id === testData.productId);
      
      if (!foundProduct) {
        throw new Error('Test product not found in vendor products');
      }
      
      logSuccess(`Retrieved ${response.data.products.length} products for vendor`);
    }
  });
  
  // 7. Vendor Reviews
  logSection('VENDOR REVIEWS');
  
  // 7.1 Add a review for the vendor
  await runTest('Add Vendor Review', async () => {
    // Set user token (not vendor, as vendors shouldn't review themselves)
    api.defaults.headers.common['x-auth-token'] = testData.userToken;
    
    const reviewData = {
      rating: 5,
      comment: 'Excellent vendor! Great products and service.'
    };
    
    const response = await api.post(`/vendors/${testData.vendorId}/review`, reviewData);
    
    if (!response.data || !response.data.ratings) {
      throw new Error('Failed to add vendor review');
    }
    
    // Store the review ID if available
    if (response.data.ratings && response.data.ratings.length > 0) {
      testData.reviewId = response.data.ratings[0]._id;
    }
    
    logSuccess('Added vendor review successfully');
  });
  
  // 7.2 Get vendor with reviews
  await runTest('Get Vendor with Reviews', async () => {
    // Clear auth token for public request
    delete api.defaults.headers.common['x-auth-token'];
    
    const response = await api.get(`/vendors/${testData.vendorId}`);
    
    if (!response.data || !response.data.vendor) {
      throw new Error('Failed to get vendor with reviews');
    }
    
    if (!response.data.vendor.ratings || response.data.vendor.ratings.length === 0) {
      throw new Error('Vendor reviews not found');
    }
    
    logSuccess(`Retrieved vendor with ${response.data.vendor.ratings.length} reviews`);
    logInfo(`Average rating: ${response.data.vendor.averageRating}`);
  });
  
  // 8. Admin Dashboard
  logSection('ADMIN DASHBOARD');
  
  // 8.1 Get vendor statistics for admin dashboard
  await runTest('Get Vendor Dashboard Statistics', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    const response = await api.get('/vendors/admin/dashboard');
    
    if (!response.data || typeof response.data.totalVendors !== 'number') {
      throw new Error('Failed to get vendor dashboard statistics');
    }
    
    logSuccess('Retrieved vendor dashboard statistics');
    
    // Log some stats for verification
    logInfo(`Total Vendors: ${response.data.totalVendors}`);
    logInfo(`Pending Vendors: ${response.data.pendingVendors}`);
    logInfo(`Approved Vendors: ${response.data.approvedVendors}`);
    logInfo(`Featured Vendors: ${response.data.featuredVendors}`);
  });
  
  // 9. Cleanup (optional - comment out if you want to keep test data)
  logSection('CLEANUP');
  
  // 9.1 Delete test product
  await runTest('Delete Test Product', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    await api.delete(`/products/${testData.productId}`);
    
    // Verify deletion
    try {
      await api.get(`/products/${testData.productId}`);
      throw new Error('Product was not deleted');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logSuccess('Test product deleted successfully');
      } else {
        throw error;
      }
    }
  });
  
  // 9.2 Deactivate test vendor (instead of deleting)
  await runTest('Deactivate Test Vendor', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append('active', 'false');
    
    // Make the request
    await api.put(`/vendors/${testData.vendorId}`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    // Verify deactivation
    const vendorResponse = await api.get(`/vendors/${testData.vendorId}`);
    
    if (vendorResponse.data.vendor.active !== false) {
      throw new Error('Vendor active status not updated correctly');
    }
    
    logSuccess('Test vendor deactivated successfully');
  });
  
  // Print test summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Skipped: ${skippedTests}`);
  console.log(`Total: ${passedTests + failedTests + skippedTests}`);
  
  if (failedTests > 0) {
    console.log(chalk.red(`✗ ${failedTests} test(s) failed. Please check the logs above for details.`));
    process.exit(1);
  } else {
    console.log(chalk.green('✓ All vendor management tests passed!'));
  }
}

// Run the tests
runVendorManagementTests().catch(error => {
  console.error('Unhandled error in test runner:', error);
  process.exit(1);
});
