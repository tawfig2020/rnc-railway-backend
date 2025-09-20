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
  CardMedia,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  MenuBook as BookIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/donation-hero.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(10, 0),
  },
}));

const ImpactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const DonationCard = styled(Card)(({ theme, active }) => ({
  border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
}));

const CampaignCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundImage: 'url(/images/quote.svg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.2,
  }
}));

const DonationEnhanced = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);
  
  // Handle form input changes
  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle donation amount selection
  const handleAmountSelect = (value) => {
    if (value === 'custom') {
      setAmount('custom');
    } else {
      setAmount(value);
      setCustomAmount('');
    }
  };
  
  // Handle donation completion
  const handleDonationComplete = () => {
    setDonationComplete(true);
    window.scrollTo(0, 0);
  };
  
  // Testimonials data
  const testimonials = [
    {
      quote: "Thanks to your donations, my daughter can now study at home and dream bigger.",
      author: "A refugee parent",
      location: "Malaysia",
      avatar: "/images/testimonials/parent1.jpg"
    },
    {
      quote: "The digital skills I learned changed my life. I can now work remotely and support my family.",
      author: "Aisha",
      location: "Rohingya Refugee Camp",
      avatar: "/images/testimonials/student1.jpg"
    },
    {
      quote: "Education is the key to a better future. Your support has helped us reach more children than ever before.",
      author: "Mohammed",
      location: "Community Teacher",
      avatar: "/images/testimonials/teacher1.jpg"
    }
  ];
  
  // Recent donors data
  const recentDonors = [
    { name: "Sarah Johnson", amount: 50, message: "Keep up the amazing work!" },
    { name: "Anonymous", amount: 100, message: "For the children's education" },
    { name: "The Kim Family", amount: 250, message: "We stand with refugees" },
    { name: "Tech4Good Corp", amount: 1000, message: "Supporting digital literacy" },
    { name: "David Chen", amount: 75, message: "" }
  ];
  
  // Campaigns data
  const campaigns = [
    {
      id: 'mothers-hands',
      title: 'A Mother\'s Hands',
      description: 'Support this crochet initiative by Rohingya women. Each handcrafted piece helps mothers provide for their families while preserving traditional techniques.',
      image: '/images/campaigns/mothers-hands.jpg',
      goal: 3500,
      raised: 1850,
      daysLeft: 18,
      category: 'Empowerment'
    },
    {
      id: 'stem-girls',
      title: 'Girls STEM Program',
      description: 'Empowering young refugee girls with STEM education and mentorship',
      image: '/images/campaigns/stem-girls.jpg',
      goal: 3000,
      raised: 1200,
      daysLeft: 15,
      category: 'Education'
    },
    {
      id: 'digital-hub',
      title: 'Digital Hub for Rohingya Women',
      description: 'Creating a safe space for Rohingya women to learn digital skills',
      image: '/images/campaigns/digital-hub.jpg',
      goal: 5000,
      raised: 3800,
      daysLeft: 8,
      category: 'Empowerment'
    },
    {
      id: 'youth-leadership',
      title: 'Youth Leadership Academy',
      description: 'Training the next generation of community leaders from refugee backgrounds',
      image: '/images/campaigns/youth-leadership.jpg',
      goal: 4500,
      raised: 2200,
      daysLeft: 21,
      category: 'Leadership'
    },
    {
      id: 'language-program',
      title: 'Multilingual Education Program',
      description: 'Supporting language learning for integration and cultural preservation',
      image: '/images/campaigns/language-program.jpg',
      goal: 2800,
      raised: 1500,
      daysLeft: 12,
      category: 'Education'
    }
  ];
  
  // Step 1: Hero Section
  const renderHeroSection = () => (
    <HeroSection>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Every Donation Builds a Future
        </Typography>
        <Typography variant="h5" paragraph sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Support refugee-led education, skills training, and well-being.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => setActiveStep(1)}
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontWeight: 'bold',
              borderRadius: theme.shape.borderRadius * 1.5,
              '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
            }}
          >
            Donate Now
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderWidth: 2,
              borderRadius: theme.shape.borderRadius * 1.5,
              '&:hover': { 
                borderWidth: 2,
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(255,255,255,0.2)'
              }
            }}
          >
            Start a Fundraiser
          </Button>
        </Box>
      </Container>
    </HeroSection>
  );

  // Step 2: Impact Section - Where Your Money Goes
  const impactItems = [
    {
      icon: <SchoolIcon fontSize="large" sx={{ color: theme.palette.primary.main, fontSize: 48, mb: 2 }} />,
      amount: '25',
      title: 'Internet for 5 students',
      description: 'Help provide internet access for a week'
    },
    {
      icon: <BookIcon fontSize="large" sx={{ color: theme.palette.secondary.main, fontSize: 48, mb: 2 }} />,
      amount: '50',
      title: 'Books for 10 learners',
      description: 'Provide educational materials'
    },
    {
      icon: <ComputerIcon fontSize="large" sx={{ color: theme.palette.success.main, fontSize: 48, mb: 2 }} />,
      amount: '100',
      title: 'Digital tablet',
      description: 'Support digital learning'
    },
    {
      icon: <WorkIcon fontSize="large" sx={{ color: theme.palette.error.main, fontSize: 48, mb: 2 }} />,
      amount: '500',
      title: '1 month of teacher salary',
      description: 'Help keep our teachers teaching'
    }
  ];

  const renderImpactSection = () => (
    <Box sx={{ py: 8, bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Where Your Money Goes
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          Your donation directly impacts refugee lives through these essential programs
        </Typography>
        
        <Grid container spacing={4}>
          {impactItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ImpactCard>
                {item.icon}
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ${item.amount}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => {
                    setAmount(item.amount);
                    setActiveStep(1);
                  }}
                  sx={{ mt: 2 }}
                >
                  Donate ${item.amount}
                </Button>
              </ImpactCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  // Step 3: Fundraising Campaigns Section
  const renderCampaignsSection = () => (
    <Box sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Fundraising Campaigns
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          Support these specific initiatives and help us reach our goals
        </Typography>
        
        <Grid container spacing={4}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={3} key={campaign.id}>
              <CampaignCard>
                <CardMedia
                  component="img"
                  height="160"
                  image={campaign.image}
                  alt={campaign.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {campaign.title}
                    </Typography>
                    <Chip 
                      label={campaign.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: 
                          campaign.category === 'Education' ? 'primary.light' : 
                          campaign.category === 'Empowerment' ? 'secondary.light' : 
                          'success.light',
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {campaign.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Raised: ${campaign.raised.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Goal: ${campaign.goal.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(campaign.raised / campaign.goal) * 100} 
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        {Math.round((campaign.raised / campaign.goal) * 100)}% Complete
                      </Typography>
                      <Typography variant="body2" color="error" fontWeight="medium">
                        {campaign.daysLeft} days left
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedProject(campaign.id);
                      setActiveStep(1);
                    }}
                    sx={{ borderRadius: theme.shape.borderRadius * 1.5 }}
                  >
                    Support This Cause
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ borderRadius: theme.shape.borderRadius * 1.5 }}
                  >
                    Learn More
                  </Button>
                </Box>
              </CampaignCard>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: theme.shape.borderRadius * 1.5,
              fontWeight: 'bold',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
            }}
          >
            Start Your Own Fundraiser
          </Button>
        </Box>
      </Container>
    </Box>
  );

  // Step 4: Testimonials and Donor Wall Section
  const renderTestimonialsSection = () => (
    <Box sx={{ py: 8, bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Impact Stories
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          See how your donations transform lives in refugee communities
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <TestimonialCard elevation={3}>
                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3, pl: 5 }}>
                  &quot;{testimonial.quote}&quot;
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {testimonial.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Box>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Recent Donors
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" paragraph sx={{ mb: 4 }}>
            Join these generous supporters in making a difference
          </Typography>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: theme.shape.borderRadius * 2 }}>
            {recentDonors.map((donor, index) => (
              <React.Fragment key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: index % 3 === 0 ? 'primary.main' : 
                                index % 3 === 1 ? 'secondary.main' : 'success.main',
                        mr: 2
                      }}
                    >
                      {donor.name !== "Anonymous" ? donor.name.charAt(0) : "A"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {donor.name}
                      </Typography>
                      {donor.message && (
                        <Typography variant="body2" color="text.secondary">
                          &quot;{donor.message}&quot;
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    ${donor.amount}
                  </Typography>
                </Box>
                {index < recentDonors.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setActiveStep(1)}
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: theme.shape.borderRadius * 1.5,
                '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
              }}
            >
              Join Our Donor Community
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );

  // Step 5: Donation Form Section
  const renderDonationForm = () => {
    if (donationComplete) {
      return renderThankYouSection();
    }
    
    return (
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: theme.shape.borderRadius * 2,
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(90deg, #2A7D6F 0%, #D36135 50%, #79854E 100%)',
              }
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Make Your Donation
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" paragraph sx={{ mb: 4 }}>
              Your generosity helps us provide education and support to refugee communities
            </Typography>
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              {['Choose Amount', 'Your Information', 'Payment', 'Confirmation'].map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Donation Type
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant={donationType === 'one-time' ? 'contained' : 'outlined'}
                      onClick={() => setDonationType('one-time')}
                      sx={{ 
                        py: 2, 
                        borderRadius: theme.shape.borderRadius * 1.5,
                        borderWidth: 2,
                        '&.MuiButton-outlined': {
                          borderWidth: 2,
                        }
                      }}
                    >
                      One-time Donation
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant={donationType === 'monthly' ? 'contained' : 'outlined'}
                      onClick={() => setDonationType('monthly')}
                      sx={{ 
                        py: 2, 
                        borderRadius: theme.shape.borderRadius * 1.5,
                        borderWidth: 2,
                        '&.MuiButton-outlined': {
                          borderWidth: 2,
                        }
                      }}
                    >
                      Monthly Donation
                    </Button>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Select Amount (USD)
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { value: '25', label: '$25' },
                    { value: '50', label: '$50' },
                    { value: '100', label: '$100' },
                    { value: '250', label: '$250' },
                    { value: '500', label: '$500' },
                    { value: 'custom', label: 'Other' },
                  ].map((item) => (
                    <Grid item xs={6} sm={4} key={item.value}>
                      <Button
                        fullWidth
                        variant={amount === item.value ? 'contained' : 'outlined'}
                        onClick={() => handleAmountSelect(item.value)}
                        sx={{ 
                          py: 2, 
                          borderRadius: theme.shape.borderRadius * 1.5,
                          borderWidth: 2,
                          '&.MuiButton-outlined': {
                            borderWidth: 2,
                          }
                        }}
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setActiveStep(1)}
                    disabled={!amount || (amount === 'custom' && !customAmount)}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: theme.shape.borderRadius * 1.5,
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Information
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleBillingInfoChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleBillingInfoChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={billingInfo.city}
                      onChange={handleBillingInfoChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={billingInfo.country}
                      onChange={handleBillingInfoChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ZIP/Postal Code"
                      name="zipCode"
                      value={billingInfo.zipCode}
                      onChange={handleBillingInfoChange}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: theme.shape.borderRadius * 1.5,
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(0)}
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      px: 3, 
                      py: 1.5, 
                      borderRadius: theme.shape.borderRadius * 1.5,
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveStep(2)}
                    endIcon={<ArrowForwardIcon />}
                    disabled={!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: theme.shape.borderRadius * 1.5,
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
                    }}
                  >
                    Continue to Payment
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <Card 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: theme.shape.borderRadius * 1.5,
                        border: paymentMethod === 'credit-card' ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        bgcolor: paymentMethod === 'credit-card' ? 'rgba(42, 125, 111, 0.1)' : 'transparent',
                        '&:hover': { boxShadow: theme.shadows[4] }
                      }}
                      onClick={() => setPaymentMethod('credit-card')}
                    >
                      <CreditCardIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                      <Typography variant="h6">Credit Card</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: theme.shape.borderRadius * 1.5,
                        border: paymentMethod === 'paypal' ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        bgcolor: paymentMethod === 'paypal' ? 'rgba(42, 125, 111, 0.1)' : 'transparent',
                        '&:hover': { boxShadow: theme.shadows[4] }
                      }}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <Box 
                        component="img" 
                        src="/images/paypal-logo.png" 
                        alt="PayPal" 
                        sx={{ height: 48, mb: 1 }} 
                      />
                      <Typography variant="h6">PayPal</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: theme.shape.borderRadius * 1.5,
                        border: paymentMethod === 'bank-transfer' ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        bgcolor: paymentMethod === 'bank-transfer' ? 'rgba(42, 125, 111, 0.1)' : 'transparent',
                        '&:hover': { boxShadow: theme.shadows[4] }
                      }}
                      onClick={() => setPaymentMethod('bank-transfer')}
                    >
                      <BankIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                      <Typography variant="h6">Bank Transfer</Typography>
                    </Card>
                  </Grid>
                </Grid>
                
                {paymentMethod === 'credit-card' && (
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: theme.shape.borderRadius * 1.5,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          placeholder="MM/YY"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: theme.shape.borderRadius * 1.5,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          placeholder="123"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: theme.shape.borderRadius * 1.5,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Name on Card"
                          placeholder="John Smith"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: theme.shape.borderRadius * 1.5,
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {paymentMethod === 'paypal' && (
                  <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="body1" paragraph>
                      You will be redirected to PayPal to complete your donation.
                    </Typography>
                    <Box 
                      component="img" 
                      src="/images/paypal-button.png" 
                      alt="PayPal Checkout" 
                      sx={{ maxWidth: '100%', height: 'auto', maxHeight: 60 }} 
                    />
                  </Box>
                )}
                
                {paymentMethod === 'bank-transfer' && (
                  <Box sx={{ my: 4 }}>
                    <Typography variant="body1" paragraph>
                      Please transfer your donation to the following bank account:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(42, 125, 111, 0.1)', mb: 3, borderRadius: theme.shape.borderRadius * 1.5 }}>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        Bank Transfer Details:
                      </Typography>
                      <Typography variant="body2" fontFamily="monospace" sx={{ lineHeight: 2 }}>
                        Bank Name: Refugee Network Bank<br />
                        Account Name: RNC Donation Account<br />
                        Account Number: 1234567890<br />
                        SWIFT/BIC: RNCMYXXX<br />
                        Reference: DONATION-{donationType.toUpperCase()}
                      </Typography>
                    </Paper>
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
                  sx={{ mt: 2, mb: 3 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(1)}
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      px: 3, 
                      py: 1.5, 
                      borderRadius: theme.shape.borderRadius * 1.5,
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleDonationComplete}
                    disabled={!agreedToTerms}
                    sx={{ 
                      px: 4, 
                      py: 1.5, 
                      borderRadius: theme.shape.borderRadius * 1.5,
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
                    }}
                  >
                    Complete Donation
                  </Button>
                </Box>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Box 
                    component="img" 
                    src="/images/secure-payment.png" 
                    alt="Secure Payment" 
                    sx={{ maxWidth: '100%', height: 'auto', maxHeight: 40 }} 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    100% Secure Payment | SSL Encrypted
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
          
          {/* Donation Summary */}
          {activeStep > 0 && activeStep < 3 && (
            <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: theme.shape.borderRadius * 2 }}>
              <Typography variant="h6" gutterBottom>
                Donation Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
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
              {selectedProject && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Project:</Typography>
                  <Typography fontWeight="bold">
                    {campaigns.find(c => c.id === selectedProject)?.title || 'General Fund'}
                  </Typography>
                </Box>
              )}
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
      </Box>
    );
  };
  
  // Step 6: Thank You Section
  const renderThankYouSection = () => (
    <Box sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: theme.shape.borderRadius * 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #2A7D6F 0%, #D36135 50%, #79854E 100%)',
            }
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h3" gutterBottom>
            Thank You for Your Donation!
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Your support is changing lives.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            A confirmation email has been sent to {billingInfo.email} with your donation receipt.
          </Typography>
          
          <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 3, bgcolor: 'rgba(42, 125, 111, 0.1)', borderRadius: theme.shape.borderRadius * 1.5 }}>
            <Typography variant="h6" gutterBottom>
              Donation Details
            </Typography>
            <Grid container spacing={2} sx={{ textAlign: 'left' }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Donation Type:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">{donationType === 'one-time' ? 'One-time' : 'Monthly'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">${amount === 'custom' ? customAmount : amount} USD</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Date:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">{new Date().toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">{Math.random().toString(36).substring(2, 10).toUpperCase()}</Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              href="/"
              sx={{ 
                borderRadius: theme.shape.borderRadius * 1.5, 
                px: 4, 
                py: 1.5,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              color="primary"
              href="/about"
              sx={{ 
                borderRadius: theme.shape.borderRadius * 1.5, 
                px: 4, 
                py: 1.5,
                '&:hover': { transform: 'translateY(-3px)', boxShadow: theme.shadows[8] }
              }}
            >
              Learn More About Us
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );

  return (
    <Box>
      {donationComplete ? (
        <>
          {renderHeroSection()}
          {renderThankYouSection()}
          {renderTestimonialsSection()}
        </>
      ) : activeStep > 0 ? (
        renderDonationForm()
      ) : (
        <>
          {renderHeroSection()}
          {renderImpactSection()}
          {renderCampaignsSection()}
          {renderTestimonialsSection()}
          {renderDonationForm()}
        </>
      )}
    </Box>
  );
};

export default DonationEnhanced;
