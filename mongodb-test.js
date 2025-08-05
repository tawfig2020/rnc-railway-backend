const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string (corrected format without angle brackets)
const mongoURI = 'mongodb+srv://tawfig2020ifbp:bdLp5inJJ05ZcbFN@rncmalaysia.dfz2nfi.mongodb.net/';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,      // These options are no longer needed in newer
      useUnifiedTopology: true,   // versions of mongoose but included for compatibility
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // List all collections in the database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  } finally {
    // Close the connection after testing
    setTimeout(() => {
      mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    }, 3000);
  }
};

// Run the connection test
connectDB();
