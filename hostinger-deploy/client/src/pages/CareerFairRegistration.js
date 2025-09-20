import React, { useState } from 'react';
import { 
  Container, Box, Typography, Paper, Stepper, Step, StepLabel, 
  Button, Divider, Alert, Snackbar, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  NavigateNext, NavigateBefore, Save, Check, Home, Event, ChevronRight
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Form sections
import PersonalInfoForm from '../components/career-fair/PersonalInfoForm';
import EducationForm from '../components/career-fair/EducationForm';
import WorkExperienceForm from '../components/career-fair/WorkExperienceForm';
import SkillsAssessmentForm from '../components/career-fair/SkillsAssessmentForm';
import CareerGoalsForm from '../components/career-fair/CareerGoalsForm';
import AvailabilityForm from '../components/career-fair/AvailabilityForm';
import ReviewSubmission from '../components/career-fair/ReviewSubmission';

const steps = [
  'Personal Information',
  'Education & Certifications',
  'Work Experience',
  'Skills Assessment',
  'Career Goals',
  'Availability',
  'Review & Submit'
];

const CareerFairRegistration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    dateOfBirth: null,
    gender: '',
    languages: [],
    profilePhoto: null,
    
    // Education
    educationHistory: [
      { 
        institution: '', 
        degree: '', 
        fieldOfStudy: '', 
        startDate: null, 
        endDate: null, 
        current: false,
        description: '' 
      }
    ],
    certifications: [
      { 
        name: '', 
        issuingOrganization: '', 
        issueDate: null, 
        expirationDate: null, 
        noExpiration: false,
        credentialID: '', 
        credentialURL: '' 
      }
    ],
    
    // Work Experience
    workExperience: [
      {
        title: '',
        company: '',
        location: '',
        startDate: null,
        endDate: null,
        current: false,
        description: '',
        responsibilities: '',
        achievements: ''
      }
    ],
    volunteerExperience: [
      {
        role: '',
        organization: '',
        startDate: null,
        endDate: null,
        current: false,
        description: ''
      }
    ],
    informalExperience: '',
    
    // Skills Assessment
    softSkills: {
      communication: 0,
      teamwork: 0,
      problemSolving: 0,
      adaptability: 0,
      timeManagement: 0,
      leadership: 0,
      criticalThinking: 0,
      conflictResolution: 0,
      creativity: 0,
      emotionalIntelligence: 0
    },
    technicalSkills: [],
    customSkills: [],
    languageProficiency: [
      { language: '', speaking: 0, writing: 0, reading: 0, listening: 0 }
    ],
    
    // Career Goals
    desiredRole: '',
    desiredIndustry: [],
    careerObjective: '',
    salaryExpectations: '',
    workPreferences: {
      remoteWork: false,
      relocation: false,
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false
    },
    resume: null,
    coverLetter: null,
    portfolio: '',
    linkedin: '',
    
    // Availability
    availableDates: [],
    preferredTimeSlots: [],
    interviewPreference: '',
    specialAssistance: '',
    dietaryRestrictions: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  // Handle form field changes
  const handleChange = (section, field, value) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  // Handle file uploads
  const handleFileUpload = (field, file) => {
    setFormData({
      ...formData,
      [field]: file
    });
  };

  // Add item to array fields
  const handleAddItem = (field, defaultItem) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultItem]
    });
  };

  // Remove item from array fields
  const handleRemoveItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  // Update item in array fields
  const handleUpdateItem = (field, index, updatedItem) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = updatedItem;
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here we would normally call an API to submit the form data
      // For demonstration, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCompleted(true);
      setSuccessMessage('Registration submitted successfully! We will contact you shortly with more details about the Career Fair.');
      // In a real implementation, we would navigate to a success page or show a confirmation
    } catch (error) {
      setErrorMessage('There was an error submitting your registration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate through form steps
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(false);
  };

  // Render the current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm 
            formData={formData} 
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
          />
        );
      case 1:
        return (
          <EducationForm 
            formData={formData}
            handleChange={handleChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleUpdateItem={handleUpdateItem}
          />
        );
      case 2:
        return (
          <WorkExperienceForm 
            formData={formData}
            handleChange={handleChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleUpdateItem={handleUpdateItem}
          />
        );
      case 3:
        return (
          <SkillsAssessmentForm 
            formData={formData}
            handleChange={handleChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleUpdateItem={handleUpdateItem}
          />
        );
      case 4:
        return (
          <CareerGoalsForm 
            formData={formData}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
          />
        );
      case 5:
        return (
          <AvailabilityForm 
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 6:
        return (
          <ReviewSubmission 
            formData={formData}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(to bottom, #F9F4EF, rgba(249, 244, 239, 0.7))`,
        pt: 4, 
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography 
            component={RouterLink}
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { color: '#2A7D6F' }
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Typography>
          <ChevronRight sx={{ mx: 1, fontSize: 18, color: 'text.secondary' }} />
          <Typography 
            component={RouterLink}
            to="/career"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { color: '#2A7D6F' }
            }}
          >
            Career Development
          </Typography>
          <ChevronRight sx={{ mx: 1, fontSize: 18, color: 'text.secondary' }} />
          <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
            <Event sx={{ mr: 0.5, fontSize: 18 }} />
            Career Fair Registration
          </Typography>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{
              fontWeight: 700,
              color: '#2A7D6F',
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                backgroundColor: '#D36135',
                borderRadius: 2
              }
            }}
          >
            Career Fair Registration
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Register for our upcoming Career Fair and Networking event to connect with potential employers and explore new opportunities.
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper 
          elevation={3} 
          className="career-fair-registration"
          data-testid="career-fair-registration-form"
          sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 3,
            mb: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          {completed ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box 
                sx={{ 
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Check sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" gutterBottom sx={{ color: 'success.main', fontWeight: 600 }}>
                Registration Complete!
              </Typography>
              <Typography variant="body1" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                Thank you for registering for our Career Fair! We&apos;ve received your information and will be in touch with further details about the event. You&apos;ll receive a confirmation email shortly.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink}
                to="/career"
                sx={{ mr: 2 }}
              >
                Return to Career Center
              </Button>
              <Button 
                variant="outlined"  
                onClick={handleReset}
              >
                Register Another Person
              </Button>
            </Box>
          ) : (
            <>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel={!isMobile}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                className="form-stepper"
                data-testid="career-fair-stepper"
                sx={{ mb: 4 }}
              >
                {steps.map((label) => (
                  <Step key={label} className="form-step" data-testid={`career-step-${steps.indexOf(label)}`}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Divider sx={{ mb: 4 }} />
              
              <Box className={`form-step-content step-${activeStep}`} data-testid={`career-step-content-${activeStep}`}>
                {getStepContent(activeStep)}
              </Box>
              
              <Divider sx={{ mt: 4, mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<NavigateBefore />}
                >
                  Back
                </Button>
                
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                      startIcon={<Save />}
                    >
                      {loading ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>
        
        {/* Important Information */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            bgcolor: 'rgba(42, 125, 111, 0.05)',
            border: '1px solid rgba(42, 125, 111, 0.1)'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#2A7D6F', fontWeight: 600 }}>
            Important Information
          </Typography>
          <Typography variant="body2" paragraph>
            The Career Fair will be held on <strong>July 15, 2025</strong> at the Refugee Network Centre&apos;s main location in Ampang, Selangor. Registration is required to participate.
          </Typography>
          <Typography variant="body2" paragraph>
            Please complete all sections of this form to help us match you with appropriate employers and opportunities. Your information will be kept confidential and only shared with participating employers with your consent.
          </Typography>
          <Typography variant="body2">
            If you need assistance completing this form, please contact us at <strong>careers@refugeenetworkcentre.org</strong> or call <strong>+60 18-203 5784</strong>.
          </Typography>
        </Paper>
        
        {/* Notifications */}
        <Snackbar 
          open={!!errorMessage} 
          autoHideDuration={6000} 
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        
        <Snackbar 
          open={!!successMessage} 
          autoHideDuration={6000} 
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CareerFairRegistration;
