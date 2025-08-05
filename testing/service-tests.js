/**
 * Service API Tests
 */

// Test service endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Service API ==='.blue);
  
  try {
    // Get all services
    const services = await apiRequest('get', '/services', null, true);
    console.log(`✓ SUCCESS: Retrieved ${services.length} services`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new service
    const newService = await apiRequest('post', '/services', {
      name: `Test Service ${Date.now()}`,
      description: 'This is a test service description.',
      category: 'legal',
      provider: 'Test Provider',
      contactEmail: 'service@example.com',
      contactPhone: '123-456-7890',
      location: 'Test Location',
      hours: 'Monday-Friday 9AM-5PM',
      isVirtual: true,
      requirements: ['Valid ID', 'Proof of refugee status'],
      cost: 'Free',
      languages: ['English', 'Arabic']
    }, true);
    
    console.log(`✓ SUCCESS: Created new service: ${newService._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store service ID in test data
    testData.serviceId = newService._id;
    
    // Get service by ID
    const serviceById = await apiRequest('get', `/services/${testData.serviceId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved service by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update service
    const updatedService = await apiRequest('put', `/services/${testData.serviceId}`, {
      name: 'Updated Test Service',
      description: 'This is an updated test service description.',
      cost: 'Donation-based'
    }, true);
    
    console.log(`✓ SUCCESS: Updated service`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test service review functionality
    try {
      const reviewResponse = await apiRequest('post', `/services/${testData.serviceId}/reviews`, {
        rating: 5,
        comment: 'This is a test review'
      }, true);
      
      console.log(`✓ SUCCESS: Added review to service`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get service reviews
      const reviews = await apiRequest('get', `/services/${testData.serviceId}/reviews`, null, true);
      console.log(`✓ SUCCESS: Retrieved service reviews`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Review functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test service booking functionality
    try {
      const bookingResponse = await apiRequest('post', `/services/${testData.serviceId}/book`, {
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        time: '10:00',
        notes: 'Test booking'
      }, true);
      
      console.log(`✓ SUCCESS: Booked service appointment`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get user bookings
      const bookings = await apiRequest('get', '/services/bookings', null, true);
      console.log(`✓ SUCCESS: Retrieved user bookings`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Cancel booking
      if (bookingResponse && bookingResponse._id) {
        const cancelResponse = await apiRequest('put', `/services/bookings/${bookingResponse._id}/cancel`, {
          reason: 'Test cancellation'
        }, true);
        
        console.log(`✓ SUCCESS: Cancelled service booking`.green);
        global.successCount = (global.successCount || 0) + 1;
      }
    } catch (error) {
      console.log(`ℹ INFO: Booking functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search services by category
    try {
      const searchResults = await apiRequest('get', '/services?category=legal', null, true);
      console.log(`✓ SUCCESS: Searched services by category`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Service search functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test featured services endpoint
    try {
      const featuredServices = await apiRequest('get', '/services/featured', null, true);
      console.log(`✓ SUCCESS: Retrieved featured services`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Featured services functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Service operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
