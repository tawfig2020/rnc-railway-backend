/**
 * Comprehensive Test Runner for RNC Platform
 * Orchestrates all types of testing: unit, integration, e2e, and cross-browser
 */

const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Import test runners
const E2ETestRunner = require('./e2e-integration-tests');
const CrossBrowserTestRunner = require('./cross-browser-tests');

class ComprehensiveTestRunner {
  constructor() {
    this.testResults = {
      unit: null,
      integration: null,
      e2e: null,
      crossBrowser: null
    };
    this.startTime = Date.now();
  }

  async checkServerStatus() {
    console.log(chalk.blue('🔍 Checking server status...'));
    
    try {
      const response = await fetch('http://localhost:3000');
      const backendResponse = await fetch('http://localhost:5000/api/health');
      
      if (response.ok && backendResponse.ok) {
        console.log(chalk.green('✅ Both frontend (3000) and backend (5000) servers are running'));
        return true;
      } else {
        throw new Error('Servers not responding correctly');
      }
    } catch (error) {
      console.log(chalk.red('❌ Servers are not running properly'));
      console.log(chalk.yellow('📝 Please ensure both servers are running:'));
      console.log(chalk.yellow('   Frontend: npm start (in client directory)'));
      console.log(chalk.yellow('   Backend: npm start (in root directory)'));
      return false;
    }
  }

  async runUnitTests() {
    console.log(chalk.blue('\n🧪 Running Unit Tests'));
    console.log(chalk.blue('=====================\n'));

    return new Promise((resolve) => {
      const clientDir = path.join(__dirname, '../client');
      const testProcess = spawn('npm', ['test', '--', '--coverage', '--watchAll=false'], {
        cwd: clientDir,
        shell: true,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      testProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        console.log(text);
      });

      testProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        console.error(chalk.red(text));
      });

      testProcess.on('close', (code) => {
        const result = {
          status: code === 0 ? 'PASSED' : 'FAILED',
          exitCode: code,
          output,
          errorOutput,
          duration: Date.now() - this.startTime
        };

        this.testResults.unit = result;
        
        if (code === 0) {
          console.log(chalk.green('✅ Unit tests completed successfully'));
        } else {
          console.log(chalk.red('❌ Unit tests failed'));
        }
        
        resolve(result);
      });
    });
  }

  async runIntegrationTests() {
    console.log(chalk.blue('\n🔗 Running Integration Tests'));
    console.log(chalk.blue('=============================\n'));

    return new Promise((resolve) => {
      const integrationTestPath = path.join(__dirname, 'run-integration-tests.js');
      const testProcess = spawn('node', [integrationTestPath], {
        cwd: __dirname,
        shell: true,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      testProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        console.log(text);
      });

      testProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        console.error(chalk.red(text));
      });

      testProcess.on('close', (code) => {
        const result = {
          status: code === 0 ? 'PASSED' : 'FAILED',
          exitCode: code,
          output,
          errorOutput,
          duration: Date.now() - this.startTime
        };

        this.testResults.integration = result;
        
        if (code === 0) {
          console.log(chalk.green('✅ Integration tests completed successfully'));
        } else {
          console.log(chalk.red('❌ Integration tests failed'));
        }
        
        resolve(result);
      });
    });
  }

  async runAPIIntegrationTests() {
    console.log(chalk.blue('\n🔌 Running API Integration Tests'));
    console.log(chalk.blue('==================================\n'));

    try {
      const apiTestSuite = new APIIntegrationTests();
      await apiTestSuite.runAllTests();
      console.log(chalk.green('✅ API integration tests passed'));
      this.testResults.apiIntegration = { status: 'PASSED', duration: Date.now() - this.startTime };
    } catch (error) {
      console.log(chalk.red('❌ API integration tests failed'));
      console.log(chalk.red(`Error: ${error.message}`));
      this.testResults.apiIntegration = { status: 'FAILED', error: error.message, duration: Date.now() - this.startTime };
    }
  }

  async runFrontendBackendIntegrationTests() {
    console.log(chalk.blue('\n🌐 Running Frontend-Backend Integration Tests'));
    console.log(chalk.blue('===============================================\n'));

    try {
      const fbTestSuite = new FrontendBackendIntegrationTests();
      await fbTestSuite.runAllTests();
      console.log(chalk.green('✅ Frontend-Backend integration tests passed'));
      this.testResults.frontendBackendIntegration = { status: 'PASSED', duration: Date.now() - this.startTime };
    } catch (error) {
      console.log(chalk.red('❌ Frontend-Backend integration tests failed'));
      console.log(chalk.red(`Error: ${error.message}`));
      this.testResults.frontendBackendIntegration = { status: 'FAILED', error: error.message, duration: Date.now() - this.startTime };
    }
  }

  async runE2ETests() {
    console.log(chalk.blue('\n🎯 Running End-to-End Tests'));
    console.log(chalk.blue('============================\n'));

    try {
      const e2eRunner = new E2ETestRunner();
      await e2eRunner.runAllTests();
      
      this.testResults.e2e = {
        status: 'PASSED',
        results: e2eRunner.testResults,
        duration: Date.now() - this.startTime
      };
      
      console.log(chalk.green('✅ E2E tests completed successfully'));
      return this.testResults.e2e;
    } catch (error) {
      this.testResults.e2e = {
        status: 'FAILED',
        error: error.message,
        duration: Date.now() - this.startTime
      };
      
      console.log(chalk.red('❌ E2E tests failed:', error.message));
      return this.testResults.e2e;
    }
  }

  async runCrossBrowserTests() {
    console.log(chalk.blue('\n🌐 Running Cross-Browser Tests'));
    console.log(chalk.blue('===============================\n'));

    try {
      const crossBrowserRunner = new CrossBrowserTestRunner();
      const report = await crossBrowserRunner.runAllTests();
      
      this.testResults.crossBrowser = {
        status: report.summary.failed === 0 ? 'PASSED' : 'FAILED',
        report,
        duration: Date.now() - this.startTime
      };
      
      console.log(chalk.green('✅ Cross-browser tests completed'));
      return this.testResults.crossBrowser;
    } catch (error) {
      this.testResults.crossBrowser = {
        status: 'FAILED',
        error: error.message,
        duration: Date.now() - this.startTime
      };
      
      console.log(chalk.red('❌ Cross-browser tests failed:', error.message));
      return this.testResults.crossBrowser;
    }
  }

  async runPerformanceTests() {
    console.log(chalk.blue('\n⚡ Running Performance Tests'));
    console.log(chalk.blue('============================\n'));

    const performanceResults = [];
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/marketplace', name: 'Marketplace' },
      { url: '/donate', name: 'Donate' },
      { url: '/register', name: 'Register' }
    ];

    for (const page of pages) {
      try {
        console.log(chalk.blue(`📊 Testing ${page.name}...`));
        
        const startTime = Date.now();
        const response = await fetch(`http://localhost:3000${page.url}`);
        const loadTime = Date.now() - startTime;
        
        const contentLength = response.headers.get('content-length') || 'unknown';
        
        performanceResults.push({
          page: page.name,
          url: page.url,
          loadTime,
          status: response.status,
          contentLength,
          result: loadTime < 3000 ? 'PASSED' : 'WARNING'
        });
        
        const status = loadTime < 3000 ? chalk.green('✅') : chalk.yellow('⚠️');
        console.log(`${status} ${page.name}: ${loadTime}ms`);
        
      } catch (error) {
        performanceResults.push({
          page: page.name,
          url: page.url,
          error: error.message,
          result: 'FAILED'
        });
        console.log(chalk.red(`❌ ${page.name}: ${error.message}`));
      }
    }

    return {
      status: performanceResults.every(r => r.result !== 'FAILED') ? 'PASSED' : 'FAILED',
      results: performanceResults
    };
  }

  async runSecurityTests() {
    console.log(chalk.blue('\n🔒 Running Basic Security Tests'));
    console.log(chalk.blue('=================================\n'));

    const securityTests = [];

    try {
      // Test 1: Check for HTTPS redirect (in production)
      console.log(chalk.blue('🔍 Checking security headers...'));
      
      const response = await fetch('http://localhost:3000');
      const headers = response.headers;
      
      // Check for security headers
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'strict-transport-security'
      ];
      
      securityHeaders.forEach(header => {
        const hasHeader = headers.has(header);
        securityTests.push({
          test: `Security Header: ${header}`,
          status: hasHeader ? 'PASSED' : 'WARNING',
          details: hasHeader ? `Present: ${headers.get(header)}` : 'Missing'
        });
      });

      // Test 2: Check for exposed sensitive files
      console.log(chalk.blue('🔍 Checking for exposed sensitive files...'));
      
      const sensitiveFiles = [
        '/.env',
        '/config/database.js',
        '/package.json',
        '/.git/config'
      ];
      
      for (const file of sensitiveFiles) {
        try {
          const fileResponse = await fetch(`http://localhost:3000${file}`);
          securityTests.push({
            test: `Sensitive File Exposure: ${file}`,
            status: fileResponse.status === 404 ? 'PASSED' : 'WARNING',
            details: `HTTP ${fileResponse.status}`
          });
        } catch (error) {
          securityTests.push({
            test: `Sensitive File Exposure: ${file}`,
            status: 'PASSED',
            details: 'File not accessible'
          });
        }
      }

      // Test 3: Check for SQL injection protection (basic)
      console.log(chalk.blue('🔍 Testing basic input validation...'));
      
      try {
        const maliciousInput = "'; DROP TABLE users; --";
        const testResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: maliciousInput, password: 'test' })
        });
        
        securityTests.push({
          test: 'SQL Injection Protection',
          status: testResponse.status === 400 || testResponse.status === 422 ? 'PASSED' : 'WARNING',
          details: `Server responded with HTTP ${testResponse.status}`
        });
      } catch (error) {
        securityTests.push({
          test: 'SQL Injection Protection',
          status: 'WARNING',
          details: 'Could not test - server may be down'
        });
      }

    } catch (error) {
      console.log(chalk.red(`❌ Security tests failed: ${error.message}`));
    }

    // Print results
    securityTests.forEach(test => {
      const icon = test.status === 'PASSED' ? '✅' : test.status === 'WARNING' ? '⚠️' : '❌';
      console.log(`${icon} ${test.test}: ${test.details}`);
    });

    return {
      status: securityTests.some(t => t.status === 'FAILED') ? 'FAILED' : 'PASSED',
      tests: securityTests
    };
  }

  async generateFinalReport() {
    const totalDuration = Date.now() - this.startTime;
    const timestamp = new Date().toISOString();
    
    const report = {
      timestamp,
      duration: totalDuration,
      summary: {
        unit: this.testResults.unit?.status || 'NOT_RUN',
        integration: this.testResults.integration?.status || 'NOT_RUN',
        e2e: this.testResults.e2e?.status || 'NOT_RUN',
        crossBrowser: this.testResults.crossBrowser?.status || 'NOT_RUN',
        performance: this.testResults.performance?.status || 'NOT_RUN',
        security: this.testResults.security?.status || 'NOT_RUN'
      },
      details: this.testResults
    };

    // Save report
    const reportPath = path.join(__dirname, 'reports', `comprehensive-test-report-${timestamp.replace(/[:.]/g, '-')}.json`);
    
    // Ensure directory exists
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return { report, reportPath };
  }

  async runAllTests(options = {}) {
    console.log(chalk.blue('\n🚀 RNC Platform Comprehensive Testing Suite'));
    console.log(chalk.blue('============================================\n'));
    
    const {
      skipUnit = false,
      skipIntegration = false,
      skipE2E = false,
      skipCrossBrowser = false,
      skipPerformance = false,
      skipSecurity = false
    } = options;

    // Check if servers are running
    const serversRunning = await this.checkServerStatus();
    if (!serversRunning) {
      console.log(chalk.red('\n❌ Cannot proceed with tests - servers not running'));
      process.exit(1);
    }

    try {
      // Run unit tests
      if (!skipUnit) {
        await this.runUnitTests();
      }

      // Run integration tests
      if (!skipIntegration) {
        await this.runIntegrationTests();
      }

      // Run E2E tests
      if (!skipE2E) {
        await this.runE2ETests();
      }

      // Run cross-browser tests
      if (!skipCrossBrowser) {
        await this.runCrossBrowserTests();
      }

      // Run performance tests
      if (!skipPerformance) {
        this.testResults.performance = await this.runPerformanceTests();
      }

      // Run security tests
      if (!skipSecurity) {
        this.testResults.security = await this.runSecurityTests();
      }

      // Generate final report
      const { report, reportPath } = await this.generateFinalReport();

      // Print final summary
      console.log(chalk.blue('\n📊 Final Test Summary'));
      console.log(chalk.blue('====================='));
      
      Object.entries(report.summary).forEach(([testType, status]) => {
        const icon = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : status === 'WARNING' ? '⚠️' : '⏭️';
        const color = status === 'PASSED' ? chalk.green : status === 'FAILED' ? chalk.red : status === 'WARNING' ? chalk.yellow : chalk.gray;
        console.log(`${icon} ${color(testType.toUpperCase())}: ${color(status)}`);
      });

      console.log(chalk.blue(`\n⏱️  Total Duration: ${Math.round(report.duration / 1000)}s`));
      console.log(chalk.blue(`📄 Full Report: ${reportPath}`));

      // Determine overall status
      const hasFailures = Object.values(report.summary).some(status => status === 'FAILED');
      const hasWarnings = Object.values(report.summary).some(status => status === 'WARNING');

      if (hasFailures) {
        console.log(chalk.red('\n❌ Some tests failed. Please review the detailed report.'));
        process.exit(1);
      } else if (hasWarnings) {
        console.log(chalk.yellow('\n⚠️  All tests passed but some warnings were found.'));
      } else {
        console.log(chalk.green('\n🎉 All tests passed successfully!'));
      }

      return report;

    } catch (error) {
      console.error(chalk.red('\n💥 Test suite failed:'), error);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  args.forEach(arg => {
    if (arg.startsWith('--skip-')) {
      const testType = arg.replace('--skip-', '').replace('-', '');
      options[`skip${testType.charAt(0).toUpperCase() + testType.slice(1)}`] = true;
    }
  });

  const testRunner = new ComprehensiveTestRunner();
  testRunner.runAllTests(options).catch(error => {
    console.error(chalk.red('Test runner failed:'), error);
    process.exit(1);
  });
}

module.exports = ComprehensiveTestRunner;
