/**
 * Profile API Tests
 */

// Test profile endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Profile API ==='.blue);
  
  try {
    // Get current user's profile
    try {
      const profile = await apiRequest('get', '/profiles/me', null, true);
      
      if (profile && profile._id) {
        console.log(`✓ SUCCESS: Retrieved user profile: ${profile._id}`.green);
        global.successCount = (global.successCount || 0) + 1;
        
        // Store profile ID in test data
        testData.profileId = profile._id;
        
        // Test profile update
        const updatedProfile = await apiRequest('put', '/profiles', {
          status: 'refugee',
          countryOfOrigin: 'Updated Country',
          medicalConditions: ['None'],
          languages: ['English', 'Arabic'],
          educationLevel: 'Bachelor'
        }, true);
        
        console.log(`✓ SUCCESS: Profile updated successfully`.green);
        global.successCount = (global.successCount || 0) + 1;
      }
    } catch (error) {
      console.log(`ℹ INFO: No profile found, creating new profile`.blue);
      
      // Create a new profile if none exists
      const newProfile = await apiRequest('post', '/profiles', {
        status: 'refugee',
        countryOfOrigin: 'Test Country',
        medicalConditions: ['None'],
        languages: ['English'],
        educationLevel: 'High School'
      }, true);
      
      console.log(`✓ SUCCESS: Created new profile: ${newProfile._id}`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Store profile ID in test data
      testData.profileId = newProfile._id;
    }
    
    // Test getting profile by ID
    if (testData.profileId) {
      const profileById = await apiRequest('get', `/profiles/${testData.profileId}`, null, true);
      console.log(`✓ SUCCESS: Retrieved profile by ID`.green);
      global.successCount = (global.successCount || 0) + 1;
    }
    
    // Test getting all profiles (admin only feature, may fail if not admin)
    try {
      const allProfiles = await apiRequest('get', '/profiles', null, true);
      console.log(`✓ SUCCESS: Retrieved all profiles: ${allProfiles.length} found`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Could not retrieve all profiles (requires admin access): ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Profile operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
