const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configure multer for photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.filename));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PNG, JPG, JPEG
  const allowedTypes = /png|jpg|jpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, and JPEG files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB max file size
  },
  fileFilter: fileFilter
});

// @route   POST api/profiles/complete
// @desc    Complete user profile (mandatory after registration)
// @access  Private
router.post('/complete', [auth, upload.single('photo')], async (req, res) => {
  try {
    const {
      idType,
      idNumber,
      locationType,
      state,
      country,
      city,
      phoneNumber,
      dateOfBirth,
      gender,
      nationality,
      dataCollection,
      dataStorage,
      dataSharing,
      partnerSharing
    } = req.body;

    // Validate required fields
    if (!idType || !idNumber) {
      return res.status(400).json({
        success: false,
        message: 'ID type and number are required'
      });
    }

    if (!locationType || !city) {
      return res.status(400).json({
        success: false,
        message: 'Location information is required'
      });
    }

    if (locationType === 'malaysia' && !state) {
      return res.status(400).json({
        success: false,
        message: 'State is required for Malaysia residents'
      });
    }

    if (locationType === 'overseas' && !country) {
      return res.status(400).json({
        success: false,
        message: 'Country is required for overseas residents'
      });
    }

    if (!phoneNumber || !dateOfBirth || !gender || !nationality) {
      return res.status(400).json({
        success: false,
        message: 'All personal details are required'
      });
    }

    // Validate data consent
    if (!dataCollection || !dataStorage || !dataSharing || !partnerSharing) {
      return res.status(400).json({
        success: false,
        message: 'All data consent agreements are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Profile photo is required'
      });
    }

    // Update user with profile information
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    user.idType = idType;
    user.idNumber = idNumber;
    user.locationType = locationType;
    user.state = state || '';
    user.country = country || '';
    user.city = city;
    user.phoneNumber = phoneNumber;
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;
    user.nationality = nationality;
    user.profileImage = req.file.path;
    user.profileCompleted = true;
    
    // Save data consent
    user.dataConsent = {
      dataCollection: dataCollection === 'true' || dataCollection === true,
      dataStorage: dataStorage === 'true' || dataStorage === true,
      dataSharing: dataSharing === 'true' || dataSharing === true,
      partnerSharing: partnerSharing === 'true' || partnerSharing === true,
      consentDate: new Date(),
      consentVersion: '1.0'
    };

    await user.save();

    res.json({
      success: true,
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error('Profile completion error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while completing profile',
      error: err.message
    });
  }
});

// @route   GET api/profiles/check-completion
// @desc    Check if user profile is completed
// @access  Private
router.get('/check-completion', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('profileCompleted');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      profileCompleted: user.profileCompleted || false
    });
  } catch (err) {
    console.error('Check completion error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

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
