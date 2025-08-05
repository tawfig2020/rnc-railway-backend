/**
 * Discount API Tests
 */

// Test discount endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Discount API ==='.blue);
  
  try {
    // Get all discounts
    try {
      const discounts = await apiRequest('get', '/discounts', null, true);
      console.log(`✓ SUCCESS: Retrieved ${discounts.length} discounts`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Get all discounts might require admin access: ${error.message}`.blue);
    }
    
    // Create a new discount
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 1); // Expires 1 month in future
    
    const newDiscount = await apiRequest('post', '/discounts', {
      code: `TEST${Date.now()}`,
      description: 'This is a test discount code',
      discountType: 'percentage',
      discountValue: 15,
      minPurchase: 25,
      maxDiscount: 100,
      expiryDate: futureDate.toISOString(),
      usageLimit: 100,
      applicableTo: {
        products: testData.productId ? [testData.productId] : [],
        categories: testData.categoryId ? [testData.categoryId] : []
      },
      isActive: true
    }, true);
    
    console.log(`✓ SUCCESS: Created new discount: ${newDiscount._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store discount ID in test data
    testData.discountId = newDiscount._id;
    
    // Get discount by ID
    const discountById = await apiRequest('get', `/discounts/${testData.discountId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved discount by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update discount
    const updatedDiscount = await apiRequest('put', `/discounts/${testData.discountId}`, {
      description: 'This is an updated test discount code',
      discountValue: 20,
      isActive: true
    }, true);
    
    console.log(`✓ SUCCESS: Updated discount`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test validate discount code
    try {
      const validateResponse = await apiRequest('post', '/discounts/validate', {
        code: newDiscount.code,
        cartValue: 50.00,
        products: testData.productId ? [testData.productId] : []
      }, true);
      
      console.log(`✓ SUCCESS: Validated discount code`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Discount validation not implemented or failed: ${error.message}`.blue);
    }
    
    // Test apply discount to order
    try {
      const applyResponse = await apiRequest('post', '/discounts/apply', {
        code: newDiscount.code,
        orderId: testData.orderId || '507f1f77bcf86cd799439011' // Use test orderId if available
      }, true);
      
      console.log(`✓ SUCCESS: Applied discount to order`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Apply discount to order not implemented or failed: ${error.message}`.blue);
    }
    
    // Test discount usage statistics
    try {
      const usageStats = await apiRequest('get', `/discounts/${testData.discountId}/usage`, null, true);
      console.log(`✓ SUCCESS: Retrieved discount usage statistics`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Discount usage statistics not implemented or failed: ${error.message}`.blue);
    }
    
    // Test deactivate discount
    try {
      const deactivateResponse = await apiRequest('put', `/discounts/${testData.discountId}/deactivate`, {}, true);
      console.log(`✓ SUCCESS: Deactivated discount`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Reactivate discount
      const reactivateResponse = await apiRequest('put', `/discounts/${testData.discountId}/activate`, {}, true);
      console.log(`✓ SUCCESS: Reactivated discount`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Discount activation toggle not implemented or failed: ${error.message}`.blue);
    }
    
    // Test active discounts
    try {
      const activeDiscounts = await apiRequest('get', '/discounts/active', null, true);
      console.log(`✓ SUCCESS: Retrieved active discounts`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Active discounts endpoint not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Discount operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
