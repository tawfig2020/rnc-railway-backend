const axios = require('axios');
const https = require('https');

// Function to get public IP address using a public API
async function getPublicIp() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data.trim());
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Utility to automatically update MongoDB Atlas IP whitelist
 * Add your Atlas API Public Key and Private Key from:
 * MongoDB Atlas → Project Settings → Access Manager → API Keys
 */

const MONGODB_ATLAS_API = {
  PUBLIC_KEY: process.env.MONGODB_ATLAS_PUBLIC_KEY || '', // Set these in your .env file
  PRIVATE_KEY: process.env.MONGODB_ATLAS_PRIVATE_KEY || '',
  PROJECT_ID: process.env.MONGODB_ATLAS_PROJECT_ID || '' // Your Atlas Project ID
};

/**
 * Updates MongoDB Atlas IP whitelist with the current public IP address
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function updateMongoDBAtlasIpWhitelist() {
  try {
    // Check if API credentials are configured
    if (!MONGODB_ATLAS_API.PUBLIC_KEY || !MONGODB_ATLAS_API.PRIVATE_KEY || !MONGODB_ATLAS_API.PROJECT_ID) {
      console.warn(
        'MongoDB Atlas API credentials not configured. IP whitelist not updated.\n' +
        'To enable automatic IP whitelisting, set MONGODB_ATLAS_PUBLIC_KEY, ' +
        'MONGODB_ATLAS_PRIVATE_KEY, and MONGODB_ATLAS_PROJECT_ID in your .env file.'
      );
      return false;
    }

    // Get current public IP address
    const ip = await getPublicIp();
    const ipWithMask = `${ip}/32`; // Add CIDR notation
    console.log(`Current public IP address: ${ipWithMask}`);

    // MongoDB Atlas API endpoint for access list
    const apiUrl = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${MONGODB_ATLAS_API.PROJECT_ID}/accessList`;

    // Update the IP whitelist
    const response = await axios.post(
      apiUrl,
      {
        ipAddress: ipWithMask,
        comment: 'Auto-added by application on ' + new Date().toISOString()
      },
      {
        auth: {
          username: MONGODB_ATLAS_API.PUBLIC_KEY,
          password: MONGODB_ATLAS_API.PRIVATE_KEY
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      console.log('MongoDB Atlas IP whitelist successfully updated.');
      return true;
    } else {
      console.warn('Unexpected response from MongoDB Atlas API:', response.status);
      return false;
    }
  } catch (error) {
    // Check for specific error types
    if (error.response && error.response.status === 409) {
      console.log('IP address is already in the whitelist. Continuing...');
      return true;
    } else if (error.response && error.response.data) {
      console.error('MongoDB Atlas API error:', error.response.data);
    } else {
      console.error('Error updating MongoDB Atlas IP whitelist:', error.message);
    }
    return false;
  }
}

module.exports = {
  updateMongoDBAtlasIpWhitelist
};
