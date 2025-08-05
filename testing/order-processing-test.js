/**
 * Order Processing Integration Test
 * 
 * This script tests the complete order processing lifecycle including:
 * - Order creation
 * - Order retrieval (user and admin)
 * - Order status updates
 * - Payment processing
 * - Order fulfillment
 * - Vendor payouts
 * - Order statistics and reporting
 * 
 * Run with: node testing/order-processing-test.js
 */

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@refugeenetwork.com';
const ADMIN_PASSWORD = 'Admin@123';
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
  userToken: null,
  productId: null,
  vendorId: null,
  orderId: null,
  addressId: null,
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

// Main test sequence
async function runOrderProcessingTests() {
  console.log('=== ORDER PROCESSING INTEGRATION TEST ===');
  logInfo('Testing RNC Marketplace Order Processing API endpoints and frontend integration');
  
  // Check if server is running
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    logError('Server is not running. Please start the server and try again.');
    return;
  }
  
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
  
  // 1.2 Create test user if needed
  await runTest('Create Test User (if needed)', async () => {
    try {
      // Try to login as test user
      const loginResponse = await api.post('/auth/login', {
        email: USER_EMAIL,
        password: USER_PASSWORD
      });
      
      testData.userToken = loginResponse.data.token;
      logSuccess('Test user login successful');
    } catch (error) {
      // If login fails, create a new test user
      logInfo('Creating new test user');
      
      // Set admin token for user creation
      api.defaults.headers.common['x-auth-token'] = testData.adminToken;
      
      const registerResponse = await api.post('/users', {
        name: 'Test User',
        email: USER_EMAIL,
        password: USER_PASSWORD,
        role: 'user',
        emailVerified: true
      });
      
      // Login as the new user
      const loginResponse = await api.post('/auth/login', {
        email: USER_EMAIL,
        password: USER_PASSWORD
      });
      
      testData.userToken = loginResponse.data.token;
      logSuccess('Test user created and logged in');
    }
    
    if (!testData.userToken) {
      throw new Error('No token received from user login');
    }
  });
  
  // 2. Setup Test Data
  logSection('SETUP TEST DATA');
  
  // 2.1 Get or create test product
  await runTest('Get or Create Test Product', async () => {
    // Set admin token for product creation
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    // Check for existing test products
    const productsResponse = await api.get('/products?search=Test Product');
    
    if (productsResponse.data.products && productsResponse.data.products.length > 0) {
      // Use existing product
      testData.productId = productsResponse.data.products[0]._id;
      testData.vendorId = productsResponse.data.products[0].vendor;
      logSuccess(`Using existing product with ID: ${testData.productId}`);
    } else {
      // Create a new vendor if needed
      const vendorsResponse = await api.get('/vendors');
      
      if (vendorsResponse.data.length > 0) {
        testData.vendorId = vendorsResponse.data[0]._id;
      } else {
        // Create a test vendor
        const vendorResponse = await api.post('/vendors', {
          businessName: 'Test Vendor',
          description: 'Test vendor for integration testing',
          email: 'testvendor@example.com',
          phone: '123-456-7890',
          status: 'active'
        });
        
        testData.vendorId = vendorResponse.data._id;
      }
      
      // Create a test product
      const productData = {
        name: 'Test Product',
        description: 'Product for order processing tests',
        price: 29.99,
        vendor: testData.vendorId,
        stock: 100,
        status: 'active',
        images: ['https://via.placeholder.com/300']
      };
      
      const productResponse = await api.post('/products', productData);
      testData.productId = productResponse.data._id;
      
      logSuccess(`Created new test product with ID: ${testData.productId}`);
    }
    
    if (!testData.productId) {
      throw new Error('Failed to get or create test product');
    }
  });
  
  // 2.2 Create shipping address
  await runTest('Create Shipping Address', async () => {
    // Set user token for address creation
    api.defaults.headers.common['x-auth-token'] = testData.userToken;
    
    const addressData = {
      fullName: 'Test User',
      addressLine1: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      phone: '123-456-7890',
      isDefault: true
    };
    
    const addressResponse = await api.post('/addresses', addressData);
    testData.addressId = addressResponse.data._id;
    
    logSuccess(`Created shipping address with ID: ${testData.addressId}`);
  });
  
  // 3. Order Creation
  logSection('ORDER CREATION');
  
  // 3.1 Create a new order
  await runTest('Create Order', async () => {
    // Set user token for order creation
    api.defaults.headers.common['x-auth-token'] = testData.userToken;
    
    const orderData = {
      items: [
        {
          productId: testData.productId,
          quantity: 2
        }
      ],
      shippingAddressId: testData.addressId,
      paymentMethod: 'credit_card',
      paymentInfo: {
        id: 'test_payment_123',
        status: 'completed',
        type: 'credit_card'
      },
      taxPrice: 6.00,
      shippingPrice: 5.00,
      totalPrice: 70.98
    };
    
    const orderResponse = await api.post('/orders', orderData);
    testData.orderId = orderResponse.data.order._id;
    
    if (!testData.orderId) {
      throw new Error('Failed to create order');
    }
    
    logSuccess(`Created order with ID: ${testData.orderId}`);
  });
  
  // 4. Order Retrieval
  logSection('ORDER RETRIEVAL');
  
  // 4.1 Get user's orders
  await runTest('Get User Orders', async () => {
    // Set user token
    api.defaults.headers.common['x-auth-token'] = testData.userToken;
    
    const ordersResponse = await api.get('/orders');
    
    if (!ordersResponse.data || ordersResponse.data.length === 0) {
      throw new Error('No orders found for user');
    }
    
    // Verify our test order is in the list
    const foundOrder = ordersResponse.data.find(order => order._id === testData.orderId);
    
    if (!foundOrder) {
      throw new Error('Test order not found in user orders');
    }
    
    logSuccess(`Retrieved ${ordersResponse.data.length} orders for user`);
  });
  
  // 4.2 Get order by ID (as user)
  await runTest('Get Order by ID (User)', async () => {
    // Set user token
    api.defaults.headers.common['x-auth-token'] = testData.userToken;
    
    const orderResponse = await api.get(`/orders/${testData.orderId}`);
    
    if (!orderResponse.data || orderResponse.data._id !== testData.orderId) {
      throw new Error('Order not found or ID mismatch');
    }
    
    logSuccess('Retrieved order details as user');
  });
  
  // 4.3 Get all orders (as admin)
  await runTest('Get All Orders (Admin)', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    const ordersResponse = await api.get('/orders/admin/all');
    
    if (!ordersResponse.data || !ordersResponse.data.orders) {
      throw new Error('Failed to retrieve orders as admin');
    }
    
    logSuccess(`Admin retrieved ${ordersResponse.data.orders.length} orders`);
  });
  
  // 5. Order Status Updates
  logSection('ORDER STATUS UPDATES');
  
  // 5.1 Update order status to confirmed
  await runTest('Update Order Status to Confirmed', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    await api.put(`/orders/${testData.orderId}/status`, {
      status: 'confirmed'
    });
    
    // Verify status update
    const orderResponse = await api.get(`/orders/${testData.orderId}`);
    
    if (orderResponse.data.orderStatus !== 'confirmed') {
      throw new Error(`Order status not updated. Expected 'confirmed' but got '${orderResponse.data.orderStatus}'`);
    }
    
    logSuccess('Updated order status to confirmed');
  });
  
  // 5.2 Update order status to shipped with tracking info
  await runTest('Update Order Status to Shipped with Tracking', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    const trackingInfo = {
      carrier: 'Test Carrier',
      trackingNumber: 'TRACK123456',
      trackingUrl: 'https://example.com/track/TRACK123456'
    };
    
    await api.put(`/orders/${testData.orderId}/status`, {
      status: 'shipped',
      trackingInfo
    });
    
    // Verify status update and tracking info
    const orderResponse = await api.get(`/orders/${testData.orderId}`);
    
    if (orderResponse.data.orderStatus !== 'shipped') {
      throw new Error(`Order status not updated. Expected 'shipped' but got '${orderResponse.data.orderStatus}'`);
    }
    
    if (!orderResponse.data.trackingInfo || 
        orderResponse.data.trackingInfo.trackingNumber !== 'TRACK123456') {
      throw new Error('Tracking information not updated correctly');
    }
    
    logSuccess('Updated order status to shipped with tracking information');
  });
  
  // 5.3 Update order status to delivered
  await runTest('Update Order Status to Delivered', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    await api.put(`/orders/${testData.orderId}/status`, {
      status: 'delivered'
    });
    
    // Verify status update
    const orderResponse = await api.get(`/orders/${testData.orderId}`);
    
    if (orderResponse.data.orderStatus !== 'delivered') {
      throw new Error(`Order status not updated. Expected 'delivered' but got '${orderResponse.data.orderStatus}'`);
    }
    
    // Verify deliveredAt date was set
    if (!orderResponse.data.deliveredAt) {
      throw new Error('deliveredAt date not set');
    }
    
    logSuccess('Updated order status to delivered');
  });
  
  // 6. Vendor Payouts
  logSection('VENDOR PAYOUTS');
  
  // 6.1 Update vendor payout status
  await runTest('Update Vendor Payout Status', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    await api.put(`/orders/${testData.orderId}/payout`, {
      vendorPayoutStatus: 'completed'
    });
    
    // Verify payout status update
    const orderResponse = await api.get(`/orders/${testData.orderId}`);
    
    if (orderResponse.data.vendorPayoutStatus !== 'completed') {
      throw new Error(`Vendor payout status not updated. Expected 'completed' but got '${orderResponse.data.vendorPayoutStatus}'`);
    }
    
    // Verify vendorPayoutDate was set
    if (!orderResponse.data.vendorPayoutDate) {
      throw new Error('vendorPayoutDate not set');
    }
    
    logSuccess('Updated vendor payout status to completed');
  });
  
  // 7. Order Statistics and Reporting
  logSection('ORDER STATISTICS AND REPORTING');
  
  // 7.1 Get order dashboard statistics
  await runTest('Get Order Dashboard Statistics', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    const statsResponse = await api.get('/orders/admin/dashboard');
    
    if (!statsResponse.data || typeof statsResponse.data.totalOrders !== 'number') {
      throw new Error('Failed to retrieve order statistics');
    }
    
    logSuccess('Retrieved order dashboard statistics');
    
    // Log some stats for verification
    logInfo(`Total Orders: ${statsResponse.data.totalOrders}`);
    logInfo(`Total Sales: $${statsResponse.data.totalSales.toFixed(2)}`);
    logInfo(`Completed Orders: ${statsResponse.data.completedOrders}`);
  });
  
  // 8. Cleanup (optional - comment out if you want to keep test data)
  logSection('CLEANUP');
  
  // 8.1 Cancel the test order (instead of deleting)
  await runTest('Cancel Test Order', async () => {
    // Set admin token
    api.defaults.headers.common['x-auth-token'] = testData.adminToken;
    
    // Instead of deleting, mark as cancelled for record keeping
    await api.put(`/orders/${testData.orderId}/status`, {
      status: 'cancelled'
    });
    
    // Verify status update
    const orderResponse = await api.get(`/orders/${testData.orderId}`);
    
    if (orderResponse.data.orderStatus !== 'cancelled') {
      throw new Error(`Order status not updated. Expected 'cancelled' but got '${orderResponse.data.orderStatus}'`);
    }
    
    logSuccess('Test order cancelled successfully');
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
    console.log(chalk.green('✓ All order processing tests passed!'));
  }
}

// Run the tests
runOrderProcessingTests().catch(error => {
  console.error('Unhandled error in test runner:', error);
  process.exit(1);
});
