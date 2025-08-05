/**
 * Marketplace Frontend Integration Test
 * 
 * This script tests the user-facing marketplace components including:
 * - Product browsing and filtering
 * - Shopping cart functionality
 * - Checkout process
 * - User address management
 * - Order history viewing
 * 
 * Uses Puppeteer for browser automation to test the actual React components.
 * 
 * Run with: node testing/marketplace-frontend-test.js
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const FRONTEND_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';
const USER_EMAIL = 'testuser@example.com';
const USER_PASSWORD = 'Test@123';
const ADMIN_EMAIL = 'admin@refugeenetwork.com';
const ADMIN_PASSWORD = 'Admin@123';

// Debug flag - set to true for additional logging and screenshots
const DEBUG = true;
const HEADLESS = true; // Set to false to watch the browser tests in real-time

// Directory for saving screenshots
const SCREENSHOTS_DIR = path.join(__dirname, '../test-screenshots');

// Test results tracking
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// Store data for use across tests
const testData = {
  userToken: null,
  adminToken: null,
  browser: null,
  page: null,
  testProductId: null,
  testOrderId: null,
  testAddressId: null
};

// Helper functions
const logSuccess = (message) => console.log(chalk.green(`✓ ${message}`));
const logError = (message, error) => {
  console.log(chalk.red(`✗ ${message}`));
  if (error) {
    console.log(chalk.red(`  Error: ${error.message}`));
  }
};
const logInfo = (message) => console.log(chalk.blue(`ℹ ${message}`));
const logWarning = (message) => console.log(chalk.yellow(`⚠ ${message}`));
const logSection = (title) => console.log(chalk.cyan(`\n=== ${title} ===`));

// Run a test and handle errors
async function runTest(name, testFn) {
  logInfo(`Running test: ${name}`);
  
  try {
    await testFn();
    passedTests++;
    logSuccess(`Test passed: ${name}`);
    return true;
  } catch (error) {
    failedTests++;
    logError(`Test failed: ${name}`, error);
    
    // Take screenshot on failure if we have a page
    if (testData.page) {
      try {
        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(SCREENSHOTS_DIR)) {
          fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
        }
        
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${name.replace(/\s+/g, '-').toLowerCase()}-failure.png`);
        await testData.page.screenshot({ path: screenshotPath, fullPage: true });
        logInfo(`Screenshot saved to ${screenshotPath}`);
      } catch (screenshotError) {
        logError('Failed to take screenshot', screenshotError);
      }
    }
    
    return false;
  }
}

// Wait for network requests to finish
async function waitForNetworkIdle(page, timeout = 5000) {
  try {
    await page.waitForNetworkIdle({ idleTime: 500, timeout });
  } catch (error) {
    logWarning('Network did not become idle within timeout period');
  }
}

// Setup function to initialize browser and API tokens
async function setup() {
  logSection('SETUP');
  
  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  
  // Launch browser
  testData.browser = await puppeteer.launch({
    headless: HEADLESS ? 'new' : false,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Create a new page
  testData.page = await testData.browser.newPage();
  
  // Set default navigation timeout
  testData.page.setDefaultNavigationTimeout(30000);
  
  // Enable request interception for debugging
  if (DEBUG) {
    testData.page.on('console', message => {
      console.log(`Browser console: ${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
    });
  }
  
  // Get API tokens
  try {
    // Get user token
    const userLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    testData.userToken = userLoginResponse.data.token;
    
    // Get admin token
    const adminLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    testData.adminToken = adminLoginResponse.data.token;
    
    logSuccess('API tokens obtained successfully');
  } catch (error) {
    logError('Failed to obtain API tokens', error);
    throw new Error('Setup failed: Could not obtain API tokens');
  }
  
  // Create test product if needed
  try {
    // Check if we already have test products
    const productsResponse = await axios.get(`${API_URL}/products?search=Frontend Test Product`, {
      headers: { 'x-auth-token': testData.adminToken }
    });
    
    if (productsResponse.data.products && productsResponse.data.products.length > 0) {
      testData.testProductId = productsResponse.data.products[0]._id;
      logSuccess(`Using existing test product with ID: ${testData.testProductId}`);
    } else {
      // Get a vendor ID to use
      const vendorsResponse = await axios.get(`${API_URL}/vendors`, {
        headers: { 'x-auth-token': testData.adminToken }
      });
      
      if (!vendorsResponse.data.vendors || vendorsResponse.data.vendors.length === 0) {
        throw new Error('No vendors found to create test product');
      }
      
      const vendorId = vendorsResponse.data.vendors[0]._id;
      
      // Create test product
      const productData = {
        name: 'Frontend Test Product',
        description: 'Product for frontend integration testing',
        price: 19.99,
        stock: 50,
        status: 'active',
        vendor: vendorId,
        images: ['https://via.placeholder.com/300']
      };
      
      const createProductResponse = await axios.post(`${API_URL}/products`, productData, {
        headers: { 'x-auth-token': testData.adminToken }
      });
      
      testData.testProductId = createProductResponse.data._id;
      logSuccess(`Created new test product with ID: ${testData.testProductId}`);
    }
  } catch (error) {
    logError('Failed to create test product', error);
    throw new Error('Setup failed: Could not create test product');
  }
}

// Teardown function to clean up resources
async function teardown() {
  logSection('TEARDOWN');
  
  // Close browser
  if (testData.browser) {
    await testData.browser.close();
    logSuccess('Browser closed');
  }
}

// Main test sequence
async function runMarketplaceFrontendTests() {
  console.log('=== MARKETPLACE FRONTEND INTEGRATION TEST ===');
  logInfo('Testing RNC Marketplace frontend components and integration with backend');
  
  try {
    await setup();
    
    // 1. Marketplace Navigation and Browsing
    logSection('MARKETPLACE NAVIGATION AND BROWSING');
    
    // 1.1 Navigate to marketplace homepage
    await runTest('Navigate to Marketplace Homepage', async () => {
      await testData.page.goto(`${FRONTEND_URL}/marketplace`, { waitUntil: 'networkidle2' });
      
      // Check if the page title contains "Marketplace"
      const title = await testData.page.title();
      if (!title.includes('Marketplace')) {
        throw new Error('Page title does not contain "Marketplace"');
      }
      
      // Check if the marketplace header is visible
      const headerText = await testData.page.$eval('h1, h2, h3, h4, h5', el => el.textContent);
      if (!headerText.includes('Marketplace') && !headerText.includes('Community Marketplace')) {
        throw new Error('Marketplace header not found');
      }
      
      logSuccess('Marketplace homepage loaded successfully');
    });
    
    // 1.2 Test category navigation
    await runTest('Category Navigation', async () => {
      // Click on a category (if available)
      const categoryLinks = await testData.page.$$('a[href*="/marketplace/"]');
      
      if (categoryLinks.length === 0) {
        logWarning('No category links found, skipping category navigation test');
        return;
      }
      
      // Click the first category link
      await categoryLinks[0].click();
      await testData.page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check if URL changed to include the category
      const url = testData.page.url();
      if (!url.includes('/marketplace/')) {
        throw new Error('Category navigation failed');
      }
      
      logSuccess('Category navigation successful');
    });
    
    // 1.3 Test search functionality
    await runTest('Product Search', async () => {
      // Navigate back to marketplace main page
      await testData.page.goto(`${FRONTEND_URL}/marketplace`, { waitUntil: 'networkidle2' });
      
      // Find search input
      const searchInput = await testData.page.$('input[type="text"], input[placeholder*="Search"]');
      
      if (!searchInput) {
        logWarning('Search input not found, skipping search test');
        return;
      }
      
      // Enter search term
      await searchInput.type('Test Product');
      
      // Submit search (either by pressing Enter or clicking a search button)
      await testData.page.keyboard.press('Enter');
      await waitForNetworkIdle(testData.page);
      
      // Check if search results are displayed
      // This will depend on your specific implementation
      const resultsText = await testData.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        for (const el of elements) {
          if (el.textContent.includes('Test Product')) {
            return el.textContent;
          }
        }
        return '';
      });
      
      if (!resultsText) {
        throw new Error('Search results not displayed');
      }
      
      logSuccess('Product search functionality working');
    });
    
    // 2. User Authentication
    logSection('USER AUTHENTICATION');
    
    // 2.1 Login as test user
    await runTest('User Login', async () => {
      // Navigate to login page
      await testData.page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
      
      // Fill login form
      await testData.page.type('input[type="email"], input[name="email"]', USER_EMAIL);
      await testData.page.type('input[type="password"], input[name="password"]', USER_PASSWORD);
      
      // Submit form
      const loginButton = await testData.page.$('button[type="submit"]');
      await loginButton.click();
      
      // Wait for navigation and check if login was successful
      await testData.page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check if user is logged in (look for user-specific elements)
      const userElements = await testData.page.evaluate(() => {
        // Look for common user account indicators
        const elements = Array.from(document.querySelectorAll('*'));
        for (const el of elements) {
          if (el.textContent.includes('Profile') || 
              el.textContent.includes('Account') || 
              el.textContent.includes('Logout') ||
              el.textContent.includes('Sign out')) {
            return true;
          }
        }
        return false;
      });
      
      if (!userElements) {
        throw new Error('User login failed');
      }
      
      logSuccess('User login successful');
    });
    
    // 3. Shopping Cart Functionality
    logSection('SHOPPING CART FUNCTIONALITY');
    
    // 3.1 Navigate to a product page
    await runTest('Navigate to Product Page', async () => {
      // Go to marketplace
      await testData.page.goto(`${FRONTEND_URL}/marketplace`, { waitUntil: 'networkidle2' });
      
      // Find and click on a product
      const productLinks = await testData.page.$$('a[href*="/product/"]');
      
      if (productLinks.length === 0) {
        // Try alternative selectors for product links
        const altProductLinks = await testData.page.$$('a[href*="/marketplace/product/"]');
        
        if (altProductLinks.length === 0) {
          // If no direct product links, try to find product cards
          const productCards = await testData.page.$$('.product-card, [class*="product"]');
          
          if (productCards.length === 0) {
            throw new Error('No product links or cards found');
          }
          
          await productCards[0].click();
        } else {
          await altProductLinks[0].click();
        }
      } else {
        await productLinks[0].click();
      }
      
      await waitForNetworkIdle(testData.page);
      
      // Check if we're on a product page
      const url = testData.page.url();
      if (!url.includes('/product/') && !url.includes('/marketplace/product/')) {
        throw new Error('Navigation to product page failed');
      }
      
      logSuccess('Navigated to product page successfully');
    });
    
    // 3.2 Add product to cart
    await runTest('Add Product to Cart', async () => {
      // Find and click "Add to Cart" button
      const addToCartButton = await testData.page.$('button:has-text("Add to Cart"), button:has-text("Add To Cart")');
      
      if (!addToCartButton) {
        throw new Error('Add to Cart button not found');
      }
      
      await addToCartButton.click();
      await waitForNetworkIdle(testData.page);
      
      // Check if product was added to cart (look for cart indicator)
      const cartUpdated = await testData.page.evaluate(() => {
        // Look for cart indicators
        const elements = Array.from(document.querySelectorAll('*'));
        for (const el of elements) {
          if (el.textContent.includes('Cart') && 
              (el.textContent.includes('1') || el.textContent.includes('Item'))) {
            return true;
          }
        }
        return false;
      });
      
      if (!cartUpdated) {
        throw new Error('Product not added to cart');
      }
      
      logSuccess('Product added to cart successfully');
    });
    
    // 3.3 View cart
    await runTest('View Cart', async () => {
      // Find and click cart icon/button
      const cartButton = await testData.page.$('a[href*="/cart"], button:has-text("Cart")');
      
      if (!cartButton) {
        throw new Error('Cart button not found');
      }
      
      await cartButton.click();
      await waitForNetworkIdle(testData.page);
      
      // Check if we're on the cart page
      const url = testData.page.url();
      const pageContent = await testData.page.content();
      
      if (!url.includes('/cart') && !pageContent.includes('Shopping Cart')) {
        throw new Error('Navigation to cart page failed');
      }
      
      // Check if the cart contains at least one item
      const cartItems = await testData.page.$$('.cart-item, [class*="cartItem"]');
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      
      logSuccess('Cart viewed successfully with items');
    });
    
    // 4. Checkout Process
    logSection('CHECKOUT PROCESS');
    
    // 4.1 Proceed to checkout
    await runTest('Proceed to Checkout', async () => {
      // Find and click checkout button
      const checkoutButton = await testData.page.$('button:has-text("Checkout"), a:has-text("Checkout")');
      
      if (!checkoutButton) {
        throw new Error('Checkout button not found');
      }
      
      await checkoutButton.click();
      await waitForNetworkIdle(testData.page);
      
      // Check if we're on the checkout page
      const pageContent = await testData.page.content();
      
      if (!pageContent.includes('Checkout') && !pageContent.includes('Shipping')) {
        throw new Error('Navigation to checkout page failed');
      }
      
      logSuccess('Proceeded to checkout successfully');
    });
    
    // 4.2 Fill shipping address
    await runTest('Fill Shipping Address', async () => {
      // Check if we need to add a new address or select an existing one
      const existingAddresses = await testData.page.$$('.address-card, [class*="addressCard"]');
      
      if (existingAddresses.length > 0) {
        // Select the first address
        await existingAddresses[0].click();
      } else {
        // Fill address form
        await testData.page.type('input[name="fullName"]', 'Test User');
        await testData.page.type('input[name="addressLine1"]', '123 Test Street');
        await testData.page.type('input[name="city"]', 'Test City');
        await testData.page.type('input[name="state"]', 'Test State');
        await testData.page.type('input[name="postalCode"]', '12345');
        await testData.page.type('input[name="country"]', 'Test Country');
        await testData.page.type('input[name="phone"]', '123-456-7890');
        
        // Save address
        const saveButton = await testData.page.$('button:has-text("Save"), button:has-text("Add")');
        
        if (saveButton) {
          await saveButton.click();
          await waitForNetworkIdle(testData.page);
        }
      }
      
      // Continue to next step
      const continueButton = await testData.page.$('button:has-text("Continue"), button:has-text("Next")');
      
      if (!continueButton) {
        throw new Error('Continue button not found');
      }
      
      await continueButton.click();
      await waitForNetworkIdle(testData.page);
      
      logSuccess('Shipping address filled successfully');
    });
    
    // 4.3 Select payment method
    await runTest('Select Payment Method', async () => {
      // Check if we're on the payment step
      const pageContent = await testData.page.content();
      
      if (!pageContent.includes('Payment') && !pageContent.includes('Credit Card')) {
        throw new Error('Payment step not loaded');
      }
      
      // Select credit card payment method
      const creditCardOption = await testData.page.$('input[value="credit_card"], input[name="paymentMethod"][value="credit_card"]');
      
      if (creditCardOption) {
        await creditCardOption.click();
      }
      
      // Continue to next step
      const continueButton = await testData.page.$('button:has-text("Continue"), button:has-text("Next"), button:has-text("Place Order")');
      
      if (!continueButton) {
        throw new Error('Continue/Place Order button not found');
      }
      
      await continueButton.click();
      await waitForNetworkIdle(testData.page);
      
      logSuccess('Payment method selected successfully');
    });
    
    // 4.4 Place order
    await runTest('Place Order', async () => {
      // Check if we're on the order review step
      const pageContent = await testData.page.content();
      
      // If we're still on the review step, click the final place order button
      if (pageContent.includes('Review') || pageContent.includes('Summary')) {
        const placeOrderButton = await testData.page.$('button:has-text("Place Order")');
        
        if (!placeOrderButton) {
          throw new Error('Place Order button not found');
        }
        
        await placeOrderButton.click();
        await waitForNetworkIdle(testData.page, 10000); // Longer timeout for order processing
      }
      
      // Check if order was placed successfully
      const confirmationContent = await testData.page.content();
      
      if (!confirmationContent.includes('Confirmation') && 
          !confirmationContent.includes('Thank you') && 
          !confirmationContent.includes('Order Placed')) {
        throw new Error('Order confirmation not displayed');
      }
      
      // Try to extract order ID
      testData.testOrderId = await testData.page.evaluate(() => {
        const orderIdMatch = document.body.textContent.match(/Order #([a-zA-Z0-9]+)/);
        if (orderIdMatch) return orderIdMatch[1];
        
        const orderIdMatch2 = document.body.textContent.match(/Order ID: ([a-zA-Z0-9]+)/);
        if (orderIdMatch2) return orderIdMatch2[1];
        
        return null;
      });
      
      if (testData.testOrderId) {
        logInfo(`Order placed with ID: ${testData.testOrderId}`);
      }
      
      logSuccess('Order placed successfully');
    });
    
    // 5. Order History
    logSection('ORDER HISTORY');
    
    // 5.1 View order history
    await runTest('View Order History', async () => {
      // Navigate to order history page
      await testData.page.goto(`${FRONTEND_URL}/account/orders`, { waitUntil: 'networkidle2' });
      
      // Check if order history is displayed
      const pageContent = await testData.page.content();
      
      if (!pageContent.includes('Order') && !pageContent.includes('History')) {
        throw new Error('Order history page not loaded');
      }
      
      // Check if we have at least one order
      const orderItems = await testData.page.$$('.order-item, [class*="orderItem"]');
      
      if (orderItems.length === 0) {
        throw new Error('No orders found in history');
      }
      
      logSuccess('Order history viewed successfully');
    });
    
    // 5.2 View order details
    await runTest('View Order Details', async () => {
      // Find and click on the first order
      const viewOrderButtons = await testData.page.$$('a:has-text("View"), button:has-text("View")');
      
      if (viewOrderButtons.length === 0) {
        throw new Error('No view order buttons found');
      }
      
      await viewOrderButtons[0].click();
      await waitForNetworkIdle(testData.page);
      
      // Check if order details are displayed
      const pageContent = await testData.page.content();
      
      if (!pageContent.includes('Order Details') && 
          !pageContent.includes('Order #') && 
          !pageContent.includes('Order ID')) {
        throw new Error('Order details not displayed');
      }
      
      logSuccess('Order details viewed successfully');
    });
    
    // Print test summary
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Skipped: ${skippedTests}`);
    console.log(`Total: ${passedTests + failedTests + skippedTests}`);
    
    if (failedTests > 0) {
      console.log(chalk.red(`✗ ${failedTests} test(s) failed. Please check the logs above for details.`));
      console.log(chalk.yellow(`Screenshots of failures saved to ${SCREENSHOTS_DIR}`));
    } else {
      console.log(chalk.green('✓ All marketplace frontend tests passed!'));
    }
  } catch (error) {
    console.error('Unhandled error in test runner:', error);
  } finally {
    await teardown();
  }
}

// Run the tests
runMarketplaceFrontendTests();
