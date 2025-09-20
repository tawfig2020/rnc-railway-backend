import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Import form sections
import PersonalInfoForm from '../components/volunteer/PersonalInfoForm';
import EducationForm from '../components/volunteer/EducationForm';
import SkillsForm from '../components/volunteer/SkillsForm';
import ExperienceForm from '../components/volunteer/ExperienceForm';
import ContributionForm from '../components/volunteer/ContributionForm';

const steps = [
  'Personal Information',
  'Education Background',
  'Skills & Profession',
  'Past Experience',
  'Areas of Contribution'
];

const VolunteerApplication = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      dateOfBirth: '',
      gender: '',
      ethnicity: '',
      languages: [],
    },
    // Education Background
    education: {
      highestDegree: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: '',
      certifications: [],
      additionalTraining: '',
    },
    // Skills & Profession
    skills: {
      profession: '',
      currentEmployer: '',
      jobTitle: '',
      yearsOfExperience: '',
      skillsList: [],
      computerSkills: [],
      languageSkills: [],
    },
    // Past Experience
    experience: {
      volunteerExperience: [],
      relevantWorkExperience: [],
      communityInvolvement: '',
    },
    // Areas of Contribution
    contribution: {
      areasOfInterest: [],
      availabilityFrequency: '',
      availabilityTimes: [],
      startDate: '',
      motivation: '',
      heardAbout: '',
      additionalInfo: '',
    }
  });

  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Move to the completion step
    setActiveStep(steps.length);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInfoForm formData={formData.personalInfo} handleChange={(field, value) => handleChange('personalInfo', field, value)} />;
      case 1:
        return <EducationForm formData={formData.education} handleChange={(field, value) => handleChange('education', field, value)} />;
      case 2:
        return <SkillsForm formData={formData.skills} handleChange={(field, value) => handleChange('skills', field, value)} />;
      case 3:
        return <ExperienceForm formData={formData.experience} handleChange={(field, value) => handleChange('experience', field, value)} />;
      case 4:
        return <ContributionForm formData={formData.contribution} handleChange={(field, value) => handleChange('contribution', field, value)} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          Volunteer Application
        </Typography>
        
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          Thank you for your interest in volunteering with the Refugee Network Centre. Please complete the form below to help us understand how you can contribute to our mission.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }} className="form-stepper" data-testid="volunteer-form-stepper">
          {steps.map((label) => (
            <Step key={label} className="form-step" data-testid={`volunteer-step-${steps.indexOf(label)}`}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Thank you for your application!
              </Typography>
              <Typography variant="body1" paragraph>
                We have received your volunteer application and will contact you soon about the next steps.
              </Typography>
              <Button variant="contained" color="primary" href="/">
                Return to Home
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }} className={`form-step-content step-${activeStep} ${activeStep === 0 ? 'active' : ''}`} data-testid={`step-content-${activeStep}`}>
                {getStepContent(activeStep)}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  type="button"
                  data-testid="volunteer-next-button"
                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default VolunteerApplication;
