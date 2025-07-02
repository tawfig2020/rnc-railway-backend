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

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await BlogPost.create(blogposts);
    await Course.create(courses);
    await Event.create(events);
    await Resource.create(resources);

    console.log('Data Imported...'.green.inverse);
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
