import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProgramRegistrationForm from '../components/forms/ProgramRegistrationForm';

const ProgramRegistrationPage = () => {
  const { programId } = useParams();
  const location = useLocation();
  
  // Get programName from state if available (passed from previous page)
  const programName = location.state?.programName || '';
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/our-services" color="inherit">
            Our Services
          </Link>
          <Typography color="text.primary">Program Registration</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Join Our Program
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your interest in our programs. Please complete the registration form below to join. 
          Our team will review your application and contact you with further details.
        </Typography>
      </Box>
      
      <ProgramRegistrationForm programId={programId} programName={programName} />
    </Container>
  );
};

export default ProgramRegistrationPage;
