/**
 * Create Test Users Script
 * Creates necessary test users for integration testing
 */

const axios = require('axios');
const chalk = require('chalk');

const API_BASE_URL = 'http://localhost:5000/api';

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@refugeenetwork.com',
    password: '123456',
    location: 'London, UK',
    role: 'admin'
  },
  {
    name: 'Fatima Al-Hariri',
    email: 'fatima@example.com',
    password: '123456',
    location: 'Berlin, Germany',
    role: 'refugee'
  },
  {
    name: 'Mohammed Khan',
    email: 'mohammed@example.com',
    password: '123456',
    location: 'Paris, France',
    role: 'refugee'
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    password: '123456',
    location: 'Toronto, Canada',
    role: 'volunteer'
  }
];

async function createTestUser(userData) {
  try {
    console.log(chalk.blue(`Creating user: ${userData.email}`));
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    if (response.data && response.data.token) {
      console.log(chalk.green(`✅ Successfully created user: ${userData.email}`));
      return { success: true, user: userData, token: response.data.token };
    } else {
      console.log(chalk.yellow(`⚠️ User created but no token returned: ${userData.email}`));
      return { success: true, user: userData, token: null };
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMsg = error.response.data.errors?.[0]?.msg || error.response.data.message || 'Unknown error';
      if (errorMsg.includes('User already exists') || errorMsg.includes('already exists')) {
        console.log(chalk.yellow(`⚠️ User already exists: ${userData.email}`));
        return { success: true, user: userData, token: null, existing: true };
      }
    }
    console.log(chalk.red(`❌ Failed to create user ${userData.email}: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`   Status: ${error.response.status}`));
      console.log(chalk.red(`   Data: ${JSON.stringify(error.response.data)}`));
    }
    return { success: false, user: userData, error: error.message };
  }
}

async function testUserLogin(userData) {
  try {
    console.log(chalk.blue(`Testing login for: ${userData.email}`));
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    
    if (response.data && response.data.token) {
      console.log(chalk.green(`✅ Login successful for: ${userData.email}`));
      return { success: true, user: userData, token: response.data.token };
    } else {
      console.log(chalk.red(`❌ Login failed - no token returned for: ${userData.email}`));
      return { success: false, user: userData, error: 'No token returned' };
    }
  } catch (error) {
    console.log(chalk.red(`❌ Login failed for ${userData.email}: ${error.message}`));
    if (error.response) {
      console.log(chalk.red(`   Status: ${error.response.status}`));
      console.log(chalk.red(`   Data: ${JSON.stringify(error.response.data)}`));
    }
    return { success: false, user: userData, error: error.message };
  }
}

async function checkServerHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log(chalk.green('✅ Server is healthy'));
    console.log(chalk.blue(`   Database: ${response.data.database}`));
    console.log(chalk.blue(`   Uptime: ${response.data.uptime}s`));
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Server health check failed'));
    return false;
  }
}

async function main() {
  console.log(chalk.blue('🚀 Creating Test Users for Integration Testing'));
  console.log(chalk.blue('================================================'));
  
  // Check server health
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    console.log(chalk.red('💥 Server is not healthy. Please start the backend server first.'));
    process.exit(1);
  }
  
  const results = {
    created: [],
    existing: [],
    failed: [],
    loginTests: []
  };
  
  // Create users
  console.log(chalk.blue('\n📝 Creating Users'));
  console.log(chalk.blue('=================='));
  
  for (const userData of testUsers) {
    const result = await createTestUser(userData);
    if (result.success) {
      if (result.existing) {
        results.existing.push(result);
      } else {
        results.created.push(result);
      }
    } else {
      results.failed.push(result);
    }
  }
  
  // Test logins
  console.log(chalk.blue('\n🔐 Testing User Logins'));
  console.log(chalk.blue('======================='));
  
  for (const userData of testUsers) {
    const loginResult = await testUserLogin(userData);
    results.loginTests.push(loginResult);
  }
  
  // Summary
  console.log(chalk.blue('\n📊 Summary'));
  console.log(chalk.blue('==========='));
  console.log(chalk.green(`✅ Users created: ${results.created.length}`));
  console.log(chalk.yellow(`⚠️ Users already existing: ${results.existing.length}`));
  console.log(chalk.red(`❌ Users failed to create: ${results.failed.length}`));
  
  const successfulLogins = results.loginTests.filter(r => r.success).length;
  const failedLogins = results.loginTests.filter(r => !r.success).length;
  
  console.log(chalk.green(`✅ Successful logins: ${successfulLogins}`));
  console.log(chalk.red(`❌ Failed logins: ${failedLogins}`));
  
  if (successfulLogins > 0) {
    console.log(chalk.green('\n🎉 Test users are ready for integration testing!'));
    
    // Show working credentials
    console.log(chalk.blue('\n🔑 Working Credentials:'));
    results.loginTests.filter(r => r.success).forEach(result => {
      console.log(chalk.green(`   ${result.user.email} / ${result.user.password}`));
    });
  } else {
    console.log(chalk.red('\n💥 No users can login successfully. Check user credentials or database state.'));
  }
  
  return results;
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('💥 Script failed:'), error);
    process.exit(1);
  });
}

module.exports = { createTestUser, testUserLogin, checkServerHealth };
