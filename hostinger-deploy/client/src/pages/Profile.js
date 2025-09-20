import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Avatar, Button, Divider, List, ListItem, ListItemText, TextField, Box, Tabs, Tab } from '@mui/material';
import { Edit, Save, School, MedicalServices, Work, People } from '@mui/icons-material';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    language: 'English',
    location: 'City, Country',
    bio: 'Refugee with background in engineering. Looking to build new skills and connections.',
    skills: ['Engineering', 'Computer Basics', 'Arabic', 'English'],
    education: [
      { institution: 'University of Damascus', degree: 'Bachelor of Engineering', year: '2015-2019' }
    ],
    healthInfo: {
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567890',
      medicalConditions: 'None'
    }
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Save logic would go here
    setEditMode(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                bgcolor: '#2A7D6F' // Deep teal from the color palette
              }}
            >
              {userData.name.charAt(0)}
            </Avatar>
            <Typography variant="h5" component="h1" gutterBottom>
              {userData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userData.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Preferred Language: {userData.language}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={editMode ? <Save /> : <Edit />}
              onClick={editMode ? handleSave : handleEditToggle}
              sx={{ mt: 2 }}
            >
              {editMode ? 'Save Profile' : 'Edit Profile'}
            </Button>
          </Grid>

          {/* Profile Content */}
          <Grid item xs={12} md={8}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                indicatorColor="secondary"
                textColor="secondary"
              >
                <Tab icon={<School />} label="Education" />
                <Tab icon={<MedicalServices />} label="Health" />
                <Tab icon={<Work />} label="Career" />
                <Tab icon={<People />} label="Social" />
              </Tabs>
            </Box>

            {/* Education Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Educational Background
              </Typography>
              <List>
                {userData.education.map((edu, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={edu.degree} 
                      secondary={`${edu.institution} | ${edu.year}`} 
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userData.skills.map((skill, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      bgcolor: '#F9F4EF', // Soft beige from color palette 
                      py: 1, 
                      px: 2, 
                      borderRadius: 2,
                      border: '1px solid #2A7D6F' // Deep teal border
                    }}
                  >
                    {skill}
                  </Box>
                ))}
              </Box>
            </TabPanel>

            {/* Health Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Health Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    value={userData.healthInfo.emergencyContact}
                    disabled={!editMode}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Phone"
                    value={userData.healthInfo.emergencyPhone}
                    disabled={!editMode}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medical Conditions"
                    value={userData.healthInfo.medicalConditions}
                    disabled={!editMode}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Career Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Career Information
              </Typography>
              <Typography variant="body1" paragraph>
                Track your career progress, job applications, and skill development here.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                View Job Applications
              </Button>
              <Button variant="outlined" color="primary">
                Update Resume
              </Button>
            </TabPanel>

            {/* Social Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Community Connections
              </Typography>
              <Typography variant="body1" paragraph>
                Connect with other community members and view upcoming events.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Find Community Groups
              </Button>
              <Button variant="outlined" color="primary">
                View Events
              </Button>
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
