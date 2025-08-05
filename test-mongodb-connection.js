const mongoose = require('mongoose');
const config = require('./config/config');

async function testMongoConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MongoDB URI:', config.mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  try {
    // Set connection timeout
    const conn = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('Ready state:', conn.connection.readyState);
    
    // Test basic operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('DNS resolution failed - check your internet connection');
    } else if (error.message.includes('authentication failed')) {
      console.error('Authentication failed - check username/password');
    } else if (error.message.includes('IP')) {
      console.error('IP whitelist issue - check MongoDB Atlas network access');
    }
    
    return false;
  }
}

// Run the test
testMongoConnection().then(success => {
  process.exit(success ? 0 : 1);
});
