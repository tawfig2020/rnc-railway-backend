#!/usr/bin/env node

/**
 * MongoDB Atlas IP Whitelist Configuration Script
 * Helps configure MongoDB Atlas to allow connections from Render.com
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 MongoDB Atlas IP Whitelist Configuration');
console.log('='.repeat(45));

console.log('\n📋 CURRENT ERROR:');
console.log('MongoDB Connection Error: Could not connect to any servers in your MongoDB Atlas cluster.');
console.log('This happens because Render.com\'s IP addresses aren\'t whitelisted in your MongoDB Atlas.');

console.log('\n🔧 SOLUTION OPTIONS:');
console.log('1. Allow access from anywhere (0.0.0.0/0) - Easiest but less secure');
console.log('2. Add specific Render.com IP addresses - More secure but requires maintenance');

rl.question('\nChoose an option (1 or 2): ', (option) => {
  if (option === '1') {
    console.log('\n🌐 ALLOW ACCESS FROM ANYWHERE:');
    console.log('1. Log in to MongoDB Atlas: https://cloud.mongodb.com');
    console.log('2. Select your cluster "rncmalaysia"');
    console.log('3. Click "Network Access" in the left sidebar');
    console.log('4. Click "ADD IP ADDRESS" button');
    console.log('5. Click "ALLOW ACCESS FROM ANYWHERE" button');
    console.log('6. Click "Confirm"');
    console.log('\n✅ This will add 0.0.0.0/0 to your IP whitelist');
    console.log('✅ Your database will accept connections from any IP address');
    console.log('✅ Render.com will be able to connect to your database');
    
    console.log('\n⚠️ SECURITY NOTE:');
    console.log('This option is less secure but is common for cloud deployments.');
    console.log('Your database is still protected by username/password authentication.');
    console.log('For additional security, ensure you have a strong MongoDB password.');
    
  } else if (option === '2') {
    console.log('\n🔒 ADD SPECIFIC RENDER.COM IP ADDRESSES:');
    console.log('1. Log in to MongoDB Atlas: https://cloud.mongodb.com');
    console.log('2. Select your cluster "rncmalaysia"');
    console.log('3. Click "Network Access" in the left sidebar');
    console.log('4. Click "ADD IP ADDRESS" button');
    console.log('5. Add these Render.com IP ranges one by one:');
    console.log('   • 35.174.127.31/32');
    console.log('   • 35.153.92.198/32');
    console.log('   • 3.94.78.181/32');
    console.log('   • 54.158.131.190/32');
    console.log('   • 54.158.119.122/32');
    console.log('   • 54.87.252.74/32');
    console.log('   • 52.86.120.186/32');
    console.log('6. For each IP, add a comment like "Render.com IP"');
    console.log('7. Click "Confirm" for each IP address');
    
    console.log('\n✅ This will whitelist only Render.com\'s IP addresses');
    console.log('✅ More secure than allowing access from anywhere');
    console.log('⚠️ Render may add new IPs in the future requiring updates');
    
  } else {
    console.log('\n❌ Invalid option. Please run the script again and choose 1 or 2.');
    rl.close();
    return;
  }
  
  console.log('\n🔄 AFTER UPDATING WHITELIST:');
  console.log('1. Wait 1-2 minutes for changes to propagate');
  console.log('2. Deploy your backend to Render.com');
  console.log('3. Check the logs to confirm connection is successful');
  
  console.log('\n🧪 TEST CONNECTION:');
  console.log('After deployment, visit: https://your-render-app.onrender.com/health');
  console.log('You should see: {"status":"success","message":"Server is healthy","dbConnected":true}');
  
  rl.close();
});
