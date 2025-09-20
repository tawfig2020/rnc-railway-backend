import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
// Temporarily remove DatePicker imports to resolve circular dependency
import { AssignmentTurnedIn, School, Person } from '@mui/icons-material';

const ProgramRegistrationForm = ({ programId, programName }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: null,
    gender: '',
    nationality: '',
    languages: '',
    educationLevel: '',
    programInterest: programName || '',
    reasonForJoining: '',
    howDidYouHear: '',
    previousExperience: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birthDate: date,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - in a real app, you'd send this to an API
    console.log('Form submitted:', formData);
    
    // Display success message
    setSnackbarOpen(true);
    
    // Reset form after submission
    setTimeout(() => {
      setActiveStep(0);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: null,
        gender: '',
        nationality: '',
        languages: '',
        educationLevel: '',
        programInterest: programName || '',
        reasonForJoining: '',
        howDidYouHear: '',
        previousExperience: '',
      });
    }, 1000);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const steps = [
    {
      label: 'Personal Information',
      icon: <Person />,
      content: (
        <>
          <Typography variant="h6" gutterBottom>
            Personal Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="firstName"
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="phone"
                name="phone"
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="birthDate"
                name="birthDate"
                label="Date of Birth (MM/DD/YYYY)"
                type="text"
                fullWidth
                value={formData.birthDate ? formData.birthDate : ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    birthDate: e.target.value
                  });
                }}
                placeholder="MM/DD/YYYY"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="nationality"
                name="nationality"
                label="Nationality"
                fullWidth
                value={formData.nationality}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="languages"
                name="languages"
                label="Languages Spoken"
                fullWidth
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., English, Bahasa Malaysia, Arabic"
              />
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      label: 'Education & Experience',
      icon: <School />,
      content: (
        <>
          <Typography variant="h6" gutterBottom>
            Education & Background
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="educationLevel"
                name="educationLevel"
                label="Highest Education Level"
                select
                fullWidth
                value={formData.educationLevel}
                onChange={handleChange}
              >
                <MenuItem value="Primary School">Primary School</MenuItem>
                <MenuItem value="Secondary School">Secondary School</MenuItem>
                <MenuItem value="High School Diploma">High School Diploma</MenuItem>
                <MenuItem value="Certificate">Certificate</MenuItem>
                <MenuItem value="Vocational Training">Vocational Training</MenuItem>
                <MenuItem value="Associate Degree">Associate Degree</MenuItem>
                <MenuItem value="Bachelor&apos;s Degree">Bachelor&apos;s Degree</MenuItem>
                <MenuItem value="Master&apos;s Degree">Master&apos;s Degree</MenuItem>
                <MenuItem value="Doctorate">Doctorate</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="previousExperience"
                name="previousExperience"
                label="Previous Experience (if any)"
                multiline
                rows={4}
                fullWidth
                value={formData.previousExperience}
                onChange={handleChange}
                placeholder="Please describe any relevant experience or skills you have that relate to this program."
              />
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      label: 'Program Details',
      icon: <AssignmentTurnedIn />,
      content: (
        <>
          <Typography variant="h6" gutterBottom>
            Program Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="programInterest"
                name="programInterest"
                label="Program of Interest"
                select={!programName}
                fullWidth
                value={formData.programInterest}
                onChange={handleChange}
                disabled={!!programName}
              >
                {!programName && (
                  <>
                    <MenuItem value="English Bridge Program">English Bridge Program</MenuItem>
                    <MenuItem value="Bahasa Melayu for Refugees">Bahasa Melayu for Refugees</MenuItem>
                    <MenuItem value="Design Thinking for Refugee Entrepreneurs">Design Thinking for Refugee Entrepreneurs</MenuItem>
                    <MenuItem value="Vibe Coding with AI">Vibe Coding with AI</MenuItem>
                    <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
                    <MenuItem value="Financial Literacy">Financial Literacy</MenuItem>
                    <MenuItem value="IT & Digital Skills for Women and Girls">IT & Digital Skills for Women and Girls</MenuItem>
                    <MenuItem value="Baking & Catering">Baking & Catering</MenuItem>
                    <MenuItem value="Soap Making">Soap Making</MenuItem>
                    <MenuItem value="Arts & Crafts Project">Arts & Crafts Project</MenuItem>
                    <MenuItem value="CV & Cover Letter Writing">CV & Cover Letter Writing</MenuItem>
                    <MenuItem value="Interview Skills">Interview Skills</MenuItem>
                    <MenuItem value="Networking & Personal Branding">Networking & Personal Branding</MenuItem>
                  </>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="reasonForJoining"
                name="reasonForJoining"
                label="Why do you want to join this program?"
                multiline
                rows={4}
                fullWidth
                value={formData.reasonForJoining}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="howDidYouHear"
                name="howDidYouHear"
                label="How did you hear about this program?"
                select
                fullWidth
                value={formData.howDidYouHear}
                onChange={handleChange}
              >
                <MenuItem value="RNC Website">RNC Website</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Friend or Family">Friend or Family</MenuItem>
                <MenuItem value="Community Center">Community Center</MenuItem>
                <MenuItem value="NGO Referral">NGO Referral</MenuItem>
                <MenuItem value="RNC Staff">RNC Staff</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(135deg, rgba(249, 244, 239, 0.2) 0%, rgba(249, 244, 239, 0) 100%)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom color="primary">
            Program Registration
          </Typography>
          
          {programName && (
            <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
              {programName}
            </Typography>
          )}
          
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Fill out the form below to join this program. All fields marked with * are required.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={() => (
                <Box
                  sx={{
                    backgroundColor: activeStep >= index ? theme.palette.primary.main : theme.palette.grey[300],
                    color: activeStep >= index ? 'white' : theme.palette.grey[700],
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {step.icon}
                </Box>
              )}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined}>
          {steps[activeStep]?.content}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                >
                  Submit Registration
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          Registration submitted successfully! We will contact you shortly.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProgramRegistrationForm;
