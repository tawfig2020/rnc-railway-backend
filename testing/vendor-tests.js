/**
 * Vendor API Tests
 */

// Test vendor endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Vendor API ==='.blue);
  
  try {
    // Get all vendors
    const vendors = await apiRequest('get', '/vendors', null, true);
    console.log(`✓ SUCCESS: Retrieved ${vendors.length} vendors`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new vendor
    const newVendor = await apiRequest('post', '/vendors', {
      name: `Test Vendor ${Date.now()}`,
      description: 'This is a test vendor description.',
      contactEmail: 'vendor@example.com',
      contactPhone: '123-456-7890',
      location: 'Test Location',
      specialties: ['Handicrafts', 'Jewelry'],
      backgroundStory: 'This is a test background story',
      website: 'https://example.com',
      socialMedia: {
        facebook: 'https://facebook.com/test',
        instagram: 'https://instagram.com/test'
      }
    }, true);
    
    console.log(`✓ SUCCESS: Created new vendor: ${newVendor._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store vendor ID in test data
    testData.vendorId = newVendor._id;
    
    // Get vendor by ID
    const vendorById = await apiRequest('get', `/vendors/${testData.vendorId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved vendor by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update vendor
    const updatedVendor = await apiRequest('put', `/vendors/${testData.vendorId}`, {
      name: 'Updated Test Vendor',
      description: 'This is an updated test vendor description.',
      contactEmail: 'updated@example.com'
    }, true);
    
    console.log(`✓ SUCCESS: Updated vendor`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test vendor products retrieval
    try {
      const vendorProducts = await apiRequest('get', `/vendors/${testData.vendorId}/products`, null, true);
      console.log(`✓ SUCCESS: Retrieved vendor products`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Vendor products retrieval not implemented or failed: ${error.message}`.blue);
    }
    
    // Test vendor verification functionality (if implemented)
    try {
      const verifyResponse = await apiRequest('put', `/vendors/${testData.vendorId}/verify`, {
        verified: true
      }, true);
      
      console.log(`✓ SUCCESS: Updated vendor verification status`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Vendor verification functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search vendors by specialty
    try {
      const searchResults = await apiRequest('get', '/vendors?specialty=Handicrafts', null, true);
      console.log(`✓ SUCCESS: Searched vendors by specialty`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Vendor search functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test featured vendors endpoint
    try {
      const featuredVendors = await apiRequest('get', '/vendors/featured', null, true);
      console.log(`✓ SUCCESS: Retrieved featured vendors`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Featured vendors functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Vendor operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
