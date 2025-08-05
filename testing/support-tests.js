/**
 * Support Requests API Tests
 */

// Test support request endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Support Requests API ==='.blue);
  
  try {
    // Create a support request
    const newRequest = await apiRequest('post', '/support', {
      supportType: 'general',
      title: 'Test Support Request',
      description: 'This is a test support request',
      urgency: 'low'
    }, true);
    
    console.log(`✓ SUCCESS: Created support request: ${newRequest._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store support request ID in test data
    testData.supportId = newRequest._id;
    
    // Get all user's support requests
    const requests = await apiRequest('get', '/support', null, true);
    console.log(`✓ SUCCESS: Retrieved ${requests.length} support requests`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update the created request
    if (newRequest && newRequest._id) {
      const updatedRequest = await apiRequest('put', `/support/${newRequest._id}`, {
        status: 'in progress',
        updates: [{
          message: 'Test update',
          date: new Date().toISOString(),
          updatedBy: 'system'
        }]
      }, true);
      
      console.log(`✓ SUCCESS: Updated support request`.green);
      global.successCount = (global.successCount || 0) + 1;
    }
    
    // Get a specific support request by ID
    const singleRequest = await apiRequest('get', `/support/${testData.supportId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved specific support request`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test adding a comment to the support request
    const commentResponse = await apiRequest('post', `/support/${testData.supportId}/comment`, {
      comment: 'This is a test comment',
    }, true);
    
    console.log(`✓ SUCCESS: Added comment to support request`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test support request category filtering (if implemented)
    try {
      const filteredRequests = await apiRequest('get', '/support?type=general', null, true);
      console.log(`✓ SUCCESS: Filtered support requests by type`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Support request filtering not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Support request operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
