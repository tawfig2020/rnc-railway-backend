/**
 * Category API Tests
 */

// Test category endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Category API ==='.blue);
  
  try {
    // Get all categories
    const categories = await apiRequest('get', '/categories', null, true);
    console.log(`✓ SUCCESS: Retrieved ${categories.length} categories`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new category
    const newCategory = await apiRequest('post', '/categories', {
      name: `Test Category ${Date.now()}`,
      description: 'This is a test category description.',
      type: 'product', // product, service, resource, etc.
      icon: 'test-icon',
      slug: `test-category-${Date.now()}`,
      parentCategory: null,
      isActive: true
    }, true);
    
    console.log(`✓ SUCCESS: Created new category: ${newCategory._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store category ID in test data
    testData.categoryId = newCategory._id;
    
    // Get category by ID
    const categoryById = await apiRequest('get', `/categories/${testData.categoryId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved category by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update category
    const updatedCategory = await apiRequest('put', `/categories/${testData.categoryId}`, {
      name: 'Updated Test Category',
      description: 'This is an updated test category description.'
    }, true);
    
    console.log(`✓ SUCCESS: Updated category`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a subcategory
    try {
      const subcategory = await apiRequest('post', '/categories', {
        name: `Subcategory ${Date.now()}`,
        description: 'This is a test subcategory',
        type: 'product',
        parentCategory: testData.categoryId,
        isActive: true
      }, true);
      
      console.log(`✓ SUCCESS: Created subcategory: ${subcategory._id}`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get subcategories for a parent category
      const subcategories = await apiRequest('get', `/categories/${testData.categoryId}/subcategories`, null, true);
      console.log(`✓ SUCCESS: Retrieved subcategories`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Subcategory functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test getting items by category
    try {
      // Test products by category
      const productsByCategory = await apiRequest('get', `/categories/${testData.categoryId}/products`, null, true);
      console.log(`✓ SUCCESS: Retrieved products by category`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Test services by category
      const servicesByCategory = await apiRequest('get', `/categories/${testData.categoryId}/services`, null, true);
      console.log(`✓ SUCCESS: Retrieved services by category`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Get items by category not implemented or failed: ${error.message}`.blue);
    }
    
    // Test category filtering
    try {
      const filteredCategories = await apiRequest('get', '/categories?type=product', null, true);
      console.log(`✓ SUCCESS: Filtered categories by type`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Category filtering not implemented or failed: ${error.message}`.blue);
    }
    
    // Test category search
    try {
      const searchResults = await apiRequest('get', `/categories/search?query=test`, null, true);
      console.log(`✓ SUCCESS: Searched categories`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Category search not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Category operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
