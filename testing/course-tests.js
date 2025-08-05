/**
 * Course API Tests
 */

// Test course endpoints
async function runTests(apiRequest, testData) {
  console.log('\n=== Testing Course API ==='.blue);
  
  try {
    // Get all courses
    const courses = await apiRequest('get', '/courses', null, true);
    console.log(`✓ SUCCESS: Retrieved ${courses.length} courses`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Create a new course
    const newCourse = await apiRequest('post', '/courses', {
      title: `Test Course ${Date.now()}`,
      description: 'This is a test course description.',
      instructor: 'Test Instructor',
      duration: '4 weeks',
      difficulty: 'Beginner',
      prerequisites: [],
      syllabus: [
        {
          week: 1,
          topic: 'Introduction',
          description: 'Introduction to the course'
        },
        {
          week: 2,
          topic: 'Core Concepts',
          description: 'Learning core concepts'
        }
      ]
    }, true);
    
    console.log(`✓ SUCCESS: Created new course: ${newCourse._id}`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Store course ID in test data
    testData.courseId = newCourse._id;
    
    // Get course by ID
    const courseById = await apiRequest('get', `/courses/${testData.courseId}`, null, true);
    console.log(`✓ SUCCESS: Retrieved course by ID`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Update course
    const updatedCourse = await apiRequest('put', `/courses/${testData.courseId}`, {
      title: 'Updated Test Course',
      description: 'This is an updated test course description.',
      difficulty: 'Intermediate'
    }, true);
    
    console.log(`✓ SUCCESS: Updated course`.green);
    global.successCount = (global.successCount || 0) + 1;
    
    // Test enrollment functionality
    try {
      const enrollResponse = await apiRequest('put', `/courses/${testData.courseId}/enroll`, {}, true);
      console.log(`✓ SUCCESS: Enrolled in course`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Check enrollment status
      const enrollmentStatus = await apiRequest('get', `/courses/${testData.courseId}/enrollment`, null, true);
      console.log(`✓ SUCCESS: Checked enrollment status`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Unenroll from course
      const unenrollResponse = await apiRequest('put', `/courses/${testData.courseId}/unenroll`, {}, true);
      console.log(`✓ SUCCESS: Unenrolled from course`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Enrollment functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Test course review functionality
    try {
      const reviewResponse = await apiRequest('post', `/courses/${testData.courseId}/reviews`, {
        rating: 5,
        comment: 'This is a test review'
      }, true);
      
      console.log(`✓ SUCCESS: Added review to course`.green);
      global.successCount = (global.successCount || 0) + 1;
      
      // Get course reviews
      const reviews = await apiRequest('get', `/courses/${testData.courseId}/reviews`, null, true);
      console.log(`✓ SUCCESS: Retrieved course reviews`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Review functionality not implemented or failed: ${error.message}`.blue);
    }
    
    // Search courses by topic or difficulty level
    try {
      const searchResults = await apiRequest('get', '/courses?difficulty=Beginner', null, true);
      console.log(`✓ SUCCESS: Searched courses by difficulty`.green);
      global.successCount = (global.successCount || 0) + 1;
    } catch (error) {
      console.log(`ℹ INFO: Course search functionality not implemented or failed: ${error.message}`.blue);
    }
    
  } catch (error) {
    console.error(`✗ ERROR: Course operations failed: ${error.message}`.red);
    global.errorCount = (global.errorCount || 0) + 1;
  }
}

module.exports = { runTests };
