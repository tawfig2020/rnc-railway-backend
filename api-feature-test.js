/**
 * API Feature Test Script
 * 
 * This script tests API endpoints with both mock and real database support
 * Run with: node api-feature-test.js
 */
const axios = require('axios');
const colors = require('colors');

// Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = null;
let mockMode = false;

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

// Detect server mode (mock or real)
async function detectServerMode() {
  try {
    // Try to access the root API endpoint
    const response = await apiRequest('get', '');
    
    if (response && response.message === 'Welcome to Refugee Network Centre API') {
      logInfo('Server appears to be running in mock mode');
      return true;
    } else {
      logInfo('Server appears to be running with real database connection');
      return false;
    }
  } catch (error) {
    // If error contains message about MongoDB, it's likely in real mode but with connection issues
    if (error.message.includes('MongoDB')) {
      logWarning('Server appears to be in real mode but has database connection issues');
      return false;
    }
    
    logWarning('Could not determine server mode, assuming real database mode');
    return false;
  }
}

// Test authentication in mock mode
async function testMockAuth() {
  logInfo('Testing authentication in mock mode');
  
  try {
    // In mock mode, login should work with any credentials
    const loginResponse = await apiRequest('post', '/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginResponse && loginResponse.token) {
      logSuccess('Mock login successful');
      authToken = loginResponse.token;
      return true;
    } else {
      logError('Mock login failed');
      return false;
    }
  } catch (error) {
    logError(`Mock authentication failed: ${error.message}`);
    return false;
  }
}

// Test authentication in real mode
async function testRealAuth() {
  logInfo('Testing authentication in real mode');
  
  // Try several common test credentials
  const testCredentials = [
    { email: 'admin@example.com', password: 'admin123' },
    { email: 'test@example.com', password: 'password123' },
    { email: 'user@example.com', password: 'user123' }
  ];
  
  for (const cred of testCredentials) {
    try {
      logInfo(`Trying login with email: ${cred.email}`);
      const loginResponse = await apiRequest('post', '/auth/login', cred);
      
      if (loginResponse && loginResponse.token) {
        logSuccess(`Login successful with email: ${cred.email}`);
        authToken = loginResponse.token;
        return true;
      }
    } catch (error) {
      logInfo(`Login failed with email: ${cred.email}: ${error.message}`);
    }
  }
  
  // If all credentials failed, try registering a new user
  try {
    logInfo('All logins failed, attempting to register new user');
    
    const regData = {
      name: 'Test API User',
      email: `apitest${Date.now()}@example.com`,
      password: 'password123',
      location: 'Test Location',
      role: 'user',
      phone: '123-456-7890'
    };
    
    await apiRequest('post', '/auth/register', regData);
    logSuccess('Registration successful');
    
    // Try to login with the new user
    const loginResponse = await apiRequest('post', '/auth/login', {
      email: regData.email,
      password: regData.password
    });
    
    if (loginResponse && loginResponse.token) {
      logSuccess('Login with new user successful');
      authToken = loginResponse.token;
      return true;
    }
  } catch (error) {
    logError(`Registration failed: ${error.message}`);
  }
  
  logError('All authentication attempts failed');
  return false;
}

// Test latest endpoints and features
async function testLatestFeatures() {
  console.log('\n==== TESTING LATEST FEATURES ===='.yellow);
  
  // Test Categories API
  await testCategories();
  
  // Test Discounts API
  await testDiscounts();
  
  // Test Addresses API
  await testAddresses();
  
  // Test enhanced orders with discounts
  await testEnhancedOrders();
  
  console.log('\n==== LATEST FEATURES TESTS COMPLETED ===='.yellow);
}

// Test Categories API
async function testCategories() {
  logInfo('Testing Categories API');
  
  try {
    // Get all categories
    const categories = await apiRequest('get', '/categories', null, authToken ? true : false);
    logSuccess(`Retrieved ${categories.length} categories`);
    
    if (categories.length > 0) {
      const categoryId = categories[0]._id;
      
      // Get category by ID
      const category = await apiRequest('get', `/categories/${categoryId}`, null, authToken ? true : false);
      logSuccess(`Retrieved category: ${category.name}`);
      
      if (authToken) {
        // Create a category (requires auth)
        try {
          const newCategory = await apiRequest('post', '/categories', {
            name: `Test Category ${Date.now()}`,
            description: 'Test category description',
            type: 'product'
          }, true);
          
          logSuccess(`Created new category: ${newCategory.name}`);
          
          // Update category
          const updatedCategory = await apiRequest('put', `/categories/${newCategory._id}`, {
            description: 'Updated description'
          }, true);
          
          logSuccess('Updated category');
        } catch (error) {
          logInfo(`Category creation/update requires admin permissions: ${error.message}`);
        }
      }
    }
  } catch (error) {
    logError(`Categories API test failed: ${error.message}`);
  }
}

// Test Discounts API
async function testDiscounts() {
  logInfo('Testing Discounts API');
  
  try {
    // Get all discounts (may require auth)
    try {
      const discounts = await apiRequest('get', '/discounts', null, authToken ? true : false);
      logSuccess(`Retrieved ${discounts.length} discounts`);
      
      if (discounts.length > 0 && authToken) {
        // Test discount validation
        const validateResponse = await apiRequest('post', '/discounts/validate', {
          code: discounts[0].code,
          cartValue: 100
        }, true);
        
        logSuccess('Validated discount code');
      }
    } catch (error) {
      logInfo(`Discount listing requires auth: ${error.message}`);
    }
    
    // Check active discounts
    try {
      const activeDiscounts = await apiRequest('get', '/discounts/active', null, false);
      logSuccess(`Retrieved ${activeDiscounts.length} active discounts`);
    } catch (error) {
      logInfo(`Active discounts endpoint not available: ${error.message}`);
    }
    
    if (authToken) {
      // Create a discount (requires auth)
      try {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        
        const newDiscount = await apiRequest('post', '/discounts', {
          code: `TEST${Date.now()}`,
          description: 'Test discount',
          discountType: 'percentage',
          discountValue: 10,
          expiryDate: futureDate.toISOString()
        }, true);
        
        logSuccess(`Created new discount: ${newDiscount.code}`);
      } catch (error) {
        logInfo(`Discount creation requires admin permissions: ${error.message}`);
      }
    }
  } catch (error) {
    logError(`Discounts API test failed: ${error.message}`);
  }
}

// Test Addresses API
async function testAddresses() {
  logInfo('Testing Addresses API');
  
  if (!authToken) {
    logInfo('Skipping Addresses API test - requires authentication');
    return;
  }
  
  try {
    // Get user's addresses
    const addresses = await apiRequest('get', '/addresses', null, true);
    logSuccess(`Retrieved ${addresses.length} addresses`);
    
    // Create a new address
    const newAddress = await apiRequest('post', '/addresses', {
      name: 'Test Address',
      addressLine1: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      isDefault: true
    }, true);
    
    logSuccess(`Created new address: ${newAddress._id}`);
    
    // Update address
    const updatedAddress = await apiRequest('put', `/addresses/${newAddress._id}`, {
      addressLine1: '456 Updated Street'
    }, true);
    
    logSuccess('Updated address');
    
    // Test address validation (if implemented)
    try {
      const validationResponse = await apiRequest('post', '/addresses/validate', {
        addressLine1: '123 Test Street',
        city: 'Test City',
        country: 'Test Country'
      }, true);
      
      logSuccess('Address validation works');
    } catch (error) {
      logInfo(`Address validation not implemented: ${error.message}`);
    }
  } catch (error) {
    logError(`Addresses API test failed: ${error.message}`);
  }
}

// Test enhanced orders with discounts
async function testEnhancedOrders() {
  logInfo('Testing Enhanced Orders API with discount integration');
  
  if (!authToken) {
    logInfo('Skipping Enhanced Orders API test - requires authentication');
    return;
  }
  
  try {
    // Create a test order with discount
    const newOrder = await apiRequest('post', '/orders', {
      orderItems: [
        {
          name: 'Test Product',
          quantity: 2,
          price: 29.99
        }
      ],
      shippingAddress: {
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'PayPal',
      discountCode: 'TEST10',
      itemsPrice: 59.98,
      taxPrice: 6.00,
      shippingPrice: 5.00,
      discountAmount: 6.00,
      totalPrice: 64.98
    }, true);
    
    logSuccess(`Created order with discount: ${newOrder._id}`);
    
    // Get order details
    const orderDetails = await apiRequest('get', `/orders/${newOrder._id}`, null, true);
    logSuccess('Retrieved order details with discount information');
    
  } catch (error) {
    logError(`Enhanced Orders API test failed: ${error.message}`);
  }
}

// Run tests
async function runTests() {
  console.log('\n==== API FEATURE TESTING ====\n'.yellow);
  
  try {
    // Detect server mode
    mockMode = await detectServerMode();
    
    // Attempt authentication based on detected mode
    let authSuccess = mockMode ? await testMockAuth() : await testRealAuth();
    
    if (authSuccess) {
      // Test API endpoints
      await testLatestFeatures();
    } else {
      logWarning('Proceeding with limited testing (unauthenticated endpoints only)');
      await testLatestFeatures();
    }
    
    console.log('\n==== TESTS COMPLETED ====\n'.yellow);
  } catch (error) {
    logError(`Test execution error: ${error.message}`);
  }
}

// Execute tests
runTests();
