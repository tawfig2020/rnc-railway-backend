import React, { useState } from 'react';
import { 
  Grid, Typography, TextField, Box, Paper, Divider,
  Slider, Button, Chip, IconButton, FormHelperText,
  Rating, FormControl, InputLabel, Select, MenuItem,
  OutlinedInput, Autocomplete
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Add, Delete, Psychology, Code, Translate, Star, StarBorder
} from '@mui/icons-material';

// Common technical skills categories
const TECHNICAL_SKILL_CATEGORIES = [
  'Computer & IT',
  'Office Software',
  'Trades & Crafts',
  'Culinary Arts',
  'Healthcare',
  'Education',
  'Languages',
  'Arts & Design',
  'Finance & Accounting',
  'Sales & Marketing',
  'Customer Service',
  'Mechanical',
  'Logistics & Transport',
  'Agriculture',
  'Construction',
  'Manufacturing',
  'Social Services'
];

// Common technical skills
const COMMON_TECH_SKILLS = [
  // Computer & IT
  'Microsoft Office', 'Google Workspace', 'Data Entry', 'Email Management',
  'Web Browsing', 'Social Media', 'Basic Computer Troubleshooting',
  'Word Processing', 'Spreadsheets', 'Presentations', 'Database Management',
  'Programming', 'Web Development', 'Graphic Design', 'Video Editing',
  'Photo Editing', 'Computer Networking', 'IT Support', 'System Administration',
  
  // Trades & Crafts
  'Carpentry', 'Plumbing', 'Electrical Work', 'Welding', 'Masonry', 
  'Painting', 'Tailoring', 'Sewing', 'Knitting', 'Weaving', 'Crafting',
  'Jewelry Making', 'Leatherwork', 'Pottery', 'Woodworking',
  
  // Culinary
  'Cooking', 'Baking', 'Food Preparation', 'Food Safety', 'Menu Planning',
  'Catering', 'Specialty Cuisine', 'Barista Skills', 'Food Service',
  
  // Administrative
  'Filing', 'Scheduling', 'Reception', 'Customer Service', 'Inventory Management',
  'Record Keeping', 'Bookkeeping', 'Event Planning', 'Project Management',
  
  // Healthcare
  'First Aid', 'CPR', 'Patient Care', 'Medical Terminology', 'Elderly Care',
  'Childcare', 'Healthcare Administration',
  
  // Education
  'Teaching', 'Tutoring', 'Curriculum Development', 'Training', 'Mentoring',
  'Language Instruction', 'Childcare',
  
  // Other
  'Driving', 'Translation', 'Interpretation', 'Public Speaking', 'Sales',
  'Marketing', 'Customer Relations', 'Negotiation', 'Conflict Resolution',
  'Research', 'Writing', 'Editing', 'Proofreading', 'Logistics', 'Warehousing'
];

// Language proficiency levels
const PROFICIENCY_LEVELS = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
  { value: 4, label: 'Fluent' },
  { value: 5, label: 'Native' }
];

// Soft skills with descriptions
const SOFT_SKILLS = {
  communication: 'Ability to convey information clearly and effectively',
  teamwork: 'Ability to work collaboratively with others toward common goals',
  problemSolving: 'Ability to identify issues and develop effective solutions',
  adaptability: 'Ability to adjust to new conditions and environments',
  timeManagement: 'Ability to use time effectively and prioritize tasks',
  leadership: 'Ability to guide, motivate, and influence others',
  criticalThinking: 'Ability to analyze information objectively and make reasoned judgments',
  conflictResolution: 'Ability to resolve disagreements and find compromises',
  creativity: 'Ability to think of new ideas and approaches to problems',
  emotionalIntelligence: 'Ability to understand and manage emotions in self and others'
};

// Common languages
const LANGUAGES = [
  'English',
  'Arabic',
  'French',
  'Spanish',
  'Mandarin',
  'Russian',
  'Urdu',
  'Hindi',
  'Bengali',
  'Portuguese',
  'Swahili',
  'Turkish',
  'Farsi',
  'Kurdish',
  'Somali',
  'Pashto',
  'Dari',
  'Tigrinya',
  'Amharic',
  'Ukrainian',
  'German',
  'Italian',
  'Other'
];

const SkillsAssessmentForm = ({ 
  formData, 
  handleChange, 
  handleAddItem, 
  handleRemoveItem, 
  handleUpdateItem 
}) => {
  const theme = useTheme();
  const [customSkill, setCustomSkill] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('');
  const [customSkillLevel, setCustomSkillLevel] = useState(3);
  
  // Handle soft skills rating change
  const handleSoftSkillChange = (skill, value) => {
    handleChange('softSkills', skill, value);
  };
  
  // Handle adding a technical skill
  const handleAddTechnicalSkill = (skill) => {
    if (!formData.technicalSkills.some(s => s.skill === skill)) {
      handleAddItem('technicalSkills', { 
        skill, 
        level: 3, 
        yearsExperience: '', 
        notes: '' 
      });
    }
  };
  
  // Handle updating a technical skill
  const handleTechnicalSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.technicalSkills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    handleUpdateItem('technicalSkills', index, updatedSkills[index]);
  };
  
  // Handle adding a custom skill
  const handleAddCustomSkill = () => {
    if (customSkill && customSkillCategory && !formData.customSkills.some(s => s.skill === customSkill)) {
      handleAddItem('customSkills', { 
        skill: customSkill, 
        category: customSkillCategory,
        level: customSkillLevel
      });
      setCustomSkill('');
      setCustomSkillCategory('');
      setCustomSkillLevel(3);
    }
  };
  
  // Handle adding a language proficiency entry
  const handleAddLanguage = () => {
    handleAddItem('languageProficiency', { 
      language: '', 
      speaking: 0, 
      writing: 0, 
      reading: 0, 
      listening: 0 
    });
  };
  
  // Handle language proficiency updates
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...formData.languageProficiency];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    handleUpdateItem('languageProficiency', index, updatedLanguages[index]);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        Skills Assessment
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Please assess your skills in various areas. This helps us match you with opportunities that align with your strengths.
      </Typography>

      {/* Soft Skills Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Psychology sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Soft Skills Assessment
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Rate your soft skills on a scale of 1-5, where 1 is beginning level and 5 is expert level.
        </Typography>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: '4px'
          }}
        >
          <Grid container spacing={3}>
            {Object.entries(SOFT_SKILLS).map(([skill, description]) => (
              <Grid item xs={12} key={skill}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                      {skill.replace(/([A-Z])/g, ' $1')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.softSkills[skill] === 0 ? 'Not Rated' : 
                       formData.softSkills[skill] === 1 ? 'Beginning' : 
                       formData.softSkills[skill] === 2 ? 'Basic' : 
                       formData.softSkills[skill] === 3 ? 'Intermediate' : 
                       formData.softSkills[skill] === 4 ? 'Advanced' : 'Expert'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {description}
                  </Typography>
                  <Rating
                    name={`soft-skill-${skill}`}
                    value={formData.softSkills[skill]}
                    onChange={(event, newValue) => {
                      handleSoftSkillChange(skill, newValue);
                    }}
                    max={5}
                    sx={{ color: theme.palette.primary.main }}
                    emptyIcon={<StarBorder fontSize="inherit" />}
                  />
                  <Divider sx={{ mt: 2 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Technical Skills Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Code sx={{ color: theme.palette.secondary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Technical & Practical Skills
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Select skills that you possess from the list below or add your own. For each skill, indicate your proficiency level.
        </Typography>

        {/* Skill selector */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: '4px'
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
            Add Skills from Common Categories
          </Typography>
          
          <Autocomplete
            multiple
            id="technical-skills-selector"
            options={COMMON_TECH_SKILLS}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select or type skills"
                placeholder="Search for skills"
                fullWidth
              />
            )}
            onChange={(event, newValue) => {
              // Find skills that were just added
              const newSkills = newValue.filter(
                skill => !formData.technicalSkills.some(s => s.skill === skill)
              );
              
              // Add each new skill
              newSkills.forEach(skill => {
                handleAddTechnicalSkill(skill);
              });
            }}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mt: 3 }}>
            Add Your Own Skills
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Skill Name"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="e.g. Catering, Floral Arrangement"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={customSkillCategory}
                  onChange={(e) => setCustomSkillCategory(e.target.value)}
                  label="Category"
                >
                  {TECHNICAL_SKILL_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box sx={{ width: '100%' }}>
                <Typography id="skill-level-slider" gutterBottom>
                  Proficiency Level: {
                    customSkillLevel === 1 ? 'Basic' : 
                    customSkillLevel === 2 ? 'Intermediate' : 
                    customSkillLevel === 3 ? 'Advanced' : 
                    customSkillLevel === 4 ? 'Expert' : 
                    customSkillLevel === 5 ? 'Master' : 'None'
                  }
                </Typography>
                <Slider
                  value={customSkillLevel}
                  onChange={(e, newValue) => setCustomSkillLevel(newValue)}
                  aria-labelledby="skill-level-slider"
                  step={1}
                  marks
                  min={1}
                  max={5}
                  sx={{ color: theme.palette.secondary.main }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddCustomSkill}
                disabled={!customSkill || !customSkillCategory}
                sx={{ height: '100%', minWidth: '100%' }}
              >
                <Add />
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Skills List */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
          Your Technical & Practical Skills
        </Typography>
        
        {formData.technicalSkills.length === 0 && formData.customSkills.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
            No skills added yet. Please add skills from the options above.
          </Typography>
        ) : (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: '4px'
            }}
          >
            {/* Technical Skills */}
            {formData.technicalSkills.map((skill, index) => (
              <Box key={`tech-${index}`} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {skill.skill}
                  </Typography>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveItem('technicalSkills', index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ width: '100%' }}>
                      <Typography id={`skill-level-${index}`} gutterBottom variant="body2">
                        Proficiency Level
                      </Typography>
                      <Slider
                        value={skill.level}
                        onChange={(e, newValue) => handleTechnicalSkillChange(index, 'level', newValue)}
                        aria-labelledby={`skill-level-${index}`}
                        step={1}
                        marks
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => 
                          value === 1 ? 'Basic' : 
                          value === 2 ? 'Intermediate' : 
                          value === 3 ? 'Advanced' : 
                          value === 4 ? 'Expert' : 'Master'
                        }
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Years of Experience"
                      value={skill.yearsExperience}
                      onChange={(e) => handleTechnicalSkillChange(index, 'yearsExperience', e.target.value)}
                      placeholder="e.g. 2 years, 6 months"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Notes"
                      value={skill.notes}
                      onChange={(e) => handleTechnicalSkillChange(index, 'notes', e.target.value)}
                      placeholder="Any additional details about this skill"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
                
                {index < formData.technicalSkills.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
            
            {/* Custom Skills */}
            {formData.customSkills.map((skill, index) => (
              <Box key={`custom-${index}`} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {skill.skill}
                    </Typography>
                    <Chip 
                      label={skill.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: theme.palette.secondary.light,
                        color: theme.palette.secondary.contrastText,
                        fontSize: '0.7rem',
                        height: 20
                      }} 
                    />
                  </Box>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveItem('customSkills', index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
                
                <Box sx={{ width: '100%', mt: 1 }}>
                  <Typography id={`custom-skill-level-${index}`} gutterBottom variant="body2">
                    Proficiency Level
                  </Typography>
                  <Slider
                    value={skill.level}
                    onChange={(e, newValue) => {
                      const updatedSkills = [...formData.customSkills];
                      updatedSkills[index] = {
                        ...updatedSkills[index],
                        level: newValue
                      };
                      handleUpdateItem('customSkills', index, updatedSkills[index]);
                    }}
                    aria-labelledby={`custom-skill-level-${index}`}
                    step={1}
                    marks
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => 
                      value === 1 ? 'Basic' : 
                      value === 2 ? 'Intermediate' : 
                      value === 3 ? 'Advanced' : 
                      value === 4 ? 'Expert' : 'Master'
                    }
                  />
                </Box>
                
                {index < formData.customSkills.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Language Proficiency Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Translate sx={{ color: theme.palette.success.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detailed Language Proficiency
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Please specify your proficiency in each language across different skills (speaking, writing, reading, listening).
        </Typography>

        {formData.languageProficiency.map((langItem, index) => (
          <Paper 
            key={index} 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              position: 'relative',
              borderLeft: `4px solid ${theme.palette.success.light}`,
              borderRadius: '4px'
            }}
          >
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleRemoveItem('languageProficiency', index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              disabled={formData.languageProficiency.length === 1}
            >
              <Delete />
            </IconButton>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={langItem.language}
                    onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                    label="Language"
                  >
                    {LANGUAGES.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {/* Placeholder for alignment */}
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>
                  Speaking
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    value={langItem.speaking}
                    onChange={(e) => handleLanguageChange(index, 'speaking', e.target.value)}
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <MenuItem key={`speaking-${level.value}`} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>
                  Writing
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    value={langItem.writing}
                    onChange={(e) => handleLanguageChange(index, 'writing', e.target.value)}
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <MenuItem key={`writing-${level.value}`} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>
                  Reading
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    value={langItem.reading}
                    onChange={(e) => handleLanguageChange(index, 'reading', e.target.value)}
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <MenuItem key={`reading-${level.value}`} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>
                  Listening
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    value={langItem.listening}
                    onChange={(e) => handleLanguageChange(index, 'listening', e.target.value)}
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <MenuItem key={`listening-${level.value}`} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button 
          variant="outlined" 
          startIcon={<Add />}
          onClick={handleAddLanguage}
          sx={{ mt: 1 }}
        >
          Add Another Language
        </Button>
      </Box>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(211, 97, 53, 0.1)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Be honest about your skill levels. The Career Fair is about finding the right fit for your actual abilities. Employers value potential and willingness to learn as much as existing skills.
        </Typography>
      </Box>
    </Box>
  );
};

export default SkillsAssessmentForm;
