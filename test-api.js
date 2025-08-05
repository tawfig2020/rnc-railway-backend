/**
 * API Testing Script
 * 
 * This script tests key API endpoints to verify MongoDB integration
 * Run with: node test-api.js
 * 
 * Make sure the server is running before executing this script
 */
const axios = require('axios');
const colors = require('colors');

// Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = null;

// Test credentials - replace with your test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
};

// Helper function for colored console output
const logSuccess = (msg) => console.log(`✓ SUCCESS: ${msg}`.green);
const logError = (msg) => console.error(`✗ ERROR: ${msg}`.red);
const logInfo = (msg) => console.log(`ℹ INFO: ${msg}`.blue);

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, auth = false) {
  try {
    const headers = auth && authToken ? { 'x-auth-token': authToken } : {};
    const config = { headers };
    
    let response;
    if (method === 'get') {
      response = await axios.get(`${API_URL}${endpoint}`, config);
    } else if (method === 'post') {
      response = await axios.post(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'put') {
      response = await axios.put(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'delete') {
      response = await axios.delete(`${API_URL}${endpoint}`, config);
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

// Authentication tests
async function testAuthentication() {
  logInfo('Testing Authentication...');
  
  try {
    // Login
    const loginResponse = await apiRequest('post', '/auth/login', TEST_USER);
    authToken = loginResponse.token;
    logSuccess('User login successful');
    
    // Get current user
    const userProfile = await apiRequest('get', '/auth/me', null, true);
    logSuccess(`Retrieved user profile for: ${userProfile.name}`);
  } catch (error) {
    logError(`Authentication failed: ${error.message}`);
  }
}

// Profile tests
async function testProfiles() {
  logInfo('Testing Profile API...');
  
  try {
    // Get current user's profile
    const profile = await apiRequest('get', '/profiles/me', null, true);
    
    if (profile && profile._id) {
      logSuccess(`Retrieved user profile: ${profile._id}`);
      
      // Test profile update
      const updatedProfile = await apiRequest('post', '/profiles', {
        status: 'refugee',
        countryOfOrigin: 'Updated Country',
        medicalConditions: ['None']
      }, true);
      
      logSuccess('Profile updated successfully');
    } else {
      // Create a new profile if none exists
      const newProfile = await apiRequest('post', '/profiles', {
        status: 'refugee',
        countryOfOrigin: 'Test Country',
        medicalConditions: ['None']
      }, true);
      
      logSuccess('Created new profile');
    }
  } catch (error) {
    logError(`Profile operations failed: ${error.message}`);
  }
}

// Health record tests
async function testHealthRecords() {
  logInfo('Testing Health Records API...');
  
  try {
    // Get current user's health record
    try {
      const healthRecord = await apiRequest('get', '/health/me', null, true);
      logSuccess(`Retrieved health record: ${healthRecord._id}`);
      
      // Test adding medication
      const updatedRecord = await apiRequest('put', '/health/medications', {
        medication: {
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: new Date().toISOString()
        }
      }, true);
      
      logSuccess('Added medication to health record');
    } catch (e) {
      // Create health record if it doesn't exist
      const newRecord = await apiRequest('post', '/health', {
        medicalHistory: 'Test medical history',
        allergies: ['None'],
        chronicConditions: []
      }, true);
      
      logSuccess('Created new health record');
    }
  } catch (error) {
    logError(`Health record operations failed: ${error.message}`);
  }
}

// Support request tests
async function testSupportRequests() {
  logInfo('Testing Support Requests API...');
  
  try {
    // Create a support request
    const newRequest = await apiRequest('post', '/support', {
      supportType: 'general',
      title: 'Test Support Request',
      description: 'This is a test support request',
      urgency: 'low'
    }, true);
    
    logSuccess(`Created support request: ${newRequest._id}`);
    
    // Get all user's support requests
    const requests = await apiRequest('get', '/support', null, true);
    logSuccess(`Retrieved ${requests.length} support requests`);
    
    // Update the created request
    if (newRequest && newRequest._id) {
      const updatedRequest = await apiRequest('put', `/support/${newRequest._id}`, {
        status: 'in progress',
        updates: [{
          message: 'Test update',
          date: new Date().toISOString(),
          updatedBy: 'system'
        }]
      }, true);
      
      logSuccess('Updated support request');
    }
  } catch (error) {
    logError(`Support request operations failed: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('\n==== TESTING API ENDPOINTS ====\n'.yellow);
  
  try {
    await testAuthentication();
    
    if (authToken) {
      await testProfiles();
      await testHealthRecords();
      await testSupportRequests();
    } else {
      logError('Skipping tests that require authentication');
    }
    
    console.log('\n==== TESTS COMPLETED ====\n'.yellow);
  } catch (error) {
    logError(`Test execution error: ${error.message}`);
  }
}

// Execute tests
runTests();
