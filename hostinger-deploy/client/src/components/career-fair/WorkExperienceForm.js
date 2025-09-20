import React from 'react';
import { 
  Grid, Typography, TextField, Box, Paper, Divider,
  FormControlLabel, Checkbox, IconButton, FormHelperText,
  Button, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Add, Delete, Work, VolunteerActivism, EmojiPeople, BusinessCenter
} from '@mui/icons-material';

const WorkExperienceForm = ({ 
  formData, 
  handleChange, 
  handleAddItem, 
  handleRemoveItem, 
  handleUpdateItem 
}) => {
  const theme = useTheme();

  // Handle adding new work experience
  const addWorkExperience = () => {
    handleAddItem('workExperience', {
      title: '',
      company: '',
      location: '',
      startDate: null,
      endDate: null,
      current: false,
      description: '',
      responsibilities: '',
      achievements: ''
    });
  };

  // Handle adding new volunteer experience
  const addVolunteerExperience = () => {
    handleAddItem('volunteerExperience', {
      role: '',
      organization: '',
      startDate: null,
      endDate: null,
      current: false,
      description: ''
    });
  };

  // Handle work experience field updates
  const handleWorkChange = (index, field, value) => {
    const updatedWork = [...formData.workExperience];
    updatedWork[index] = {
      ...updatedWork[index],
      [field]: value
    };
    
    // If current is checked, clear end date
    if (field === 'current' && value === true) {
      updatedWork[index].endDate = null;
    }
    
    handleUpdateItem('workExperience', index, updatedWork[index]);
  };

  // Handle volunteer experience field updates
  const handleVolunteerChange = (index, field, value) => {
    const updatedVolunteer = [...formData.volunteerExperience];
    updatedVolunteer[index] = {
      ...updatedVolunteer[index],
      [field]: value
    };
    
    // If current is checked, clear end date
    if (field === 'current' && value === true) {
      updatedVolunteer[index].endDate = null;
    }
    
    handleUpdateItem('volunteerExperience', index, updatedVolunteer[index]);
  };

  // Handle informal experience field update
  const handleInformalChange = (e) => {
    handleChange(null, 'informalExperience', e.target.value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        Work Experience
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please provide details about your professional background, including any formal employment, volunteer work, or informal experience.
      </Typography>

      {/* Formal Work Experience Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessCenter sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Formal Work Experience
          </Typography>
        </Box>

        {formData.workExperience.map((job, index) => (
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
              onClick={() => handleRemoveItem('workExperience', index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              disabled={formData.workExperience.length === 1}
            >
              <Delete />
            </IconButton>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={job.title}
                  onChange={(e) => handleWorkChange(index, 'title', e.target.value)}
                  placeholder="e.g. Teacher, Accountant, Chef"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company/Employer"
                  value={job.company}
                  onChange={(e) => handleWorkChange(index, 'company', e.target.value)}
                  placeholder="Name of the company or organization"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={job.location}
                  onChange={(e) => handleWorkChange(index, 'location', e.target.value)}
                  placeholder="City, Country"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={job.startDate || ''}
                  onChange={(e) => handleWorkChange(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={job.endDate || ''}
                  onChange={(e) => handleWorkChange(index, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  disabled={job.current}
                  helperText={job.current ? "Currently working here" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={job.current}
                      onChange={(e) => handleWorkChange(index, 'current', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I currently work here"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Job Description"
                  value={job.description}
                  onChange={(e) => handleWorkChange(index, 'description', e.target.value)}
                  placeholder="Briefly describe your role and responsibilities"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Key Responsibilities"
                  value={job.responsibilities}
                  onChange={(e) => handleWorkChange(index, 'responsibilities', e.target.value)}
                  placeholder="List your main duties and responsibilities"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Achievements"
                  value={job.achievements}
                  onChange={(e) => handleWorkChange(index, 'achievements', e.target.value)}
                  placeholder="Highlight your accomplishments and contributions"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button 
          variant="outlined" 
          startIcon={<Add />}
          onClick={addWorkExperience}
          sx={{ mt: 1 }}
        >
          Add Another Job
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Volunteer Experience Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VolunteerActivism sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Volunteer Experience
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Include any volunteer work, community service, or unpaid positions that demonstrate your skills and experience.
        </Typography>

        {formData.volunteerExperience.map((volunteer, index) => (
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
              onClick={() => handleRemoveItem('volunteerExperience', index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              disabled={formData.volunteerExperience.length === 1}
            >
              <Delete />
            </IconButton>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role/Position"
                  value={volunteer.role}
                  onChange={(e) => handleVolunteerChange(index, 'role', e.target.value)}
                  placeholder="e.g. Volunteer Teacher, Community Organizer"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  value={volunteer.organization}
                  onChange={(e) => handleVolunteerChange(index, 'organization', e.target.value)}
                  placeholder="Name of the organization"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={volunteer.startDate || ''}
                  onChange={(e) => handleVolunteerChange(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={volunteer.endDate || ''}
                  onChange={(e) => handleVolunteerChange(index, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  disabled={volunteer.current}
                  helperText={volunteer.current ? "Currently volunteering here" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={volunteer.current}
                      onChange={(e) => handleVolunteerChange(index, 'current', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I currently volunteer here"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={volunteer.description}
                  onChange={(e) => handleVolunteerChange(index, 'description', e.target.value)}
                  placeholder="Describe your volunteer activities, responsibilities, and impact"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button 
          variant="outlined" 
          startIcon={<Add />}
          onClick={addVolunteerExperience}
          sx={{ mt: 1 }}
        >
          Add Volunteer Experience
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Informal Experience Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiPeople sx={{ color: theme.palette.success.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Informal Experience & Skills
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Please describe any informal work experience, family responsibilities, or skills you&apos;ve developed outside of formal employment. This could include home-based businesses, caregiving, community leadership roles, or self-taught skills.
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={5}
          label="Informal Experience"
          value={formData.informalExperience}
          onChange={handleInformalChange}
          placeholder="Examples: Running a small home business, organizing community events, caregiving for family members, teaching others, repairing items in your community, crafting, cooking, etc."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        <FormHelperText>
          Many valuable skills are developed through informal activities. This information helps employers understand your full range of capabilities.
        </FormHelperText>
      </Box>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(42, 125, 111, 0.08)', borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
          Important Note for Refugee Job Seekers
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          We understand that you may have work experience from your home country that is difficult to document or verify. Please include all relevant experience even if you don&apos;t have formal documentation.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Employers at our Career Fair value transferable skills and diverse experiences. Focus on describing what you did, the skills you used, and the results you achieved.
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkExperienceForm;
