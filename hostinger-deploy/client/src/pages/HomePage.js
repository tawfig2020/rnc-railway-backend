import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Icon,
  Fade,
  Zoom,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  CardActionArea,
  IconButton,
  TextField,
  List,
  Link,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'; // Hope
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Resilience
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'; // Self-reliance
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Development
import FavoriteIcon from '@mui/icons-material/Favorite'; // For Donate
import HandshakeIcon from '@mui/icons-material/Handshake'; // For Get Involved/Partner
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import SupportIcon from '@mui/icons-material/Support';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer'

const HeroSection = styled(Box)(({ theme }) => ({
  color: theme.palette.common.white,
  padding: theme.spacing(12, 2),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.dark} 0%, 
    #2A7D6F 25%, 
    #496A81 50%, 
    ${theme.palette.secondary.main} 75%, 
    ${theme.palette.secondary.dark} 100%)`,
  backgroundSize: '400% 400%',
  animation: 'gradientAnimation 15s ease infinite',
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(/images/pattern-overlay.png)',
    opacity: 0.15,
    zIndex: 1,
  },
}));

const HeroTitle = styled(motion.div)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  letterSpacing: '1px',
  fontSize: '4rem',
  position: 'relative',
  zIndex: 5,
  textShadow: '0 4px 15px rgba(0,0,0,0.3)',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
    borderRadius: '2px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '3.2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const HeroSubtitle = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  maxWidth: '750px',
  fontSize: '1.35rem',
  lineHeight: 1.7,
  fontWeight: 400,
  position: 'relative',
  zIndex: 5,
  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
    lineHeight: 1.5,
  },
}));

const StyledButton = styled(motion.button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.8, 4.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: theme.shape.borderRadius * 3,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 5,
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&.primary': {
    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
    color: 'white',
  },
  '&.outlined': {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 25px rgba(0,0,0,0.3)',
  },
  '&:hover::before': {
    transform: 'translateX(100%)',
  },
}));

// Old FeatureCard - will be replaced by FlipCard structure

const StaticCardContainer = styled(motion.div)(({ theme }) => ({
  backgroundColor: 'transparent',
  width: '100%',
  maxWidth: '400px',
  minHeight: '340px',
  height: '100%',
  perspective: '1500px',
  cursor: 'pointer',
}));

const StaticCardInner = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transformStyle: 'preserve-3d',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #ffffff 100%)`,
  boxShadow: '0 15px 35px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.07)',
  transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
}));

const StyledCardContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #43C6AC, #2A7D6F)',
  },
}));

// Removed flip card components and replaced with a single static card style

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.dark,
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(3),
  boxShadow: '0 10px 20px rgba(0,0,0,0.07)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '2px solid rgba(0,0,0,0.03)',
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '2.8rem',
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px) scale(1.05)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.2)',
      color: theme.palette.secondary.main,
    }
  }
}));

// Section styles moved below

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(9, 2),
  position: 'relative',
  overflow: 'hidden',
}));

const SectionTitle = styled(motion.div)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  color: theme.palette.text.primary,
  position: 'relative',
  fontSize: '2.5rem',
  '&::after': {
    content: '""',
    display: 'block',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #43C6AC, #2A7D6F)',
    margin: '15px auto 0',
    borderRadius: '2px',
  }
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#2d3748',
  color: 'rgba(255,255,255,0.8)',
  padding: theme.spacing(5, 2),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #43C6AC, #2A7D6F)',
  }
}));

const HomePage = () => {
  const theme = useTheme();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const heroTextVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      } 
    }
  };
  
  const buttonVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut", 
        delay: 0.3 
      } 
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 } 
    },
    tap: { scale: 0.98 }
  };
  
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -10,
      boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  // InView hooks for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const inspirationalStatements = [
    { 
      icon: <EmojiEventsIcon />,
      title: 'Embrace Resilience',
      text: 'Overcome challenges, emerge stronger, and build a future of strength.',
      backText: 'Strength in adversity.'
    },
    { 
      icon: <SelfImprovementIcon />,
      title: 'Cultivate Self-Reliance',
      text: 'Empowering you with skills and opportunities to forge your own path.',
      backText: 'Empower your journey.'
    },
    { 
      icon: <VolunteerActivismIcon />,
      title: 'Nurture Hope',
      text: 'A brighter tomorrow begins with today’s belief in possibilities and support.',
      backText: 'Believe in tomorrow.'
    },
    { 
      icon: <TrendingUpIcon />,
      title: 'Drive Development',
      text: 'Unlocking potential, fostering personal and community growth for lasting impact.',
      backText: 'Grow and achieve.'
    },
  ];

  const testimonials = [
    {
      quote: "The RNC programs transformed my life. I found not just skills, but a community that believes in me.",
      name: "Aisha M.",
      role: "Program Graduate & Entrepreneur",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90JTIwYXNpYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "Supporting the RNC means investing in real change and empowering resilient individuals to rebuild their lives.",
      name: "John B.",
      role: "Community Donor",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjBtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "Volunteering with RNC has been an incredibly rewarding experience. The impact on the community is tangible.",
      name: "Sarah K.",
      role: "Volunteer Mentor",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <Box>
      <HeroSection className="hero-section" data-testid="hero-section" ref={heroRef}>
        {/* Animated elements in the background */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 0
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)',
            zIndex: 0
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 5 }}>
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={heroTextVariant}
          >
            <HeroTitle>
              <Typography variant="h1" sx={{ fontWeight: 800, textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                Building Futures, Together.
              </Typography>
            </HeroTitle>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={heroTextVariant}
            transition={{ delay: 0.2 }}
          >
            <HeroSubtitle>
              <Typography variant="h5">
                Fostering resilience and self-reliance, inspiring hope, and driving development through positive attitudes. Join us to make a difference.
              </Typography>
            </HeroSubtitle>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
              <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
                <StyledButton className="primary" component={RouterLink} to="/our-services">
                  Explore Our Programs
                </StyledButton>
              </motion.div>
              <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
                <StyledButton className="outlined" component={RouterLink} to="/program-registration/general">
                  Join Program
                </StyledButton>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
        
        {/* Scroll down indicator */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: 30, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 5,
            cursor: 'pointer',
          }}
          animate={{ 
            y: [0, 10, 0] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: 'loop' 
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ color: 'white', opacity: 0.8, textAlign: 'center', mb: 1, textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
          >
            Scroll to explore
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', delay: 0.2 }}
            >
              <ArrowForwardIcon 
                sx={{ 
                  color: 'white', 
                  transform: 'rotate(90deg)', 
                  fontSize: '2rem',
                  opacity: 0.8,
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
                }} 
              />
            </motion.div>
          </Box>
        </motion.div>
      </HeroSection>

      <Section ref={featuresRef}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            <SectionTitle>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#2A7D6F' }}>
                Inspiring Our Community
              </Typography>
            </SectionTitle>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <Grid container spacing={6} justifyContent="center">
              {inspirationalStatements.map((statement, index) => (
                <Grid item xs={12} sm={6} md={6} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    custom={index}
                    variants={cardVariant}
                    initial="hidden"
                    animate={featuresInView ? "visible" : "hidden"}
                    whileHover="hover"
                    style={{ width: '100%' }}
                  >
                    <StaticCardContainer className="feature-card card" data-testid="feature-card">
                      <StaticCardInner>
                        <CardContent>
                          <FeatureIcon>
                            {statement.icon}
                          </FeatureIcon>
                          <Typography 
                            variant="h5" 
                            component="h3" 
                            sx={{ 
                              fontWeight: '700', 
                              color: '#2A7D6F', 
                              mt: 1, 
                              mb: 1.5,
                              position: 'relative',
                              display: 'inline-block',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-5px',
                                left: '50%',
                                width: '40px',
                                height: '2px',
                                background: 'linear-gradient(90deg, rgba(42,125,111,0.2), rgba(42,125,111,0.8), rgba(42,125,111,0.2))',
                                transform: 'translateX(-50%)'
                              }
                            }}
                          >
                            {statement.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              px: 1, 
                              lineHeight: 1.8, 
                              color: '#555', 
                              mb: 2,
                              fontSize: '1rem'
                            }}
                          >
                            {statement.text}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontStyle: 'italic', 
                              fontWeight: 500,
                              px: 1, 
                              color: theme.palette.secondary.main, 
                              mt: 2,
                              pb: 1,
                            }}
                          >
                            {statement.backText}
                          </Typography>
                        </CardContent>
                      </StaticCardInner>
                    </StaticCardContainer>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Placeholder for other sections like 'Quick Links', 'Featured Stories', 'Impact Metrics' */}

      {/* Testimonials Section */}
      <Section ref={testimonialsRef} sx={{ backgroundColor: theme.palette.grey[50], position: 'relative', overflow: 'hidden' }}>
        {/* Background elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,198,172,0.05) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106,17,203,0.05) 0%, rgba(0,0,0,0) 60%)',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            <SectionTitle>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                color: '#2A7D6F',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: 0,
                  right: 0,
                  margin: '0 auto',
                  height: '4px',
                  width: '80px',
                  background: 'linear-gradient(90deg, #43C6AC, #2A7D6F)',
                  borderRadius: '2px'
                }
              }}>
                Voices of Our Community
              </Typography>
            </SectionTitle>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            transition={{ delayChildren: 0.3 }}
          >
            <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    custom={index}
                    variants={cardVariant}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    style={{ height: '100%', display: 'flex' }}
                  >
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
                      position: 'relative',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 15px 40px rgba(42,125,111,0.15)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(90deg, #43C6AC, #2A7D6F)',
                        borderRadius: '4px 4px 0 0',
                      }
                    }}>
                      <CardContent sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        p: 3 
                      }}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mb: 3 
                          }}
                        >
                          <FormatQuoteIcon sx={{ 
                            fontSize: 60, 
                            color: 'rgba(42,125,111,0.2)', 
                            transform: 'rotate(180deg)' 
                          }} />
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontStyle: 'italic',
                              mb: 3,
                              color: '#555',
                              lineHeight: 1.7,
                              textAlign: 'center'
                            }} 
                            gutterBottom
                          >
                            &ldquo;{testimonial.quote}&rdquo;
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ 
                          my: 2,
                          opacity: 0.6, 
                          background: 'linear-gradient(90deg, rgba(67,198,172,0), rgba(67,198,172,0.5), rgba(67,198,172,0))' 
                        }} />
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mt: 2,
                          justifyContent: 'center'
                        }}>
                          <Box sx={{ 
                            width: 65, 
                            height: 65, 
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid rgba(67,198,172,0.5)',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                              border: '3px solid rgba(67,198,172,0.8)'
                            }
                          }}>
                            <img 
                              src={testimonial.avatar || `/images/avatars/avatar-${index + 1}.jpg`}
                              alt={testimonial.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                            />
                          </Box>
                          <Box sx={{ ml: 2, textAlign: 'left' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#2A7D6F' }}>
                              {testimonial.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                          <Button
                            component={RouterLink}
                            to={index === 0 ? "/success-stories" : index === 1 ? "/impact" : "/testimonials"}
                            endIcon={<ArrowForwardIcon />}
                            size="small"
                            sx={{
                              color: '#2A7D6F',
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: 'rgba(42,125,111,0.08)',
                              }
                            }}
                          >
                            Discover More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* CTA and Donate Section */}
      <Section 
        ref={ctaRef} 
        sx={{ 
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: theme.palette.common.white,
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 10 }
        }}
      >
        {/* Background animation elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          background: 'url(/images/pattern-light.svg)',
          backgroundSize: '400px',
        }} />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                mb: 3 
              }}
            >
              Make a Difference Today
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5, 
                maxWidth: '750px', 
                margin: 'auto',
                lineHeight: 1.7,
                opacity: 0.9 
              }}
            >
              Your support empowers refugees to build brighter futures. Join our mission through donation, volunteering, or partnership.
            </Typography>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
                  <Button 
                    variant="contained" 
                    fullWidth 
                    component={RouterLink} 
                    to="/donate"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.5)',
                      borderRadius: '30px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.25)',
                      }
                    }}
                  >
                    Donate Now
                  </Button>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    component={RouterLink} 
                    to="/volunteer-application"
                    startIcon={<EmojiPeopleIcon />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderWidth: '2px',
                      borderRadius: '30px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Volunteer
                  </Button>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    component={RouterLink} 
                    to="/partnership-application"
                    startIcon={<HandshakeIcon />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderWidth: '2px',
                      borderRadius: '30px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Partner With Us
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Section>
    </Box>
  );
};

export default HomePage;
