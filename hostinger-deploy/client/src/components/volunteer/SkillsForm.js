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
  Slider,
  Rating
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BuildIcon from '@mui/icons-material/Build';
import WorkIcon from '@mui/icons-material/Work';
import ComputerIcon from '@mui/icons-material/Computer';

const SKILL_CATEGORIES = [
  'Teaching/Tutoring',
  'Translation/Interpretation',
  'Administrative/Clerical',
  'Event Planning',
  'Fundraising',
  'Counseling/Mentoring',
  'Healthcare/Medical',
  'Legal Assistance',
  'Marketing/Communications',
  'IT/Technical Support',
  'Arts/Creative',
  'Research/Data Analysis',
  'Leadership/Management',
  'Cooking/Food Preparation',
  'Transportation/Driving',
  'Childcare',
  'Construction/Maintenance',
  'Financial/Accounting',
  'Outreach/Community Engagement',
  'Other'
];

const COMPUTER_SKILLS = [
  'Microsoft Office Suite',
  'Google Workspace',
  'Database Management',
  'Social Media',
  'Graphic Design',
  'Web Development',
  'Programming/Coding',
  'Data Analysis',
  'Video Editing',
  'CRM Systems',
  'Virtual Meeting Platforms',
  'Email Marketing',
  'Content Management Systems',
  'Other'
];

const LANGUAGE_PROFICIENCY = [
  'Basic',
  'Conversational',
  'Professional',
  'Fluent',
  'Native/Bilingual'
];

const SkillsForm = ({ formData, handleChange }) => {
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSkillsChange = (event) => {
    const { value } = event.target;
    handleChange('skillsList', typeof value === 'string' ? value.split(',') : value);
  };

  const handleComputerSkillsChange = (event) => {
    const { value } = event.target;
    handleChange('computerSkills', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BuildIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 28 }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Skills & Profession
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please tell us about your professional background and skills that could benefit our organization.
      </Typography>

      <Grid container spacing={3}>
        {/* Professional Background */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Professional Background
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Current Profession"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            placeholder="E.g., Teacher, Engineer, Student"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Current Employer"
            name="currentEmployer"
            value={formData.currentEmployer}
            onChange={handleInputChange}
            placeholder="Company or organization name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Years of Experience"
            name="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={handleInputChange}
            inputProps={{ min: 0, max: 70 }}
          />
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Skills & Expertise
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select skills you can contribute to our organization
            </Typography>
          </Box>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="skills-label">Skills</InputLabel>
            <Select
              labelId="skills-label"
              multiple
              name="skillsList"
              value={formData.skillsList}
              onChange={handleSkillsChange}
              input={<OutlinedInput label="Skills" />}
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

        {/* Computer Skills */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
            <ComputerIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Computer & Technical Skills
            </Typography>
          </Box>
          
          <FormControl fullWidth>
            <InputLabel id="computer-skills-label">Computer Skills</InputLabel>
            <Select
              labelId="computer-skills-label"
              multiple
              name="computerSkills"
              value={formData.computerSkills}
              onChange={handleComputerSkillsChange}
              input={<OutlinedInput label="Computer Skills" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {COMPUTER_SKILLS.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select all technical skills you possess</FormHelperText>
          </FormControl>
        </Grid>

        {/* Language Skills - We'll use a more detailed approach for language proficiency */}
        <Grid item xs={12}>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Language Proficiency Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              For each language you speak, please rate your proficiency level
            </Typography>
          </Box>
          
          {/* This would typically be a dynamic form where users can add languages and rate proficiency */}
          {/* For simplicity, we'll just include a text field for now */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Language Skills Details"
            name="languageSkills"
            value={formData.languageSkills}
            onChange={handleInputChange}
            placeholder="Example: English (Native), Spanish (Professional), Arabic (Conversational)"
            helperText="Please list languages and your proficiency level"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillsForm;
