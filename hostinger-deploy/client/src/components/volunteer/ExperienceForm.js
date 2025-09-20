import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const ExperienceForm = ({ formData, handleChange }) => {
  const theme = useTheme();
  const [newVolunteerExp, setNewVolunteerExp] = useState({
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [newWorkExp, setNewWorkExp] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    relevantSkills: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleVolunteerExpChange = (e) => {
    const { name, value } = e.target;
    setNewVolunteerExp({
      ...newVolunteerExp,
      [name]: value
    });
  };

  const handleWorkExpChange = (e) => {
    const { name, value } = e.target;
    setNewWorkExp({
      ...newWorkExp,
      [name]: value
    });
  };

  const addVolunteerExperience = () => {
    // Validate required fields
    if (!newVolunteerExp.organization || !newVolunteerExp.role) return;
    
    const updatedExperiences = [...formData.volunteerExperience, { ...newVolunteerExp, id: Date.now() }];
    handleChange('volunteerExperience', updatedExperiences);
    
    // Reset form
    setNewVolunteerExp({
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const addWorkExperience = () => {
    // Validate required fields
    if (!newWorkExp.company || !newWorkExp.position) return;
    
    const updatedExperiences = [...formData.relevantWorkExperience, { ...newWorkExp, id: Date.now() }];
    handleChange('relevantWorkExperience', updatedExperiences);
    
    // Reset form
    setNewWorkExp({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      relevantSkills: ''
    });
  };

  const removeVolunteerExperience = (id) => {
    const updatedExperiences = formData.volunteerExperience.filter(exp => exp.id !== id);
    handleChange('volunteerExperience', updatedExperiences);
  };

  const removeWorkExperience = (id) => {
    const updatedExperiences = formData.relevantWorkExperience.filter(exp => exp.id !== id);
    handleChange('relevantWorkExperience', updatedExperiences);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <HistoryIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Past Experience
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please tell us about your previous volunteer and relevant work experiences.
      </Typography>

      {/* Volunteer Experience Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VolunteerActivismIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Previous Volunteer Experience
          </Typography>
        </Box>

        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization Name"
                name="organization"
                value={newVolunteerExp.organization}
                onChange={handleVolunteerExpChange}
                placeholder="Organization you volunteered with"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role/Position"
                name="role"
                value={newVolunteerExp.role}
                onChange={handleVolunteerExpChange}
                placeholder="Your role as a volunteer"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="month"
                value={newVolunteerExp.startDate}
                onChange={handleVolunteerExpChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="month"
                value={newVolunteerExp.endDate}
                onChange={handleVolunteerExpChange}
                InputLabelProps={{ shrink: true }}
                placeholder="Leave blank if current"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description of Duties"
                name="description"
                value={newVolunteerExp.description}
                onChange={handleVolunteerExpChange}
                placeholder="Briefly describe your responsibilities and achievements"
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<AddIcon />}
                onClick={addVolunteerExperience}
              >
                Add Experience
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Display added volunteer experiences */}
        {formData.volunteerExperience.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Added Volunteer Experiences:
            </Typography>
            <List>
              {formData.volunteerExperience.map((exp) => (
                <Paper key={exp.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {exp.organization} - {exp.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.startDate} to {exp.endDate || 'Present'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {exp.description}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removeVolunteerExperience(exp.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </List>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Work Experience Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkHistoryIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Relevant Work Experience
          </Typography>
        </Box>

        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company/Organization"
                name="company"
                value={newWorkExp.company}
                onChange={handleWorkExpChange}
                placeholder="Where you worked"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={newWorkExp.position}
                onChange={handleWorkExpChange}
                placeholder="Your job title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="month"
                value={newWorkExp.startDate}
                onChange={handleWorkExpChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="month"
                value={newWorkExp.endDate}
                onChange={handleWorkExpChange}
                InputLabelProps={{ shrink: true }}
                placeholder="Leave blank if current"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Relevant Skills & Experience"
                name="relevantSkills"
                value={newWorkExp.relevantSkills}
                onChange={handleWorkExpChange}
                placeholder="Describe skills and experiences relevant to volunteering with refugees"
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<AddIcon />}
                onClick={addWorkExperience}
              >
                Add Work Experience
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Display added work experiences */}
        {formData.relevantWorkExperience.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Added Work Experiences:
            </Typography>
            <List>
              {formData.relevantWorkExperience.map((exp) => (
                <Paper key={exp.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {exp.company} - {exp.position}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.startDate} to {exp.endDate || 'Present'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {exp.relevantSkills}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removeWorkExperience(exp.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Community Involvement */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Community Involvement
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Community Activities & Involvement"
          name="communityInvolvement"
          value={formData.communityInvolvement}
          onChange={handleInputChange}
          placeholder="Please describe any community activities, leadership roles, or other involvement that demonstrates your commitment to community service."
        />
      </Box>
    </Box>
  );
};

export default ExperienceForm;
