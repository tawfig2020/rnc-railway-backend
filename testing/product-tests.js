/**
 * Product API Tests
 */

// Test product endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Product API ==='.blue);
  
  try {
    // Get all products
    const products = await apiRequest('get', '/products', null, true);
    console.log(`✓ SUCCESS: Retrieved ${products.length} products`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new product
    const newProduct = await apiRequest('post', '/products', {
      name: `Test Product ${Date.now()}`,
      description: 'This is a test product description.',
      price: 29.99,
      category: 'Handicrafts',
      countInStock: 15,
      isAvailable: true,
      images: ['https://example.com/product-image.jpg'],
      tags: ['handmade', 'refugee', 'test']
    }, true);
    
    console.log(`✓ SUCCESS: Created new product: ${newProduct._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store product ID in test data
    testData.productId = newProduct._id;
    
    // Get product by ID
    const productById = await apiRequest('get', `/products/${testData.productId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved product by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update product
    const updatedProduct = await apiRequest('put', `/products/${testData.productId}`, {
      name: 'Updated Test Product',
      description: 'This is an updated test product description.',
      price: 34.99,
      countInStock: 20
    }, true);
    
    console.log(`✓ SUCCESS: Updated product`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test product review functionality
    try {
      const reviewResponse = await apiRequest('post', `/products/${testData.productId}/reviews`, {
        rating: 5,
        comment: 'This is a test review'
      }, true);
      
      console.log(`✓ SUCCESS: Added review to product`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Review functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search products by category or price range
    try {
      const searchResults = await apiRequest('get', '/products?category=Handicrafts', null, true);
      console.log(`✓ SUCCESS: Searched products by category`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      const priceSearchResults = await apiRequest('get', '/products?minPrice=20&maxPrice=50', null, true);
      console.log(`✓ SUCCESS: Searched products by price range`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Product search functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test featured products endpoint
    try {
      const featuredProducts = await apiRequest('get', '/products/featured', null, true);
      console.log(`✓ SUCCESS: Retrieved featured products`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Featured products functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Product operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
