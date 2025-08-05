const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const dns = require('dns');

// Load environment variables
dotenv.config();

// Get the MongoDB URI from environment variable
const uri = process.env.MONGODB_URI_PRODUCTION;

// Helper function to encode MongoDB URI
function encodeMongoURI(uri) {
  if (!uri) return null;
  
  try {
    // Extract parts of the connection string
    const matches = uri.match(/^(mongodb\+srv?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (!matches) return uri; // Return original if format doesn't match expected pattern
    
    const [_, protocol, username, password, rest] = matches;
    // Properly encode the password portion only
    return `${protocol}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${rest}`;
  } catch (err) {
    console.error('Error encoding MongoDB URI:', err.message);
    return uri; // Return original on error
  }
}

// Function to check DNS resolution (especially important for srv records)
async function checkDNSResolution(hostname) {
  return new Promise((resolve) => {
    dns.resolveSrv('_mongodb._tcp.' + hostname, (err, addresses) => {
      if (err) {
        console.log(`✗ DNS SRV record lookup failed: ${err.message}`);
        resolve(false);
      } else {
        console.log('✓ DNS SRV records found:');
        addresses.forEach(addr => {
          console.log(`  - ${addr.name}:${addr.port} (priority: ${addr.priority})`);
        });
        resolve(true);
      }
    });
  });
}

async function runTests() {
  console.log('=== MongoDB Connection Diagnostic Tool ===\n');
  
  // Check if URI is defined
  if (!uri) {
    console.error('✗ MONGODB_URI_PRODUCTION is not defined in your .env file');
    process.exit(1);
  }
  
  // Parse and display connection info (hiding credentials)
  try {
    const matches = uri.match(/^(mongodb\+srv?:\/\/)([^:]+):([^@]+)@([^\/]+)(?:\/([^\?]+))?/);
    if (matches) {
      const [_, protocol, username, password, hostname, dbname] = matches;
      console.log('Connection Information:');
      console.log(`Protocol: ${protocol.trim()}`);
      console.log(`Username: ${username}`);
      console.log(`Password: ${'*'.repeat(8)}`);
      console.log(`Hostname: ${hostname}`);
      console.log(`Database: ${dbname || '(not specified)'}`);
      
      // DNS check for SRV records (if using mongodb+srv)
      if (protocol.includes('+srv')) {
        console.log('\nDNS Resolution Test:');
        await checkDNSResolution(hostname);
      }
    } else {
      console.warn('⚠ Could not parse MongoDB URI format');
    }
  } catch (err) {
    console.error(`✗ Error analyzing URI: ${err.message}`);
  }
  
  // Try connecting with raw MongoClient first
  console.log('\nAttempting direct connection with MongoClient...');
  try {
    const encodedUri = encodeMongoURI(uri);
    const client = new MongoClient(encodedUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    console.log('✓ Direct connection successful!');
    
    // List available databases
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    
    console.log('\nAvailable databases:');
    databases.forEach(db => {
      console.log(`- ${db.name} (${Math.round(db.sizeOnDisk / 1024 / 1024 * 100) / 100} MB)`);
    });
    
    await client.close();
  } catch (err) {
    console.error(`✗ Direct connection error: ${err.message}`);
    
    // Specific error handling
    if (err.message.includes('bad auth')) {
      console.log('\nAuthentication Issue Detected:');
      console.log('1. Double-check your username and password');
      console.log('2. Ensure the user has access to the specified database');
      console.log('3. Check if your password contains special characters that need URL encoding');
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('\nDNS Resolution Issue Detected:');
      console.log('1. Verify your cluster address is correct');
      console.log('2. Check your internet connection');
    } else if (err.message.includes('timed out')) {
      console.log('\nConnection Timeout Detected:');
      console.log('1. Ensure your IP address is whitelisted in MongoDB Atlas');
      console.log('2. Check if there are any firewall or network restrictions');
    }
  }
  
  // Now try with mongoose as used in the application
  console.log('\nAttempting connection with Mongoose (as used in your application)...');
  try {
    const encodedUri = encodeMongoURI(uri);
    await mongoose.connect(encodedUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✓ Mongoose connection successful!');
    console.log(`Connected to database: ${mongoose.connection.name}`);
    
    await mongoose.connection.close();
  } catch (err) {
    console.error(`✗ Mongoose connection error: ${err.message}`);
  }
}

// Run all tests
runTests().then(() => {
  console.log('\n=== Diagnostic Tests Completed ===');
}).catch(err => {
  console.error('Uncaught error during tests:', err);
}).finally(() => {
  // Ensure process exits even if there are hanging connections
  process.exit(0);
});
