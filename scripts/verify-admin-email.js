#!/usr/bin/env node
/**
 * Admin Email Verification Script
 * Marks an admin user's email as verified to allow login
 */

const mongoose = require('mongoose');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const config = require('../config/config');

// Load models
require('../models/User');

const argv = yargs(hideBin(process.argv))
  .option('email', {
    type: 'string',
    describe: 'Email of the admin user to verify',
    demandOption: true,
  })
  .option('confirm', {
    type: 'boolean',
    describe: 'Required flag to actually perform the verification',
    default: false,
  })
  .help()
  .alias('h', 'help')
  .argv;

const run = async () => {
  const email = argv.email.trim().toLowerCase();

  if (!argv.confirm) {
    console.error('\nRefusing to run without --confirm. This is a safety measure.');
    console.error('Dry-run only. Re-run with:  --confirm');
  }

  if (!config.mongoURI) {
    console.error('Error: No MongoDB URI configured. Ensure MONGODB_URI is set in your environment.');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected.');

    const User = mongoose.model('User');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`\nUser found:`);
    console.log({ 
      id: user._id.toString(), 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      isEmailVerified: user.isEmailVerified 
    });

    if (user.isEmailVerified) {
      console.log('\nNo changes needed. User email is already verified.');
      process.exit(0);
    }

    if (!argv.confirm) {
      console.log('\nDry run complete. To perform the verification, re-run with --confirm');
      process.exit(0);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined; // Clear any existing token
    await user.save();

    console.log('\nSuccess: User email has been verified.');
    console.log({ 
      id: user._id.toString(), 
      name: user.name, 
      email: user.email, 
      role: user.role,
      isEmailVerified: user.isEmailVerified 
    });
    process.exit(0);
  } catch (err) {
    console.error('Error during email verification:', err.message);
    process.exit(1);
  } finally {
    try { await mongoose.disconnect(); } catch (e) {}
  }
};

run();
