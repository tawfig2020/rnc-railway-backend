/**
 * Health Records API Tests
 */

// Test health record endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Health Records API ==='.blue);
  
  try {
    // Get current user's health record
    try {
      const healthRecord = await apiRequest('get', '/health/me', null, true);
      console.log(`✓ SUCCESS: Retrieved health record: ${healthRecord._id}`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Store health record ID in test data
      testData.healthId = healthRecord._id;
      
      // Test adding medication
      const updatedRecord = await apiRequest('put', '/health/medications', {
        medication: {
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: new Date().toISOString()
        }
      }, true);
      
      console.log(`✓ SUCCESS: Added medication to health record`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Test adding vaccination
      const vaccinationRecord = await apiRequest('put', '/health/vaccinations', {
        vaccination: {
          name: 'COVID-19',
          date: new Date().toISOString(),
          provider: 'Test Clinic'
        }
      }, true);
      
      console.log(`✓ SUCCESS: Added vaccination to health record`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Test updating medical history
      const historyUpdate = await apiRequest('put', `/health/${testData.healthId}`, {
        medicalHistory: 'Updated medical history',
        allergies: ['Penicillin', 'Dust'],
        bloodType: 'O+'
      }, true);
      
      console.log(`✓ SUCCESS: Updated medical history`.green);
      global.successCount = (global.successCount || 0) + 1;
      
    } catch (e) {
      // Create health record if it doesn't exist
      const newRecord = await apiRequest('post', '/health', {
        medicalHistory: 'Test medical history',
        allergies: ['None'],
        chronicConditions: [],
        bloodType: 'A+',
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '123-456-7890',
          relationship: 'Family'
        }
      }, true);
      
      console.log(`✓ SUCCESS: Created new health record: ${newRecord._id}`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Store health record ID in test data
      testData.healthId = newRecord._id;
    }
    
    // Test getting health record by ID
    if (testData.healthId) {
      const healthById = await apiRequest('get', `/health/${testData.healthId}`, null, true);
      console.log(`✓ SUCCESS: Retrieved health record by ID`.green);
      global.successCount = (global.successCount || 0) + 1;
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Health record operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
