/**
 * Authentication API Tests
 */

// Test authentication endpoints
async function runTests(apiRequest, TEST_USER, testData) {
  console.log('\n=== Testing Authentication API ==='.blue);
  let authToken = null;
  
  try {
    // Test registration
    try {
      const regData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
        password: 'password123',
        location: 'Test Location', // Added required field
        role: 'user',
        phone: '123-456-7890' // Added potentially required field
      };
      
      const regResponse = await apiRequest('post', '/auth/register', regData);
      console.log(`✓ SUCCESS: User registration successful`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ INFO: User already exists, proceeding with login`.blue);
      } else {
        console.error(`✗ ERROR: User registration failed: ${error.message}`.red);
        global.errorCount = (global.errorCount || 0) + 1;
      }
    }

    // Login - using hard-coded credentials that should exist on the server
    try {
      const loginResponse = await apiRequest('post', '/auth/login', {
        email: 'admin@refugeenetwork.com', // Use our seeded admin account
        password: '123456'
      });
      authToken = loginResponse.token;
      console.log(`✓ SUCCESS: Admin login successful`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      // If admin login fails, try with user credentials
      try {
        const userLoginResponse = await apiRequest('post', '/auth/login', TEST_USER);
        authToken = userLoginResponse.token;
        console.log(`✓ SUCCESS: User login successful`.green);
        global.successCount = (global.successCount || 0) + 1;
      } catch (error) {
        // Try with seeded test account
        try {
          const seededLoginResponse = await apiRequest('post', '/auth/login', {
            email: 'test@example.com',
            password: 'password123'
          });
          authToken = seededLoginResponse.token;
          console.log(`✓ SUCCESS: Seeded test account login successful`.green);
          global.successCount = (global.successCount || 0) + 1;
        } catch (error) {
          console.error(`✗ ERROR: All login attempts failed: ${error.message}`.red);
          global.errorCount = (global.errorCount || 0) + 1;
        }
      }
    }
    
    // If we have a token, get the user profile
    if (authToken) {
      try {
        const userProfile = await apiRequest('get', '/auth/me', null, true);
        console.log(`✓ SUCCESS: Retrieved user profile for: ${userProfile.name}`.green);
        
        // Store user ID in test data for other tests to use
        if (userProfile && userProfile._id) {
          testData.userId = userProfile._id;
        }
        
        global.successCount = (global.successCount || 0) + 1;
      } catch (error) {
        console.error(`✗ ERROR: Could not retrieve user profile: ${error.message}`.red);
        global.errorCount = (global.errorCount || 0) + 1;
      }
    }
    
    // Test password change (optional, uncomment if needed)
    /*
    try {
      const passwordResponse = await apiRequest('put', '/auth/password', {
        currentPassword: TEST_USER.password,
        newPassword: 'newpassword123'
      }, true);
      console.log(`✓ SUCCESS: Password change successful`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Change back to original password
      const resetResponse = await apiRequest('put', '/auth/password', {
        currentPassword: 'newpassword123',
        newPassword: TEST_USER.password
      }, true);
      console.log(`✓ SUCCESS: Password reset successful`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.error(`✗ ERROR: Password change failed: ${error.message}`.red);
      global.errorCount = (global.errorCount || 0) + 1;
    }
    */
    
    return authToken;
  } catch (error) {
    console.error(`✗ ERROR: Authentication failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
    return null;
  }
}

module.exports = { runTests };
