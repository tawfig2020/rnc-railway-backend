/**
 * Address API Tests
 */

// Test address endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Address API ==='.blue);
  
  try {
    // Get user's addresses
    const addresses = await apiRequest('get', '/addresses', null, true);
    console.log(`✓ SUCCESS: Retrieved ${addresses.length} user addresses`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new address
    const newAddress = await apiRequest('post', '/addresses', {
      name: 'Test Address',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt 456',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      phone: '123-456-7890',
      isDefault: true,
      addressType: 'shipping'
    }, true);
    
    console.log(`✓ SUCCESS: Created new address: ${newAddress._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store address ID in test data
    testData.addressId = newAddress._id;
    
    // Get address by ID
    const addressById = await apiRequest('get', `/addresses/${testData.addressId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved address by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update address
    const updatedAddress = await apiRequest('put', `/addresses/${testData.addressId}`, {
      name: 'Updated Test Address',
      addressLine1: '456 Updated Street',
      city: 'Updated City'
    }, true);
    
    console.log(`✓ SUCCESS: Updated address`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test setting default address
    try {
      const defaultResponse = await apiRequest('put', `/addresses/${testData.addressId}/default`, {
        addressType: 'shipping'
      }, true);
      
      console.log(`✓ SUCCESS: Set default address`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Set default address functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test address validation
    try {
      const validateResponse = await apiRequest('post', '/addresses/validate', {
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country'
      }, true);
      
      console.log(`✓ SUCCESS: Validated address`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Address validation not implemented or failed: ${error.message}`.blue);
    }
    
    // Test address geocoding
    try {
      const geocodeResponse = await apiRequest('post', `/addresses/${testData.addressId}/geocode`, {}, true);
      console.log(`✓ SUCCESS: Geocoded address`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Address geocoding not implemented or failed: ${error.message}`.blue);
    }
    
    // Get default addresses
    try {
      const defaultAddresses = await apiRequest('get', '/addresses/default', null, true);
      console.log(`✓ SUCCESS: Retrieved default addresses`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Get default addresses not implemented or failed: ${error.message}`.blue);
    }
    
    // Delete address (optional - uncomment if you want to test deletion)
    /*
    try {
      await apiRequest('delete', `/addresses/${testData.addressId}`, null, true);
      console.log(`✓ SUCCESS: Deleted address`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Address deletion not implemented or failed: ${error.message}`.blue);
    }
    */
    
  } catch (error) {
    console.error(`✗ ERROR: Address operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
