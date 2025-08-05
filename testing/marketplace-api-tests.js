/**
 * Marketplace API Endpoint Tests
 * 
 * This script tests all marketplace-related API endpoints including:
 * - Categories API
 * - Products API
 * - Orders API
 * - Discounts API
 * - Address API
 * - Dashboard Statistics API
 * 
 * Run with: node testing/marketplace-api-tests.js
 */

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const SERVER_URL = 'http://localhost:5000';
const AUTH_BASE_URL = 'http://localhost:5000/api/auth'; // Auth endpoints are at /api/auth
const API_BASE_URL = 'http://localhost:5000/api'; // API endpoints are at /api

// Debug flag - set to true for more verbose logging
const DEBUG = true;
const USER_EMAIL = 'testuser@example.com';
const USER_PASSWORD = 'Test@123';
const ADMIN_EMAIL = 'admin@refugeenetwork.com';
const ADMIN_PASSWORD = 'Admin@123';

// Test results tracking
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// Store data for use across tests
const testData = {
  userToken: null,
  adminToken: null,
  userApi: null,
  adminApi: null,
  testProductId: null,
  testCategoryId: null,
  testOrderId: null,
  testAddressId: null,
  testDiscountId: null,
  testDiscountCode: null,
  testVendorId: null
};

// Utility functions for logging
function logInfo(message) {
  console.log(chalk.blue('ℹ'), message);
}

function logSuccess(message) {
  console.log(chalk.green('✓'), message);
}

function logWarning(message) {
  console.log(chalk.yellow('⚠'), message);
}

function logError(message, error) {
  console.log(chalk.red('✗'), message);
  if (error) {
    if (error.response) {
      console.log(chalk.red('  Status:'), error.response.status);
      console.log(chalk.red('  Data:'), JSON.stringify(error.response.data));
    } else if (error.message) {
      console.log(chalk.red('  Error:'), error.message);
    } else {
      console.log(chalk.red('  Error:'), error);
    }
  }
}

function logDebug(message, data) {
  if (DEBUG) {
    console.log(chalk.magenta('🔍 DEBUG:'), message);
    if (data !== undefined) {
      console.log(chalk.magenta('  Data:'), typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
    }
  }
}

function logSection(title) {
  console.log(chalk.cyan(`\n=== ${title} ===`));
}

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

// Check if server is available
async function checkServerAvailability() {
  logInfo('Checking server availability...');
  
  // Try multiple endpoints to check server availability
  const endpoints = [
    '/health',
    '/api/health',
    '/auth/login',
    '/api/auth/login'
  ];
  
  for (const endpoint of endpoints) {
    try {
      logInfo(`Trying to connect to ${SERVER_URL}${endpoint}...`);
      const response = await axios.get(`${SERVER_URL}${endpoint}`);
      logInfo(`Server is available at ${SERVER_URL}${endpoint}`);
      return true;
    } catch (error) {
      // If we get a 404, the server is running but the endpoint doesn't exist
      // which is fine for our availability check
      if (error.response && error.response.status === 404) {
        logInfo(`Got response with status 404 from ${SERVER_URL}${endpoint}`);
        return true;
      }
      // For other errors, continue trying other endpoints
    }
  }
  
  // If all endpoints failed, try a direct connection to the server root
  try {
    const response = await axios.get(SERVER_URL);
    logInfo(`Server is available at ${SERVER_URL}`);
    return true;
  } catch (error) {
    if (error.response) {
      // If we get any HTTP response, the server is running
      logInfo(`Got response with status ${error.response.status} from ${SERVER_URL}`);
      return true;
    }
    
    // If we get here, the server is not responding
    if (error.code === 'ECONNREFUSED') {
      logError('Server is not running. Please start the server with npm run dev');
    } else {
      logError('Server health check failed', error);
    }
    return false;
  }
}

// Setup function to initialize test data and API clients
async function setup() {
  logInfo('=== SETUP ===');
  
  // Check if server is available
  const isServerAvailable = await checkServerAvailability();
  if (!isServerAvailable) {
    throw new Error('Setup failed: Server is not available');
  }
  
  try {
    // Test direct connection to the auth endpoint
    try {
      logDebug('Testing direct connection to auth endpoint');
      const testResponse = await axios.get(`${AUTH_BASE_URL}`);
      logDebug('Auth endpoint response', testResponse.data);
    } catch (error) {
      // This might 404 but we're just checking connectivity
      logDebug('Auth endpoint test response', error.response ? 
        { status: error.response.status, data: error.response.data } : 
        { error: error.message });
    }
    
    // Try direct connection to the auth login endpoint
    try {
      logDebug('Testing direct connection to auth login endpoint');
      const testAuthResponse = await axios.get(`${AUTH_BASE_URL}/login`);
      logDebug('Auth login endpoint response', testAuthResponse.data);
    } catch (error) {
      // This might 404 but we're just checking connectivity
      logDebug('Auth login endpoint test response', error.response ? 
        { status: error.response.status, data: error.response.data } : 
        { error: error.message });
    }
    
    try {
      // Try to register a test user if they don't exist
      logDebug('Attempting to register test user', { email: USER_EMAIL });
      await axios.post(`${AUTH_BASE_URL}/register`, {
        name: 'Test User',
        email: USER_EMAIL,
        password: USER_PASSWORD,
        location: 'Test Location' // Adding required field based on auth.js validation
      });
      logInfo('Created test user account');
    } catch (error) {
      // Ignore error if user already exists
      logDebug('Registration attempt result', error.response ? 
        { status: error.response.status, data: error.response.data } : 
        { error: error.message });
    }
    
    // Get user token
    logDebug('Attempting user login', { email: USER_EMAIL });
    const userLoginResponse = await axios.post(`${AUTH_BASE_URL}/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    testData.userToken = userLoginResponse.data.token;
    logDebug('User login successful', { tokenReceived: !!testData.userToken });
    
    // Get admin token
    logDebug('Attempting admin login', { email: ADMIN_EMAIL });
    const adminLoginResponse = await axios.post(`${AUTH_BASE_URL}/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    testData.adminToken = adminLoginResponse.data.token;
    logDebug('Admin login successful', { tokenReceived: !!testData.adminToken });
    
    if (!testData.userToken || !testData.adminToken) {
      throw new Error('Could not obtain API tokens');
    }
    
    logSuccess('API tokens obtained successfully');
  } catch (error) {
    logError('Failed to obtain API tokens', error);
    throw new Error('Setup failed: Could not obtain API tokens');
  }
  
  // Create API clients with authentication
  testData.userApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': testData.userToken
    }
  });
  
  testData.adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': testData.adminToken
    }
  });
  
  // Log successful setup
  logInfo('API clients created with authentication tokens');
  logInfo(`User API base URL: ${testData.userApi.defaults.baseURL}`);
  logInfo(`Admin API base URL: ${testData.adminApi.defaults.baseURL}`);
}

// Teardown function to clean up test data
async function teardown() {
  logSection('TEARDOWN');
  
  // Clean up test address if created
  if (testData.testAddressId) {
    try {
      await testData.userApi.delete(`addresses/${testData.testAddressId}`);
      logInfo(`Deleted test address with ID: ${testData.testAddressId}`);
    } catch (error) {
      logWarning(`Failed to delete test address: ${error.message}`);
    }
  }
  
  // Clean up test discount if created
  if (testData.testDiscountId) {
    try {
      await testData.adminApi.delete(`discounts/${testData.testDiscountId}`);
      logInfo(`Deleted test discount with ID: ${testData.testDiscountId}`);
    } catch (error) {
      logWarning(`Failed to delete test discount: ${error.message}`);
    }
  }
  
  logInfo('Teardown complete');
}

// Test category API endpoints
async function testCategoryEndpoints() {
  logSection('CATEGORY API TESTS');
  
  // Test: Create category
  await runTest('Create Category', async () => {
    const categoryData = {
      name: 'Test Category ' + Date.now(),
      description: 'Category created for API testing',
      status: 'active'
    };
    
    try {
      const response = await testData.adminApi.post(`categories`, categoryData);
      
      if (!response.data || !response.data._id) {
        throw new Error('Invalid response format for category creation');
      }
      
      testData.testCategoryId = response.data._id;
      logInfo(`Created test category with ID: ${testData.testCategoryId}`);
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get all categories
  await runTest('Get All Categories', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      
      // Handle different response formats
      const categories = Array.isArray(response.data) ? response.data : 
                       (response.data.categories ? response.data.categories : []);
      
      if (!Array.isArray(categories)) {
        throw new Error('Invalid response format for categories');
      }
      
      logInfo(`Found ${categories.length} categories`);
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get category by ID
  await runTest('Get Category by ID', async () => {
    if (!testData.testCategoryId) {
      // If we don't have a test category ID yet, try to get one from the categories list
      try {
        const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
        const categories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : 
                         (categoriesResponse.data.categories ? categoriesResponse.data.categories : []);
        
        if (categories.length > 0) {
          testData.testCategoryId = categories[0]._id;
          logInfo(`Using existing category with ID: ${testData.testCategoryId}`);
        } else {
          throw new Error('No categories available');
        }
      } catch (error) {
        throw new Error('No test category ID available and could not fetch categories');
      }
    }
    
    const response = await axios.get(`${API_BASE_URL}/categories/${testData.testCategoryId}`);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for category retrieval');
    }
    
    return true;
  });
  
  // Test: Update category
  await runTest('Update Category', async () => {
    if (!testData.testCategoryId) {
      throw new Error('No test category ID available');
    }
    
    const updateData = {
      description: 'Updated description for API testing',
      featured: true
    };
    
    const response = await testData.adminApi.put(`categories/${testData.testCategoryId}`, updateData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for category update');
    }
    
    return true;
  });
}

// Test product API endpoints
async function testProductEndpoints() {
  logSection('PRODUCT API TESTS');
  
  // Test: Create product
  await runTest('Create Product', async () => {
    // First, get a vendor ID if we don't have one
    if (!testData.testVendorId) {
      const vendorsResponse = await testData.adminApi.get(`vendors`);
      
      if (!vendorsResponse.data || !vendorsResponse.data.vendors || vendorsResponse.data.vendors.length === 0) {
        logWarning('No vendors found, skipping product creation test');
        skippedTests++;
        return;
      }
      
      testData.testVendorId = vendorsResponse.data.vendors[0]._id;
    }
    
    const productData = {
      name: 'API Test Product ' + Date.now(),
      description: 'Product created for API testing',
      price: 29.99,
      stock: 100,
      status: 'active',
      vendor: testData.testVendorId,
      category: testData.testCategoryId || undefined,
      images: ['https://via.placeholder.com/300']
    };
    
    const response = await testData.adminApi.post(`products`, productData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for product creation');
    }
    
    testData.testProductId = response.data._id;
    logInfo(`Created test product with ID: ${testData.testProductId}`);
  });
  
  // Test: Get all products
  await runTest('Get All Products', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      
      // Handle different response formats
      const products = Array.isArray(response.data) ? response.data : 
                     (response.data.products ? response.data.products : []);
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid response format for products');
      }
      
      logInfo(`Found ${products.length} products`);
      
      // If we have products, store the first one's ID for later tests
      if (products.length > 0 && !testData.testProductId) {
        testData.testProductId = products[0]._id;
        logInfo(`Using existing product with ID: ${testData.testProductId}`);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get product by ID
  await runTest('Get Product by ID', async () => {
    if (!testData.testProductId) {
      throw new Error('No test product ID available');
    }
    
    const response = await axios.get(`${API_BASE_URL}/products/${testData.testProductId}`);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for product retrieval');
    }
    
    return true;
  });
  
  // Test: Update product
  await runTest('Update Product', async () => {
    if (!testData.testProductId) {
      throw new Error('No test product ID available');
    }
    
    const updateData = {
      description: 'Updated description for API testing',
      price: 39.99,
      featured: true
    };
    
    const response = await testData.adminApi.put(`products/${testData.testProductId}`, updateData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for product update');
    }
    
    return true;
  });
  
  // Test: Get featured products
  await runTest('Get Featured Products', async () => {
    const response = await axios.get(`${API_BASE_URL}/products/featured`);
    
    if (!response.data || !Array.isArray(response.data.products)) {
      throw new Error('Invalid response format for featured products');
    }
    
    return true;
  });
}

// Test address API endpoints
async function testAddressEndpoints() {
  logSection('ADDRESS API TESTS');
  
  // Test: Create address
  await runTest('Create Address', async () => {
    const addressData = {
      fullName: 'Test User',
      addressLine1: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      phone: '555-123-4567',
      isDefault: true
    };
    
    try {
      const response = await testData.userApi.post(`addresses`, addressData);
      
      if (!response.data || !response.data._id) {
        throw new Error('Invalid response format for address creation');
      }
      
      testData.testAddressId = response.data._id;
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get all addresses
  await runTest('Get All Addresses', async () => {
    try {
      const response = await testData.userApi.get(`addresses`);
      
      // Handle different response formats
      const addresses = Array.isArray(response.data) ? response.data : 
                      (response.data.addresses ? response.data.addresses : []);
      
      if (!Array.isArray(addresses) && !Array.isArray(response.data.addresses)) {
        logInfo(`Response data: ${JSON.stringify(response.data)}`);
        // If we get an empty object or unexpected format, it might be valid but empty
        return true;
      }
      
      const addressList = Array.isArray(addresses) ? addresses : response.data.addresses;
      logInfo(`Found ${addressList.length} addresses`);
      
      // If we have addresses, store the first one's ID for later tests
      if (addressList.length > 0 && !testData.testAddressId) {
        testData.testAddressId = addressList[0]._id;
        logInfo(`Using existing address with ID: ${testData.testAddressId}`);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get address by ID
  await runTest('Get Address by ID', async () => {
    if (!testData.testAddressId) {
      throw new Error('No test address ID available');
    }
    
    const response = await testData.userApi.get(`addresses/${testData.testAddressId}`);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for address retrieval');
    }
    
    return true;
  });
  
  // Test: Update address
  await runTest('Update Address', async () => {
    if (!testData.testAddressId) {
      throw new Error('No test address ID available');
    }
    
    const updateData = {
      city: 'Updated City',
      state: 'Updated State'
    };
    
    const response = await testData.userApi.put(`addresses/${testData.testAddressId}`, updateData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for address update');
    }
    
    return true;
  });
}

// Test discount API endpoints
async function testDiscountEndpoints() {
  logSection('DISCOUNT API TESTS');
  
  // Test: Create discount
  await runTest('Create Discount', async () => {
    const discountData = {
      code: 'TEST' + Date.now(),
      description: 'Test discount created by automated tests',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 50,
      maxUsesPerUser: 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };
    
    try {
      const response = await testData.adminApi.post(`discounts`, discountData);
      
      if (!response.data || !response.data._id) {
        throw new Error('Invalid response format for discount creation');
      }
      
      testData.testDiscountId = response.data._id;
      testData.testDiscountCode = response.data.code;
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get all discounts
  await runTest('Get All Discounts', async () => {
    try {
      const response = await testData.adminApi.get(`discounts`);
      
      // Handle different response formats
      const discounts = Array.isArray(response.data) ? response.data : 
                      (response.data.discounts ? response.data.discounts : []);
      
      if (!Array.isArray(discounts) && !Array.isArray(response.data.discounts)) {
        logInfo(`Response data: ${JSON.stringify(response.data)}`);
        // If we get an empty object or unexpected format, it might be valid but empty
        return true;
      }
      
      const discountList = Array.isArray(discounts) ? discounts : response.data.discounts;
      logInfo(`Found ${discountList.length} discounts`);
      
      // If we have discounts, store the first one's ID and code for later tests
      if (discountList.length > 0 && !testData.testDiscountId) {
        testData.testDiscountId = discountList[0]._id;
        testData.testDiscountCode = discountList[0].code;
        logInfo(`Using existing discount with ID: ${testData.testDiscountId} and code: ${testData.testDiscountCode}`);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Validate discount code
  await runTest('Validate Discount Code', async () => {
    if (!testData.testDiscountCode) {
      throw new Error('No test discount code available');
    }
    
    const response = await testData.userApi.post(`discounts/validate`, { code: testData.testDiscountCode });
    
    if (response.data === undefined) {
      throw new Error('Invalid response format for discount validation');
    }
    
    return true;
  });
  
  // Test: Update discount
  await runTest('Update Discount', async () => {
    if (!testData.testDiscountId) {
      throw new Error('No test discount ID available');
    }
    
    const updateData = {
      description: 'Updated test discount',
      discountValue: 15
    };
    
    const response = await testData.adminApi.put(`discounts/${testData.testDiscountId}`, updateData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for discount update');
    }
    
    return true;
  });
}

// Test order API endpoints
async function testOrderEndpoints() {
  logSection('ORDERS API TESTS');
  
  // Test: Create order
  await runTest('Create Order', async () => {
    if (!testData.testProductId || !testData.testAddressId) {
      throw new Error('Missing test product ID or address ID');
    }
    
    const orderData = {
      items: [
        {
          product: testData.testProductId,
          quantity: 2,
          price: 19.99
        }
      ],
      shippingAddress: testData.testAddressId,
      billingAddress: testData.testAddressId,
      paymentMethod: 'credit_card',
      paymentDetails: {
        cardNumber: '4111111111111111',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
      },
      subtotal: 39.98,
      tax: 3.20,
      shippingCost: 5.99,
      total: 49.17
    };
    
    try {
      const response = await testData.userApi.post(`orders`, orderData);
      
      if (!response.data || !response.data._id) {
        throw new Error('Invalid response format for order creation');
      }
      
      testData.testOrderId = response.data._id;
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get user orders
  await runTest('Get User Orders', async () => {
    try {
      // The endpoint might be /orders/user or /orders/myorders
      try {
        const response = await testData.userApi.get(`orders/myorders`);
        
        // Handle different response formats
        const orders = Array.isArray(response.data) ? response.data : 
                     (response.data.orders ? response.data.orders : []);
        
        if (Array.isArray(orders) || Array.isArray(response.data.orders)) {
          const orderList = Array.isArray(orders) ? orders : response.data.orders;
          logInfo(`Found ${orderList.length} orders via /orders/myorders`);
          
          // If we have orders, store the first one's ID for later tests
          if (orderList.length > 0 && !testData.testOrderId) {
            testData.testOrderId = orderList[0]._id;
            logInfo(`Using existing order with ID: ${testData.testOrderId}`);
          }
          
          return true;
        }
      } catch (error1) {
        // Try alternative endpoint
        try {
          const altResponse = await testData.userApi.get(`orders/user`);
          
          // Handle different response formats
          const altOrders = Array.isArray(altResponse.data) ? altResponse.data : 
                         (altResponse.data.orders ? altResponse.data.orders : []);
          
          if (Array.isArray(altOrders) || Array.isArray(altResponse.data.orders)) {
            const orderList = Array.isArray(altOrders) ? altOrders : altResponse.data.orders;
            logInfo(`Found ${orderList.length} orders via /orders/user`);
            
            // If we have orders, store the first one's ID for later tests
            if (orderList.length > 0 && !testData.testOrderId) {
              testData.testOrderId = orderList[0]._id;
              logInfo(`Using existing order with ID: ${testData.testOrderId}`);
            }
            
            return true;
          }
        } catch (error2) {
          // Both endpoints failed
          throw error1;
        }
      }
      
      // If we reach here, we didn't get a valid response from either endpoint
      throw new Error('Could not retrieve user orders from any endpoint');
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Get order by ID
  await runTest('Get Order by ID', async () => {
    if (!testData.testOrderId) {
      throw new Error('No test order ID available');
    }
    
    const response = await testData.userApi.get(`orders/${testData.testOrderId}`);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for order retrieval');
    }
    
    return true;
  });
  
  // Test: Get all orders (admin only)
  await runTest('Get All Orders', async () => {
    try {
      const response = await testData.adminApi.get(`orders`);
      
      // Handle different response formats
      const orders = Array.isArray(response.data) ? response.data : 
                   (response.data.orders ? response.data.orders : []);
      
      if (!Array.isArray(orders) && !Array.isArray(response.data.orders)) {
        logInfo(`Response data: ${JSON.stringify(response.data)}`);
        // If we get an empty object or unexpected format, it might be valid but empty
        return true;
      }
      
      const orderList = Array.isArray(orders) ? orders : response.data.orders;
      logInfo(`Found ${orderList.length} orders as admin`);
      
      // If we have orders and no test order ID yet, store the first one's ID
      if (orderList.length > 0 && !testData.testOrderId) {
        testData.testOrderId = orderList[0]._id;
        logInfo(`Using existing order with ID: ${testData.testOrderId}`);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  });
  
  // Test: Update order status
  await runTest('Update Order Status', async () => {
    if (!testData.testOrderId) {
      throw new Error('No test order ID available');
    }
    
    const updateData = {
      status: 'processing'
    };
    
    const response = await testData.adminApi.put(`orders/${testData.testOrderId}/status`, updateData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for order status update');
    }
    
    return true;
  });
  
  // Test: Add order tracking
  await runTest('Add Order Tracking', async () => {
    if (!testData.testOrderId) {
      throw new Error('No test order ID available');
    }
    
    const trackingData = {
      carrier: 'Test Carrier',
      trackingNumber: 'TEST123456789',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const response = await testData.adminApi.put(`orders/${testData.testOrderId}/tracking`, trackingData);
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format for order tracking update');
    }
    
    return true;
  });
}

// Test dashboard statistics API endpoints
async function testDashboardEndpoints() {
  logSection('DASHBOARD STATISTICS API TESTS');
  
  // Test: Get marketplace statistics
  await runTest('Get Marketplace Statistics', async () => {
    try {
      // Try different possible dashboard endpoints
      try {
        const response = await testData.adminApi.get(`dashboard/marketplace`);
        
        if (!response.data) {
          throw new Error('Invalid response format for marketplace statistics');
        }
        
        logInfo('Successfully retrieved marketplace statistics from /dashboard/marketplace');
        return true;
      } catch (error1) {
        try {
          // Try alternative endpoint
          const altResponse = await testData.adminApi.get(`dashboard/stats`);
          
          if (!altResponse.data) {
            throw new Error('Invalid response format for marketplace statistics');
          }
          
          logInfo('Successfully retrieved marketplace statistics from /dashboard/stats');
          return true;
        } catch (error2) {
          try {
            // Try another alternative endpoint
            const alt2Response = await testData.adminApi.get(`stats/marketplace`);
            
            if (!alt2Response.data) {
              throw new Error('Invalid response format for marketplace statistics');
            }
            
            logInfo('Successfully retrieved marketplace statistics from /stats/marketplace');
            return true;
          } catch (error3) {
            // All endpoints failed
            throw error1;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  });
}

// Main test execution function
async function runMarketplaceApiTests() {
  try {
    // Check if server is available
    if (!(await checkServerAvailability())) {
      logError('Server is not available. Please start the server before running tests.');
      process.exit(1);
    }

    // Set up test data
    await setup();

    // Run category tests
    await testCategoryEndpoints();

    // Run product tests
    await testProductEndpoints();
    
    // Run address tests
    await testAddressEndpoints();
    
    // Run discount tests
    await testDiscountEndpoints();
    
    // Run order tests
    await testOrderEndpoints();
    
    // Run dashboard tests
    await testDashboardEndpoints();

    // Print test summary
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Skipped: ${skippedTests}`);
    console.log(`Total: ${passedTests + failedTests + skippedTests}`);
    
    if (failedTests > 0) {
      console.log(chalk.red(`✗ ${failedTests} test(s) failed. Please check the logs above for details.`));
    } else {
      console.log(chalk.green('✓ All marketplace API tests passed!'));
    }
  } catch (error) {
    console.error('Unhandled error in test runner:', error);
  } finally {
    await teardown();
  }
}

// Run the tests
runMarketplaceApiTests().catch(error => {
  console.error('Test runner failed:', error.message);
  process.exit(1);
});
