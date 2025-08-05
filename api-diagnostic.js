/**
 * API Diagnostic Tool
 * This script checks which API endpoints are available and responding on the server
 */
const axios = require('axios');
const colors = require('colors');

// Configuration
const API_URL = 'http://localhost:5000/api';

// Common API endpoints to test
const endpointsToTest = [
  { method: 'get', path: '/', description: 'API Root' },
  { method: 'get', path: '/auth', description: 'Auth Root' },
  { method: 'post', path: '/auth/register', description: 'User Registration', 
    data: { name: 'Test User', email: 'test@example.com', password: 'password123', location: 'Test' } },
  { method: 'post', path: '/auth/login', description: 'User Login', 
    data: { email: 'test@example.com', password: 'password123' } },
  { method: 'get', path: '/profiles', description: 'Get Profiles' },
  { method: 'get', path: '/health', description: 'Health Records' },
  { method: 'get', path: '/support', description: 'Support Requests' },
  { method: 'get', path: '/blogs', description: 'Blogs' },
  { method: 'get', path: '/courses', description: 'Courses' },
  { method: 'get', path: '/events', description: 'Events' },
  { method: 'get', path: '/resources', description: 'Resources' },
  { method: 'get', path: '/products', description: 'Products' },
  { method: 'get', path: '/vendors', description: 'Vendors' },
  { method: 'get', path: '/orders', description: 'Orders' },
  { method: 'get', path: '/campaigns', description: 'Campaigns' },
  { method: 'get', path: '/donations', description: 'Donations' },
  { method: 'get', path: '/services', description: 'Services' },
  { method: 'get', path: '/categories', description: 'Categories' },
  { method: 'get', path: '/discounts', description: 'Discounts' },
  { method: 'get', path: '/addresses', description: 'Addresses' },
];

// Helper functions for console output
const logSuccess = (msg) => console.log(`✓ ${msg}`.green);
const logError = (msg) => console.error(`✗ ${msg}`.red);
const logInfo = (msg) => console.log(`ℹ ${msg}`.blue);
const logWarning = (msg) => console.log(`⚠ ${msg}`.yellow);

// Test if an endpoint exists
async function testEndpoint(endpoint) {
  try {
    let response;
    if (endpoint.method === 'get') {
      response = await axios.get(`${API_URL}${endpoint.path}`);
    } else if (endpoint.method === 'post') {
      response = await axios.post(`${API_URL}${endpoint.path}`, endpoint.data);
    }
    
    logSuccess(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): AVAILABLE - Status ${response.status}`);
    return { available: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      // The request was made but the server responded with an error
      if (error.response.status === 401 || error.response.status === 403) {
        // Auth required endpoints will return 401/403 but they do exist
        logWarning(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): REQUIRES AUTH - Status ${error.response.status}`);
        return { available: true, requiresAuth: true, status: error.response.status };
      } else if (error.response.status === 400) {
        // Bad request means the endpoint exists but our parameters aren't correct
        logWarning(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): INVALID REQUEST - Status ${error.response.status}`);
        return { available: true, invalidRequest: true, status: error.response.status };
      } else if (error.response.status === 404) {
        // Not found means the endpoint doesn't exist
        logError(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): NOT FOUND - Status ${error.response.status}`);
        return { available: false, status: error.response.status };
      } else {
        // Other error
        logError(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): ERROR - Status ${error.response.status}`);
        return { available: false, status: error.response.status, error: error.response.data };
      }
    } else if (error.request) {
      // The request was made but no response was received
      logError(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): NO RESPONSE - Server might be down`);
      return { available: false, error: 'No response from server' };
    } else {
      // Error setting up the request
      logError(`${endpoint.description} (${endpoint.method.toUpperCase()} ${endpoint.path}): REQUEST ERROR - ${error.message}`);
      return { available: false, error: error.message };
    }
  }
}

// Run the diagnostic
async function runDiagnostic() {
  console.log('\n==== API DIAGNOSTIC TOOL ====\n'.yellow);
  
  // Check if server is running
  logInfo('Checking if API server is running...');
  try {
    await axios.get(API_URL);
    logSuccess('API server is responding');
  } catch (error) {
    if (error.response) {
      // Even if we get an error response, the server is at least running
      logWarning(`API server is responding but returned status ${error.response.status}`);
    } else {
      logError('API server is not responding. Please ensure the server is running on http://localhost:5000');
      return;
    }
  }
  
  // Test all endpoints
  logInfo('Testing API endpoints...');
  const results = {
    available: 0,
    requiresAuth: 0,
    notFound: 0,
    error: 0
  };
  
  for (const endpoint of endpointsToTest) {
    const result = await testEndpoint(endpoint);
    
    if (result.available) {
      if (result.requiresAuth) {
        results.requiresAuth++;
      } else {
        results.available++;
      }
    } else if (result.status === 404) {
      results.notFound++;
    } else {
      results.error++;
    }
  }
  
  // Print summary
  console.log('\n==== DIAGNOSTIC SUMMARY ===='.yellow);
  console.log(`Total endpoints tested: ${endpointsToTest.length}`.blue);
  console.log(`✓ Available without auth: ${results.available}`.green);
  console.log(`⚠ Requires authentication: ${results.requiresAuth}`.yellow);
  console.log(`✗ Not found (404): ${results.notFound}`.red);
  console.log(`✗ Other errors: ${results.error}`.red);
  
  if (results.notFound > 0) {
    console.log('\nRECOMMENDATION:'.yellow);
    console.log('Many endpoints were not found. Verify the API routes are correctly configured in the server.js file.');
    console.log('Check if you need to run the server with a specific environment variable or flag to enable all routes.');
  }
  
  if (results.available === 0 && results.requiresAuth === 0) {
    console.log('\nCRITICAL ISSUE:'.red);
    console.log('No API endpoints are responding correctly. Verify the API server is properly configured.');
  }
  
  console.log('\n==== DIAGNOSTIC COMPLETE ====\n'.yellow);
}

// Run the diagnostic
runDiagnostic();
