import React, { useState } from 'react';
import { 
  Grid, Typography, TextField, Box, Paper, Divider,
  FormControlLabel, Checkbox, Button, Chip, Autocomplete,
  FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  CloudUpload, Delete, Lightbulb, WorkOutline, Business, AttachMoney, Link
} from '@mui/icons-material';

// Industry options
const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Food Service',
  'Transportation',
  'Construction',
  'Finance',
  'Professional Services',
  'Government',
  'Non-Profit',
  'Arts & Entertainment',
  'Media & Communications',
  'Agriculture',
  'Energy',
  'Real Estate',
  'Automotive',
  'Telecommunications'
];

// Roles categories
const ROLE_CATEGORIES = [
  'Administrative',
  'Customer Service',
  'Sales & Marketing',
  'Technology & IT',
  'Education & Training',
  'Healthcare',
  'Food Service',
  'Skilled Trades',
  'Manufacturing',
  'Transportation',
  'Management',
  'Finance & Accounting',
  'Creative & Design',
  'Social Services',
  'Legal',
  'Human Resources',
  'Logistics & Warehouse',
  'Research & Development'
];

const CareerGoalsForm = ({ formData, handleChange, handleFileUpload }) => {
  const theme = useTheme();

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(null, name, value);
  };

  // Handle industry selection
  const handleIndustryChange = (event, newValue) => {
    handleChange(null, 'desiredIndustry', newValue);
  };

  // Handle work preference checkboxes
  const handleWorkPreferenceChange = (preference) => (event) => {
    handleChange('workPreferences', preference, event.target.checked);
  };

  // Handle resume upload
  const handleResumeUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleFileUpload('resume', event.target.files[0]);
    }
  };

  // Handle cover letter upload
  const handleCoverLetterUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleFileUpload('coverLetter', event.target.files[0]);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (field) => {
    handleFileUpload(field, null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        Career Goals & Preferences
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please share your career aspirations and preferences. This helps us connect you with employers and opportunities that align with your goals.
      </Typography>

      {/* Career Aspirations Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Lightbulb sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Career Aspirations
          </Typography>
        </Box>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: '4px'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Desired Role Category</InputLabel>
                <Select
                  name="desiredRole"
                  value={formData.desiredRole}
                  onChange={handleInputChange}
                  label="Desired Role Category"
                >
                  {ROLE_CATEGORIES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                id="industry-selector"
                options={INDUSTRIES}
                value={formData.desiredIndustry}
                onChange={handleIndustryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Desired Industries"
                    placeholder="Select industries"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      key={index}
                      label={option} 
                      {...getTagProps({ index })} 
                      sx={{ 
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText
                      }}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="careerObjective"
                label="Career Objective"
                value={formData.careerObjective}
                onChange={handleInputChange}
                placeholder="Describe your career goals and what you hope to achieve professionally in the short and long term."
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="salaryExpectations"
                label="Salary Expectations"
                value={formData.salaryExpectations}
                onChange={handleInputChange}
                placeholder="e.g. MYR 2,500 - 3,500 per month"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />
                  )
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Work Preferences Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkOutline sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Work Preferences
          </Typography>
        </Box>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: '4px'
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            What types of work arrangements are you interested in? (Select all that apply)
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.workPreferences.fullTime}
                    onChange={handleWorkPreferenceChange('fullTime')}
                    color="primary"
                  />
                }
                label="Full-time Employment"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.workPreferences.partTime}
                    onChange={handleWorkPreferenceChange('partTime')}
                    color="primary"
                  />
                }
                label="Part-time Employment"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.workPreferences.contract}
                    onChange={handleWorkPreferenceChange('contract')}
                    color="primary"
                  />
                }
                label="Contract/Temporary"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.workPreferences.internship}
                    onChange={handleWorkPreferenceChange('internship')}
                    color="primary"
                  />
                }
                label="Internship/Trainee"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.workPreferences.remoteWork}
                    onChange={handleWorkPreferenceChange('remoteWork')}
                    color="primary"
                  />
                }
                label="Remote Work"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.workPreferences.relocation}
                    onChange={handleWorkPreferenceChange('relocation')}
                    color="primary"
                  />
                }
                label="Willing to Relocate"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Professional Documents Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Business sx={{ color: theme.palette.success.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Professional Documents & Links
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Upload your resume/CV and any other relevant documents. You can also provide links to your portfolio or professional profiles.
        </Typography>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: '4px'
          }}
        >
          <Grid container spacing={3}>
            {/* Resume Upload */}
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                {formData.resume ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Resume Uploaded
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.resume.name}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveFile('resume')}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <Delete />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Upload Resume/CV
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      PDF or Word Document (Max 5MB)
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Select File
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                      />
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            
            {/* Cover Letter Upload */}
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                {formData.coverLetter ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Cover Letter Uploaded
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.coverLetter.name}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveFile('coverLetter')}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <Delete />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Upload Cover Letter (Optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      PDF or Word Document (Max 5MB)
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Select File
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleCoverLetterUpload}
                      />
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            
            {/* Professional Links */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Professional Links (Optional)
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="portfolio"
                label="Portfolio/Website"
                value={formData.portfolio}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Link sx={{ color: 'text.secondary', mr: 1 }} />
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="linkedin"
                label="LinkedIn Profile"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Link sx={{ color: 'text.secondary', mr: 1 }} />
                  )
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(42, 125, 111, 0.08)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> If you don&apos;t have a resume or cover letter prepared, don&apos;t worry! The Refugee Network Centre offers resume writing workshops and can help you prepare these documents before the Career Fair. Check our Events calendar for upcoming workshops.
        </Typography>
      </Box>
    </Box>
  );
};

export default CareerGoalsForm;
