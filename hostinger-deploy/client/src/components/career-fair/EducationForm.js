import React from 'react';
import { 
  Grid, Typography, TextField, MenuItem, Button, Box, Paper, Divider,
  FormControlLabel, Checkbox, IconButton, Accordion, AccordionSummary,
  AccordionDetails, FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Add, Delete, Edit, School, ExpandMore, Timeline, WorkspacePremium
} from '@mui/icons-material';

// Education level options
const EDUCATION_LEVELS = [
  'Primary School',
  'Secondary School',
  'High School',
  'Vocational Training',
  'Certificate',
  'Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctoral Degree',
  'Professional Degree',
  'Other'
];

const EducationForm = ({ 
  formData, 
  handleChange, 
  handleAddItem, 
  handleRemoveItem, 
  handleUpdateItem 
}) => {
  const theme = useTheme();

  // Handle adding new education entry
  const addEducation = () => {
    handleAddItem('educationHistory', { 
      institution: '', 
      degree: '', 
      fieldOfStudy: '', 
      startDate: null, 
      endDate: null, 
      current: false,
      description: '' 
    });
  };

  // Handle adding new certification
  const addCertification = () => {
    handleAddItem('certifications', { 
      name: '', 
      issuingOrganization: '', 
      issueDate: null, 
      expirationDate: null, 
      noExpiration: false,
      credentialID: '', 
      credentialURL: '' 
    });
  };

  // Handle education field updates
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.educationHistory];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    // If current is checked, clear end date
    if (field === 'current' && value === true) {
      updatedEducation[index].endDate = null;
    }
    
    handleUpdateItem('educationHistory', index, updatedEducation[index]);
  };

  // Handle certification field updates
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    
    // If no expiration is checked, clear expiration date
    if (field === 'noExpiration' && value === true) {
      updatedCertifications[index].expirationDate = null;
    }
    
    handleUpdateItem('certifications', index, updatedCertifications[index]);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        Education & Certifications
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please provide details about your educational background and any certifications or qualifications you have earned.
      </Typography>

      {/* Education History Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <School sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Education History
          </Typography>
        </Box>

        {formData.educationHistory.map((education, index) => (
          <Paper 
            key={index} 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              position: 'relative',
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              borderRadius: '4px'
            }}
          >
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleRemoveItem('educationHistory', index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              disabled={formData.educationHistory.length === 1}
            >
              <Delete />
            </IconButton>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution Name"
                  value={education.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="School or University Name"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Degree/Level"
                  value={education.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  variant="outlined"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study"
                  value={education.fieldOfStudy}
                  onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                  placeholder="e.g. Computer Science, Business, etc."
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={education.startDate || ''}
                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={education.endDate || ''}
                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  disabled={education.current}
                  helperText={education.current ? "Currently studying" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={education.current}
                      onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I am currently studying here"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={education.description}
                  onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  placeholder="Briefly describe your studies, achievements, or relevant coursework"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button 
          variant="outlined" 
          startIcon={<Add />}
          onClick={addEducation}
          sx={{ mt: 1 }}
        >
          Add Another Education
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Certifications Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkspacePremium sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Certifications & Qualifications
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Include any professional certifications, licenses, or specialized training you&apos;ve completed.
        </Typography>

        {formData.certifications.map((certification, index) => (
          <Paper 
            key={index} 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              position: 'relative',
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
              borderRadius: '4px'
            }}
          >
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleRemoveItem('certifications', index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              disabled={formData.certifications.length === 1}
            >
              <Delete />
            </IconButton>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certification Name"
                  value={certification.name}
                  onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                  placeholder="e.g. Microsoft Certified Professional, TEFL Certificate"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issuing Organization"
                  value={certification.issuingOrganization}
                  onChange={(e) => handleCertificationChange(index, 'issuingOrganization', e.target.value)}
                  placeholder="Organization that issued the certification"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  type="date"
                  value={certification.issueDate || ''}
                  onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiration Date"
                  type="date"
                  value={certification.expirationDate || ''}
                  onChange={(e) => handleCertificationChange(index, 'expirationDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  disabled={certification.noExpiration}
                  helperText={certification.noExpiration ? "No expiration date" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={certification.noExpiration}
                      onChange={(e) => handleCertificationChange(index, 'noExpiration', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="This certification does not expire"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  value={certification.credentialID}
                  onChange={(e) => handleCertificationChange(index, 'credentialID', e.target.value)}
                  placeholder="Optional: ID or reference number"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credential URL"
                  value={certification.credentialURL}
                  onChange={(e) => handleCertificationChange(index, 'credentialURL', e.target.value)}
                  placeholder="Optional: Link to verify certification"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button 
          variant="outlined" 
          startIcon={<Add />}
          onClick={addCertification}
          sx={{ mt: 1 }}
        >
          Add Another Certification
        </Button>
      </Box>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(121, 133, 78, 0.1)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Even informal education or incomplete degrees can be valuable. Include any educational experiences that have helped you develop skills relevant to your career goals.
        </Typography>
      </Box>
    </Box>
  );
};

export default EducationForm;
