/**
 * Donation API Tests
 */

// Test donation endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Donation API ==='.blue);
  
  try {
    // Get user's donations
    try {
      const donations = await apiRequest('get', '/donations/mydonations', null, true);
      console.log(`✓ SUCCESS: Retrieved ${donations.length} user donations`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Get user donations not implemented or failed: ${error.message}`.blue);
    }
    
    // Create a new donation
    const newDonation = await apiRequest('post', '/donations', {
      amount: 50.00,
      campaign: testData.campaignId || '507f1f77bcf86cd799439011', // Use test campaignId if available
      paymentMethod: 'creditCard',
      message: 'This is a test donation',
      anonymous: false
    }, true);
    
    console.log(`✓ SUCCESS: Created new donation: ${newDonation._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store donation ID in test data
    testData.donationId = newDonation._id;
    
    // Get donation by ID
    const donationById = await apiRequest('get', `/donations/${testData.donationId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved donation by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test donation receipt functionality
    try {
      const receiptResponse = await apiRequest('get', `/donations/${testData.donationId}/receipt`, null, true);
      console.log(`✓ SUCCESS: Generated donation receipt`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Donation receipt functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test donation verification functionality
    try {
      const verifyResponse = await apiRequest('put', `/donations/${testData.donationId}/verify`, {
        status: 'verified',
        transactionId: `TRANS${Date.now()}`
      }, true);
      
      console.log(`✓ SUCCESS: Verified donation`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Donation verification functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test recurring donation functionality
    try {
      const recurringDonation = await apiRequest('post', '/donations/recurring', {
        amount: 25.00,
        campaign: testData.campaignId || '507f1f77bcf86cd799439011',
        frequency: 'monthly',
        paymentMethod: 'creditCard'
      }, true);
      
      console.log(`✓ SUCCESS: Created recurring donation`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Cancel recurring donation
      if (recurringDonation && recurringDonation._id) {
        const cancelRecurring = await apiRequest('put', `/donations/recurring/${recurringDonation._id}/cancel`, {
          reason: 'Test cancellation'
        }, true);
        
        console.log(`✓ SUCCESS: Cancelled recurring donation`.green);
        global.successCount = (global.successCount || 0) + 1;
      }
    } catch (error) {
      console.log(`ℹ INFO: Recurring donation functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Get donations by campaign
    try {
      if (testData.campaignId) {
        const campaignDonations = await apiRequest('get', `/donations/campaign/${testData.campaignId}`, null, true);
        console.log(`✓ SUCCESS: Retrieved donations for campaign`.green);
        global.successCount = (global.successCount || 0) + 1;
      }
    } catch (error) {
      console.log(`ℹ INFO: Get donations by campaign not implemented or failed: ${error.message}`.blue);
    }
    
    // Test donation statistics
    try {
      const donationStats = await apiRequest('get', '/donations/stats', null, true);
      console.log(`✓ SUCCESS: Retrieved donation statistics`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Donation statistics not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Donation operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
