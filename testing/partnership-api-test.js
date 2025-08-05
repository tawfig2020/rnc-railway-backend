/**
 * Partnership Application API Test
 * Tests the complete backend API journey for partnership applications:
 * - Admin authentication
 * - Partnership application submission
 * - Admin management operations
 * - Data validation and error handling
 */

const axios = require('axios');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  backendUrl: 'http://localhost:5000/api',
  adminCredentials: {
    email: 'admin@refugeenetwork.com',
    password: 'Admin@123'
  },
  reportDir: path.join(__dirname, 'reports')
};

// Test data for partnership application
const PARTNERSHIP_TEST_DATA = {
  companyName: 'TechCorp Solutions Inc.',
  industry: 'Technology',
  companySize: 'Medium (50-249 employees)',
  companyWebsite: 'https://www.techcorp-solutions.com',
  yearsInOperation: '8',
  companyDescription: 'A leading technology company specializing in software development and digital solutions for businesses worldwide.',
  
  contactName: 'Sarah Johnson',
  contactTitle: 'HR Director',
  contactEmail: 'sarah.johnson@techcorp-solutions.com',
  contactPhone: '+1-555-0123',
  preferredContact: 'email',
  
  positionTypes: ['Full-time', 'Part-time'],
  potentialOpenings: '5-10 positions available in the next 6 months',
  workArrangements: {
    onsite: true,
    hybrid: true,
    remote: false
  },
  skillsNeeded: ['Technology & IT', 'Customer Service'],
  languageRequirements: ['English', 'Spanish'],
  
  hasDiversityPolicy: true,
  diversityPolicyDetails: 'We have a comprehensive diversity and inclusion policy that promotes equal opportunities for all employees.',
  previousRefugeeHiring: false,
  previousExperience: 'This would be our first experience hiring refugees, but we are committed to providing a welcoming environment.',
  supportSystems: 'We offer mentorship programs, language support, and cultural integration assistance.',
  
  partnershipGoals: 'To build a diverse workforce and contribute to refugee integration in our community.',
  hiringTimeline: 'We plan to start hiring within the next 3 months.',
  supportNeeded: 'Guidance on best practices for refugee integration and ongoing support during the transition period.',
  mentorshipOpportunities: true,
  additionalInfo: 'We are excited about this partnership and committed to making it successful.'
};

class PartnershipAPITest {
  constructor() {
    this.adminToken = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.partnershipId = null;
  }

  async initialize() {
    console.log(chalk.blue('🚀 Initializing Partnership API Test Suite...'));
    
    // Create reports directory
    if (!fs.existsSync(TEST_CONFIG.reportDir)) {
      fs.mkdirSync(TEST_CONFIG.reportDir, { recursive: true });
    }

    // Check backend server availability
    await this.checkBackendAvailability();
  }

  async checkBackendAvailability() {
    console.log(chalk.blue('🔍 Checking backend server availability...'));
    
    try {
      const response = await axios.get(`${TEST_CONFIG.backendUrl}/blogs`, { timeout: 5000 });
      console.log(chalk.green('✅ Backend server is running'));
    } catch (error) {
      throw new Error(`Backend server not available: ${error.message}`);
    }
  }

  async runTest(testName, testFunction) {
    console.log(chalk.blue(`\n🧪 Running test: ${testName}`));
    this.testResults.total++;
    
    try {
      const startTime = Date.now();
      await testFunction();
      const duration = Date.now() - startTime;
      
      console.log(chalk.green(`✅ ${testName} - PASSED (${duration}ms)`));
      this.testResults.passed++;
      this.testResults.details.push({
        name: testName,
        status: 'PASSED',
        duration,
        error: null
      });
    } catch (error) {
      console.log(chalk.red(`❌ ${testName} - FAILED`));
      console.log(chalk.red(`Error: ${error.message}`));
      
      this.testResults.failed++;
      this.testResults.details.push({
        name: testName,
        status: 'FAILED',
        duration: 0,
        error: error.message
      });
      
      throw error;
    }
  }

  async authenticateAdmin() {
    console.log(chalk.blue('🔐 Authenticating admin user...'));
    
    try {
      const response = await axios.post(`${TEST_CONFIG.backendUrl}/auth/login`, {
        email: TEST_CONFIG.adminCredentials.email,
        password: TEST_CONFIG.adminCredentials.password
      });
      
      if (response.data.token) {
        this.adminToken = response.data.token;
        console.log(chalk.green('✅ Admin authentication successful'));
        return true;
      } else {
        throw new Error('No token received from login');
      }
    } catch (error) {
      throw new Error(`Admin authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async testPartnershipSubmission() {
    console.log(chalk.blue('📝 Testing partnership application submission...'));
    
    try {
      const response = await axios.post(`${TEST_CONFIG.backendUrl}/partnerships`, PARTNERSHIP_TEST_DATA);
      
      if (response.status === 201 && response.data.success) {
        this.partnershipId = response.data.data._id;
        console.log(chalk.green(`✅ Partnership application created with ID: ${this.partnershipId}`));
        
        // Verify response structure
        const partnership = response.data.data;
        if (!partnership.companyName || !partnership.contactEmail || !partnership.status) {
          throw new Error('Invalid partnership response structure');
        }
        
        console.log(chalk.green(`Company: ${partnership.companyName}`));
        console.log(chalk.green(`Contact: ${partnership.contactEmail}`));
        console.log(chalk.green(`Status: ${partnership.status}`));
        
        return partnership;
      } else {
        throw new Error(`API call failed with status ${response.status}`);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log(chalk.yellow('⚠️ Partnership application already exists - this is expected for testing'));
        
        // Try to find the existing partnership
        if (this.adminToken) {
          const listResponse = await axios.get(`${TEST_CONFIG.backendUrl}/partnerships`, {
            headers: { 'x-auth-token': this.adminToken }
          });
          
          const existingPartnership = listResponse.data.data.find(p => 
            p.companyName === PARTNERSHIP_TEST_DATA.companyName && 
            p.contactEmail === PARTNERSHIP_TEST_DATA.contactEmail
          );
          
          if (existingPartnership) {
            this.partnershipId = existingPartnership._id;
            console.log(chalk.yellow(`Using existing partnership ID: ${this.partnershipId}`));
            return existingPartnership;
          }
        }
        
        return { success: true, message: 'Duplicate application (expected)' };
      }
      throw new Error(`Partnership submission failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async testPartnershipValidation() {
    console.log(chalk.blue('🔍 Testing partnership application validation...'));
    
    // Test with missing required fields
    const invalidData = {
      companyName: '', // Empty required field
      contactEmail: 'invalid-email' // Invalid email format
    };
    
    try {
      await axios.post(`${TEST_CONFIG.backendUrl}/partnerships`, invalidData);
      throw new Error('Validation should have failed but did not');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(chalk.green('✅ Validation correctly rejected invalid data'));
        console.log(chalk.yellow(`Validation error: ${error.response.data.message}`));
      } else {
        throw new Error(`Unexpected error during validation test: ${error.message}`);
      }
    }
  }

  async testAdminPartnershipList() {
    console.log(chalk.blue('📋 Testing admin partnership list retrieval...'));
    
    if (!this.adminToken) {
      throw new Error('Admin token not available');
    }
    
    const response = await axios.get(`${TEST_CONFIG.backendUrl}/partnerships`, {
      headers: { 'x-auth-token': this.adminToken }
    });
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to retrieve partnerships list');
    }
    
    const partnerships = response.data.data;
    console.log(chalk.green(`✅ Retrieved ${partnerships.length} partnership applications`));
    
    // Verify structure of first partnership if exists
    if (partnerships.length > 0) {
      const partnership = partnerships[0];
      const requiredFields = ['_id', 'companyName', 'contactEmail', 'status', 'createdAt'];
      
      for (const field of requiredFields) {
        if (!partnership[field]) {
          throw new Error(`Missing required field in partnership list: ${field}`);
        }
      }
      
      console.log(chalk.green('✅ Partnership list structure validated'));
    }
    
    return partnerships;
  }

  async testAdminPartnershipDetail() {
    console.log(chalk.blue('🔍 Testing admin partnership detail retrieval...'));
    
    if (!this.adminToken || !this.partnershipId) {
      throw new Error('Admin token or partnership ID not available');
    }
    
    const response = await axios.get(`${TEST_CONFIG.backendUrl}/partnerships/${this.partnershipId}`, {
      headers: { 'x-auth-token': this.adminToken }
    });
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to retrieve partnership details');
    }
    
    const partnership = response.data.data;
    console.log(chalk.green(`✅ Retrieved partnership details for: ${partnership.companyName}`));
    
    // Verify detailed fields
    const detailedFields = ['companyDescription', 'partnershipGoals', 'hiringTimeline'];
    for (const field of detailedFields) {
      if (!partnership[field]) {
        console.log(chalk.yellow(`⚠️ Optional field missing: ${field}`));
      }
    }
    
    return partnership;
  }

  async testAdminStatusUpdate() {
    console.log(chalk.blue('🔄 Testing admin partnership status update...'));
    
    if (!this.adminToken || !this.partnershipId) {
      throw new Error('Admin token or partnership ID not available');
    }
    
    const newStatus = 'under_review';
    const reviewNotes = 'Application is being reviewed by our team.';
    
    const response = await axios.put(`${TEST_CONFIG.backendUrl}/partnerships/${this.partnershipId}/status`, {
      status: newStatus,
      reviewNotes: reviewNotes
    }, {
      headers: { 'x-auth-token': this.adminToken }
    });
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to update partnership status');
    }
    
    const updatedPartnership = response.data.data;
    if (updatedPartnership.status !== newStatus) {
      throw new Error(`Status not updated correctly. Expected: ${newStatus}, Got: ${updatedPartnership.status}`);
    }
    
    console.log(chalk.green(`✅ Partnership status updated to: ${newStatus}`));
    console.log(chalk.green(`✅ Review notes added: ${reviewNotes}`));
    
    return updatedPartnership;
  }

  async testPartnershipStats() {
    console.log(chalk.blue('📊 Testing partnership statistics...'));
    
    if (!this.adminToken) {
      throw new Error('Admin token not available');
    }
    
    const response = await axios.get(`${TEST_CONFIG.backendUrl}/partnerships/stats/overview`, {
      headers: { 'x-auth-token': this.adminToken }
    });
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to retrieve partnership statistics');
    }
    
    const stats = response.data.data;
    console.log(chalk.green(`✅ Partnership stats retrieved:`));
    console.log(chalk.blue(`   Total applications: ${stats.total}`));
    console.log(chalk.blue(`   Pending: ${stats.pending}`));
    console.log(chalk.blue(`   Under review: ${stats.under_review}`));
    console.log(chalk.blue(`   Approved: ${stats.approved}`));
    console.log(chalk.blue(`   Recent applications: ${stats.recentApplications?.length || 0}`));
    
    return stats;
  }

  async testUnauthorizedAccess() {
    console.log(chalk.blue('🔒 Testing unauthorized access protection...'));
    
    // Test admin endpoints without token
    const adminEndpoints = [
      `${TEST_CONFIG.backendUrl}/partnerships`,
      `${TEST_CONFIG.backendUrl}/partnerships/stats/overview`
    ];
    
    for (const endpoint of adminEndpoints) {
      try {
        await axios.get(endpoint);
        throw new Error(`Unauthorized access should have been blocked for: ${endpoint}`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(chalk.green(`✅ Unauthorized access correctly blocked for: ${endpoint}`));
        } else {
          throw new Error(`Unexpected error for unauthorized access test: ${error.message}`);
        }
      }
    }
  }

  async cleanup() {
    console.log(chalk.blue('🧹 Cleaning up test data...'));
    
    try {
      // Delete test partnership if created
      if (this.partnershipId && this.adminToken) {
        await axios.delete(`${TEST_CONFIG.backendUrl}/partnerships/${this.partnershipId}`, {
          headers: { 'x-auth-token': this.adminToken }
        });
        console.log(chalk.green('✅ Test partnership deleted'));
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Cleanup warning: ${error.message}`));
    }
  }

  async generateReport() {
    const report = {
      testSuite: 'Partnership Application API Test',
      timestamp: new Date().toISOString(),
      results: this.testResults,
      testData: PARTNERSHIP_TEST_DATA,
      partnershipId: this.partnershipId
    };
    
    const reportPath = path.join(TEST_CONFIG.reportDir, `partnership-api-test-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(chalk.blue(`\n📊 Test Report Generated: ${reportPath}`));
    return report;
  }

  async runAllTests() {
    try {
      await this.initialize();
      
      // Authentication Tests
      console.log(chalk.blue('\n🔐 Authentication Tests'));
      console.log(chalk.blue('========================'));
      await this.runTest('Admin Authentication', () => this.authenticateAdmin());
      
      // Partnership Submission Tests
      console.log(chalk.blue('\n📝 Partnership Submission Tests'));
      console.log(chalk.blue('================================='));
      await this.runTest('Partnership Application Submission', () => this.testPartnershipSubmission());
      await this.runTest('Partnership Application Validation', () => this.testPartnershipValidation());
      
      // Admin Management Tests
      console.log(chalk.blue('\n👨‍💼 Admin Management Tests'));
      console.log(chalk.blue('============================'));
      await this.runTest('Admin Partnership List', () => this.testAdminPartnershipList());
      await this.runTest('Admin Partnership Detail', () => this.testAdminPartnershipDetail());
      await this.runTest('Admin Status Update', () => this.testAdminStatusUpdate());
      await this.runTest('Partnership Statistics', () => this.testPartnershipStats());
      
      // Security Tests
      console.log(chalk.blue('\n🔒 Security Tests'));
      console.log(chalk.blue('=================='));
      await this.runTest('Unauthorized Access Protection', () => this.testUnauthorizedAccess());
      
      // Generate report
      const report = await this.generateReport();
      
      // Summary
      console.log(chalk.blue('\n📊 Partnership API Test Results'));
      console.log(chalk.blue('=================================='));
      
      const { passed, failed, total } = this.testResults;
      console.log(chalk.blue(`Total Tests: ${total}`));
      console.log(chalk.green(`Passed: ${passed}`));
      console.log(chalk.red(`Failed: ${failed}`));
      console.log(chalk.blue(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`));
      
      if (failed === 0) {
        console.log(chalk.green('\n🎉 All partnership API tests passed!'));
        console.log(chalk.green('✅ Partnership application submission working'));
        console.log(chalk.green('✅ Data validation working'));
        console.log(chalk.green('✅ Admin authentication working'));
        console.log(chalk.green('✅ Admin management features working'));
        console.log(chalk.green('✅ Security protection working'));
        console.log(chalk.green('✅ Complete backend API journey verified'));
      } else {
        console.log(chalk.yellow('\n⚠️ Some tests failed - check details above'));
      }
      
      return report;
      
    } catch (error) {
      console.log(chalk.red(`\n💥 Partnership API Test Suite Failed: ${error.message}`));
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const test = new PartnershipAPITest();
  test.runAllTests()
    .then((report) => {
      if (report.results.failed === 0) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = PartnershipAPITest;
