/**
 * Complete Database Seeding Script
 * This script creates sample data for testing the RNC platform
 * Run with: node seedDatabase.js
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

// Load all models
require('./models/User');
require('./models/Category');
require('./models/Vendor');
require('./models/Product');

const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Vendor = mongoose.model('Vendor');
const Product = mongoose.model('Product');

// Sample data
const categories = [
  {
    name: 'Handicrafts',
    slug: 'handicrafts',
    description: 'Traditional handmade crafts and artisan products',
    featured: true,
    status: 'active',
    displayOrder: 1
  },
  {
    name: 'Textiles',
    slug: 'textiles',
    description: 'Handwoven fabrics, clothing, and textile products',
    featured: true,
    status: 'active',
    displayOrder: 2
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Handcrafted jewelry and accessories',
    featured: true,
    status: 'active',
    displayOrder: 3
  },
  {
    name: 'Art',
    slug: 'art',
    description: 'Paintings, sculptures, and artistic creations',
    featured: false,
    status: 'active',
    displayOrder: 4
  },
  {
    name: 'Food & Beverages',
    slug: 'food-beverages',
    description: 'Traditional foods, spices, and beverages',
    featured: false,
    status: 'active',
    displayOrder: 5
  },
  {
    name: 'Services',
    slug: 'services',
    description: 'Professional services and freelance work',
    featured: true,
    status: 'active',
    displayOrder: 6
  },
  {
    name: 'Freelance',
    slug: 'freelance',
    description: 'Freelance services and gig work',
    featured: false,
    status: 'active',
    displayOrder: 7
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@rncmalaysia.net',
    password: 'admin123',
    role: 'admin',
    location: 'Kuala Lumpur, Malaysia',
    languages: ['English', 'Malay'],
    bio: 'Platform administrator'
  },
  {
    name: 'Amina Hassan',
    email: 'amina@example.com',
    password: 'vendor123',
    role: 'vendor',
    location: 'Kuala Lumpur, Malaysia',
    languages: ['English', 'Somali', 'Malay'],
    bio: 'Traditional Somali crafts artisan with 15 years of experience'
  },
  {
    name: 'Hassan Ibrahim',
    email: 'hassan@example.com',
    password: 'vendor123',
    role: 'vendor',
    location: 'Selangor, Malaysia',
    languages: ['English', 'Arabic', 'Malay'],
    bio: 'Textile designer specializing in traditional weaving'
  }
];

async function seedDatabase() {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // Step 1: Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Vendor.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared all collections\n');

    // Step 2: Create Users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      // Don't hash password here - the User model's pre-save hook will do it
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.name} (${user.role})`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Step 3: Create Categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Step 4: Create Vendors
    console.log('🏪 Creating vendors...');
    const vendorData = [
      {
        user: createdUsers[1]._id, // Amina
        businessName: "Amina's Traditional Crafts",
        description: 'Authentic Somali handicrafts including baskets, pottery, and traditional decorative items. Each piece tells a story of our heritage.',
        logo: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200',
        coverImage: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
        address: {
          street: '123 Jalan Ampang',
          city: 'Kuala Lumpur',
          state: 'Federal Territory',
          country: 'Malaysia',
          postalCode: '50450'
        },
        contactEmail: 'amina@example.com',
        contactPhone: '+60123456789',
        categories: ['crafts', 'art'],
        storyOfBusiness: 'I learned these traditional crafts from my grandmother in Somalia. Now in Malaysia, I continue this heritage while supporting my family and preserving our culture.',
        approvalStatus: 'approved',
        approvalDate: new Date(),
        approvedBy: createdUsers[0]._id, // Admin
        averageRating: 4.8,
        numReviews: 24,
        featured: true,
        active: true
      },
      {
        user: createdUsers[2]._id, // Hassan
        businessName: "Hassan's Fine Textiles",
        description: 'Premium handwoven textiles, traditional clothing, and modern fashion pieces that blend cultural heritage with contemporary design.',
        logo: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1f57?w=200',
        coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1f57?w=800',
        address: {
          street: '456 Jalan Raja',
          city: 'Shah Alam',
          state: 'Selangor',
          country: 'Malaysia',
          postalCode: '40000'
        },
        contactEmail: 'hassan@example.com',
        contactPhone: '+60123456790',
        categories: ['clothing', 'art'],
        storyOfBusiness: 'Weaving has been in my family for generations. I combine traditional techniques with modern designs to create unique textiles.',
        approvalStatus: 'approved',
        approvalDate: new Date(),
        approvedBy: createdUsers[0]._id, // Admin
        averageRating: 4.6,
        numReviews: 18,
        featured: true,
        active: true
      }
    ];

    const createdVendors = await Vendor.insertMany(vendorData);
    console.log(`✅ Created ${createdVendors.length} vendors\n`);

    // Step 5: Create Products
    console.log('📦 Creating products...');
    
    const handicraftsCategory = createdCategories.find(c => c.slug === 'handicrafts');
    const textilesCategory = createdCategories.find(c => c.slug === 'textiles');
    const jewelryCategory = createdCategories.find(c => c.slug === 'jewelry');

    const products = [
      {
        name: 'Hand-Woven Traditional Basket',
        description: 'Beautifully crafted basket using traditional Somali weaving techniques. Each basket takes 3-4 days to complete and features natural dyes from local plants. Perfect for storage or as a decorative piece.',
        price: 45,
        discountPrice: 0,
        images: [
          'https://images.unsplash.com/photo-1563298998-d795091aafe8?w=800',
          'https://images.unsplash.com/photo-1563298998-d795091aafe8?w=800&q=80'
        ],
        category: handicraftsCategory._id,
        tags: ['handmade', 'traditional', 'eco-friendly', 'storage', 'decor'],
        stock: 10,
        featured: true,
        vendor: createdVendors[0]._id,
        averageRating: 4.8,
        numReviews: 12,
        status: 'approved'
      },
      {
        name: 'Embroidered Cushion Cover',
        description: 'Handmade cushion cover with intricate traditional embroidery patterns. Made from high-quality cotton with silk thread embroidery. Adds elegance to any living space.',
        price: 35,
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800'
        ],
        category: textilesCategory._id,
        tags: ['handmade', 'embroidery', 'home-decor', 'cushion'],
        stock: 15,
        featured: true,
        vendor: createdVendors[1]._id,
        averageRating: 4.5,
        numReviews: 8,
        status: 'approved'
      },
      {
        name: 'Traditional Woven Scarf',
        description: 'Elegant handwoven scarf with traditional patterns and vibrant colors. Made from 100% pure cotton. Perfect for any season and occasion.',
        price: 55,
        discountPrice: 45,
        images: [
          'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800'
        ],
        category: textilesCategory._id,
        tags: ['handmade', 'fashion', 'traditional', 'scarf', 'cotton'],
        stock: 20,
        featured: false,
        vendor: createdVendors[1]._id,
        averageRating: 4.7,
        numReviews: 15,
        status: 'approved'
      },
      {
        name: 'Handcrafted Jewelry Box',
        description: 'Beautiful wooden jewelry box with hand-carved traditional motifs. Made from sustainable teak wood. Features velvet lining and multiple compartments.',
        price: 65,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'
        ],
        category: handicraftsCategory._id,
        tags: ['handmade', 'wood', 'storage', 'jewelry', 'carved'],
        stock: 8,
        featured: true,
        vendor: createdVendors[0]._id,
        averageRating: 4.9,
        numReviews: 6,
        status: 'approved'
      },
      {
        name: 'Traditional Tea Set',
        description: 'Handcrafted ceramic tea set with traditional designs. Includes teapot, 4 cups, and 4 saucers. Each piece is hand-painted with intricate patterns.',
        price: 85,
        images: [
          'https://images.unsplash.com/photo-1563822249366-3efbb2e8e9e5?w=800'
        ],
        category: handicraftsCategory._id,
        tags: ['handmade', 'ceramic', 'kitchenware', 'tea', 'traditional'],
        stock: 5,
        featured: false,
        vendor: createdVendors[0]._id,
        averageRating: 4.6,
        numReviews: 4,
        status: 'approved'
      },
      {
        name: 'Woven Table Runner',
        description: 'Elegant table runner with traditional weaving patterns. Made from cotton blend. Perfect for dining tables or as a decorative accent.',
        price: 40,
        images: [
          'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'
        ],
        category: textilesCategory._id,
        tags: ['handmade', 'home-decor', 'traditional', 'table', 'woven'],
        stock: 12,
        featured: false,
        vendor: createdVendors[1]._id,
        averageRating: 4.4,
        numReviews: 7,
        status: 'approved'
      },
      {
        name: 'Beaded Necklace Set',
        description: 'Stunning handmade beaded necklace with matching earrings. Features traditional patterns and vibrant colors. Each bead is carefully selected and placed.',
        price: 48,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
        ],
        category: jewelryCategory._id,
        tags: ['handmade', 'jewelry', 'beaded', 'necklace', 'traditional'],
        stock: 18,
        featured: true,
        vendor: createdVendors[0]._id,
        averageRating: 4.7,
        numReviews: 11,
        status: 'approved'
      },
      {
        name: 'Hand-Painted Ceramic Vase',
        description: 'Beautiful ceramic vase with hand-painted traditional motifs. Perfect for flowers or as a standalone decorative piece. Each vase is unique.',
        price: 52,
        images: [
          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
        ],
        category: handicraftsCategory._id,
        tags: ['handmade', 'ceramic', 'vase', 'decor', 'painted'],
        stock: 9,
        featured: false,
        vendor: createdVendors[0]._id,
        averageRating: 4.5,
        numReviews: 5,
        status: 'approved'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products\n`);

    // Step 6: Update category product counts
    console.log('🔄 Updating category product counts...');
    for (const category of createdCategories) {
      const count = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount: count });
    }
    console.log('✅ Updated category counts\n');

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📁 Categories: ${createdCategories.length}`);
    console.log(`   🏪 Vendors: ${createdVendors.length}`);
    console.log(`   📦 Products: ${createdProducts.length}\n`);
    console.log('🔐 Test Credentials:');
    console.log('   Admin:');
    console.log('      Email: admin@rncmalaysia.net');
    console.log('      Password: admin123\n');
    console.log('   Vendor 1:');
    console.log('      Email: amina@example.com');
    console.log('      Password: vendor123\n');
    console.log('   Vendor 2:');
    console.log('      Email: hassan@example.com');
    console.log('      Password: vendor123\n');
    console.log('🌐 Test Your API:');
    console.log('   Products: https://rnc-railway-backend.onrender.com/api/products');
    console.log('   Vendors: https://rnc-railway-backend.onrender.com/api/vendors');
    console.log('   Categories: https://rnc-railway-backend.onrender.com/api/categories\n');
    console.log('✨ Your marketplace should now display products!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    console.error('\nError details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    process.exit(1);
  }
}

// Wait for MongoDB connection
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB\n');
  seedDatabase();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
