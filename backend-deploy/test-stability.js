/**
 * Server Stability Test Script
 * Simulates load to test memory management and error handling
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:10000';
const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 100;
const REQUEST_DELAY = 100; // ms between batches

console.log('🔬 Server Stability Test');
console.log('========================\n');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Concurrent Requests: ${CONCURRENT_REQUESTS}`);
console.log(`Total Requests: ${TOTAL_REQUESTS}`);
console.log(`Request Delay: ${REQUEST_DELAY}ms\n`);

let completedRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let timeoutRequests = 0;
let responseTimes = [];

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const startTime = Date.now();
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - startTime;
        responseTimes.push(duration);
        
        try {
          const json = JSON.parse(responseData);
          resolve({ 
            status: res.statusCode, 
            data: json,
            duration 
          });
        } catch (error) {
          resolve({ 
            status: res.statusCode, 
            data: responseData,
            duration 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - startTime;
      reject({ error, duration });
    });
    
    req.setTimeout(35000, () => {
      req.destroy();
      const duration = Date.now() - startTime;
      reject({ error: new Error('Request timeout'), duration, timeout: true });
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testEndpoint(name, url, method = 'GET', data = null) {
  try {
    const result = await makeRequest(url, method, data);
    
    if (result.status >= 200 && result.status < 300) {
      successfulRequests++;
      return { success: true, duration: result.duration };
    } else if (result.status === 408) {
      timeoutRequests++;
      return { success: false, timeout: true, duration: result.duration };
    } else {
      failedRequests++;
      return { success: false, status: result.status, duration: result.duration };
    }
  } catch (error) {
    if (error.timeout) {
      timeoutRequests++;
      return { success: false, timeout: true, duration: error.duration };
    } else {
      failedRequests++;
      return { success: false, error: error.error?.message, duration: error.duration };
    }
  } finally {
    completedRequests++;
  }
}

async function runTests() {
  console.log('🚀 Starting stability tests...\n');
  
  const tests = [
    { name: 'Health Check', url: `${BACKEND_URL}/api/health`, weight: 30 },
    { name: 'Root Endpoint', url: `${BACKEND_URL}/`, weight: 20 },
    { name: 'Login (Invalid)', url: `${BACKEND_URL}/api/auth/login`, method: 'POST', data: { email: 'test@test.com', password: 'wrong' }, weight: 25 },
    { name: 'Login (Valid)', url: `${BACKEND_URL}/api/auth/login`, method: 'POST', data: { email: 'test@example.com', password: '123456' }, weight: 25 }
  ];
  
  const startTime = Date.now();
  const promises = [];
  
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    // Select test based on weight
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedTest = tests[0];
    
    for (const test of tests) {
      cumulative += test.weight;
      if (random < cumulative) {
        selectedTest = test;
        break;
      }
    }
    
    promises.push(testEndpoint(
      selectedTest.name,
      selectedTest.url,
      selectedTest.method,
      selectedTest.data
    ));
    
    // Batch requests
    if (promises.length >= CONCURRENT_REQUESTS) {
      await Promise.all(promises);
      promises.length = 0;
      
      // Progress indicator
      const progress = ((completedRequests / TOTAL_REQUESTS) * 100).toFixed(0);
      process.stdout.write(`\rProgress: ${completedRequests}/${TOTAL_REQUESTS} (${progress}%)`);
      
      // Delay between batches
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
    }
  }
  
  // Wait for remaining requests
  if (promises.length > 0) {
    await Promise.all(promises);
  }
  
  const totalDuration = Date.now() - startTime;
  
  console.log('\n\n📊 Test Results');
  console.log('===============\n');
  
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);
  console.log(`Successful: ${successfulRequests} (${((successfulRequests / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failedRequests} (${((failedRequests / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`Timeouts: ${timeoutRequests} (${((timeoutRequests / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`Requests/sec: ${(TOTAL_REQUESTS / (totalDuration / 1000)).toFixed(2)}`);
  
  if (responseTimes.length > 0) {
    responseTimes.sort((a, b) => a - b);
    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const min = responseTimes[0];
    const max = responseTimes[responseTimes.length - 1];
    const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)];
    const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)];
    const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)];
    
    console.log('\n⏱️  Response Times:');
    console.log('------------------');
    console.log(`Min: ${min}ms`);
    console.log(`Max: ${max}ms`);
    console.log(`Avg: ${avg.toFixed(0)}ms`);
    console.log(`P50: ${p50}ms`);
    console.log(`P95: ${p95}ms`);
    console.log(`P99: ${p99}ms`);
  }
  
  // Check final health
  console.log('\n🏥 Final Health Check:');
  console.log('---------------------');
  
  try {
    const health = await makeRequest(`${BACKEND_URL}/api/health`);
    console.log(`Status: ${health.data.status}`);
    console.log(`Memory: ${health.data.memory?.heapUsed} / ${health.data.memory?.heapTotal}`);
    console.log(`Total Requests: ${health.data.metrics?.totalRequests}`);
    console.log(`Total Errors: ${health.data.metrics?.totalErrors}`);
    console.log(`Error Rate: ${health.data.metrics?.errorRate}`);
    console.log(`Active Tokens: ${health.data.metrics?.activeTokens}`);
    
    if (health.data.status === 'DEGRADED') {
      console.log('\n⚠️  WARNING: Server is in DEGRADED state after load test!');
    } else {
      console.log('\n✅ Server is healthy after load test');
    }
  } catch (error) {
    console.log(`❌ Failed to get final health: ${error.message || error.error?.message}`);
  }
  
  console.log('\n✅ Stability test completed');
}

runTests().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
