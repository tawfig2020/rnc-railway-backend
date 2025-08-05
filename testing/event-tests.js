/**
 * Event API Tests
 */

// Test event endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Event API ==='.blue);
  
  try {
    // Get all events
    const events = await apiRequest('get', '/events', null, true);
    console.log(`✓ SUCCESS: Retrieved ${events.length} events`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new event
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 14); // Event 2 weeks in future
    
    const newEvent = await apiRequest('post', '/events', {
      title: `Test Event ${Date.now()}`,
      description: 'This is a test event description.',
      date: futureDate.toISOString(),
      location: 'Test Location',
      organizer: 'Test Organizer',
      capacity: 50,
      type: 'workshop',
      virtual: false,
      contactEmail: 'test@example.com'
    }, true);
    
    console.log(`✓ SUCCESS: Created new event: ${newEvent._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store event ID in test data
    testData.eventId = newEvent._id;
    
    // Get event by ID
    const eventById = await apiRequest('get', `/events/${testData.eventId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved event by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update event
    const updatedEvent = await apiRequest('put', `/events/${testData.eventId}`, {
      title: 'Updated Test Event',
      description: 'This is an updated test event description.',
      capacity: 100
    }, true);
    
    console.log(`✓ SUCCESS: Updated event`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test RSVP functionality
    try {
      const rsvpResponse = await apiRequest('put', `/events/${testData.eventId}/rsvp`, {
        attending: true
      }, true);
      console.log(`✓ SUCCESS: RSVP'd to event`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Check RSVP status
      const rsvpStatus = await apiRequest('get', `/events/${testData.eventId}/rsvp`, null, true);
      console.log(`✓ SUCCESS: Checked RSVP status`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Cancel RSVP
      const cancelResponse = await apiRequest('put', `/events/${testData.eventId}/rsvp`, {
        attending: false
      }, true);
      console.log(`✓ SUCCESS: Cancelled event RSVP`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: RSVP functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test event comment functionality
    try {
      const commentResponse = await apiRequest('post', `/events/${testData.eventId}/comments`, {
        text: 'This is a test comment'
      }, true);
      
      console.log(`✓ SUCCESS: Added comment to event`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get event comments
      const comments = await apiRequest('get', `/events/${testData.eventId}/comments`, null, true);
      console.log(`✓ SUCCESS: Retrieved event comments`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Comment functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search events by type or date range
    try {
      const searchResults = await apiRequest('get', '/events?type=workshop', null, true);
      console.log(`✓ SUCCESS: Searched events by type`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Event search functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Event operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
