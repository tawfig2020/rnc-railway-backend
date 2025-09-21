const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const HealthRecord = require('../models/HealthRecord');

// @route   GET api/health
// @desc    Get all health records (admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find().populate('user', ['name', 'email']);
    res.json(healthRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/health/me
// @desc    Get current user's health record
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({ 
      user: req.user.id 
    }).populate('user', ['name', 'email']);
    
    if (!healthRecord) {
      return res.status(404).json({ msg: 'Health record not found' });
    }

    res.json(healthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/health
// @desc    Create or update health record
// @access  Private
router.post('/', async (req, res) => {
  const {
    medicalHistory,
    allergies,
    currentMedications,
    immunizations,
    chronicConditions,
    mentalHealthStatus,
    primaryCareProvider,
    emergencyContact,
    accessibility,
    nutritionalNeeds,
    lastCheckupDate,
    notes
  } = req.body;

  // Build health record object
  const healthFields = {};
  healthFields.user = req.user.id; // This assumes you have authentication middleware
  if (medicalHistory) healthFields.medicalHistory = medicalHistory;
  if (allergies) healthFields.allergies = allergies;
  if (currentMedications) healthFields.currentMedications = currentMedications;
  if (immunizations) healthFields.immunizations = immunizations;
  if (chronicConditions) healthFields.chronicConditions = chronicConditions;
  if (mentalHealthStatus) healthFields.mentalHealthStatus = mentalHealthStatus;
  if (primaryCareProvider) healthFields.primaryCareProvider = primaryCareProvider;
  if (emergencyContact) healthFields.emergencyContact = emergencyContact;
  if (accessibility) healthFields.accessibility = accessibility;
  if (nutritionalNeeds) healthFields.nutritionalNeeds = nutritionalNeeds;
  if (lastCheckupDate) healthFields.lastCheckupDate = lastCheckupDate;
  if (notes) healthFields.notes = notes;

  try {
    // Check if health record exists
    let healthRecord = await HealthRecord.findOne({ user: req.user.id });

    if (healthRecord) {
      // Update
      healthRecord = await HealthRecord.findOneAndUpdate(
        { user: req.user.id },
        { $set: healthFields },
        { new: true }
      );

      return res.json(healthRecord);
    }

    // Create
    healthRecord = new HealthRecord(healthFields);
    await healthRecord.save();
    res.json(healthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/health/medications
// @desc    Add medication to health record
// @access  Private
router.put('/medications', [
  check('name', 'Medication name is required').not().isEmpty(),
  check('dosage', 'Dosage is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, dosage, frequency, startDate, endDate } = req.body;

  const newMedication = {
    name,
    dosage,
    frequency,
    startDate,
    endDate
  };

  try {
    const healthRecord = await HealthRecord.findOne({ user: req.user.id });

    if (!healthRecord) {
      return res.status(404).json({ msg: 'Health record not found' });
    }

    healthRecord.currentMedications.unshift(newMedication);
    await healthRecord.save();

    res.json(healthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/health
// @desc    Delete health record
// @access  Private
router.delete('/', async (req, res) => {
  try {
    await HealthRecord.findOneAndDelete({ user: req.user.id });
    res.json({ msg: 'Health record deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
