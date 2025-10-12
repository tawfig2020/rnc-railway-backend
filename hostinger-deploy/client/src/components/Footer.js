import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, useMediaQuery, useTheme, Paper, Button, TextField, Snackbar, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Phone, Email, Instagram, LocationOn, Language, Facebook, Twitter, Send, OpenInNew } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [subscribeSnackbar, setSubscribeSnackbar] = useState(false);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Custom link handler to ensure scrolling to top when navigating to a new page
  const handleLinkClick = (path) => (e) => {
    // Only handle non-hash links with custom logic
    if (!path.includes('#')) {
      e.preventDefault();
      // Navigate to the path and scroll to top
      navigate(path);
      window.scrollTo(0, 0);
    }
    // Hash links will be handled by default browser behavior or by the ScrollToTop component
  };
  
  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // In a real app, you would send this to your backend
      console.log('Subscribing email:', email);
      setEmail('');
      setSubscribeSnackbar(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSubscribeSnackbar(false);
  };

  const footerLinks = [
    { 
      title: 'Quick Links',
      links: [
        { text: 'Home', path: '/' },
        { text: 'About Us', path: '/about' },
        { text: 'Donate', path: '/donate' },
        { text: 'Contact', path: '/about#contact' },
      ]
    },
    {
      title: 'Our Programs',
      links: [
        { text: 'Language Programs', path: '/our-services#language-programs' },
        { text: 'Skills & Entrepreneurship', path: '/our-services#skills-entrepreneurship' },
        { text: 'Vocational Training', path: '/our-services#vocational-training' },
        { text: 'Career Development', path: '/our-services#career-development' },
      ]
    },
    {
      title: 'Marketplace',
      links: [
        { text: 'Handmade Products', path: '/marketplace/handmade' },
        { text: 'Digital Services', path: '/marketplace/digital' },
        { text: 'Bakery & Foods', path: '/marketplace/bakery' },
        { text: 'All Categories', path: '/marketplace' },
      ]
    },
    {
      title: 'Community',
      links: [
        { text: 'Blog', path: '/blog' },
        { text: 'Forum', path: '/forum' },
        { text: 'AI Hub', path: '/ai-hub' },
        { text: 'Community Projects', path: '/community-projects' },
        { text: 'Events', path: '/events' },
        { text: 'Refugee Talents Pool', path: '/career/fair-registration' },
      ]
    }
  ];

  return (
    <Box component="footer" sx={{ 
      bgcolor: '#2A7D6F',
      color: 'white',
      py: 6,
      mt: 'auto',
      backgroundImage: 'linear-gradient(rgba(42, 125, 111, 0.97), rgba(42, 125, 111, 0.97)), url("/assets/subtle-pattern.png")',
      backgroundRepeat: 'repeat',
      boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.1)'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>

              
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                  Refugee Network Centre (RNC)
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Box sx={{ display: 'flex', mt: 2, mb: 3 }}>
                  <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring' }}>
                    <IconButton
                      component={Link}
                      href="https://facebook.com/refugeenetworkcentre"
                      target="_blank"
                      rel="noopener"
                      sx={{ 
                        color: 'white', 
                        mr: 1,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
                      }}
                    >
                      <Facebook />
                    </IconButton>
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring' }}>
                    <IconButton
                      component={Link}
                      href="https://instagram.com/rnc_malaysia"
                      target="_blank"
                      rel="noopener"
                      sx={{ 
                        color: 'white', 
                        mr: 1,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
                      }}
                    >
                      <Instagram />
                    </IconButton>
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring' }}>
                    <IconButton
                      component={Link}
                      href="https://twitter.com/refugeenetwork"
                      target="_blank"
                      rel="noopener"
                      sx={{ 
                        color: 'white', 
                        mr: 1,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
                      }}
                    >
                      <Twitter />
                    </IconButton>
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring' }}>
                    <IconButton
                      component={Link}
                      href="https://refugeenetworkcentre.org"
                      target="_blank"
                      rel="noopener"
                      sx={{ 
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
                      }}
                    >
                      <Language />
                    </IconButton>
                  </motion.div>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Paper elevation={3} sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#F9F4EF' }}>
                    Contact Us
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, fontSize: 20 }} />
                    <Link href="tel:+60182035784" color="inherit" sx={{ 
                      textDecoration: 'none', 
                      '&:hover': { color: '#F9F4EF', textDecoration: 'underline' }
                    }}>
                      +60 18-203 5784
                    </Link>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, fontSize: 20 }} />
                    <Link href="mailto:refugeenc@gmail.com" color="inherit" sx={{ 
                      textDecoration: 'none', 
                      '&:hover': { color: '#F9F4EF', textDecoration: 'underline' }
                    }}>
                      refugeenc@gmail.com
                    </Link>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Grid>
          
          {/* Location/Address Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Paper elevation={4} sx={{ 
                overflow: 'hidden',
                borderRadius: 3,
                height: isMobile ? 250 : 300,
                border: '4px solid rgba(255,255,255,0.2)',
              }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8367839509866!2d101.76172857465043!3d3.1484896532879204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d4f4ae91e7%3A0x17319828e386da6a!2sJalan%20Sulaiman%203%2C%20Taman%20Putra%20Sulaiman%2C%2068000%20Ampang%2C%20Selangor%2C%20Malaysia!5e0!3m2!1sen!2s!4v1714984650123!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RNC Location Map"
                ></iframe>
              </Paper>
              
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <LocationOn sx={{ mr: 1, fontSize: 24, mt: 0.5, color: '#F9F4EF' }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#F9F4EF' }}>
                    Our Location
                  </Typography>
                  <Typography variant="body2">
                    43-2, Jalan Sulaiman 3, Taman Putra Sulaiman,<br />
                    68000 Ampang, Selangor, Malaysia
                  </Typography>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      component={Link}
                      href="https://goo.gl/maps/j3NKs4L6ZQc7ZJTM7" 
                      target="_blank" 
                      rel="noopener"
                      variant="contained"
                      endIcon={<OpenInNew />}
                      size="small"
                      sx={{ 
                        mt: 1, 
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        border: '1px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
                          '70%': { boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)' },
                          '100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' }
                        },
                        '&:hover': { 
                          backgroundColor: 'rgba(255,255,255,0.3)', 
                          borderColor: '#F9F4EF'
                        }
                      }}
                    >
                      View Larger Map
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Grid>
          
          {/* Newsletter Subscription */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ 
                mb: 2, 
                color: 'white',
                fontSize: '1.1rem',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  backgroundColor: theme.palette.primary.main
                }
              }}>
                Newsletter
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                Subscribe to our newsletter for updates on refugee programs and events.
              </Typography>
              
              <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                    },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                />
                <Button 
                  type="submit"
                  variant="contained" 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  <Send fontSize="small" />
                </Button>
              </Box>
              
              <Snackbar 
                open={subscribeSnackbar} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                  Thank you for subscribing to our newsletter!
                </Alert>
              </Snackbar>
            </motion.div>
          </Grid>
          
          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <Grid item xs={6} md={2} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              >
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '30px',
                    height: '3px',
                    bottom: '0',
                    left: '0',
                    backgroundColor: '#D36135',
                    borderRadius: '2px'
                  }
                }}>
                  {section.title}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {section.links.map((link, linkIndex) => (
                    <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                      <motion.div 
                        whileHover={{ x: 5 }} 
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Link 
                          component={RouterLink} 
                          to={link.path} 
                          color="inherit"
                          onClick={handleLinkClick(link.path)}
                          sx={{ 
                            textDecoration: 'none',
                            '&:hover': { 
                              color: '#F9F4EF',
                              textDecoration: 'none'
                            },
                            display: 'inline-block'
                          }}
                        >
                          {link.text}
                        </Link>
                      </motion.div>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Divider sx={{ 
            my: 4, 
            bgcolor: 'rgba(255,255,255,0.2)',
            '&::before, &::after': {
              borderColor: 'rgba(255,255,255,0.2)',
            }
          }} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <Box>
              <Typography variant="body2" sx={{ mb: isMobile ? 0.5 : 0 }}>
                © {new Date().getFullYear()} Refugee Network Centre. All rights reserved.
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)' }}>
                Powered by DDBIS\Dr Taufeeq
              </Typography>
            </Box>
            
            <Box>
              <Link component={RouterLink} to="/terms" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: '#F9F4EF' } }}>
                Terms of Service
              </Link>
              <Link component={RouterLink} to="/privacy" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: '#F9F4EF' } }}>
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/accessibility" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: '#F9F4EF' } }}>
                Accessibility
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
