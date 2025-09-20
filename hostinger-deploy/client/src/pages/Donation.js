import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import { 
  Payment as PaymentIcon, 
  School as SchoolIcon, 
  LocalHospital as HealthIcon, 
  Build as BuildIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';

const DonationCard = styled(Card)(({ theme, active }) => ({
  border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
}));

const Donation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState('education');
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const projects = [
    {
      id: 'education',
      title: 'Education for All',
      description: 'Support refugee education programs and learning materials',
      icon: <SchoolIcon color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      id: 'healthcare',
      title: 'Healthcare Access',
      description: 'Provide medical care and health services to refugee communities',
      icon: <HealthIcon color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      id: 'livelihood',
      title: 'Livelihood Programs',
      description: 'Support skills training and job placement services',
      icon: <BuildIcon color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      id: 'general',
      title: 'General Fund',
      description: 'Let us direct your donation to where it\'s needed most',
      icon: <FavoriteIcon color="primary" sx={{ fontSize: 40 }} />,
    },
  ];

  const amounts = [
    { value: '25', label: '$25' },
    { value: '50', label: '$50' },
    { value: '100', label: '$100' },
    { value: '250', label: '$250' },
    { value: '500', label: '$500' },
    { value: 'custom', label: 'Other' },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAmountSelect = (value) => {
    if (value === 'custom') {
      setAmount('custom');
    } else {
      setAmount(value);
      setCustomAmount('');
    }
  };

  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process donation logic would go here
    handleNext();
  };

  const steps = [
    {
      label: 'Select Project',
      description: 'Choose a project to support',
    },
    {
      label: 'Donation Amount',
      description: 'Select or enter donation amount',
    },
    {
      label: 'Billing Information',
      description: 'Enter your details',
    },
    {
      label: 'Payment',
      description: 'Complete your donation',
    },
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select a project to support
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {projects.map((project) => (
                <Grid item xs={12} md={6} key={project.id}>
                  <DonationCard 
                    onClick={() => setSelectedProject(project.id)}
                    active={selectedProject === project.id}
                  >
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <Box sx={{ mb: 2 }}>{project.icon}</Box>
                      <Typography variant="h6" gutterBottom>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </CardContent>
                  </DonationCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Donation Type
            </Typography>
            <Box sx={{ mb: 4 }}>
              <RadioGroup
                row
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
                sx={{ mb: 3 }}
              >
                <FormControlLabel
                  value="one-time"
                  control={<Radio />}
                  label="One-time Donation"
                />
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label="Monthly Donation"
                />
              </RadioGroup>

              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Select Amount (USD)
              </Typography>
              <Grid container spacing={2}>
                {amounts.map((item) => (
                  <Grid item xs={6} sm={4} key={item.value}>
                    <Button
                      fullWidth
                      variant={amount === item.value ? 'contained' : 'outlined'}
                      onClick={() => handleAmountSelect(item.value)}
                      sx={{ py: 2 }}
                    >
                      {item.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              {amount === 'custom' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Custom Amount (USD)"
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Billing Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={billingInfo.firstName}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={billingInfo.lastName}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={billingInfo.email}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={billingInfo.phone}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={billingInfo.city}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={billingInfo.country}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ZIP/Postal Code"
                  name="zipCode"
                  value={billingInfo.zipCode}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="credit-card"
                control={<Radio />}
                label="Credit/Debit Card"
              />
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label="PayPal"
              />
              <FormControlLabel
                value="bank-transfer"
                control={<Radio />}
                label="Bank Transfer"
              />
            </RadioGroup>

            {paymentMethod === 'credit-card' && (
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on Card"
                      placeholder="John Smith"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the Terms of Service and Privacy Policy. My donation is secure and tax-deductible.
                </Typography>
              }
              sx={{ mb: 3 }}
            />
          </Box>
        );
      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h4" gutterBottom>
              Thank You for Your Donation!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your generous support will help us continue our mission to empower refugees through education and skills development.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              A confirmation email has been sent to {billingInfo.email} with your donation receipt.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              href="/"
              sx={{ mt: 3 }}
            >
              Back to Home
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Support Our Cause
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Your donation helps us provide education, healthcare, and livelihood opportunities to refugees worldwide.
      </Typography>

      {activeStep < steps.length - 1 && (
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ my: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                {getStepContent(index)}
                <Box sx={{ mb: 2, mt: 4 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={
                        (index === 0 && !selectedProject) ||
                        (index === 1 && !amount) ||
                        (index === 3 && !agreedToTerms)
                      }
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 2 ? 'Complete Donation' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}

      {activeStep === steps.length - 1 && getStepContent(activeStep)}

      {/* Donation Summary */}
      {activeStep > 0 && activeStep < steps.length - 1 && (
        <Paper elevation={3} sx={{ p: 3, mt: 4, position: 'sticky', top: 20 }}>
          <Typography variant="h6" gutterBottom>
            Donation Summary
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Project:</Typography>
            <Typography fontWeight="bold">
              {projects.find(p => p.id === selectedProject)?.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Donation Type:</Typography>
            <Typography fontWeight="bold">
              {donationType === 'one-time' ? 'One-time' : 'Monthly'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Amount:</Typography>
            <Typography fontWeight="bold">
              ${amount === 'custom' ? customAmount : amount} USD
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Total:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${amount === 'custom' ? customAmount : amount} USD
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Donation;
