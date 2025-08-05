const puppeteer = require('puppeteer');

const FRONTEND_URL = 'http://localhost:3000';

async function detectConsoleErrors() {
  console.log('🔍 Detecting React Console Errors...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });

    // Test different pages to find the source of the error
    const testPages = [
      { path: '/', name: 'Homepage' },
      { path: '/about', name: 'About' },
      { path: '/marketplace', name: 'Marketplace' },
      { path: '/blog', name: 'Blog' },
      { path: '/forum', name: 'Forum' },
      { path: '/social', name: 'Social' }
    ];
    
    for (const testPage of testPages) {
      console.log(`Testing ${testPage.name} (${testPage.path})...`);
      
      // Clear previous messages
      consoleMessages.length = 0;
      
      try {
        await page.goto(`${FRONTEND_URL}${testPage.path}`, { 
          waitUntil: 'networkidle2', 
          timeout: 10000 
        });
        
        // Wait for React to fully render
        await page.waitForTimeout(2000);
        
        // Check for React boolean attribute warnings
        const booleanWarnings = consoleMessages.filter(msg => 
          (msg.type === 'error' || msg.type === 'warning') &&
          msg.text.includes('button') && 
          msg.text.includes('boolean')
        );
        
        if (booleanWarnings.length > 0) {
          console.log(`   ❌ Found ${booleanWarnings.length} React boolean warnings on ${testPage.name}:`);
          booleanWarnings.forEach((warning, index) => {
            console.log(`      ${index + 1}. ${warning.text}`);
            if (warning.location && warning.location.url) {
              console.log(`         Location: ${warning.location.url}:${warning.location.lineNumber}`);
            }
          });
          console.log('');
        } else {
          console.log(`   ✅ No React boolean warnings on ${testPage.name}`);
        }
        
      } catch (error) {
        console.log(`   ⚠️  Error testing ${testPage.name}: ${error.message}`);
      }
    }

  } catch (error) {
    console.log(`❌ Browser test failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the detector
if (require.main === module) {
  detectConsoleErrors().catch(console.error);
}

module.exports = detectConsoleErrors;
