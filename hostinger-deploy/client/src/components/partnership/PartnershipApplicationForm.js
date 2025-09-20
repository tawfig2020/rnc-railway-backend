import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ExpandMore,
  Business,
  People,
  Diversity3,
  Handshake,
  Check,
  Send
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Manufacturing',
  'Retail & Hospitality',
  'Financial Services',
  'Education',
  'Construction',
  'Professional Services',
  'Non-profit',
  'Transportation & Logistics',
  'Agriculture',
  'Media & Entertainment',
  'Energy & Utilities',
  'Other'
];

const COMPANY_SIZE_OPTIONS = [
  'Micro (1-9 employees)',
  'Small (10-49 employees)',
  'Medium (50-249 employees)',
  'Large (250+ employees)'
];

const SKILL_CATEGORIES = [
  'Administrative & Clerical',
  'Customer Service',
  'Technology & IT',
  'Healthcare',
  'Manufacturing & Production',
  'Sales & Marketing',
  'Food Service',
  'Education & Training',
  'Skilled Trades',
  'Languages & Translation',
  'Creative & Design',
  'Finance & Accounting',
  'Management',
  'Other'
];

const PartnershipApplicationForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    industry: '',
    companySize: '',
    companyWebsite: '',
    yearsInOperation: '',
    companyDescription: '',
    
    // Contact Information
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    preferredContact: 'email',
    
    // Hiring Interests
    positionTypes: [],
    potentialOpenings: '',
    workArrangements: {
      onsite: false,
      hybrid: false,
      remote: false
    },
    skillsNeeded: [],
    languageRequirements: [],
    
    // Diversity & Inclusion
    hasDiversityPolicy: null,
    diversityPolicyDetails: '',
    previousRefugeeHiring: null,
    previousExperience: '',
    supportSystems: '',
    
    // Partnership Expectations
    partnershipGoals: '',
    hiringTimeline: '',
    supportNeeded: '',
    mentorshipOpportunities: false,
    additionalInfo: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState('companyInfo');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (section, field) => (e) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: e.target.checked
      }
    });
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (field) => (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [field]: typeof value === 'string' ? value.split(',') : value
    });
  };
  
  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/partnerships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Reset form after successful submission
        setFormData({
          companyName: '',
          industry: '',
          companySize: '',
          companyWebsite: '',
          yearsInOperation: '',
          companyDescription: '',
          contactName: '',
          contactTitle: '',
          contactEmail: '',
          contactPhone: '',
          preferredContact: 'email',
          positionTypes: [],
          potentialOpenings: '',
          workArrangements: {
            onsite: false,
            hybrid: false,
            remote: false
          },
          skillsNeeded: [],
          languageRequirements: [],
          hasDiversityPolicy: null,
          diversityPolicyDetails: '',
          previousRefugeeHiring: null,
          previousExperience: '',
          supportSystems: '',
          partnershipGoals: '',
          hiringTimeline: '',
          supportNeeded: '',
          mentorshipOpportunities: false,
          additionalInfo: ''
        });
      } else {
        setError(data.message || 'Failed to submit partnership application');
      }
    } catch (err) {
      console.error('Partnership submission error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Company Information Section */}
      <Accordion 
        expanded={expanded === 'companyInfo'} 
        onChange={handleAccordionChange('companyInfo')}
        elevation={2}
        sx={{ 
          mb: 2, 
          borderRadius: '8px',
          '&:before': { display: 'none' },
          overflow: 'hidden',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: '#2A7D6F',
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Business sx={{ mr: 2 }} />
          <Typography variant="h6">Company Information</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Industry</InputLabel>
                <Select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  label="Industry"
                >
                  {INDUSTRY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Company Size</InputLabel>
                <Select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  label="Company Size"
                >
                  {COMPANY_SIZE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Website"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://www.example.com"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Years in Operation"
                name="yearsInOperation"
                value={formData.yearsInOperation}
                onChange={handleChange}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Brief Company Description"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                placeholder="Tell us about your company, its mission, and values..."
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Contact Information Section */}
      <Accordion 
        expanded={expanded === 'contactInfo'} 
        onChange={handleAccordionChange('contactInfo')}
        elevation={2}
        sx={{ 
          mb: 2, 
          borderRadius: '8px',
          '&:before': { display: 'none' },
          overflow: 'hidden'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: '#D36135',
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <People sx={{ mr: 2 }} />
          <Typography variant="h6">Primary Contact Information</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Contact Name"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Full name of primary contact"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Job Title"
                name="contactTitle"
                value={formData.contactTitle}
                onChange={handleChange}
                placeholder="Your position at the company"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Include country code if international"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Preferred Contact Method</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.preferredContact === 'email'}
                        onChange={() => handleChange({ target: { name: 'preferredContact', value: 'email' } })}
                        color="primary"
                      />
                    }
                    label="Email"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.preferredContact === 'phone'}
                        onChange={() => handleChange({ target: { name: 'preferredContact', value: 'phone' } })}
                        color="primary"
                      />
                    }
                    label="Phone"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Hiring Interests Section */}
      <Accordion 
        expanded={expanded === 'hiringInterests'} 
        onChange={handleAccordionChange('hiringInterests')}
        elevation={2}
        sx={{ 
          mb: 2, 
          borderRadius: '8px',
          '&:before': { display: 'none' },
          overflow: 'hidden'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: '#79854E',
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Diversity3 sx={{ mr: 2 }} />
          <Typography variant="h6">Hiring Interests & Capacity</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Skills & Positions</InputLabel>
                <Select
                  multiple
                  name="skillsNeeded"
                  value={formData.skillsNeeded}
                  onChange={handleMultiSelectChange('skillsNeeded')}
                  label="Skills & Positions"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {SKILL_CATEGORIES.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Potential Number of Openings"
                name="potentialOpenings"
                value={formData.potentialOpenings}
                onChange={handleChange}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                placeholder="Approximate number of positions"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Work Arrangements</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.workArrangements.onsite}
                        onChange={handleCheckboxChange('workArrangements', 'onsite')}
                        color="primary"
                      />
                    }
                    label="On-site"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.workArrangements.hybrid}
                        onChange={handleCheckboxChange('workArrangements', 'hybrid')}
                        color="primary"
                      />
                    }
                    label="Hybrid"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.workArrangements.remote}
                        onChange={handleCheckboxChange('workArrangements', 'remote')}
                        color="primary"
                      />
                    }
                    label="Remote"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Required Qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="Describe the qualifications and experience required for the positions"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Language Requirements</InputLabel>
                <Select
                  multiple
                  name="languageRequirements"
                  value={formData.languageRequirements}
                  onChange={handleMultiSelectChange('languageRequirements')}
                  label="Language Requirements"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {['English', 'Arabic', 'French', 'Spanish', 'Malay', 'Persian', 'Swahili', 'Other'].map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Diversity & Inclusion Section */}
      <Accordion 
        expanded={expanded === 'diversityInclusion'} 
        onChange={handleAccordionChange('diversityInclusion')}
        elevation={2}
        sx={{ 
          mb: 2, 
          borderRadius: '8px',
          '&:before': { display: 'none' },
          overflow: 'hidden'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: '#1B5A50',
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Handshake sx={{ mr: 2 }} />
          <Typography variant="h6">Diversity & Inclusion</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" required>
                <FormLabel component="legend">Does your company have a diversity and inclusion policy?</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.hasDiversityPolicy === true}
                        onChange={() => handleChange({ target: { name: 'hasDiversityPolicy', value: true } })}
                        color="primary"
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.hasDiversityPolicy === false}
                        onChange={() => handleChange({ target: { name: 'hasDiversityPolicy', value: false } })}
                        color="primary"
                      />
                    }
                    label="No"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" required>
                <FormLabel component="legend">Has your company hired refugees before?</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.previousRefugeeHiring === true}
                        onChange={() => handleChange({ target: { name: 'previousRefugeeHiring', value: true } })}
                        color="primary"
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.previousRefugeeHiring === false}
                        onChange={() => handleChange({ target: { name: 'previousRefugeeHiring', value: false } })}
                        color="primary"
                      />
                    }
                    label="No"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            
            {formData.hasDiversityPolicy && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Diversity Policy Details"
                  name="diversityPolicyDetails"
                  value={formData.diversityPolicyDetails}
                  onChange={handleChange}
                  placeholder="Please provide a brief overview of your diversity and inclusion policy"
                />
              </Grid>
            )}
            
            {formData.previousRefugeeHiring && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Previous Experience with Refugee Employment"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  placeholder="Please describe your company's experience with hiring and supporting refugee employees"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Support Systems for Diverse Employees"
                name="supportSystems"
                value={formData.supportSystems}
                onChange={handleChange}
                placeholder="Describe any support systems, mentorship programs, or accommodations your company provides to support diverse employees"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Partnership Expectations Section */}
      <Accordion 
        expanded={expanded === 'partnershipExpectations'} 
        onChange={handleAccordionChange('partnershipExpectations')}
        elevation={2}
        sx={{ 
          mb: 2, 
          borderRadius: '8px',
          '&:before': { display: 'none' },
          overflow: 'hidden'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: '#A4492A',
            color: 'white',
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'white'
            }
          }}
        >
          <Handshake sx={{ mr: 2 }} />
          <Typography variant="h6">Partnership Expectations</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Partnership Goals"
                name="partnershipGoals"
                value={formData.partnershipGoals}
                onChange={handleChange}
                placeholder="What do you hope to achieve through partnering with the Refugee Network Centre?"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hiring Timeline"
                name="hiringTimeline"
                value={formData.hiringTimeline}
                onChange={handleChange}
                placeholder="When do you anticipate being able to hire refugee talent?"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.mentorshipOpportunities}
                    onChange={(e) => handleChange({ 
                      target: { 
                        name: 'mentorshipOpportunities', 
                        value: e.target.checked 
                      } 
                    })}
                    color="primary"
                  />
                }
                label="We can provide mentorship opportunities"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Support Needed from RNC"
                name="supportNeeded"
                value={formData.supportNeeded}
                onChange={handleChange}
                placeholder="What support would you need from the Refugee Network Centre to successfully hire and integrate refugee talent?"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Information"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any other information you'd like to share about your interest in partnering with us"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Submit Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            disabled={loading}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 2,
              backgroundColor: '#2A7D6F',
              '&:hover': {
                backgroundColor: '#1B5A50',
              }
            }}
          >
            {loading ? 'Submitting...' : 'Submit Partnership Application'}
          </Button>
        </motion.div>
      </Box>
      
      {/* Success Message */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Your partnership application has been submitted successfully! Our team will contact you within 3-5 business days.
        </Alert>
      </Snackbar>
      
      {/* Error Message */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartnershipApplicationForm;
