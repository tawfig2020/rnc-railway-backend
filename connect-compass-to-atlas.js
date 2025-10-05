#!/usr/bin/env node

/**
 * Connect MongoDB Compass to Atlas Cloud Database
 * Correct connection string for Atlas (not localhost)
 */

console.log('🔧 CONNECT COMPASS TO ATLAS CLOUD DATABASE');
console.log('='.repeat(45));

console.log('\n🎯 PROBLEM SOLVED:');
console.log('Your Compass was connected to localhost (local database)');
console.log('Your backend uses Atlas cloud database');
console.log('Solution: Connect Compass to Atlas cloud database');

console.log('\n🔗 ATLAS CONNECTION STRING FOR COMPASS:');
console.log('mongodb+srv://tawfig2020:Tawfig2020@cluster0.dfz2nfi.mongodb.net/refugee-network');

console.log('\n📋 STEPS TO CONNECT COMPASS TO ATLAS:');
console.log('1. Open MongoDB Compass');
console.log('2. Disconnect from localhost if connected');
console.log('3. Click "New Connection"');
console.log('4. Paste this connection string:');
console.log('   mongodb+srv://tawfig2020:Tawfig2020@cluster0.dfz2nfi.mongodb.net/refugee-network');
console.log('5. Click "Connect"');
console.log('6. Navigate to: refugee-network → users');
console.log('7. Find admin user: admin@refugeenetwork.com');
console.log('8. Edit the document');
console.log('9. Update password field to:');
console.log('   "$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86"');
console.log('10. Set isEmailVerified: true');
console.log('11. Set role: "admin"');
console.log('12. Save changes');

console.log('\n🔄 ALTERNATIVE: USE ATLAS WEB INTERFACE');
console.log('1. Go to: https://cloud.mongodb.com/');
console.log('2. Collections → refugee-network → users');
console.log('3. Find admin user and edit');
console.log('4. Update password, role, and verification');

console.log('\n✅ AFTER CORRECT UPDATE:');
console.log('- Backend will connect to updated Atlas database');
console.log('- Admin login will work: admin@refugeenetwork.com / 123456');
console.log('- Authentication will be functional');

console.log('\n🎯 KEY DIFFERENCE:');
console.log('❌ localhost:27017 (local database - wrong)');
console.log('✅ cluster0.dfz2nfi.mongodb.net (Atlas cloud - correct)');
