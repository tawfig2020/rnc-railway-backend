/**
 * Latest Features Test Script
 * 
 * This simple script tests the latest features we've implemented:
 * - Categories API
 * - Discounts API
 * - Addresses API
 * 
 * It uses a simpler approach with better error handling and connection retry logic.
 */
const axios = require('axios');
const colors = require('colors');

// Configuration
const API_URL = 'http://localhost:5000/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Test credentials
const TEST_CREDENTIALS = [
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'test@example.com', password: 'password123' },
  { email: 'user@example.com', password: 'user123' }
];

// Global auth token
let authToken = null;

// Helper functions for colored console output
const logSuccess = (msg) => console.log(`✓ SUCCESS: ${msg}`.green);
const logError = (msg) => console.error(`✗ ERROR: ${msg}`.red);
const logInfo = (msg) => console.log(`ℹ INFO: ${msg}`.blue);
const logWarning = (msg) => console.log(`⚠ WARNING: ${msg}`.yellow);

// Helper function to make API requests with retry logic
async function apiRequest(method, endpoint, data = null, auth = false, retries = MAX_RETRIES) {
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
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      if (retries > 0) {
        logWarning(`Connection issue, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return apiRequest(method, endpoint, data, auth, retries - 1);
      }
    }
    
    if (error.response) {
      return { error: true, status: error.response.status, data: error.response.data };
    } else if (error.request) {
      return { error: true, message: 'No response received from server' };
    } else {
      return { error: true, message: error.message };
    }
  }
}

// Try to authenticate
async function authenticate() {
  logInfo('Attempting authentication with test credentials');
  
  for (const cred of TEST_CREDENTIALS) {
    try {
      logInfo(`Trying to login with ${cred.email}`);
      const response = await apiRequest('post', '/auth/login', cred);
      
      if (!response.error && response.token) {
        authToken = response.token;
        logSuccess(`Authentication successful with ${cred.email}`);
        return true;
      } else {
        logInfo(`Login failed with ${cred.email}`);
      }
    } catch (error) {
      logInfo(`Login attempt with ${cred.email} failed`);
    }
  }
  
  logWarning('All authentication attempts failed, proceeding with unauthenticated tests only');
  return false;
}

// Test Categories API
async function testCategoriesAPI() {
  console.log('\n==== Testing Categories API ===='.yellow);
  
  // Test GET /categories (public endpoint)
  try {
    const categoriesResponse = await apiRequest('get', '/categories');
    
    if (!categoriesResponse.error) {
      const categories = Array.isArray(categoriesResponse) ? 
        categoriesResponse : 
        (categoriesResponse.categories || []);
      
      logSuccess(`Retrieved ${categories.length} categories`);
      
      // Test individual category if any exist
      if (categories.length > 0) {
        const categoryId = categories[0]._id || categories[0].id;
        const categoryResponse = await apiRequest('get', `/categories/${categoryId}`);
        
        if (!categoryResponse.error) {
          logSuccess(`Retrieved individual category: ${categoryResponse.name}`);
        } else {
          logError(`Failed to retrieve individual category: ${JSON.stringify(categoryResponse)}`);
        }
      }
    } else {
      logError(`Failed to retrieve categories: ${JSON.stringify(categoriesResponse)}`);
    }
  } catch (error) {
    logError(`Categories API test error: ${error.message}`);
  }
  
  // Test protected endpoints if authenticated
  if (authToken) {
    // Test creating a category
    try {
      const newCategory = {
        name: `Test Category ${Date.now()}`,
        description: 'Test category created by API test script'
      };
      
      const createResponse = await apiRequest('post', '/categories', newCategory, true);
      
      if (!createResponse.error) {
        logSuccess(`Created new category: ${createResponse.name}`);
        
        // Test updating the category
        const updateResponse = await apiRequest('put', `/categories/${createResponse._id}`, {
          description: 'Updated description'
        }, true);
        
        if (!updateResponse.error) {
          logSuccess('Updated category successfully');
        } else {
          logWarning(`Category update failed: ${JSON.stringify(updateResponse)}`);
        }
      } else if (createResponse.status === 403) {
        logInfo('Creating categories requires admin privileges');
      } else {
        logWarning(`Category creation failed: ${JSON.stringify(createResponse)}`);
      }
    } catch (error) {
      logError(`Category creation test error: ${error.message}`);
    }
  } else {
    logInfo('Skipping protected categories endpoints (no authentication)');
  }
}

// Test Discounts API
async function testDiscountsAPI() {
  console.log('\n==== Testing Discounts API ===='.yellow);
  
  // Test GET /discounts/active (public endpoint)
  try {
    const activeDiscountsResponse = await apiRequest('get', '/discounts/active');
    
    if (!activeDiscountsResponse.error) {
      const discounts = Array.isArray(activeDiscountsResponse) ? 
        activeDiscountsResponse : 
        (activeDiscountsResponse.discounts || []);
      
      logSuccess(`Retrieved ${discounts.length} active discounts`);
      
      // Test discount validation
      if (discounts.length > 0) {
        const testCode = discounts[0].code;
        const validateResponse = await apiRequest('post', '/discounts/validate', {
          code: testCode,
          cartValue: 100
        });
        
        if (!validateResponse.error) {
          logSuccess(`Validated discount code: ${testCode}`);
        } else {
          logWarning(`Discount validation failed: ${JSON.stringify(validateResponse)}`);
        }
      }
    } else {
      logWarning(`Failed to retrieve active discounts: ${JSON.stringify(activeDiscountsResponse)}`);
    }
  } catch (error) {
    logError(`Discounts API test error: ${error.message}`);
  }
  
  // Test protected endpoints if authenticated
  if (authToken) {
    try {
      const discountsResponse = await apiRequest('get', '/discounts', null, true);
      
      if (!discountsResponse.error) {
        const discounts = Array.isArray(discountsResponse) ? 
          discountsResponse : 
          (discountsResponse.discounts || []);
        
        logSuccess(`Retrieved ${discounts.length} discounts (admin view)`);
        
        // Test creating a discount
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        
        const newDiscount = {
          code: `TEST${Date.now()}`,
          description: 'Test discount',
          discountType: 'percentage',
          discountValue: 10,
          startDate: new Date().toISOString(),
          endDate: futureDate.toISOString(),
          isActive: true
        };
        
        const createResponse = await apiRequest('post', '/discounts', newDiscount, true);
        
        if (!createResponse.error) {
          logSuccess(`Created new discount: ${createResponse.code}`);
          
          // Test updating the discount
          const updateResponse = await apiRequest('put', `/discounts/${createResponse._id}`, {
            description: 'Updated test discount'
          }, true);
          
          if (!updateResponse.error) {
            logSuccess('Updated discount successfully');
          } else {
            logWarning(`Discount update failed: ${JSON.stringify(updateResponse)}`);
          }
        } else if (createResponse.status === 403) {
          logInfo('Creating discounts requires admin privileges');
        } else {
          logWarning(`Discount creation failed: ${JSON.stringify(createResponse)}`);
        }
      } else if (discountsResponse.status === 403) {
        logInfo('Viewing all discounts requires admin privileges');
      } else {
        logWarning(`Retrieving discounts failed: ${JSON.stringify(discountsResponse)}`);
      }
    } catch (error) {
      logError(`Protected discounts API test error: ${error.message}`);
    }
  } else {
    logInfo('Skipping protected discounts endpoints (no authentication)');
  }
}

// Test Addresses API
async function testAddressesAPI() {
  console.log('\n==== Testing Addresses API ===='.yellow);
  
  if (!authToken) {
    logInfo('Addresses API requires authentication, skipping tests');
    return;
  }
  
  // Test GET /addresses
  try {
    const addressesResponse = await apiRequest('get', '/addresses', null, true);
    
    if (!addressesResponse.error) {
      const addresses = Array.isArray(addressesResponse) ? addressesResponse : [];
      logSuccess(`Retrieved ${addresses.length} addresses`);
      
      // Test creating an address
      const newAddress = {
        fullName: 'Test User',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country',
        phone: '123-456-7890'
      };
      
      const createResponse = await apiRequest('post', '/addresses', newAddress, true);
      
      if (!createResponse.error) {
        logSuccess(`Created new address: ${createResponse._id || createResponse.id}`);
        
        // Test updating the address
        const addressId = createResponse._id || createResponse.id;
        const updateResponse = await apiRequest('put', `/addresses/${addressId}`, {
          ...newAddress,
          addressLine1: '456 Updated Street'
        }, true);
        
        if (!updateResponse.error) {
          logSuccess('Updated address successfully');
        } else {
          logWarning(`Address update failed: ${JSON.stringify(updateResponse)}`);
        }
        
        // Test address validation if available
        try {
          const validationResponse = await apiRequest('post', '/addresses/validate', {
            addressLine1: '123 Test Street',
            city: 'Test City',
            country: 'Test Country'
          }, true);
          
          if (!validationResponse.error) {
            logSuccess('Address validation works');
          } else {
            logWarning(`Address validation failed: ${JSON.stringify(validationResponse)}`);
          }
        } catch (error) {
          logInfo('Address validation feature not available');
        }
      } else {
        logWarning(`Address creation failed: ${JSON.stringify(createResponse)}`);
      }
    } else {
      logWarning(`Failed to retrieve addresses: ${JSON.stringify(addressesResponse)}`);
    }
  } catch (error) {
    logError(`Addresses API test error: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('\n==== LATEST FEATURES TEST SCRIPT ====\n'.yellow);
  
  try {
    // Try to authenticate first
    await authenticate();
    
    // Test each feature
    await testCategoriesAPI();
    await testDiscountsAPI();
    await testAddressesAPI();
    
    console.log('\n==== TESTS COMPLETED ====\n'.yellow);
  } catch (error) {
    logError(`Test execution error: ${error.message}`);
  }
}

// Execute tests
runTests();
