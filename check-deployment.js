#!/usr/bin/env node

/**
 * Deployment Status Checker
 * Verifies that the backend deployment is working correctly
 */

const https = require('https');
const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔍 Deployment Status Checker');
console.log('='.repeat(30));

rl.question('\n📝 Enter your deployed backend URL: ', (backendUrl) => {
  
  const cleanUrl = backendUrl.replace(/\/$/, '');
  
  console.log(`\n🔍 Testing deployment at: ${cleanUrl}`);
  console.log('='.repeat(50));
  
  // Test 1: Health Check
  console.log('\n1️⃣ Testing Health Endpoint...');
  testEndpoint(`${cleanUrl}/health`, (result) => {
    if (result.success) {
      console.log('✅ Health Check: PASSED');
      console.log(`   Status: ${result.data.status || 'OK'}`);
      console.log(`   Database: ${result.data.database || 'Unknown'}`);
    } else {
      console.log('❌ Health Check: FAILED');
      console.log(`   Error: ${result.error}`);
    }
    
    // Test 2: API Base
    console.log('\n2️⃣ Testing API Base...');
    testEndpoint(`${cleanUrl}/api`, (result) => {
      if (result.success) {
        console.log('✅ API Base: ACCESSIBLE');
      } else {
        console.log('❌ API Base: FAILED');
        console.log(`   Error: ${result.error}`);
      }
      
      // Test 3: Authentication Endpoint
      console.log('\n3️⃣ Testing Authentication...');
      testLogin(`${cleanUrl}/api/auth/login`, (result) => {
        if (result.success) {
          console.log('✅ Authentication: WORKING');
          console.log(`   User: ${result.data.user?.email || 'Unknown'}`);
          console.log(`   Role: ${result.data.user?.role || 'Unknown'}`);
        } else {
          console.log('❌ Authentication: FAILED');
          console.log(`   Error: ${result.error}`);
        }
        
        // Summary
        console.log('\n📋 DEPLOYMENT SUMMARY:');
        console.log('='.repeat(25));
        console.log(`🌐 Backend URL: ${cleanUrl}`);
        console.log(`🔗 API URL: ${cleanUrl}/api`);
        console.log(`❤️  Health: ${cleanUrl}/health`);
        
        console.log('\n🎯 Next Steps:');
        console.log('1. If all tests passed, update your frontend:');
        console.log('   node update-frontend-api.js');
        console.log('\n2. Rebuild and redeploy your frontend');
        console.log('\n3. Test login at: http://rncmalaysia.org/login');
        
        rl.close();
      });
    });
  });
});

function testEndpoint(url, callback) {
  const client = url.startsWith('https') ? https : http;
  
  const request = client.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback({ success: true, data: jsonData, status: res.statusCode });
      } catch (error) {
        callback({ success: true, data: data, status: res.statusCode });
      }
    });
  });
  
  request.on('error', (error) => {
    callback({ success: false, error: error.message });
  });
  
  request.setTimeout(10000, () => {
    request.destroy();
    callback({ success: false, error: 'Request timeout' });
  });
}

function testLogin(url, callback) {
  const postData = JSON.stringify({
    email: 'admin@refugeenetwork.com',
    password: '123456'
  });
  
  const urlObj = new URL(url);
  const client = url.startsWith('https') ? https : http;
  
  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const request = client.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        if (res.statusCode === 200 && (jsonData.success || jsonData.token)) {
          callback({ success: true, data: jsonData });
        } else {
          callback({ success: false, error: `HTTP ${res.statusCode}: ${jsonData.message || data}` });
        }
      } catch (error) {
        callback({ success: false, error: `Parse error: ${error.message}` });
      }
    });
  });
  
  request.on('error', (error) => {
    callback({ success: false, error: error.message });
  });
  
  request.setTimeout(10000, () => {
    request.destroy();
    callback({ success: false, error: 'Request timeout' });
  });
  
  request.write(postData);
  request.end();
}
