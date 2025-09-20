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
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpIcon from '@mui/icons-material/Help';

const CONTRIBUTION_AREAS = [
  'Education & Tutoring',
  'Language Support & Translation',
  'Job Readiness & Career Mentoring',
  'Community Events & Outreach',
  'Administration & Office Support',
  'IT & Technical Support',
  'Fundraising & Grant Writing',
  'Legal Support & Advocacy',
  'Healthcare & Wellness',
  'Arts & Culture Programs',
  'Youth Mentoring & Activities',
  'Women\'s Empowerment Programs',
  'Food Security & Distribution',
  'Housing & Settlement Support',
  'Transportation Assistance',
  'Marketing & Communications',
  'Social Media & Digital Content',
  'Research & Data Analysis',
  'Leadership & Board Participation',
  'Other'
];

const AVAILABILITY_OPTIONS = [
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'Quarterly',
  'For special events only',
  'Flexible/As needed'
];

const TIME_SLOTS = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekend mornings',
  'Weekend afternoons',
  'Weekend evenings',
  'Remote/Any time'
];

const REFERRAL_SOURCES = [
  'Friend/Family',
  'Current Volunteer',
  'Social Media',
  'Website',
  'Community Event',
  'School/University',
  'Workplace',
  'Religious Organization',
  'News/Media',
  'Online Search',
  'Other'
];

const ContributionForm = ({ formData, handleChange }) => {
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleAreasChange = (event) => {
    const { value } = event.target;
    handleChange('areasOfInterest', typeof value === 'string' ? value.split(',') : value);
  };

  const handleTimesChange = (event) => {
    const { value } = event.target;
    handleChange('availabilityTimes', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <VolunteerActivismIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Areas of Contribution
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please tell us how you would like to contribute to the Refugee Network Centre and your availability.
      </Typography>

      {/* Areas of Interest */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Areas of Interest
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the areas where you would like to contribute your time and skills:
        </Typography>
        
        <FormControl fullWidth>
          <InputLabel id="areas-label">Areas of Interest</InputLabel>
          <Select
            labelId="areas-label"
            multiple
            name="areasOfInterest"
            value={formData.areasOfInterest}
            onChange={handleAreasChange}
            input={<OutlinedInput label="Areas of Interest" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {CONTRIBUTION_AREAS.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select all areas that interest you</FormHelperText>
        </FormControl>
      </Paper>

      {/* Availability */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Availability
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="frequency-label">How often can you volunteer?</InputLabel>
              <Select
                labelId="frequency-label"
                name="availabilityFrequency"
                value={formData.availabilityFrequency}
                onChange={handleInputChange}
                label="How often can you volunteer?"
              >
                {AVAILABILITY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preferred Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              helperText="When would you like to start volunteering?"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="times-label">Preferred Time Slots</InputLabel>
              <Select
                labelId="times-label"
                multiple
                name="availabilityTimes"
                value={formData.availabilityTimes}
                onChange={handleTimesChange}
                input={<OutlinedInput label="Preferred Time Slots" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {TIME_SLOTS.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select all time slots when you&apos;re typically available</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Motivation & Additional Info */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HelpIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Motivation & Additional Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Why do you want to volunteer with the Refugee Network Centre?"
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              placeholder="Please share your motivation for volunteering with us and what you hope to achieve or contribute."
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="heard-about-label">How did you hear about us?</InputLabel>
              <Select
                labelId="heard-about-label"
                name="heardAbout"
                value={formData.heardAbout}
                onChange={handleInputChange}
                label="How did you hear about us?"
              >
                {REFERRAL_SOURCES.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Information"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Is there anything else you would like to share with us about your interest in volunteering?"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(42, 125, 111, 0.1)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> By submitting this application, you agree to be contacted by our Volunteer Coordinator for further discussion about volunteer opportunities that match your skills and interests. All information provided will be kept confidential and used only for volunteer placement purposes.
        </Typography>
      </Box>
    </Box>
  );
};

export default ContributionForm;
