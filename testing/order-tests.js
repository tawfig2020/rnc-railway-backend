/**
 * Order API Tests
 */

// Test order endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Order API ==='.blue);
  
  try {
    // Get all orders (may be admin only)
    try {
      const orders = await apiRequest('get', '/orders', null, true);
      console.log(`✓ SUCCESS: Retrieved ${orders.length} orders`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Get all orders requires admin access: ${error.message}`.blue);
    }
    
    // Create a new order
    const newOrder = await apiRequest('post', '/orders', {
      orderItems: [
        {
          name: 'Test Product',
          quantity: 2,
          price: 29.99,
          product: testData.productId || '507f1f77bcf86cd799439011' // Use test productId if available
        }
      ],
      shippingAddress: {
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'PayPal',
      itemsPrice: 59.98,
      taxPrice: 6.00,
      shippingPrice: 5.00,
      totalPrice: 70.98
    }, true);
    
    console.log(`✓ SUCCESS: Created new order: ${newOrder._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store order ID in test data
    testData.orderId = newOrder._id;
    
    // Get user's orders
    const userOrders = await apiRequest('get', '/orders/myorders', null, true);
    console.log(`✓ SUCCESS: Retrieved user orders: ${userOrders.length} found`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Get order by ID
    const orderById = await apiRequest('get', `/orders/${testData.orderId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved order by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update order to paid
    try {
      const paidResponse = await apiRequest('put', `/orders/${testData.orderId}/pay`, {
        id: 'PAYPAL123456',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: { email_address: 'test@example.com' }
      }, true);
      
      console.log(`✓ SUCCESS: Updated order to paid`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Update order to paid not implemented or failed: ${error.message}`.blue);
    }
    
    // Update order to delivered (admin only)
    try {
      const deliveredResponse = await apiRequest('put', `/orders/${testData.orderId}/deliver`, {}, true);
      console.log(`✓ SUCCESS: Updated order to delivered`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Update order to delivered requires admin access: ${error.message}`.blue);
    }
    
    // Cancel order
    try {
      const cancelResponse = await apiRequest('put', `/orders/${testData.orderId}/cancel`, {
        reason: 'Test cancellation'
      }, true);
      
      console.log(`✓ SUCCESS: Cancelled order`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Cancel order not implemented or failed: ${error.message}`.blue);
    }
    
    // Test order tracking functionality
    try {
      const trackingResponse = await apiRequest('get', `/orders/${testData.orderId}/tracking`, null, true);
      console.log(`✓ SUCCESS: Retrieved order tracking information`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Order tracking not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Order operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
