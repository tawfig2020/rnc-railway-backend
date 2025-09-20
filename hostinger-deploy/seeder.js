const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');
const config = require('./config/config');

// Load models
const User = require('./models/User');
const BlogPost = require('./models/BlogPost');
const Course = require('./models/Course');
const Event = require('./models/Event');
const Resource = require('./models/Resource');
const Profile = require('./models/Profile');
const HealthRecord = require('./models/HealthRecord');
const Support = require('./models/Support');

// Connect to DB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const blogposts = JSON.parse(fs.readFileSync(`${__dirname}/data/blogposts.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`, 'utf-8'));
const events = JSON.parse(fs.readFileSync(`${__dirname}/data/events.json`, 'utf-8'));
const resources = JSON.parse(fs.readFileSync(`${__dirname}/data/resources.json`, 'utf-8'));
const profiles = JSON.parse(fs.readFileSync(`${__dirname}/data/profiles.json`, 'utf-8'));
const healthRecords = JSON.parse(fs.readFileSync(`${__dirname}/data/healthrecords.json`, 'utf-8'));
const supportRequests = JSON.parse(fs.readFileSync(`${__dirname}/data/support.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    // First create users
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created...`)
    
    // Create other base content
    await BlogPost.create(blogposts);
    await Course.create(courses);
    await Event.create(events);
    await Resource.create(resources);
    
    // Create profiles and associate with users
    const profilesWithUsers = profiles.map((profile, index) => {
      // Ensure we don't exceed user array bounds
      if (index < createdUsers.length) {
        return {
          ...profile,
          user: createdUsers[index]._id
        };
      }
      return profile;
    });
    const createdProfiles = await Profile.create(profilesWithUsers);
    console.log(`${createdProfiles.length} profiles created...`);
    
    // Create health records and associate with users
    const healthRecordsWithUsers = healthRecords.map((record, index) => {
      if (index < createdUsers.length) {
        return {
          ...record,
          user: createdUsers[index]._id
        };
      }
      return record;
    });
    const createdHealthRecords = await HealthRecord.create(healthRecordsWithUsers);
    console.log(`${createdHealthRecords.length} health records created...`);
    
    // Create support requests and associate with users
    const supportWithUsers = supportRequests.map((request, index) => {
      if (index < createdUsers.length) {
        // For simplicity, use sequential users as requesters
        return {
          ...request,
          user: createdUsers[index]._id,
          // If assigned, use a different user as the assignee
          assignedTo: request.assignedTo ? 
            createdUsers[(index + 1) % createdUsers.length]._id : 
            undefined
        };
      }
      return request;
    });
    const createdSupport = await Support.create(supportWithUsers);
    console.log(`${createdSupport.length} support requests created...`);

    console.log('All Data Imported Successfully'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await BlogPost.deleteMany();
    await Course.deleteMany();
    await Event.deleteMany();
    await Resource.deleteMany();
    await Profile.deleteMany();
    await HealthRecord.deleteMany();
    await Support.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Command line argument to determine action
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to delete data'.yellow);
  process.exit();
}
