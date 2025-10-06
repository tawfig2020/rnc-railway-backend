/**
 * Migration Script: Refugee → Member
 * 
 * This script migrates all users with role 'refugee' to role 'member'
 * Run this BEFORE deploying code changes
 */

const mongoose = require('mongoose');
const path = require('path');

// Load config
const config = require('../config/config');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

async function migrateRefugeeToMember() {
  console.log(`${colors.cyan}${colors.bright}========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}  Refugee → Member Migration Script${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}========================================${colors.reset}\n`);

  try {
    // Connect to MongoDB
    console.log(`${colors.yellow}Connecting to MongoDB...${colors.reset}`);
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`${colors.green}✓ Connected to MongoDB${colors.reset}\n`);

    // Get database
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Count users before migration
    console.log(`${colors.yellow}Analyzing current data...${colors.reset}`);
    const refugeeCount = await usersCollection.countDocuments({ role: 'refugee' });
    const totalUsers = await usersCollection.countDocuments({});
    
    console.log(`${colors.cyan}Current Status:${colors.reset}`);
    console.log(`  Total users: ${totalUsers}`);
    console.log(`  Users with role 'refugee': ${refugeeCount}`);
    console.log('');

    if (refugeeCount === 0) {
      console.log(`${colors.green}✓ No users with role 'refugee' found. Migration not needed.${colors.reset}`);
      await mongoose.disconnect();
      return;
    }

    // Confirm migration
    console.log(`${colors.yellow}${colors.bright}⚠ WARNING: This will update ${refugeeCount} user(s)${colors.reset}`);
    console.log(`${colors.yellow}Press Ctrl+C to cancel, or wait 5 seconds to continue...${colors.reset}\n`);
    
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Perform migration
    console.log(`${colors.yellow}Starting migration...${colors.reset}`);
    const result = await usersCollection.updateMany(
      { role: 'refugee' },
      { $set: { role: 'member' } }
    );

    console.log(`${colors.green}✓ Migration complete!${colors.reset}`);
    console.log(`  Modified: ${result.modifiedCount} users`);
    console.log(`  Matched: ${result.matchedCount} users\n`);

    // Verify migration
    console.log(`${colors.yellow}Verifying migration...${colors.reset}`);
    const refugeeCountAfter = await usersCollection.countDocuments({ role: 'refugee' });
    const memberCount = await usersCollection.countDocuments({ role: 'member' });

    console.log(`${colors.cyan}After Migration:${colors.reset}`);
    console.log(`  Users with role 'refugee': ${refugeeCountAfter}`);
    console.log(`  Users with role 'member': ${memberCount}`);
    console.log('');

    if (refugeeCountAfter === 0) {
      console.log(`${colors.green}${colors.bright}✓✓✓ Migration successful! ✓✓✓${colors.reset}\n`);
    } else {
      console.log(`${colors.red}${colors.bright}⚠ WARNING: ${refugeeCountAfter} users still have role 'refugee'${colors.reset}\n`);
    }

    // Show sample of migrated users
    console.log(`${colors.yellow}Sample of migrated users:${colors.reset}`);
    const sampleUsers = await usersCollection.find({ role: 'member' })
      .limit(5)
      .project({ name: 1, email: 1, role: 1 })
      .toArray();

    sampleUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    console.log('');

    // Disconnect
    await mongoose.disconnect();
    console.log(`${colors.green}✓ Disconnected from MongoDB${colors.reset}\n`);

    console.log(`${colors.cyan}${colors.bright}========================================${colors.reset}`);
    console.log(`${colors.green}${colors.bright}  Migration Complete!${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}========================================${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}${colors.bright}✗ Migration failed:${colors.reset}`, error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run migration
migrateRefugeeToMember();
