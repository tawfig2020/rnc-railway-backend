/**
 * Populate Marketplace Script for Local Development
 * 
 * This script creates essential marketplace categories and placeholder products
 * for the Refugee Network Centre platform using a local MongoDB connection.
 */

const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

// Connect to local MongoDB
const localMongoURI = 'mongodb://localhost:27017/refugee-network';
mongoose.connect(localMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected to local instance...'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Main Categories with Descriptions
const mainCategories = [
  {
    name: 'Handmade & Artisan Products',
    description: 'Unique handcrafted items created by refugee artisans showcasing traditional craftsmanship and cultural heritage.',
    icon: 'HandymanOutlined',
    image: '/assets/marketplace/categories/handmade.jpg',
    featured: true,
    status: 'active',
    displayOrder: 1
  },
  {
    name: 'Digital Products & Services',
    description: 'Digital goods and professional services offered by skilled refugees including design work, translation services, and digital content.',
    icon: 'ComputerOutlined',
    image: '/assets/marketplace/categories/digital.jpg',
    featured: true,
    status: 'active',
    displayOrder: 2
  },
  {
    name: 'Food & Culinary',
    description: 'Authentic food products, spices, ingredients, and culinary items representing diverse refugee cuisines and food traditions.',
    icon: 'RestaurantOutlined',
    image: '/assets/marketplace/categories/food.jpg',
    featured: true,
    status: 'active',
    displayOrder: 3
  },
  {
    name: 'Home & Living',
    description: 'Home decor, textiles, and living essentials with cultural influences that bring unique character to any living space.',
    icon: 'HomeOutlined',
    image: '/assets/marketplace/categories/home.jpg',
    featured: false,
    status: 'active',
    displayOrder: 4
  },
  {
    name: 'Education & Skills',
    description: 'Educational resources, courses, and skill-building materials created to empower both refugees and those supporting them.',
    icon: 'SchoolOutlined',
    image: '/assets/marketplace/categories/education.jpg',
    featured: false,
    status: 'active',
    displayOrder: 5
  }
];

// Subcategories mapped to main categories
const subCategories = [
  // Handmade & Artisan Products subcategories
  {
    name: 'Jewelry & Accessories',
    parentName: 'Handmade & Artisan Products',
    description: 'Handcrafted jewelry and accessories representing cultural traditions and artistic expression.',
    icon: 'DiamondOutlined',
    status: 'active',
    displayOrder: 1
  },
  {
    name: 'Textiles & Clothing',
    parentName: 'Handmade & Artisan Products',
    description: 'Traditional and contemporary textiles and clothing items showcasing cultural heritage.',
    icon: 'CheckroomOutlined',
    status: 'active',
    displayOrder: 2
  },
  {
    name: 'Art & Decor',
    parentName: 'Handmade & Artisan Products',
    description: 'Original artwork and decorative items reflecting diverse artistic traditions.',
    icon: 'BrushOutlined',
    status: 'active',
    displayOrder: 3
  },
  
  // Digital Products & Services subcategories
  {
    name: 'Graphic Design',
    parentName: 'Digital Products & Services',
    description: 'Professional graphic design services from logos to marketing materials.',
    icon: 'DesignServicesOutlined',
    status: 'active',
    displayOrder: 1
  },
  {
    name: 'Translation Services',
    parentName: 'Digital Products & Services',
    description: 'Language translation services across multiple languages and dialects.',
    icon: 'TranslateOutlined',
    status: 'active',
    displayOrder: 2
  },
  {
    name: 'Digital Content',
    parentName: 'Digital Products & Services',
    description: 'E-books, templates, and digital resources created by refugee professionals.',
    icon: 'MenuBookOutlined',
    status: 'active',
    displayOrder: 3
  },
  
  // Food & Culinary subcategories
  {
    name: 'Spices & Ingredients',
    parentName: 'Food & Culinary',
    description: 'Authentic spices, herbs, and cooking ingredients from around the world.',
    icon: 'RiceBowlOutlined',
    status: 'active',
    displayOrder: 1
  },
  {
    name: 'Prepared Foods',
    parentName: 'Food & Culinary',
    description: 'Ready-to-eat foods and specialty items prepared according to traditional recipes.',
    icon: 'TakeoutDiningOutlined',
    status: 'active',
    displayOrder: 2
  },
  {
    name: 'Cooking Tools',
    parentName: 'Food & Culinary',
    description: 'Traditional and specialized cooking tools and utensils.',
    icon: 'KitchenOutlined',
    status: 'active',
    displayOrder: 3
  }
];

// Create default vendor for products
const createDefaultVendor = async () => {
  try {
    // First check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@refugeenetwork.org' });
    
    if (!adminUser) {
      // Create admin user if it doesn't exist
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@refugeenetwork.org',
        password: 'placeholder123', // This should be properly hashed
        role: 'admin'
      });
      await adminUser.save();
      console.log('Created default admin user');
    }
    
    // Check if vendor exists
    let vendor = await Vendor.findOne({ email: 'marketplace@refugeenetwork.org' });
    
    if (!vendor) {
      // Create default vendor
      vendor = new Vendor({
        name: 'Refugee Network Marketplace',
        description: 'Official vendor account for Refugee Network Centre marketplace products.',
        email: 'marketplace@refugeenetwork.org',
        phone: '+1-555-123-4567',
        address: '123 Main St, San Francisco, CA 94105',
        logo: '/assets/marketplace/vendors/rnc-vendor.png',
        user: adminUser._id,
        status: 'approved'
      });
      await vendor.save();
      console.log('Created default vendor account');
    }
    
    return vendor;
  } catch (err) {
    console.error('Error creating default vendor:', err);
    process.exit(1);
  }
};

// Main function to populate the database
const populateMarketplace = async () => {
  try {
    console.log('Starting marketplace data population...');
    
    // Create main categories
    const categoryMap = {};
    
    for (const categoryData of mainCategories) {
      try {
        // Check if category already exists
        let category = await Category.findOne({ name: categoryData.name });
        
        if (!category) {
          category = new Category(categoryData);
          await category.save();
          console.log(`Created main category: ${categoryData.name}`);
        } else {
          console.log(`Main category already exists: ${categoryData.name}`);
        }
        
        categoryMap[categoryData.name] = category._id;
      } catch (err) {
        console.error(`Error creating category ${categoryData.name}:`, err);
      }
    }
    
    console.log('Main categories processed');
    
    // Create subcategories
    const subCategoryMap = {};
    
    for (const subCategoryData of subCategories) {
      try {
        // Check if subcategory already exists
        let subCategory = await Category.findOne({ name: subCategoryData.name });
        
        if (!subCategory) {
          const parentId = categoryMap[subCategoryData.parentName];
          
          if (!parentId) {
            console.warn(`Parent category not found for: ${subCategoryData.name}`);
            continue;
          }
          
          subCategory = new Category({
            ...subCategoryData,
            parentId
          });
          
          await subCategory.save();
          console.log(`Created subcategory: ${subCategoryData.name}`);
        } else {
          console.log(`Subcategory already exists: ${subCategoryData.name}`);
        }
        
        subCategoryMap[subCategoryData.name] = subCategory._id;
      } catch (err) {
        console.error(`Error creating subcategory ${subCategoryData.name}:`, err);
      }
    }
    
    console.log('Subcategories processed');
    
    console.log('Marketplace categories created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error populating database:', err);
    process.exit(1);
  }
};

// Run the population script
populateMarketplace();
