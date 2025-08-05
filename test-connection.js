const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the MongoDB URI from environment variable
const uri = process.env.MONGODB_URI_PRODUCTION;

console.log('Attempting to connect to MongoDB with URI:');
// Show first part of URI for security but hide credentials
const redactedUri = uri.replace(/(:.*@)/g, ':****@');
console.log(redactedUri);

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✓ Successfully connected to MongoDB!');
  // List available databases to verify access
  return mongoose.connection.db.admin().listDatabases();
})
.then(result => {
  console.log('\nAvailable databases:');
  result.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
  mongoose.connection.close();
})
.catch(err => {
  console.error('✗ MongoDB connection error:', err.message);
  
  // Show specific troubleshooting tips based on error
  if (err.message.includes('bad auth')) {
    console.log('\nTroubleshooting tips for authentication errors:');
    console.log('1. Double-check username and password');
    console.log('2. Verify that special characters in password are URL encoded');
    console.log('3. Ensure the user has access to the specified database');
    console.log('4. Check if your IP address is whitelisted in MongoDB Atlas');
  } else if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT')) {
    console.log('\nTroubleshooting tips for connection errors:');
    console.log('1. Verify cluster address is correct');
    console.log('2. Check your internet connection');
    console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
  }
  
  process.exit(1);
});
