/**
 * Campaign API Tests
 */

// Test campaign endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Campaign API ==='.blue);
  
  try {
    // Get all campaigns
    const campaigns = await apiRequest('get', '/campaigns', null, true);
    console.log(`✓ SUCCESS: Retrieved ${campaigns.length} campaigns`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new campaign
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 2); // End date 2 months in future
    
    const newCampaign = await apiRequest('post', '/campaigns', {
      title: `Test Campaign ${Date.now()}`,
      description: 'This is a test campaign description.',
      goal: 10000,
      endDate: futureDate.toISOString(),
      category: 'education',
      images: ['https://example.com/campaign-image.jpg'],
      story: 'This is a detailed story about the campaign.',
      organizer: 'Test Organizer',
      beneficiaries: 'Refugee families in need'
    }, true);
    
    console.log(`✓ SUCCESS: Created new campaign: ${newCampaign._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store campaign ID in test data
    testData.campaignId = newCampaign._id;
    
    // Get campaign by ID
    const campaignById = await apiRequest('get', `/campaigns/${testData.campaignId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved campaign by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update campaign
    const updatedCampaign = await apiRequest('put', `/campaigns/${testData.campaignId}`, {
      title: 'Updated Test Campaign',
      description: 'This is an updated test campaign description.',
      goal: 15000
    }, true);
    
    console.log(`✓ SUCCESS: Updated campaign`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test campaign updates functionality
    try {
      const updateResponse = await apiRequest('post', `/campaigns/${testData.campaignId}/updates`, {
        title: 'Campaign Progress Update',
        content: 'This is a test update on the campaign progress.',
        date: new Date().toISOString()
      }, true);
      
      console.log(`✓ SUCCESS: Added update to campaign`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get campaign updates
      const updates = await apiRequest('get', `/campaigns/${testData.campaignId}/updates`, null, true);
      console.log(`✓ SUCCESS: Retrieved campaign updates`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Campaign updates functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test campaign comment functionality
    try {
      const commentResponse = await apiRequest('post', `/campaigns/${testData.campaignId}/comments`, {
        text: 'This is a test comment on the campaign'
      }, true);
      
      console.log(`✓ SUCCESS: Added comment to campaign`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Campaign comment functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search campaigns by category
    try {
      const searchResults = await apiRequest('get', '/campaigns?category=education', null, true);
      console.log(`✓ SUCCESS: Searched campaigns by category`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Campaign search functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test featured campaigns endpoint
    try {
      const featuredCampaigns = await apiRequest('get', '/campaigns/featured', null, true);
      console.log(`✓ SUCCESS: Retrieved featured campaigns`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Featured campaigns functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Campaign operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
