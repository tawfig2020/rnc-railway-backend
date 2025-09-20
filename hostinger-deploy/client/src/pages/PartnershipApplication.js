import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs, 
  Link, 
  useMediaQuery 
} from '@mui/material';
import { partnershipPlaceholderImage } from '../assets/partnership-placeholder';
import { generateDotPattern, generateWavePattern, generateDiamondPattern } from '../assets/pattern-generator';
import { useTheme } from '@mui/material/styles';
import { Home, Business, KeyboardArrowRight } from '@mui/icons-material';
import { motion } from 'framer-motion';
import PartnershipApplicationForm from '../components/partnership/PartnershipApplicationForm';
import CompanyLogosSection from '../components/partnership/CompanyLogosSection';

const PartnershipApplication = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Set page title
  useEffect(() => {
    document.title = 'Partnership Application | Refugee Network Centre';
    window.scrollTo(0, 0);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs Navigation */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator={<KeyboardArrowRight fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link 
            color="inherit" 
            href="/" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            color="inherit"
            href="/career"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Career
          </Link>
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Business sx={{ mr: 0.5 }} fontSize="inherit" />
            Partnership Application
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Page Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            position: 'relative',
            pt: 4,
            pb: 6,
            borderRadius: 4,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: generateDiamondPattern('#2A7D6F', 0.05, 80),
              backgroundSize: '80px 80px',
              zIndex: -1,
            }
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: '#2A7D6F'
              }}
            >
              Partner With Us
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                mb: 4,
                color: 'text.secondary'
              }}
            >
              Join our network of employers committed to creating opportunities for refugees. 
              Together, we can build a more inclusive workforce and help talented individuals rebuild their lives.
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: 4, 
                mb: 6 
              }}
            >
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  width: { xs: '100%', sm: '30%' },
                  backgroundColor: 'rgba(42, 125, 111, 0.08)'
                }}
              >
                <Typography variant="h4" sx={{ color: '#2A7D6F', mb: 1 }}>
                  70%
                </Typography>
                <Typography variant="body1" textAlign="center">
                  of partner companies report improved workplace diversity
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  width: { xs: '100%', sm: '30%' },
                  backgroundColor: 'rgba(211, 97, 53, 0.08)'
                }}
              >
                <Typography variant="h4" sx={{ color: '#D36135', mb: 1 }}>
                  500+
                </Typography>
                <Typography variant="body1" textAlign="center">
                  refugees successfully placed with our partner organizations
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  width: { xs: '100%', sm: '30%' },
                  backgroundColor: 'rgba(121, 133, 78, 0.08)'
                }}
              >
                <Typography variant="h4" sx={{ color: '#79854E', mb: 1 }}>
                  85%
                </Typography>
                <Typography variant="body1" textAlign="center">
                  retention rate for refugee placements after one year
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        </Box>
        
        {/* Partnership Benefits */}
        <motion.div variants={itemVariants}>
          <Box 
            sx={{ 
              mb: 6,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: generateWavePattern('#79854E', 0.04, 100),
                backgroundSize: '100px 50px',
                zIndex: -1,
                opacity: 0.7,
                borderRadius: 3
              } 
            }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                mb: 3, 
                textAlign: 'center', 
                color: '#2A7D6F',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#D36135',
                  borderRadius: '2px'
                }
              }}
            >
              Partnership Benefits
            </Typography>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: 4,
                mt: 5,
                px: { xs: 2, md: 4 }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '4px solid #2A7D6F',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: generateDotPattern('#2A7D6F', 0.03),
                      opacity: 0.5,
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#2A7D6F', fontWeight: 600 }}>
                      Access to Diverse Talent
                    </Typography>
                    <Typography variant="body1">
                      Connect with pre-screened candidates who bring international experience, 
                      multilingual skills, and unique perspectives to your organization.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '4px solid #D36135',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: generateDotPattern('#D36135', 0.03),
                      opacity: 0.5,
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#D36135', fontWeight: 600 }}>
                      Recruitment Support
                    </Typography>
                    <Typography variant="body1">
                      Receive assistance with the entire hiring process, from candidate 
                      matching and interview coordination to onboarding support.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '4px solid #79854E',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: generateDotPattern('#79854E', 0.03),
                      opacity: 0.5,
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#79854E', fontWeight: 600 }}>
                      Cultural Integration Resources
                    </Typography>
                    <Typography variant="body1">
                      Get training and resources to help integrate refugee employees 
                      into your workplace culture and support their success.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '4px solid #2A7D6F',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: generateDotPattern('#2A7D6F', 0.03),
                      opacity: 0.5,
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#2A7D6F', fontWeight: 600 }}>
                      Community Recognition
                    </Typography>
                    <Typography variant="body1">
                      Be recognized as a socially responsible employer committed to 
                      creating opportunities for vulnerable populations.
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
        
        {/* Partner Companies Section */}
        <CompanyLogosSection />
        
        {/* Application Form */}
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={4}
            sx={{ 
              p: { xs: 2, sm: 4 }, 
              borderRadius: 3, 
              mb: 6,
              backgroundColor: '#F9F4EF',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: generateDotPattern('#2A7D6F', 0.02, 30),
                zIndex: 0
              }
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                zIndex: 1,
                pt: 2
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Typography 
                  variant="h4" 
                  component="h2" 
                  align="center" 
                  sx={{ 
                    mb: 4, 
                    color: '#2A7D6F',
                    fontWeight: 600,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#D36135',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Partnership Application
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography 
                  variant="body1" 
                  align="center" 
                  sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
                >
                  Please complete the form below to apply for a partnership with the Refugee Network Centre. 
                  Our team will review your application and contact you within 3-5 business days to discuss 
                  potential partnership opportunities.
                </Typography>
              </motion.div>
            
              <PartnershipApplicationForm />
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default PartnershipApplication;
