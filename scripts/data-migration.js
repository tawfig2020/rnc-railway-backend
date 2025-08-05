const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import all models
const User = require('../models/User');
const Product = require('../models/Product');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Event = require('../models/Event');
const Category = require('../models/Category');

// Import mock data
const mockData = require('../client/src/data/mockData');

class DataMigration {
  constructor() {
    this.migrationLog = [];
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    this.migrationLog.push(`${new Date().toISOString()}: ${message}`);
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rnc');
      this.log('Connected to MongoDB');
    } catch (error) {
      this.log(`Database connection failed: ${error.message}`);
      throw error;
    }
  }

  async migrateCategories() {
    this.log('Starting category migration...');
    
    const categories = [
      { name: 'Digital Skills', description: 'Computer and technology skills', type: 'course' },
      { name: 'Business', description: 'Entrepreneurship and business skills', type: 'course' },
      { name: 'Healthcare', description: 'Health and medical training', type: 'course' },
      { name: 'Language', description: 'Language learning and communication', type: 'course' },
      { name: 'Crafts', description: 'Handmade and artisan products', type: 'product' },
      { name: 'Services', description: 'Professional services', type: 'product' },
      { name: 'Art', description: 'Artistic creations and designs', type: 'product' },
      { name: 'Food', description: 'Food and culinary products', type: 'product' },
      { name: 'Fashion', description: 'Clothing and accessories', type: 'product' }
    ];

    for (const categoryData of categories) {
      try {
        const existingCategory = await Category.findOne({ name: categoryData.name });
        if (!existingCategory) {
          await Category.create(categoryData);
          this.log(`Created category: ${categoryData.name}`);
        } else {
          this.log(`Category already exists: ${categoryData.name}`);
        }
      } catch (error) {
        this.log(`Error creating category ${categoryData.name}: ${error.message}`);
      }
    }
  }

  async migrateCourses() {
    this.log('Starting course migration...');
    
    // This is where you'll replace mock data with real course data
    // For now, we'll create a structure for real data input
    
    const realCourseData = [
      // Replace this with actual course data from your content team
      {
        title: "Digital Literacy for Refugees",
        description: "Essential computer skills for daily life and work",
        category: "Digital Skills",
        instructor: "Admin User", // Will be updated with real instructor
        duration: "6 weeks",
        level: "Beginner",
        language: "English",
        price: 0, // Free course
        modules: [
          { title: "Computer Basics", duration: "2 hours" },
          { title: "Internet Safety", duration: "1.5 hours" },
          { title: "Email Communication", duration: "2 hours" }
        ]
      }
      // Add more real courses here
    ];

    for (const courseData of realCourseData) {
      try {
        const category = await Category.findOne({ name: courseData.category });
        if (category) {
          courseData.category = category._id;
        }

        const existingCourse = await Course.findOne({ title: courseData.title });
        if (!existingCourse) {
          await Course.create(courseData);
          this.log(`Created course: ${courseData.title}`);
        }
      } catch (error) {
        this.log(`Error creating course ${courseData.title}: ${error.message}`);
      }
    }
  }

  async migrateProducts() {
    this.log('Starting product migration...');
    
    // Structure for real marketplace products
    const realProductData = [
      // Replace with actual vendor products
      {
        title: "Sample Product",
        description: "This is a placeholder - replace with real product data",
        price: 25.00,
        category: "Crafts",
        vendor: "admin@rnc.org", // Will be linked to real vendor accounts
        images: ["placeholder-image-url"],
        inStock: true,
        quantity: 10
      }
      // Add real products here
    ];

    for (const productData of realProductData) {
      try {
        const category = await Category.findOne({ name: productData.category });
        if (category) {
          productData.category = category._id;
        }

        const vendor = await User.findOne({ email: productData.vendor });
        if (vendor) {
          productData.vendor = vendor._id;
        }

        const existingProduct = await Product.findOne({ title: productData.title });
        if (!existingProduct) {
          await Product.create(productData);
          this.log(`Created product: ${productData.title}`);
        }
      } catch (error) {
        this.log(`Error creating product ${productData.title}: ${error.message}`);
      }
    }
  }

  async migrateBlogs() {
    this.log('Starting blog migration...');
    
    // Structure for real blog posts
    const realBlogData = [
      {
        title: "Welcome to RNC Community",
        content: "This is a sample blog post - replace with real content",
        author: "admin@rnc.org",
        category: "Community",
        tags: ["welcome", "community"],
        published: true,
        featured: true
      }
      // Add real blog posts here
    ];

    for (const blogData of realBlogData) {
      try {
        const author = await User.findOne({ email: blogData.author });
        if (author) {
          blogData.author = author._id;
        }

        const existingBlog = await Blog.findOne({ title: blogData.title });
        if (!existingBlog) {
          await Blog.create(blogData);
          this.log(`Created blog post: ${blogData.title}`);
        }
      } catch (error) {
        this.log(`Error creating blog ${blogData.title}: ${error.message}`);
      }
    }
  }

  async generateMigrationReport() {
    const reportPath = path.join(__dirname, '../logs/migration-report.txt');
    const reportContent = this.migrationLog.join('\n');
    
    fs.writeFileSync(reportPath, reportContent);
    this.log(`Migration report saved to: ${reportPath}`);
  }

  async runFullMigration() {
    try {
      await this.connectDB();
      
      this.log('=== STARTING FULL DATA MIGRATION ===');
      
      await this.migrateCategories();
      await this.migrateCourses();
      await this.migrateProducts();
      await this.migrateBlogs();
      
      await this.generateMigrationReport();
      
      this.log('=== MIGRATION COMPLETED SUCCESSFULLY ===');
      
    } catch (error) {
      this.log(`Migration failed: ${error.message}`);
      throw error;
    } finally {
      await mongoose.disconnect();
      this.log('Database connection closed');
    }
  }
}

// Export for use in other scripts
module.exports = DataMigration;

// Run migration if called directly
if (require.main === module) {
  const migration = new DataMigration();
  migration.runFullMigration().catch(console.error);
}
