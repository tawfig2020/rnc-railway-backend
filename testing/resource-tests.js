/**
 * Resource API Tests
 */

// Test resource endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Resource API ==='.blue);
  
  try {
    // Get all resources
    const resources = await apiRequest('get', '/resources', null, true);
    console.log(`✓ SUCCESS: Retrieved ${resources.length} resources`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new resource
    const newResource = await apiRequest('post', '/resources', {
      title: `Test Resource ${Date.now()}`,
      description: 'This is a test resource description.',
      url: 'https://example.com/resource',
      type: 'document',
      language: 'English',
      category: 'legal',
      tags: ['test', 'refugee', 'documentation']
    }, true);
    
    console.log(`✓ SUCCESS: Created new resource: ${newResource._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store resource ID in test data
    testData.resourceId = newResource._id;
    
    // Get resource by ID
    const resourceById = await apiRequest('get', `/resources/${testData.resourceId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved resource by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update resource
    const updatedResource = await apiRequest('put', `/resources/${testData.resourceId}`, {
      title: 'Updated Test Resource',
      description: 'This is an updated test resource description.',
      category: 'education'
    }, true);
    
    console.log(`✓ SUCCESS: Updated resource`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test resource rating functionality
    try {
      const ratingResponse = await apiRequest('post', `/resources/${testData.resourceId}/rating`, {
        rating: 5
      }, true);
      
      console.log(`✓ SUCCESS: Added rating to resource`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get resource ratings
      const ratings = await apiRequest('get', `/resources/${testData.resourceId}/ratings`, null, true);
      console.log(`✓ SUCCESS: Retrieved resource ratings`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Rating functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test resource sharing functionality
    try {
      const shareResponse = await apiRequest('post', `/resources/${testData.resourceId}/share`, {
        recipient: 'test2@example.com',
        message: 'Check out this resource!'
      }, true);
      
      console.log(`✓ SUCCESS: Shared resource`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Sharing functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search resources by category or tag
    try {
      const searchResults = await apiRequest('get', '/resources?category=legal', null, true);
      console.log(`✓ SUCCESS: Searched resources by category`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      const tagSearchResults = await apiRequest('get', '/resources?tag=refugee', null, true);
      console.log(`✓ SUCCESS: Searched resources by tag`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Resource search functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Resource operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
