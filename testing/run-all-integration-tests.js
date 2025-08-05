/**
 * Run All Integration Tests
 * Orchestrates all integration test suites for the RNC platform
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;

// Import test runners
const APIIntegrationTests = require('./api-integration-tests');
const FrontendBackendIntegrationTests = require('./frontend-backend-integration-tests');

class IntegrationTestOrchestrator {
  constructor() {
    this.testResults = {
      apiIntegration: null,
      frontendBackendIntegration: null,
      e2eIntegration: null
    };
    this.startTime = Date.now();
    this.reportDir = path.join(__dirname, 'reports');
  }

  async initialize() {
    console.log(chalk.blue('🚀 Initializing Integration Test Suite...'));
    
    // Create report directory
    try {
      await fs.mkdir(this.reportDir, { recursive: true });
    } catch (error) {
      console.log(chalk.yellow(`Directory creation warning: ${error.message}`));
    }

    // Check server availability
    await this.checkServerStatus();
  }

  async checkServerStatus() {
    console.log(chalk.blue('🔍 Checking server status...'));
    
    try {
      // Check frontend server
      const frontendResponse = await fetch('http://localhost:3000');
      if (!frontendResponse.ok) {
        throw new Error('Frontend server not responding');
      }
      
      // Check backend server
      const backendResponse = await fetch('http://localhost:5000/health');
      if (!backendResponse.ok) {
        throw new Error('Backend server not responding');
      }
      
      console.log(chalk.green('✅ Both frontend (3000) and backend (5000) servers are running'));
      return true;
    } catch (error) {
      console.log(chalk.red('❌ Server check failed'));
      console.log(chalk.yellow('📝 Please ensure both servers are running:'));
      console.log(chalk.yellow('   Frontend: npm start (in client directory)'));
      console.log(chalk.yellow('   Backend: npm start (in root directory)'));
      throw new Error(`Server availability check failed: ${error.message}`);
    }
  }

  async runAPIIntegrationTests() {
    console.log(chalk.blue('\n🔌 Running API Integration Tests'));
    console.log(chalk.blue('=================================='));
    
    const testStart = Date.now();
    try {
      const apiTestSuite = new APIIntegrationTests();
      const results = await apiTestSuite.runAllTests();
      
      this.testResults.apiIntegration = {
        status: 'PASSED',
        duration: Date.now() - testStart,
        results: results
      };
      
      console.log(chalk.green('✅ API integration tests passed'));
      return this.testResults.apiIntegration;
    } catch (error) {
      this.testResults.apiIntegration = {
        status: 'FAILED',
        duration: Date.now() - testStart,
        error: error.message
      };
      
      console.log(chalk.red('❌ API integration tests failed'));
      console.log(chalk.red(`Error: ${error.message}`));
      return this.testResults.apiIntegration;
    }
  }

  async runFrontendBackendIntegrationTests() {
    console.log(chalk.blue('\n🌐 Running Frontend-Backend Integration Tests'));
    console.log(chalk.blue('==============================================='));
    
    const testStart = Date.now();
    try {
      const fbTestSuite = new FrontendBackendIntegrationTests();
      const results = await fbTestSuite.runAllTests();
      
      this.testResults.frontendBackendIntegration = {
        status: 'PASSED',
        duration: Date.now() - testStart,
        results: results
      };
      
      console.log(chalk.green('✅ Frontend-Backend integration tests passed'));
      return this.testResults.frontendBackendIntegration;
    } catch (error) {
      this.testResults.frontendBackendIntegration = {
        status: 'FAILED',
        duration: Date.now() - testStart,
        error: error.message
      };
      
      console.log(chalk.red('❌ Frontend-Backend integration tests failed'));
      console.log(chalk.red(`Error: ${error.message}`));
      return this.testResults.frontendBackendIntegration;
    }
  }

  async runE2EIntegrationTests() {
    console.log(chalk.blue('\n🎯 Running E2E Integration Tests'));
    console.log(chalk.blue('=================================='));
    
    const testStart = Date.now();
    try {
      // Import and run E2E tests
      const E2ETestRunner = require('./e2e-integration-tests');
      const e2eRunner = new E2ETestRunner();
      const results = await e2eRunner.runAllTests();
      
      this.testResults.e2eIntegration = {
        status: 'PASSED',
        duration: Date.now() - testStart,
        results: results
      };
      
      console.log(chalk.green('✅ E2E integration tests passed'));
      return this.testResults.e2eIntegration;
    } catch (error) {
      this.testResults.e2eIntegration = {
        status: 'FAILED',
        duration: Date.now() - testStart,
        error: error.message
      };
      
      console.log(chalk.red('❌ E2E integration tests failed'));
      console.log(chalk.red(`Error: ${error.message}`));
      return this.testResults.e2eIntegration;
    }
  }

  async generateConsolidatedReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    const passedTests = Object.values(this.testResults).filter(result => result && result.status === 'PASSED').length;
    const totalTests = Object.values(this.testResults).filter(result => result !== null).length;
    const failedTests = totalTests - passedTests;
    
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration,
      summary: {
        totalTestSuites: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: totalTests > 0 ? `${((passedTests / totalTests) * 100).toFixed(2)}%` : '0%'
      },
      testResults: this.testResults,
      environment: {
        frontendUrl: 'http://localhost:3000',
        backendUrl: 'http://localhost:5000/api',
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    const reportPath = path.join(this.reportDir, `integration-tests-consolidated-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(chalk.blue('\n📊 Integration Tests Consolidated Report'));
    console.log(chalk.blue('========================================='));
    console.log(`Total Test Suites: ${report.summary.totalTestSuites}`);
    console.log(chalk.green(`Passed: ${report.summary.passed}`));
    console.log(chalk.red(`Failed: ${report.summary.failed}`));
    console.log(`Success Rate: ${report.summary.successRate}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Report saved: ${reportPath}`);

    // Print individual test suite results
    console.log(chalk.blue('\n📋 Test Suite Breakdown:'));
    console.log(chalk.blue('========================'));
    
    Object.entries(this.testResults).forEach(([suiteName, result]) => {
      if (result) {
        const status = result.status === 'PASSED' ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED');
        const duration = result.duration ? `(${result.duration}ms)` : '';
        console.log(`${status} ${suiteName} ${duration}`);
        
        if (result.error) {
          console.log(chalk.red(`   Error: ${result.error}`));
        }
      }
    });

    return report;
  }

  async runAllIntegrationTests() {
    try {
      await this.initialize();

      console.log(chalk.blue('\n🧪 Starting Comprehensive Integration Testing'));
      console.log(chalk.blue('=============================================='));
      console.log(chalk.yellow('This will run all integration test suites in sequence...'));

      // Run all integration test suites
      await this.runAPIIntegrationTests();
      await this.runFrontendBackendIntegrationTests();
      await this.runE2EIntegrationTests();

      // Generate consolidated report
      const report = await this.generateConsolidatedReport();

      // Determine overall success
      const hasFailures = Object.values(this.testResults).some(result => result && result.status === 'FAILED');
      
      if (hasFailures) {
        console.log(chalk.red('\n💥 Some integration tests failed!'));
        console.log(chalk.yellow('Check the detailed report for specific failures.'));
        return { success: false, report };
      } else {
        console.log(chalk.green('\n🎉 All integration tests passed!'));
        return { success: true, report };
      }

    } catch (error) {
      console.log(chalk.red('\n💥 Integration test orchestration failed!'));
      console.log(chalk.red(`Error: ${error.message}`));
      throw error;
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const orchestrator = new IntegrationTestOrchestrator();
  orchestrator.runAllIntegrationTests()
    .then((result) => {
      if (result.success) {
        console.log(chalk.green('\n🎊 All Integration Tests Completed Successfully!'));
        process.exit(0);
      } else {
        console.log(chalk.red('\n⚠️ Integration Tests Completed with Failures!'));
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log(chalk.red('\n💥 Integration Test Suite Failed!'));
      console.error(error);
      process.exit(1);
    });
}

module.exports = IntegrationTestOrchestrator;
