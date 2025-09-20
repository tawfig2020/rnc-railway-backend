import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const DEGREE_LEVELS = [
  'High School Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctoral Degree',
  'Professional Degree',
  'Vocational Training',
  'Other'
];

const CERTIFICATION_EXAMPLES = [
  'Teaching Certification',
  'First Aid/CPR',
  'Project Management',
  'Language Proficiency',
  'Social Work',
  'Counseling',
  'IT Certifications',
  'Healthcare Certifications',
  'Nonprofit Management',
  'Other'
];

const EducationForm = ({ formData, handleChange }) => {
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleCertificationsChange = (event) => {
    const { value } = event.target;
    handleChange('certifications', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Education Background
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please provide information about your educational background and qualifications.
      </Typography>

      <Grid container spacing={3}>
        {/* Highest Degree */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="highest-degree-label">Highest Degree</InputLabel>
            <Select
              labelId="highest-degree-label"
              name="highestDegree"
              value={formData.highestDegree}
              onChange={handleInputChange}
              label="Highest Degree"
            >
              {DEGREE_LEVELS.map((degree) => (
                <MenuItem key={degree} value={degree}>
                  {degree}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Field of Study */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Field of Study"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder="E.g., Computer Science, Social Work, Education"
          />
        </Grid>

        {/* Institution */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Institution Name"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            placeholder="Name of school, college, or university"
          />
        </Grid>

        {/* Graduation Year */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Graduation Year"
            name="graduationYear"
            type="number"
            value={formData.graduationYear}
            onChange={handleInputChange}
            placeholder="YYYY"
            inputProps={{ min: 1950, max: new Date().getFullYear() }}
          />
        </Grid>

        {/* Certifications */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WorkspacePremiumIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Certifications & Professional Qualifications
            </Typography>
          </Box>
          <FormControl fullWidth>
            <InputLabel id="certifications-label">Relevant Certifications</InputLabel>
            <Select
              labelId="certifications-label"
              multiple
              name="certifications"
              value={formData.certifications}
              onChange={handleCertificationsChange}
              input={<OutlinedInput label="Relevant Certifications" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {CERTIFICATION_EXAMPLES.map((cert) => (
                <MenuItem key={cert} value={cert}>
                  {cert}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select all relevant certifications you currently hold</FormHelperText>
          </FormControl>
        </Grid>

        {/* Additional Training */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Training & Education"
            name="additionalTraining"
            value={formData.additionalTraining}
            onChange={handleInputChange}
            placeholder="Please describe any additional training, workshops, or educational experiences relevant to volunteering with refugees and newcomers."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EducationForm;
