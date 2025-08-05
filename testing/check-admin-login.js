const axios = require('axios');

const testAdminLogin = async () => {
  try {
    console.log('🔐 Testing admin login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@refugeenetwork.com',
      password: 'Admin@123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Admin login successful!');
    console.log('User role:', response.data.user?.role);
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    
  } catch (error) {
    console.log('❌ Admin login failed');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
    
    // Try creating admin user through registration
    console.log('\n🔧 Trying to create admin user...');
    
    try {
      const adminRegResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Admin User',
        email: 'admin@refugeenetwork.com',
        password: 'Admin@123',
        location: 'Admin Location'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin user created via registration');
      console.log('Response:', adminRegResponse.data);
      
    } catch (regError) {
      console.log('❌ Admin registration also failed:', regError.response?.data);
    }
  }
};

testAdminLogin();
