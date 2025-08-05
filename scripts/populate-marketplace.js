/**
 * Populate Marketplace Script
 * 
 * This script creates essential marketplace categories and placeholder products
 * for the Refugee Network Centre platform.
 */

const mongoose = require('mongoose');
const config = require('../config/config.js');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
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

// Sample product data
const sampleProducts = [
  // Handmade jewelry product
  {
    name: 'Traditional Silver Necklace',
    description: 'Handcrafted silver necklace with traditional Middle Eastern design elements. Each piece is unique and crafted by artisans using traditional techniques passed down through generations.',
    price: 45.99,
    discountPrice: 39.99,
    images: ['/assets/marketplace/products/silver-necklace-1.jpg', '/assets/marketplace/products/silver-necklace-2.jpg'],
    categoryName: 'Jewelry & Accessories',
    tags: ['jewelry', 'handmade', 'silver', 'traditional'],
    stock: 15,
    featured: true,
    status: 'approved'
  },
  // Textile product
  {
    name: 'Hand-Embroidered Table Runner',
    description: 'Beautiful table runner with intricate embroidery patterns representing Syrian cultural heritage. Each piece takes approximately 20 hours to complete and uses traditional stitching techniques.',
    price: 32.50,
    images: ['/assets/marketplace/products/table-runner-1.jpg'],
    categoryName: 'Textiles & Clothing',
    tags: ['textile', 'embroidery', 'home decor', 'handmade'],
    stock: 8,
    featured: true,
    status: 'approved'
  },
  // Digital service
  {
    name: 'Professional Arabic-English Translation',
    description: 'Professional translation services between Arabic and English by certified translators with expertise in legal, medical, and technical terminology.',
    price: 25.00,
    images: ['/assets/marketplace/products/translation-service.jpg'],
    categoryName: 'Translation Services',
    tags: ['service', 'translation', 'arabic', 'english', 'professional'],
    stock: 999,
    featured: true,
    status: 'approved'
  },
  // Food product
  {
    name: 'Authentic Za\'atar Spice Blend',
    description: 'Traditional Za\'atar spice mix made from wild thyme, sumac, and sesame seeds. This authentic blend is prepared according to a family recipe from the Levant region.',
    price: 8.99,
    images: ['/assets/marketplace/products/zaatar-1.jpg', '/assets/marketplace/products/zaatar-2.jpg'],
    categoryName: 'Spices & Ingredients',
    tags: ['food', 'spice', 'middle eastern', 'cooking'],
    stock: 50,
    featured: true,
    status: 'approved'
  },
  // Educational product
  {
    name: 'Arabic Calligraphy Starter Kit',
    description: 'Complete kit for learning Arabic calligraphy, including special pens, ink, practice sheets, and a detailed guidebook with step-by-step instructions.',
    price: 28.99,
    discountPrice: 24.99,
    images: ['/assets/marketplace/products/calligraphy-kit.jpg'],
    categoryName: 'Education & Skills',
    tags: ['education', 'art', 'calligraphy', 'arabic'],
    stock: 25,
    featured: false,
    status: 'approved'
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
        role: 'admin',
        location: 'Kuala Lumpur, Malaysia' // Adding the required location field
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
        businessName: 'Refugee Network Marketplace', // Required field
        description: 'Official vendor account for Refugee Network Centre marketplace products.',
        email: 'marketplace@refugeenetwork.org',
        phone: '+1-555-123-4567',
        address: '123 Main St, San Francisco, CA 94105',
        logo: '/assets/marketplace/vendors/rnc-vendor.png',
        user: adminUser._id,
        status: 'approved',
        averageRating: 5 // Required minimum value 1
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
    // Create default vendor
    const defaultVendor = await createDefaultVendor();
    
    // Create main categories
    const categoryMap = {};
    
    for (const categoryData of mainCategories) {
      // Check if category already exists
      let category = await Category.findOne({ name: categoryData.name });
      
      if (!category) {
        category = new Category(categoryData);
        await category.save();
        console.log(`Created main category: ${categoryData.name}`);
      }
      
      categoryMap[categoryData.name] = category._id;
    }
    
    // Create subcategories
    const subCategoryMap = {};
    
    for (const subCategoryData of subCategories) {
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
      }
      
      subCategoryMap[subCategoryData.name] = subCategory._id;
    }
    
    // Create sample products
    for (const productData of sampleProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (!existingProduct) {
        const categoryId = subCategoryMap[productData.categoryName] || 
                          categoryMap[productData.categoryName];
        
        if (!categoryId) {
          console.warn(`Category not found for product: ${productData.name}`);
          continue;
        }
        
        const product = new Product({
          ...productData,
          category: categoryId,
          vendor: defaultVendor._id,
          averageRating: 4 // Add default average rating (minimum of 1 required)
        });
        
        await product.save();
        console.log(`Created product: ${productData.name}`);
      }
    }
    
    console.log('Database population completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error populating database:', err);
    process.exit(1);
  }
};

// Run the population script
populateMarketplace();
