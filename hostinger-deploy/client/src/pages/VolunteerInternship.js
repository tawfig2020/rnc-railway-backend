import React, { useState } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  CardMedia, Button, Tabs, Tab, Paper, Accordion, 
  AccordionSummary, AccordionDetails, TextField, MenuItem, Chip
} from '@mui/material';
import { 
  VolunteerActivism, School, Work, GroupAdd, 
  ExpandMore, Send, Lightbulb, Favorite, Handshake
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Mock data for volunteer roles
const VOLUNTEER_ROLES = [
  {
    title: "Language Tutor",
    description: "Help refugees improve their language skills through one-on-one or group tutoring sessions.",
    skills: ["Fluency in English or other local languages", "Patience", "Teaching experience (preferred)"],
    commitment: "2-4 hours/week",
    icon: <School />
  },
  {
    title: "Mentor for Newcomers",
    description: "Guide and support newly arrived refugees in navigating their new community and accessing resources.",
    skills: ["Good communication", "Empathy", "Knowledge of local services"],
    commitment: "3-5 hours/week",
    icon: <Handshake />
  },
  {
    title: "Workshop Facilitator",
    description: "Lead workshops on topics like job skills, cultural orientation, or digital literacy.",
    skills: ["Public speaking", "Subject matter expertise", "Group management"],
    commitment: "Flexible, per workshop basis",
    icon: <Lightbulb />
  },
  {
    title: "Event Support Volunteer",
    description: "Assist with the planning and execution of RNC events, from setup to guest registration.",
    skills: ["Organization", "Teamwork", "Customer service"],
    commitment: "Event-based",
    icon: <VolunteerActivism />
  }
];

// Mock data for internship roles
const INTERNSHIP_ROLES = [
  {
    title: "Social Media & Communications Intern",
    department: "Communications",
    duration: "3-6 months",
    description: "Assist in managing RNC's social media presence, creating content, and supporting communication campaigns.",
    eligibility: ["Enrolled in a relevant Bachelor's or Master's program", "Strong writing and digital skills", "Passion for social impact"],
    responsibilities: ["Draft social media posts", "Monitor engagement", "Assist with newsletter creation", "Support event promotion"]
  },
  {
    title: "Program Support Intern",
    department: "Programs & Services",
    duration: "3-6 months",
    description: "Provide administrative and logistical support to RNC's various programs for refugees.",
    eligibility: ["Strong organizational skills", "Attention to detail", "Ability to work in a multicultural environment"],
    responsibilities: ["Assist with participant registration", "Prepare program materials", "Collect feedback", "Support program coordinators"]
  },
  {
    title: "Research & Advocacy Intern",
    department: "Policy & Advocacy",
    duration: "4-6 months",
    description: "Conduct research on refugee issues, assist in policy analysis, and support advocacy efforts.",
    eligibility: ["Background in social sciences, law, or international relations", "Strong analytical and research skills", "Commitment to human rights"],
    responsibilities: ["Literature reviews", "Data collection and analysis", "Drafting reports and briefs", "Monitoring policy developments"]
  }
];

// Mock testimonials
const TESTIMONIALS = [
  {
    name: "Aisha Khan",
    role: "Former Program Support Intern",
    quote: "My internship at RNC was an incredibly rewarding experience. I learned so much about the challenges refugees face and how dedicated the RNC team is to making a difference. It solidified my desire to work in the non-profit sector.",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait"
  },
  {
    name: "John Doe",
    role: "Current Volunteer Mentor",
    quote: "Volunteering as a mentor has been a privilege. Seeing the direct impact of my support on a newcomer's life is truly inspiring. RNC provides excellent training and resources for its volunteers.",
    image: "https://source.unsplash.com/random/100x100/?man,portrait"
  }
];

const VolunteerInternship = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interest: '', // 'volunteer' or 'internship'
    role: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({ ...formData, interest: newValue === 0 ? 'volunteer' : 'internship', role: '' });
    setSubmitted(false);
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // In a real app, you would send this data to a backend
    console.log("Application Submitted:", formData);
    setSubmitted(true);
    // Reset form after a delay or on successful submission
    setTimeout(() => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            interest: tabValue === 0 ? 'volunteer' : 'internship',
            role: '',
            message: ''
        });
        setSubmitted(false);
    }, 5000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Join Program
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Join us in making a difference. Volunteer your time or gain valuable experience through our internship program.
        </Typography>
        <Divider />
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        centered
        sx={{ 
          mb: 4,
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: { xs: 2, sm: 4 },
            py: 1.5,
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }
        }}
      >
        <Tab icon={<VolunteerActivism />} label="Become a Changemaker (Volunteer)" iconPosition="start" />
        <Tab icon={<School />} label="Internship Program" iconPosition="start" />
      </Tabs>

      {/* Volunteer Section */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3, color: theme.palette.primary.main }}>
            Volunteer Opportunities
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 4 }}>
            Our volunteers are the heart of RNC. By sharing your skills and time, you can directly contribute to the well-being and integration of refugees in our community. We offer diverse roles to match your interests and availability.
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {VOLUNTEER_ROLES.map((role) => (
              <Grid item xs={12} sm={6} md={3} key={role.title}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p:2 }}>
                  <Box sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 1 }}>{role.icon}</Box>
                  <Typography variant="h6" gutterBottom>{role.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>{role.description}</Typography>
                  <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>Commitment: {role.commitment}</Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => setFormData({...formData, role: role.title, interest: 'volunteer'})}>
                    I'm Interested
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button variant="contained" size="large" startIcon={<Favorite />} onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' }) }>
              Apply to Volunteer Now
            </Button>
          </Box>
        </Box>
      )}

      {/* Internship Section */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3, color: theme.palette.primary.main }}>
            Internship Program at RNC
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 2 }}>
            Gain hands-on experience in the non-profit sector while contributing to meaningful projects. Our internship program offers opportunities for students and recent graduates to develop professional skills and learn about refugee support services.
          </Typography>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>Available Internship Roles:</Typography>
          {INTERNSHIP_ROLES.map((role, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">{role.title} <Chip label={role.department} size="small" sx={{ml:1}} color="secondary"/></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph><strong>Duration:</strong> {role.duration}</Typography>
                <Typography variant="body2" paragraph>{role.description}</Typography>
                <Typography variant="subtitle2" gutterBottom>Eligibility:</Typography>
                <ul>
                  {role.eligibility.map((item, i) => <li key={i}><Typography variant="body2">{item}</Typography></li>)}
                </ul>
                <Typography variant="subtitle2" gutterBottom>Key Responsibilities:</Typography>
                <ul>
                  {role.responsibilities.map((item, i) => <li key={i}><Typography variant="body2">{item}</Typography></li>)}
                </ul>
                <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => setFormData({...formData, role: role.title, interest: 'internship'})}>
                  I'm Interested in this Role
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
            <Button variant="contained" size="large" startIcon={<Work />} onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' }) }>
              Apply for an Internship
            </Button>
          </Box>
        </Box>
      )}
      
      {/* Testimonials Section (Common for both) */}
      <Paper elevation={2} sx={{ p: 3, my: 4, borderRadius: 2, bgcolor: 'rgba(42, 125, 111, 0.05)' }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Voices from Our Community
        </Typography>
        <Grid container spacing={3}>
          {TESTIMONIALS.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, borderRadius: '50%', mr: 2 }}
                  image={testimonial.image}
                  alt={testimonial.name}
                />
                <CardContent sx={{p:0, '&:last-child': { pb: 0 }}}>
                  <Typography variant="body1">"{testimonial.quote}"</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    - {testimonial.name}, {testimonial.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Application Form (Common for both) */}
      <Paper id="apply-form" elevation={3} sx={{ p: {xs: 2, sm: 4}, borderRadius: 2, mt: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Apply to {tabValue === 0 ? 'Volunteer' : 'Intern'}
        </Typography>
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h5" color="primary">Thank You!</Typography>
            <Typography variant="body1">Your application has been submitted. We will get back to you soon.</Typography>
          </Box>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  required 
                  label="Full Name" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleFormChange} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  required 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleFormChange} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Phone Number" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleFormChange} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  select 
                  required 
                  label={`Selected ${tabValue === 0 ? 'Volunteer Role' : 'Internship Role'}`}
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  helperText={`Please select a ${tabValue === 0 ? 'volunteer role you are interested in' : 'specific internship role if applicable'}`}
                >
                  {(tabValue === 0 ? VOLUNTEER_ROLES : INTERNSHIP_ROLES).map((option) => (
                    <MenuItem key={option.title} value={option.title}>
                      {option.title}
                    </MenuItem>
                  ))}
                  <MenuItem value="General Interest">General {tabValue === 0 ? 'Volunteer' : 'Internship'} Interest</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={4} 
                  label="Message (Optional - tell us more about yourself or your interest)" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleFormChange} 
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  startIcon={<Send />} 
                  disabled={!formData.fullName || !formData.email || !formData.role}
                >
                  Submit Application
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

    </Container>
  );
};

export default VolunteerInternship;
