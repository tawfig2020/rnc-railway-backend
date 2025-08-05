const axios = require('axios');

const createTestUser = async () => {
  try {
    console.log('👤 Creating test user...');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestUser@123',
      location: 'Test Location'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Test user created successfully!');
    console.log('Response:', response.data);
    
    // Now try to login
    console.log('\n🔑 Testing login with new user...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testuser@example.com',
      password: 'TestUser@123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    
  } catch (error) {
    console.log('❌ Operation failed');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }
};

createTestUser();
