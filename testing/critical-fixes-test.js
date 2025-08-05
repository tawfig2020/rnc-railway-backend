const axios = require('axios');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

async function testCriticalFixes() {
  console.log('🔧 Testing Critical Fixes for 100/100 Score...\n');
  
  const results = {
    apiEventsEndpoint: false,
    frontendConsoleErrors: false,
    navigationTimeout: false,
    overallScore: 0
  };

  // Test 1: API Events Endpoint Fix
  console.log('1. Testing /api/events endpoint fix...');
  try {
    const response = await axios.get(`${BASE_URL}/api/events`);
    if (response.status === 200 && response.data && typeof response.data === 'object') {
      // Check if it's the correct API response format
      if (response.data.success !== undefined && response.data.data !== undefined) {
        console.log('   ✅ /api/events endpoint working correctly');
        console.log(`   📊 Returned ${response.data.count || 0} events`);
        results.apiEventsEndpoint = true;
      } else if (Array.isArray(response.data)) {
        console.log('   ✅ /api/events endpoint working correctly');
        console.log(`   📊 Returned ${response.data.length} events`);
        results.apiEventsEndpoint = true;
      } else {
        console.log('   ❌ /api/events endpoint returned unexpected format');
        console.log(`   📋 Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
    } else {
      console.log('   ❌ /api/events endpoint returned unexpected format');
    }
  } catch (error) {
    console.log(`   ❌ /api/events endpoint failed: ${error.message}`);
  }

  // Test 2: Frontend Console Errors (React Boolean Attributes)
  console.log('\n2. Testing frontend console errors fix...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Capture console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to homepage
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Wait a bit for any delayed console messages
    await page.waitForTimeout(2000);
    
    // Check for React boolean attribute warnings
    const booleanWarnings = consoleErrors.filter(error => 
      error.includes('button') && error.includes('boolean')
    );
    
    if (booleanWarnings.length === 0) {
      console.log('   ✅ No React boolean attribute warnings found');
      results.frontendConsoleErrors = true;
    } else {
      console.log(`   ❌ Found ${booleanWarnings.length} React boolean attribute warnings:`);
      booleanWarnings.forEach(warning => console.log(`      - ${warning}`));
    }
    
    // Test 3: Navigation Timeout Fix
    console.log('\n3. Testing navigation timeout fix...');
    try {
      // Test navigation to different pages
      const testPages = ['/about', '/marketplace', '/blog'];
      let navigationSuccess = true;
      
      for (const testPage of testPages) {
        try {
          await page.goto(`${FRONTEND_URL}${testPage}`, { 
            waitUntil: 'networkidle2', 
            timeout: 8000 
          });
          console.log(`   ✅ Successfully navigated to ${testPage}`);
        } catch (navError) {
          console.log(`   ❌ Navigation timeout for ${testPage}: ${navError.message}`);
          navigationSuccess = false;
        }
      }
      
      if (navigationSuccess) {
        results.navigationTimeout = true;
        console.log('   ✅ All page navigations completed without timeout');
      }
      
    } catch (error) {
      console.log(`   ❌ Navigation test failed: ${error.message}`);
    }

  } catch (error) {
    console.log(`   ❌ Frontend test failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Calculate overall score
  const totalTests = Object.keys(results).length - 1; // Exclude overallScore
  const passedTests = Object.values(results).filter(result => result === true).length;
  results.overallScore = Math.round((passedTests / totalTests) * 100);

  // Generate Report
  console.log('\n' + '='.repeat(60));
  console.log('🎯 CRITICAL FIXES TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`📊 Overall Score: ${results.overallScore}/100`);
  console.log('\n📋 Test Results:');
  console.log(`   API Events Endpoint: ${results.apiEventsEndpoint ? '✅ FIXED' : '❌ FAILED'}`);
  console.log(`   Frontend Console Errors: ${results.frontendConsoleErrors ? '✅ FIXED' : '❌ FAILED'}`);
  console.log(`   Navigation Timeout: ${results.navigationTimeout ? '✅ FIXED' : '❌ FAILED'}`);
  
  if (results.overallScore === 100) {
    console.log('\n🎉 ALL CRITICAL FIXES SUCCESSFUL! Ready for 100/100 score!');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} issue(s) still need attention.`);
  }
  
  console.log('='.repeat(60));
  
  return results;
}

// Run the test
if (require.main === module) {
  testCriticalFixes().catch(console.error);
}

module.exports = testCriticalFixes;
