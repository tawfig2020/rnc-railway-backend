/**
 * Health Check Test Script
 * Tests the enhanced health monitoring endpoint
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:10000';
const TEST_DURATION = 60000; // 1 minute
const CHECK_INTERVAL = 5000; // 5 seconds

console.log('🏥 Health Check Test Script');
console.log('==========================\n');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Test Duration: ${TEST_DURATION / 1000}s`);
console.log(`Check Interval: ${CHECK_INTERVAL / 1000}s\n`);

let checkCount = 0;
let successCount = 0;
let failCount = 0;
let healthHistory = [];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkHealth() {
  checkCount++;
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`\n[${checkCount}] Checking health at ${timestamp}...`);
    
    const result = await makeRequest(`${BACKEND_URL}/api/health`);
    
    if (result.status === 200 || result.status === 503) {
      successCount++;
      const health = result.data;
      
      console.log(`✅ Status: ${health.status} (${result.status})`);
      console.log(`   Version: ${health.version}`);
      console.log(`   Uptime: ${health.uptimeHuman || health.uptime + 's'}`);
      
      if (health.memory) {
        console.log(`   Memory: ${health.memory.heapUsed} / ${health.memory.heapTotal}`);
      }
      
      if (health.metrics) {
        console.log(`   Requests: ${health.metrics.totalRequests}`);
        console.log(`   Errors: ${health.metrics.totalErrors}`);
        console.log(`   Error Rate: ${health.metrics.errorRate}`);
        console.log(`   Active Tokens: ${health.metrics.activeTokens}`);
        
        if (health.metrics.lastError) {
          console.log(`   ⚠️  Last Error: ${health.metrics.lastError.message}`);
        }
      }
      
      // Store health data
      healthHistory.push({
        timestamp,
        status: health.status,
        errorRate: health.metrics?.errorRate,
        memory: health.memory?.heapUsed,
        tokens: health.metrics?.activeTokens
      });
      
      // Warnings
      if (health.status === 'DEGRADED') {
        console.log(`   ⚠️  WARNING: Server is in DEGRADED state!`);
      }
      
      if (health.metrics?.errorRate) {
        const rate = parseFloat(health.metrics.errorRate);
        if (rate > 5) {
          console.log(`   ⚠️  WARNING: High error rate (${rate}%)!`);
        }
      }
      
    } else {
      failCount++;
      console.log(`❌ Unexpected status code: ${result.status}`);
    }
    
  } catch (error) {
    failCount++;
    console.log(`❌ Health check failed: ${error.message}`);
  }
}

// Run initial check
checkHealth();

// Schedule periodic checks
const interval = setInterval(checkHealth, CHECK_INTERVAL);

// Stop after test duration
setTimeout(() => {
  clearInterval(interval);
  
  console.log('\n\n📊 Test Summary');
  console.log('===============\n');
  console.log(`Total Checks: ${checkCount}`);
  console.log(`Successful: ${successCount} (${((successCount / checkCount) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failCount} (${((failCount / checkCount) * 100).toFixed(1)}%)`);
  
  if (healthHistory.length > 0) {
    console.log('\n📈 Health Trends:');
    console.log('----------------');
    
    const statuses = healthHistory.map(h => h.status);
    const okCount = statuses.filter(s => s === 'OK').length;
    const degradedCount = statuses.filter(s => s === 'DEGRADED').length;
    
    console.log(`OK: ${okCount} / ${healthHistory.length}`);
    console.log(`DEGRADED: ${degradedCount} / ${healthHistory.length}`);
    
    if (healthHistory.length > 1) {
      const firstTokens = healthHistory[0].tokens;
      const lastTokens = healthHistory[healthHistory.length - 1].tokens;
      const tokenGrowth = lastTokens - firstTokens;
      
      console.log(`\nToken Growth: ${firstTokens} → ${lastTokens} (${tokenGrowth > 0 ? '+' : ''}${tokenGrowth})`);
    }
  }
  
  console.log('\n✅ Test completed');
  process.exit(0);
  
}, TEST_DURATION);

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Test interrupted by user');
  clearInterval(interval);
  process.exit(0);
});
