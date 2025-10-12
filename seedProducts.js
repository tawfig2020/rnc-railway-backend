/**
 * Seed Script for Products and Vendors
 * Run this once to populate the database with sample data
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rnc-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load models
require('./models/User');
require('./models/Vendor');
require('./models/Product');

const User = mongoose.model('User');
const Vendor = mongoose.model('Vendor');
const Product = mongoose.model('Product');

const sampleVendors = [
  {
    businessName: "Amina's Crafts",
    description: "Traditional Somali handicrafts and textiles",
    categories: ['handicrafts', 'textiles'],
    email: 'amina@example.com',
    phone: '+60123456789',
    address: {
      street: '123 Main St',
      city: 'Kuala Lumpur',
      state: 'Federal Territory',
      country: 'Malaysia',
      postalCode: '50000'
    },
    coverImage: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    logo: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200',
    storyOfBusiness: 'Preserving traditional Somali weaving techniques passed down through generations.',
    approvalStatus: 'approved',
    active: true,
    featured: true,
    averageRating: 4.8,
    numReviews: 24
  },
  {
    businessName: "Hassan's Textiles",
    description: "Beautiful handwoven fabrics and traditional clothing",
    categories: ['textiles', 'clothing'],
    email: 'hassan@example.com',
    phone: '+60123456790',
    address: {
      street: '456 Market St',
      city: 'Kuala Lumpur',
      state: 'Federal Territory',
      country: 'Malaysia',
      postalCode: '50000'
    },
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1f57?w=800',
    logo: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1f57?w=200',
    storyOfBusiness: 'Creating beautiful textiles that blend traditional and modern designs.',
    approvalStatus: 'approved',
    active: true,
    featured: true,
    averageRating: 4.6,
    numReviews: 18
  }
];

const sampleProducts = [
  {
    name: 'Hand-Woven Traditional Basket',
    description: 'Beautifully crafted basket using traditional Somali weaving techniques. Each basket takes 3-4 days to complete and features natural dyes from local plants.',
    price: 45,
    category: 'handicrafts',
    images: ['https://images.unsplash.com/photo-1563298998-d795091aafe8?w=800'],
    stock: 10,
    tags: ['handmade', 'traditional', 'eco-friendly'],
    status: 'approved',
    featured: true,
    specifications: {
      dimensions: '30cm x 25cm',
      weight: '0.5kg',
      material: 'Natural palm fiber'
    }
  },
  {
    name: 'Embroidered Cushion Cover',
    description: 'Handmade cushion cover with intricate traditional embroidery patterns.',
    price: 35,
    category: 'textiles',
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800'],
    stock: 15,
    tags: ['handmade', 'embroidery', 'home-decor'],
    status: 'approved',
    featured: true,
    specifications: {
      dimensions: '45cm x 45cm',
      material: 'Cotton with silk thread embroidery'
    }
  },
  {
    name: 'Traditional Woven Scarf',
    description: 'Elegant handwoven scarf with traditional patterns and vibrant colors.',
    price: 55,
    category: 'textiles',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800'],
    stock: 20,
    tags: ['handmade', 'fashion', 'traditional'],
    status: 'approved',
    featured: false,
    specifications: {
      dimensions: '180cm x 70cm',
      material: 'Pure cotton'
    }
  },
  {
    name: 'Handcrafted Jewelry Box',
    description: 'Beautiful wooden jewelry box with hand-carved traditional motifs.',
    price: 65,
    category: 'handicrafts',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    stock: 8,
    tags: ['handmade', 'wood', 'storage'],
    status: 'approved',
    featured: true,
    specifications: {
      dimensions: '20cm x 15cm x 10cm',
      material: 'Teak wood'
    }
  },
  {
    name: 'Traditional Tea Set',
    description: 'Handcrafted ceramic tea set with traditional designs.',
    price: 85,
    category: 'handicrafts',
    images: ['https://images.unsplash.com/photo-1563822249366-3efbb2e8e9e5?w=800'],
    stock: 5,
    tags: ['handmade', 'ceramic', 'kitchenware'],
    status: 'approved',
    featured: false,
    specifications: {
      includes: '1 teapot, 4 cups, 4 saucers',
      material: 'Hand-painted ceramic'
    }
  },
  {
    name: 'Woven Table Runner',
    description: 'Elegant table runner with traditional weaving patterns.',
    price: 40,
    category: 'textiles',
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'],
    stock: 12,
    tags: ['handmade', 'home-decor', 'traditional'],
    status: 'approved',
    featured: false,
    specifications: {
      dimensions: '150cm x 40cm',
      material: 'Cotton blend'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing products and vendors...');
    await Product.deleteMany({});
    await Vendor.deleteMany({});

    // Create vendors
    console.log('👥 Creating vendors...');
    const createdVendors = await Vendor.insertMany(sampleVendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    // Assign vendors to products
    const productsWithVendors = sampleProducts.map((product, index) => ({
      ...product,
      vendor: createdVendors[index % createdVendors.length]._id
    }));

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(productsWithVendors);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Vendors: ${createdVendors.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`\n🌐 Test your API:`);
    console.log(`   curl https://rnc-railway-backend.onrender.com/api/products`);
    console.log(`   curl https://rnc-railway-backend.onrender.com/api/vendors`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
  seedDatabase();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
