/**
 * Test Community Project Creation
 * Tests the project creation with the exact data from the screenshot
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rnc-platform';

console.log('🔗 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load models
require('./models/User');
require('./models/CommunityProject');

const User = mongoose.model('User');
const CommunityProject = mongoose.model('CommunityProject');

async function testProjectCreation() {
  try {
    console.log('✅ Connected to MongoDB\n');

    // Get admin user
    const admin = await User.findOne({ email: 'admin@rncmalaysia.net' });
    if (!admin) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }
    console.log(`✅ Admin user found: ${admin.name}\n`);

    // Test data from screenshot
    const projectData = {
      title: 'Science Virtual Lab',
      category: 'Education Program', // ❌ This is what frontend sends
      status: 'Active', // ❌ This is what frontend sends
      description: 'Building lab to give access to refugee schools',
      location: 'Malaysia, Kuala Lumpur',
      participants: 25,
      fundingGoal: 26000,
      fundingCurrent: 0,
      tags: ['Education', 'AI Solution'],
      founder: {
        name: admin.name,
        avatar: admin.avatar,
        role: 'Project Founder'
      },
      createdBy: admin._id
    };

    console.log('📝 Testing with EXACT data from screenshot:');
    console.log(JSON.stringify(projectData, null, 2));
    console.log();

    // Test 1: Try with frontend data (should now work!)
    console.log('Test 1: Creating with "Education Program" category...');
    try {
      const project1 = new CommunityProject(projectData);
      await project1.validate();
      await project1.save();
      console.log('✅ Project created successfully with frontend data!');
      console.log(`   ID: ${project1._id}`);
      console.log(`   Category: ${project1.category}`);
      console.log(`   Status: ${project1.status}`);
      console.log();
      
      // Clean up
      await CommunityProject.findByIdAndDelete(project1._id);
      console.log('✅ Test project deleted\n');
    } catch (err) {
      console.log('❌ Validation failed:');
      console.log(`   Error: ${err.message}`);
      console.log();
    }

    // Test 2: Try with correct data (should work)
    console.log('Test 2: Creating with "Education" category...');
    const correctData = {
      ...projectData,
      category: 'Education', // ✅ Correct value
      status: 'active' // ✅ Correct value (lowercase)
    };
    
    try {
      const project2 = new CommunityProject(correctData);
      await project2.validate();
      await project2.save();
      console.log('✅ Project created successfully!');
      console.log(`   ID: ${project2._id}`);
      console.log(`   Title: ${project2.title}`);
      console.log(`   Category: ${project2.category}`);
      console.log(`   Status: ${project2.status}`);
      console.log();
      
      // Clean up
      await CommunityProject.findByIdAndDelete(project2._id);
      console.log('✅ Test project deleted\n');
    } catch (err) {
      console.log('❌ Failed to create project:');
      console.log(`   Error: ${err.message}`);
      console.log();
    }

    // Show the issue
    console.log('═══════════════════════════════════════');
    console.log('🔍 ROOT CAUSE IDENTIFIED:');
    console.log('═══════════════════════════════════════\n');
    console.log('Frontend sends:');
    console.log('  Category: "Education Program" ❌');
    console.log('  Status: "Active" ❌\n');
    console.log('Backend expects:');
    console.log('  Category: "Education" ✅');
    console.log('  Status: "active" ✅\n');
    console.log('Valid categories:');
    console.log('  - Social Enterprise');
    console.log('  - Local Initiative');
    console.log('  - Cultural Project');
    console.log('  - Education');
    console.log('  - Health');
    console.log('  - Environment');
    console.log('  - Other\n');
    console.log('Valid statuses:');
    console.log('  - draft');
    console.log('  - active');
    console.log('  - completed');
    console.log('  - paused');
    console.log('  - archived\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\nFull error:');
    console.error(error);
    process.exit(1);
  }
}

// Wait for MongoDB connection
mongoose.connection.once('open', () => {
  testProjectCreation();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
