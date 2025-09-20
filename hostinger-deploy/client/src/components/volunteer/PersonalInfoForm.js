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
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';

const LANGUAGES = [
  'English', 'Arabic', 'Spanish', 'French', 'Mandarin', 'Hindi', 'Bengali',
  'Portuguese', 'Russian', 'Japanese', 'German', 'Swahili', 'Urdu', 'Korean',
  'Italian', 'Turkish', 'Vietnamese', 'Tagalog', 'Thai', 'Farsi'
];

const GENDER_OPTIONS = [
  'Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'
];

const ETHNICITY_OPTIONS = [
  'Asian', 'Black/African', 'Hispanic/Latino', 'Middle Eastern', 
  'Native American/Indigenous', 'Pacific Islander', 'White/Caucasian', 
  'Mixed/Multiple ethnic groups', 'Prefer not to say', 'Other'
];

const PersonalInfoForm = ({ formData, handleChange }) => {
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleLanguagesChange = (event) => {
    const { value } = event.target;
    handleChange('languages', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Personal Information
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please provide your personal details so we can get to know you better.
      </Typography>

      <Grid container spacing={3}>
        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
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
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
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
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Zip/Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Demographic Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              label="Gender"
            >
              {GENDER_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="ethnicity-label">Ethnicity</InputLabel>
            <Select
              labelId="ethnicity-label"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleInputChange}
              label="Ethnicity"
            >
              {ETHNICITY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>This information helps us with diversity tracking</FormHelperText>
          </FormControl>
        </Grid>

        {/* Languages */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LanguageIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Languages Spoken
            </Typography>
          </Box>
          <FormControl fullWidth>
            <InputLabel id="languages-label">Select Languages</InputLabel>
            <Select
              labelId="languages-label"
              multiple
              value={formData.languages}
              onChange={handleLanguagesChange}
              input={<OutlinedInput label="Select Languages" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
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
            <FormHelperText>Select all languages you can speak fluently</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoForm;
