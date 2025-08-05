/**
 * Populate Blog Script
 * 
 * This script creates placeholder blog posts for the Refugee Network Centre platform.
 */

const mongoose = require('mongoose');
const config = require('../config/config.js');
const Blog = require('../models/BlogPost');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Blog categories
const blogCategories = [
  'Success Stories', 
  'Resources', 
  'Community News', 
  'Educational Content',
  'Policy Updates'
];

// Sample blog posts
const sampleBlogPosts = [
  {
    title: 'Celebrating World Refugee Day: Stories of Resilience',
    category: 'Success Stories',
    excerpt: 'Stories of resilience and success from refugees who have rebuilt their lives despite tremendous challenges.',
    content: `
# Celebrating World Refugee Day: Stories of Resilience

June 20th marks World Refugee Day, a time to recognize the strength and courage of people who have been forced to flee their home countries to escape conflict or persecution. Today, we share the inspiring journeys of several members of our community who have rebuilt their lives despite tremendous challenges.

## Sarah's Journey from Syria to Success

Sarah, a former physician from Damascus, fled Syria in 2015. After facing numerous obstacles, she has recently completed the medical certification process in her new country and has begun practicing medicine again at a community clinic.

"The journey wasn't easy," Sarah explains. "There were days I wanted to give up, but I kept reminding myself why I became a doctor in the first place—to help others."

## Mohamed's Tech Innovation

Mohamed arrived as a teenage refugee with little more than the clothes on his back. Today, at 23, he has developed a mobile application that helps newcomers navigate government services and connect with community resources.

"Technology can bridge gaps," Mohamed says. "When I first arrived, I was confused about how to access services. I created this app so others wouldn't face the same challenges."

## Community Support Programs

The Refugee Network Centre continues to develop programs to support newcomers in their journey. From language classes to career mentorship, our resources are designed to help refugees rebuild with dignity and purpose.

Join us in celebrating the contributions refugees make to our communities every day, not just on World Refugee Day.
    `,
    coverImage: '/assets/blog/refugee-day.jpg',
    tags: ['World Refugee Day', 'Success Stories', 'Community Support'],
    featured: true
  },
  {
    title: 'How to Support Refugee Integration in Your Community',
    category: 'Resources',
    excerpt: 'Practical ways you can help refugees integrate and thrive in your community through volunteering, business support, mentorship, and more.',
    content: `
# How to Support Refugee Integration in Your Community

Creating welcoming communities for refugees requires collective effort and understanding. Here are practical ways you can help newcomers feel at home and thrive in your community.

## Volunteer as a Language Partner

One of the biggest barriers refugees face is language acquisition. By volunteering just a few hours a week as a conversation partner, you can help someone practice their language skills in a comfortable, low-pressure environment.

## Support Local Refugee-Owned Businesses

Many refugees bring entrepreneurial skills and cultural knowledge that enrich our communities. Make an effort to patronize refugee-owned restaurants, stores, and services in your area. Your business helps these entrepreneurs support their families and contribute to the local economy.

## Offer Professional Mentorship

If you're established in your career, consider mentoring a refugee professional in your field. Many refugees arrive with valuable qualifications and experience but need guidance navigating the job market in their new country.

## Create Housing Solutions

Secure housing is fundamental to successful integration. Property owners can work with settlement agencies to provide fair housing opportunities for refugee families.

## Educate Yourself and Others

Take time to learn about the refugee experience and the specific challenges faced by newcomers in your community. Share this knowledge with friends, family, and colleagues to build greater understanding and empathy.

## Advocate for Inclusive Policies

Support policies at local and national levels that promote refugee inclusion and provide pathways to education, employment, and citizenship.

By taking these steps, you help create communities where refugees can rebuild their lives with dignity and become contributing members of society.
    `,
    coverImage: '/assets/blog/community-support.jpg',
    tags: ['Community Support', 'Integration', 'Volunteering'],
    featured: true
  },
  {
    title: 'Upcoming Changes to Refugee Support Programs',
    category: 'Policy Updates',
    excerpt: 'Exciting updates to our support programs including extended language learning, mental health initiatives, digital literacy enhancements, and career advancement partnerships.',
    content: `
# Upcoming Changes to Refugee Support Programs

The Refugee Network Centre is pleased to announce several important updates to our support programs, designed to better serve the evolving needs of our community.

## Extended Language Learning Resources

Starting next month, our language learning program will expand to include industry-specific vocabulary courses in healthcare, technology, trades, and customer service. These specialized modules will help refugees develop the language skills needed for specific career paths.

## New Mental Health Support Initiative

We recognize that mental health support is essential for those who have experienced trauma and displacement. Our new initiative includes:

- Weekly support groups facilitated by licensed counselors
- Individual therapy sessions available in multiple languages
- Trauma-informed care training for all staff members
- Wellness workshops focusing on stress management and resilience building

## Digital Literacy Program Enhancements

In today's digital world, computer skills are essential for education, employment, and daily life. We've upgraded our digital literacy program to include:

- Advanced courses in common workplace software
- Coding basics for those interested in tech careers
- Digital financial literacy and online banking
- Internet safety and privacy protection

## Career Advancement Partnerships

We've established new partnerships with local businesses and educational institutions to create clearer pathways to meaningful employment:

- Paid apprenticeship opportunities in various industries
- Scholarship programs for vocational training
- Certification courses for internationally trained professionals
- Entrepreneurship support for business startups

These program changes will be implemented over the next three months. Current participants will be contacted directly with information about how these changes may benefit them.

We welcome your feedback as we continue to evolve our programs to better serve our community.
    `,
    coverImage: '/assets/blog/program-updates.jpg',
    tags: ['Programs', 'Policy', 'Updates'],
    featured: false
  }
];

// Create default admin user if needed
const getAdminUser = async () => {
  try {
    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@refugeenetwork.org' });
    
    if (!adminUser) {
      // Create admin user
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@refugeenetwork.org',
        password: 'placeholder123', // This would be properly hashed in a real scenario
        role: 'admin'
      });
      await adminUser.save();
      console.log('Created default admin user');
    }
    
    return adminUser;
  } catch (err) {
    console.error('Error creating/finding admin user:', err);
    process.exit(1);
  }
};

// Main function to populate blog posts
const populateBlogs = async () => {
  try {
    // Get admin user
    const adminUser = await getAdminUser();
    
    // Create blog posts
    for (const postData of sampleBlogPosts) {
      // Check if blog post already exists
      const existingPost = await Blog.findOne({ title: postData.title });
      
      if (!existingPost) {
        const blog = new Blog({
          ...postData,
          author: adminUser._id,
          status: 'published'
        });
        
        await blog.save();
        console.log(`Created blog post: ${postData.title}`);
      }
    }
    
    console.log('Blog posts created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating blog posts:', err);
    process.exit(1);
  }
};

// Run the population script
populateBlogs();
