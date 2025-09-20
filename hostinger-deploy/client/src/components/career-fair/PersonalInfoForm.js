import React from 'react';
import { 
  Grid, Typography, TextField, MenuItem, FormControl, 
  InputLabel, Select, Box, Chip, OutlinedInput, Button,
  FormHelperText, Divider, Avatar, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CloudUpload, Delete, Person } from '@mui/icons-material';

// Language options based on Refugee Network Centre's supported languages
const LANGUAGES = [
  'English',
  'Arabic',
  'French',
  'Spanish',
  'Persian',
  'Swahili',
  'Urdu',
  'Somali',
  'Burmese',
  'Kurdish',
  'Dari',
  'Pashto',
  'Tamil',
  'Mandarin',
  'Bengali'
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const PersonalInfoForm = ({ formData, handleChange, handleFileUpload }) => {
  const theme = useTheme();

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(null, name, value);
  };

  // Handle multiple language selection
  const handleLanguageChange = (event) => {
    const { value } = event.target;
    handleChange(null, 'languages', value);
  };

  // Handle profile photo upload
  const handlePhotoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleFileUpload('profilePhoto', event.target.files[0]);
    }
  };

  // Remove profile photo
  const handleRemovePhoto = () => {
    handleFileUpload('profilePhoto', null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        Personal Information
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please provide your personal details. This information helps employers identify and contact you.
      </Typography>

      {/* Profile Photo Upload */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : ''}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            bgcolor: theme.palette.primary.light,
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {!formData.profilePhoto && <Person sx={{ fontSize: 60 }} />}
        </Avatar>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            size="small"
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoUpload}
            />
          </Button>
          
          {formData.profilePhoto && (
            <IconButton 
              color="error" 
              onClick={handleRemovePhoto}
              size="small"
            >
              <Delete />
            </IconButton>
          )}
        </Box>
        <FormHelperText>A professional photo helps employers recognize you during the fair</FormHelperText>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="outlined"
            helperText="This will be our primary way to contact you"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            variant="outlined"
            placeholder="e.g. +60 12-345 6789"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              label="Gender"
            >
              {GENDER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 500 }}>
            Address Information
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 500 }}>
            Language Proficiency
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Languages Spoken</InputLabel>
            <Select
              multiple
              name="languages"
              value={formData.languages}
              onChange={handleLanguageChange}
              input={<OutlinedInput label="Languages Spoken" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {LANGUAGES.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select all languages you speak</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(211, 97, 53, 0.1)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Privacy Note:</strong> Your personal information will be kept confidential and only shared with employers at the Career Fair with your explicit consent. For more information, please refer to our Privacy Policy.
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonalInfoForm;
