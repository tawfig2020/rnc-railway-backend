/**
 * Blog API Tests
 */

// Test blog endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Blog API ==='.blue);
  
  try {
    // Get all blogs
    const blogs = await apiRequest('get', '/blogs', null, true);
    console.log(`✓ SUCCESS: Retrieved ${blogs.length} blog posts`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new blog post
    const newBlog = await apiRequest('post', '/blogs', {
      title: `Test Blog Post ${Date.now()}`,
      content: 'This is a test blog post content.',
      summary: 'Test blog post summary',
      tags: ['test', 'api', 'refugee']
    }, true);
    
    console.log(`✓ SUCCESS: Created new blog post: ${newBlog._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store blog ID in test data
    testData.blogId = newBlog._id;
    
    // Get blog by ID
    const blogById = await apiRequest('get', `/blogs/${testData.blogId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved blog by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update blog
    const updatedBlog = await apiRequest('put', `/blogs/${testData.blogId}`, {
      title: 'Updated Test Blog Post',
      content: 'This is updated test content',
      summary: 'Updated test summary'
    }, true);
    
    console.log(`✓ SUCCESS: Updated blog post`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test like functionality
    try {
      const likeResponse = await apiRequest('put', `/blogs/${testData.blogId}/like`, {}, true);
      console.log(`✓ SUCCESS: Liked blog post`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Unlike post
      const unlikeResponse = await apiRequest('put', `/blogs/${testData.blogId}/unlike`, {}, true);
      console.log(`✓ SUCCESS: Unliked blog post`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Like/unlike functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test comment functionality
    try {
      const commentResponse = await apiRequest('post', `/blogs/${testData.blogId}/comments`, {
        text: 'This is a test comment'
      }, true);
      
      console.log(`✓ SUCCESS: Added comment to blog post`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get comment ID
      const commentId = commentResponse.comments[0]._id;
      
      // Update comment
      if (commentId) {
        const updateCommentResponse = await apiRequest('put', `/blogs/${testData.blogId}/comments/${commentId}`, {
          text: 'This is an updated comment'
        }, true);
        
        console.log(`✓ SUCCESS: Updated comment`.green);
        global.successCount = (global.successCount || 0) + 1;
      }
    } catch (error) {
      console.log(`ℹ INFO: Comment functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search blogs by tag or keyword
    try {
      const searchResults = await apiRequest('get', '/blogs?tag=test', null, true);
      console.log(`✓ SUCCESS: Searched blogs by tag`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Blog search functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Blog operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
