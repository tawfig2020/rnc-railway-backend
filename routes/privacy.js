const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { logger } = require('../utils/logger');
const User = require('../models/User');
const UserConsent = require('../models/UserConsent');

// @route   GET /api/privacy/policy
// @desc    Get current privacy policy version and content
// @access  Public
router.get('/policy', async (req, res) => {
  try {
    const privacyPolicy = {
      version: '1.0',
      lastUpdated: '2024-01-01',
      effectiveDate: '2024-01-01',
      sections: {
        introduction: 'The Refugee Network Centre (RNC) is committed to protecting your privacy...',
        dataCollection: 'We collect information you provide directly to us...',
        dataUsage: 'We use the information we collect to provide and improve our services...',
        dataSharing: 'We do not sell, trade, or otherwise transfer your personal information...',
        dataSecurity: 'We implement appropriate security measures...',
        userRights: 'You have certain rights regarding your personal information...',
        childrenPrivacy: 'Our services are not intended for children under 13...',
        contact: 'If you have questions about this Privacy Policy...'
      }
    };

    logger.info('Privacy policy accessed', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    logger.error('Error fetching privacy policy', {
      error: error.message,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/privacy/consent
// @desc    Update user consent preferences
// @access  Private
router.post('/consent', auth, async (req, res) => {
  try {
    const { analytics, marketing, dataProcessing, thirdParty, consentMethod } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Find or create user consent record
    let userConsent = await UserConsent.findOne({ userId });
    
    if (!userConsent) {
      userConsent = new UserConsent({
        userId,
        ipAddress,
        userAgent,
        consentMethod: consentMethod || 'explicit_consent'
      });
    }

    // Update consents with timestamps
    const timestamp = new Date();
    
    if (typeof analytics === 'boolean') {
      userConsent.updateConsent('analytics', analytics, ipAddress, userAgent);
    }
    
    if (typeof marketing === 'boolean') {
      userConsent.updateConsent('marketing', marketing, ipAddress, userAgent);
    }
    
    if (typeof dataProcessing === 'boolean') {
      userConsent.updateConsent('dataProcessing', dataProcessing, ipAddress, userAgent);
    }
    
    if (typeof thirdParty === 'boolean') {
      userConsent.updateConsent('thirdParty', thirdParty, ipAddress, userAgent);
    }

    await userConsent.save();

    logger.logUserAction(userId, 'consent_updated', {
      analytics,
      marketing,
      dataProcessing,
      thirdParty,
      ip: ipAddress,
      userAgent
    });

    res.json({
      success: true,
      message: 'Consent preferences updated successfully',
      data: {
        consents: userConsent.consents
      }
    });
  } catch (error) {
    logger.error('Error updating user consent', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/privacy/consent
// @desc    Get user consent preferences
// @access  Private
router.get('/consent', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userConsent = await UserConsent.findOne({ userId });

    if (!userConsent) {
      return res.json({
        success: true,
        data: {
          consents: {
            essential: { given: true, timestamp: new Date() },
            analytics: { given: false, timestamp: null },
            marketing: { given: false, timestamp: null },
            dataProcessing: { given: false, timestamp: null },
            thirdParty: { given: false, timestamp: null }
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        consents: userConsent.consents,
        privacyPolicyVersion: userConsent.privacyPolicyVersion,
        lastUpdated: userConsent.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Error fetching user consent', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/privacy/accept-policy
// @desc    Record user acceptance of privacy policy
// @access  Private
router.post('/accept-policy', auth, async (req, res) => {
  try {
    const { version } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      'lastPrivacyPolicyAccepted.version': version || '1.0',
      'lastPrivacyPolicyAccepted.acceptedAt': new Date()
    });

    logger.logUserAction(userId, 'privacy_policy_accepted', {
      version: version || '1.0',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Privacy policy acceptance recorded'
    });
  } catch (error) {
    logger.error('Error recording privacy policy acceptance', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/privacy/data-export
// @desc    Request user data export
// @access  Private
router.post('/data-export', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // In a real implementation, this would trigger a background job
    // to compile all user data and send it via email
    
    logger.logUserAction(userId, 'data_export_requested', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Data export request received. You will receive an email with your data within 30 days.'
    });
  } catch (error) {
    logger.error('Error processing data export request', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/privacy/account-deletion
// @desc    Request account deletion
// @access  Private
router.post('/account-deletion', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user.id;
    
    // Schedule account deletion (30 days from now)
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + 30);

    await User.findByIdAndUpdate(userId, {
      'accountDeletionRequest.requested': true,
      'accountDeletionRequest.requestedAt': new Date(),
      'accountDeletionRequest.scheduledDeletionDate': scheduledDeletionDate,
      'accountDeletionRequest.reason': reason
    });

    logger.logUserAction(userId, 'account_deletion_requested', {
      reason,
      scheduledDeletionDate,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `Account deletion scheduled for ${scheduledDeletionDate.toDateString()}. You can cancel this request anytime before then.`,
      data: {
        scheduledDeletionDate
      }
    });
  } catch (error) {
    logger.error('Error processing account deletion request', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/privacy/account-deletion
// @desc    Cancel account deletion request
// @access  Private
router.delete('/account-deletion', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      'accountDeletionRequest.requested': false,
      'accountDeletionRequest.requestedAt': null,
      'accountDeletionRequest.scheduledDeletionDate': null,
      'accountDeletionRequest.reason': null
    });

    logger.logUserAction(userId, 'account_deletion_cancelled', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Account deletion request cancelled successfully'
    });
  } catch (error) {
    logger.error('Error cancelling account deletion request', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/privacy/settings
// @desc    Update privacy settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileVisibility, dataRetention, communicationPreferences } = req.body;

    const updateData = {};
    
    if (profileVisibility) {
      updateData['privacySettings.profileVisibility'] = profileVisibility;
    }
    
    if (typeof dataRetention === 'boolean') {
      updateData['privacySettings.dataRetention'] = dataRetention;
    }
    
    if (communicationPreferences) {
      if (typeof communicationPreferences.email === 'boolean') {
        updateData['privacySettings.communicationPreferences.email'] = communicationPreferences.email;
      }
      if (typeof communicationPreferences.sms === 'boolean') {
        updateData['privacySettings.communicationPreferences.sms'] = communicationPreferences.sms;
      }
      if (typeof communicationPreferences.newsletter === 'boolean') {
        updateData['privacySettings.communicationPreferences.newsletter'] = communicationPreferences.newsletter;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: 'privacySettings' }
    );

    logger.logUserAction(userId, 'privacy_settings_updated', {
      changes: updateData,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: {
        privacySettings: updatedUser.privacySettings
      }
    });
  } catch (error) {
    logger.error('Error updating privacy settings', {
      error: error.message,
      userId: req.user?.id,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
