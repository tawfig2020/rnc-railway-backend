const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profiles
// @desc    Get all profiles
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'email', 'role']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ 
      user: req.params.user_id 
    }).populate('user', ['name', 'email', 'role', 'location', 'languages']);
    
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    check('status', 'Status is required').not().isEmpty(),
    check('countryOfOrigin', 'Country of origin is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      arrivalDate,
      countryOfOrigin,
      education,
      workExperience,
      familyMembers,
      housingStatus,
      medicalConditions,
      servicesNeeded,
      currentLocation,
      socialMediaHandles
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id; // This assumes you have authentication middleware
    if (status) profileFields.status = status;
    if (arrivalDate) profileFields.arrivalDate = arrivalDate;
    if (countryOfOrigin) profileFields.countryOfOrigin = countryOfOrigin;
    if (housingStatus) profileFields.housingStatus = housingStatus;
    
    // Build education array
    if (education) {
      profileFields.education = education;
    }

    // Build work experience array
    if (workExperience) {
      profileFields.workExperience = workExperience;
    }

    // Build family members array
    if (familyMembers) {
      profileFields.familyMembers = familyMembers;
    }

    // Build medical conditions array
    if (medicalConditions) {
      profileFields.medicalConditions = medicalConditions;
    }

    // Build services needed array
    if (servicesNeeded) {
      profileFields.servicesNeeded = servicesNeeded;
    }

    // Build location object
    if (currentLocation) {
      profileFields.currentLocation = currentLocation;
    }

    // Build social media object
    profileFields.socialMediaHandles = {};
    if (socialMediaHandles && socialMediaHandles.facebook) profileFields.socialMediaHandles.facebook = socialMediaHandles.facebook;
    if (socialMediaHandles && socialMediaHandles.twitter) profileFields.socialMediaHandles.twitter = socialMediaHandles.twitter;
    if (socialMediaHandles && socialMediaHandles.linkedin) profileFields.socialMediaHandles.linkedin = socialMediaHandles.linkedin;
    if (socialMediaHandles && socialMediaHandles.instagram) profileFields.socialMediaHandles.instagram = socialMediaHandles.instagram;

    try {
      // Check if profile exists
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profiles
// @desc    Delete profile and user
// @access  Private
router.delete('/', async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });
    
    // Remove user
    // Uncomment below if you want to also remove the user
    // await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
