import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Grid, Paper, Typography, Button, Card, CardContent, Divider,
  Avatar, CardMedia, IconButton, useMediaQuery, useTheme, Skeleton, Chip, Zoom, Slide,
  Tooltip, Badge, Fade, CardActionArea, CircularProgress, LinearProgress
} from '@mui/material';
import { alpha, darken } from '@mui/material/styles';
import {
  Home as HomeIcon, People, Business, School, Favorite, Info, Policy, Event, Group, Storefront, VolunteerActivism, Handshake, Assessment, KeyboardArrowRight, 
  Visibility, Flag // Added for Vision/Mission cards
} from '@mui/icons-material';
// Animation libraries
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs for scroll animations
  const heroRef = useRef(null);

  const servicesRef = useRef(null);
  const aiHubRef = useRef(null);
  const testimonialsRef = useRef(null);
  const eventsRef = useRef(null);
  
  // Animation controls
  const heroControls = useAnimation();
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.3 });

  const isServicesInView = useInView(servicesRef, { once: false, amount: 0.2 });
  
  // Enhanced state for interactive elements
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  
  // Handler for card flip functionality
  const handleCardFlip = (cardId) => {
    setFlippedCards(prevFlipped => {
      if (prevFlipped.includes(cardId)) {
        return prevFlipped.filter(id => id !== cardId);
      } else {
        return [...prevFlipped, cardId];
      }
    });
  };

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 50
    });
  }, []);

  // Hero section animation effect
  useEffect(() => {
    if (isHeroInView) {
      heroControls.start('visible');
    } else {
      heroControls.start('hidden');
    }
  }, [isHeroInView, heroControls]);

  // Set initial animation state
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Cultural pattern backgrounds
  const patterns = [
    'radial-gradient(circle, rgba(42, 125, 111, 0.2) 10%, transparent 11%),radial-gradient(circle at 50% 50%, transparent 10%, rgba(42, 125, 111, 0.2) 11%)',
    'linear-gradient(45deg, rgba(211, 97, 53, 0.1) 25%, transparent 25%, transparent 50%, rgba(211, 97, 53, 0.1) 50%, rgba(211, 97, 53, 0.1) 75%, transparent 75%, transparent)',
    'radial-gradient(circle at 50% 0, rgba(121, 133, 78, 0.2), rgba(121, 133, 78, 0.1) 70%, transparent 1.5rem),radial-gradient(circle at 6.7% 75%, rgba(121, 133, 78, 0.15), transparent 1.5rem)',
    'linear-gradient(135deg, rgba(139, 94, 131, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 94, 131, 0.1) 50%, rgba(139, 94, 131, 0.1) 75%, transparent 75%, transparent)'
  ];

  // Enhanced feature cards data with updated content for the redesign
  const featureCards = [
    {
      id: 'marketplace',
      title: 'Community Marketplace',
      description: 'Discover unique products created by refugee entrepreneurs. Each purchase supports families building sustainable livelihoods and preserving cultural heritage.',
      icon: Storefront,
      color: '#2A7D6F', // Deep teal
      stats: {
        products: 320,
        sellers: 95,
        categories: 3
      },
      features: ['Direct Support to Creators', 'Unique Cultural Items', 'International Shipping', 'Secure Transactions'],
      categories: [
        { name: 'Handmade & Artisan Products', count: 145, route: '/marketplace/handmade' },
        { name: 'Digital Products & Services', count: 98, route: '/marketplace/digital' },
        { name: 'Bakery & Cultural Foods', count: 77, route: '/marketplace/bakery' }
      ],
      pattern: patterns[0],
      route: '/marketplace'
    },
    {
      id: 'donate',
      title: 'Make an Impact',
      description: 'Your donations directly fund education, career development, and community support programs. See exactly how your contribution creates positive change.',
      icon: VolunteerActivism,
      color: '#D36135', // Terracotta
      stats: {
        donors: 1850,
        raised: '$120,000',
        projects: 32
      },
      features: ['Transparent Fund Allocation', 'Monthly Impact Reports', 'Targeted Project Support', 'Corporate Matching'],
      impactAreas: [
        { name: 'Education Access', amount: '$48,000', beneficiaries: 620 },
        { name: 'Career Development', amount: '$42,000', beneficiaries: 485 },
        { name: 'Community Programs', amount: '$30,000', beneficiaries: 1750 }
      ],
      pattern: patterns[1],
      route: '/donate'
    },
    {
      id: 'services',
      title: 'Our Services',
      description: 'Comprehensive support designed to help refugees build fulfilling lives through education, career development, legal aid, and community connections.',
      icon: Handshake,
      color: '#79854E', // Olive green
      stats: {
        services: 42,
        partners: 58,
        beneficiaries: '7,200+'
      },
      features: ['Education Resources', 'Career Development', 'Community Connections', 'Cultural Integration'],
      keyServices: [
        { name: 'Language Courses', users: 2100, satisfaction: 4.9 },
        { name: 'Job Placement', users: 1250, satisfaction: 4.8 },
        { name: 'Community Events', users: 3800, satisfaction: 4.9 }
      ],
      pattern: patterns[2],
      route: '/services'
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      name: 'Ahmed Hassan',
      origin: 'Syria',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'The language courses changed my life. I went from struggling to communicate to finding a job in just 8 months. The community here feels like family.',
      joinedDate: 'Mar 2022',
      services: ['education', 'career']
    },
    {
      name: 'Fatima Ahmadi',
      origin: 'Afghanistan',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      text: 'The health resources connected me with culturally sensitive care for my family. I also found a supportive community of other mothers.',
      joinedDate: 'Jun 2023',
      services: ['healthcare', 'community']
    },
    {
      name: 'Emmanuel Okoro',
      origin: 'Nigeria',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: 'Through the career development program, I was able to validate my engineering degree and find work in my field. This platform is truly life-changing.',
      joinedDate: 'Sep 2022',
      services: ['education', 'career']
    }
  ];
  
  // Upcoming events
  const upcomingEvents = [
    {
      id: 'evt1',
      title: 'Cultural Celebration Festival',
      date: 'Oct 15, 2023',
      location: 'Central Community Center',
      description: 'Celebrate diversity with food, music, and performances from around the world. This event brings together various cultural traditions and creates opportunities for cross-cultural exchange.',
      attendees: 187,
      image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'evt2',
      title: 'Career Fair & Networking',
      date: 'Nov 22, 2023',
      location: 'Tech Innovation Hub',
      description: 'Connect with employers and explore job opportunities across various industries. Resume help and interview workshops will also be available.',
      attendees: 145,
      image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'evt3',
      title: 'Language Exchange Meetup',
      date: 'Dec 05, 2023',
      location: 'Public Library - Meeting Room A',
      description: 'Practice conversation skills in a supportive environment with native speakers. All language levels welcome, from beginner to advanced.',
      attendees: 68,
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const heroItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Floating animation for hero image
  const floatingAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-10px)' },
    config: { duration: 2000 },
    loop: { reverse: true }
  });

  // Background pattern animation
  const patternAnimation = useSpring({
    from: { backgroundPosition: '0% 0%' },
    to: { backgroundPosition: '100% 100%' },
    config: { duration: 20000 },
    loop: true
  });

  // Dynamic particles animation for hero background
  const particlesAnimation = useSpring({
    from: { opacity: 0.3, scale: 1 },
    to: { opacity: 0.7, scale: 1.1 },
    config: { duration: 8000 },
    loop: { reverse: true }
  });
  
  // Wave animation for hero background
  const waveAnimation = useSpring({
    from: { transform: 'translateY(0px) scale(1)' },
    to: { transform: 'translateY(15px) scale(1.05)' },
    config: { duration: 5000 },
    loop: { reverse: true }
  });

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pt: 4, pb: 8 }}>
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={heroVariants}
      >
        <Box 
          component={animated.div}
          style={patternAnimation}
          sx={{
            position: 'relative',
            backgroundColor: '#2A7D6F', // Deep teal from the color palette
            color: '#fff',
            pt: 8,
            pb: 10,
            overflow: 'hidden',
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1%, transparent 8%), 
                            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1%, transparent 8%)`,
            backgroundSize: '50px 50px'
          }}
        >
          {/* Animated background elements */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
            {/* Animated particles */}
            <animated.div style={particlesAnimation}>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: Math.random() * 40 + 10,
                    height: Math.random() * 40 + 10,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                    y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                    opacity: [0.1, 0.5, 0.1],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
              ))}
            </animated.div>
            
            {/* Animated wave */}
            <animated.div 
              style={{
                ...waveAnimation,
                position: 'absolute',
                bottom: -100,
                left: 0,
                right: 0,
                height: 200,
                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%)',
                borderRadius: '100% 100% 0 0',
                zIndex: 1
              }}
            />
            
            {/* Light beams */}
            <motion.div
              style={{
                position: 'absolute',
                top: -100,
                left: '30%',
                width: 300,
                height: 600,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
                transform: 'rotate(30deg)',
                transformOrigin: 'top center',
                zIndex: 0
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                rotate: [30, 35, 30]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          </Box>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div variants={heroItemVariants}>
                  <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
                    Empowering Refugee Communities
                  </Typography>
                </motion.div>
                <motion.div variants={heroItemVariants}>
                  <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                    Access education, healthcare, career support, and community connections in one place
                  </Typography>
                </motion.div>
                <motion.div 
                  variants={heroItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={Link} 
                    to="/register" 
                    sx={{ 
                      backgroundColor: '#D36135', // Terracotta from the color palette
                      px: 4, 
                      py: 1.5,
                      '&:hover': { backgroundColor: '#b8512e' }
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 1 }}
                      whileHover={{
                        opacity: [1, 0.8, 1],
                        transition: { duration: 0.3, repeat: Infinity }
                      }}
                    >
                      Join Our Community
                    </motion.span>
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={5}>
                <motion.div 
                  variants={heroItemVariants}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Box sx={{ position: 'relative', textAlign: 'center' }}>
                    <animated.img 
                      style={floatingAnimation}
                      src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Diverse community"
                      className="hero-image"
                      sx={{ 
                        maxWidth: '100%', 
                        borderRadius: '12px', 
                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                        transition: 'all 0.5s ease-in-out'
                      }}
                    />
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: -15,
                        right: -15,
                        background: '#D36135',
                        borderRadius: '50%',
                        padding: '10px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Celebration style={{ color: 'white', fontSize: 24 }} />
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Vision and Mission Section */}
      <Box sx={{ py: 10, bgcolor: 'rgba(249, 244, 239, 0.5)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                fontWeight: 700, 
                mb: 6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 4,
                  backgroundColor: '#2A7D6F', // Deep teal
                  borderRadius: 2
                }
              }}
            >
              Our Vision and Mission
            </Typography>
          </motion.div>
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <Card sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px rgba(42, 125, 111, 0.2)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white', mr: 2 }}>
                      <Visibility />
                    </Avatar>
                    <Typography variant="h4" component="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Our Vision
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 0, flexGrow: 1 }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      To create a world where refugees have the resources, support, and opportunities to rebuild their lives with dignity, purpose, and belonging.
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      We envision communities where refugees are valued for their contributions, resilience, and the cultural richness they bring to society.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px rgba(211, 97, 53, 0.2)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'white', mr: 2 }}>
                      <Flag />
                    </Avatar>
                    <Typography variant="h4" component="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      Our Mission
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 0, flexGrow: 1 }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      To provide a comprehensive platform that connects refugees with essential services, learning opportunities, career pathways, and community support.
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Through culturally sensitive resources, multilingual access, and technology-enabled solutions, we aim to empower refugees to navigate their new environments and thrive.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box 
        sx={{ backgroundColor: '#F9F4EF', py: 10 }} 
        ref={servicesRef}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      > 
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                fontWeight: 700, 
                mb: 6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 4,
                  backgroundColor: '#79854E', // Olive green
                  borderRadius: 2
                }
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Our Services
              </motion.span>
            </Typography>
          </motion.div>
          
          <Grid container spacing={4} justifyContent="center">
            {featureCards.map((card, index) => {
              const isFlipped = flippedCards.includes(card.id);
              return (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    style={{ height: '100%' }}
                  >
                    <Box 
                      sx={{ 
                        perspective: '1200px',
                        height: '100%',
                      }}
                    >
                      <Card
                        sx={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          transition: 'transform 0.8s',
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          borderRadius: 4,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        }}
                      >
                        {/* Front Card */}
                        <Card
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 4,
                            '&:hover': {
                              boxShadow: `0 12px 32px ${alpha(card.color, 0.25)}`,
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: card.color, color: 'white', mr: 2, width: 56, height: 56 }}>
                              <card.icon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h5" component="h3" sx={{ fontWeight: 700 }}>
                              {card.title}
                            </Typography>
                          </Box>
                          <CardContent sx={{ p: 0, flexGrow: 1 }}>
                            <Typography variant="body1" color="text.secondary">
                              {card.description}
                            </Typography>
                          </CardContent>
                          <Box sx={{ pt: 2, mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                              variant="text"
                              component={Link}
                              to={card.route}
                              endIcon={<KeyboardArrowRight />}
                              sx={{ color: card.color, fontWeight: 600 }}
                            >
                              Learn More
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => handleCardFlip(card.id)}
                              sx={{ 
                                borderColor: card.color, 
                                color: card.color,
                                '&:hover': { borderColor: card.color, bgcolor: alpha(card.color, 0.1) } 
                              }}
                            >
                              Details
                            </Button>
                          </Box>
                        </Card>
                        
                        {/* Back Card */}
                        <Card
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            backgroundColor: card.color,
                            color: 'white'
                          }}
                        >
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%',
                              backgroundImage: card.pattern,
                              backgroundSize: '30px 30px',
                              opacity: 0.3
                            }} 
                          />
                          
                          <Box sx={{ p: 4, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                              About {card.title}
                            </Typography>
                            
                            <Box sx={{ flex: 1 }}>
                              {card.id === 'marketplace' && (
                                <>
                                  <Typography variant="body1" paragraph>
                                    Our marketplace connects refugee artisans and entrepreneurs with customers worldwide. Every purchase directly supports refugee livelihoods.
                                  </Typography>
                                  <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                      Marketplace Stats
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Products</Typography>
                                      <Typography variant="body2">{card.stats.products}+</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Sellers</Typography>
                                      <Typography variant="body2">{card.stats.sellers}+</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Categories</Typography>
                                      <Typography variant="body2">{card.stats.categories}</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                              
                              {card.id === 'donate' && (
                                <>
                                  <Typography variant="body1" paragraph>
                                    Your donations help us provide essential services to refugees rebuilding their lives. We focus on education, career development, and community support.
                                  </Typography>
                                  <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                      Donation Impact
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Total Donors</Typography>
                                      <Typography variant="body2">{card.stats.donors}+</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Funds Raised</Typography>
                                      <Typography variant="body2">{card.stats.raised}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Active Projects</Typography>
                                      <Typography variant="body2">{card.stats.projects}</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                              
                              {card.id === 'services' && (
                                <>
                                  <Typography variant="body1" paragraph>
                                    We offer a comprehensive range of services designed to help refugees navigate their new communities and build successful lives through education, career support, and community connections.
                                  </Typography>
                                  <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                      Services Overview
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Total Services</Typography>
                                      <Typography variant="body2">{card.stats.services}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Partner Organizations</Typography>
                                      <Typography variant="body2">{card.stats.partners}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">People Served</Typography>
                                      <Typography variant="body2">{card.stats.beneficiaries}</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                            </Box>
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="contained" 
                                fullWidth 
                                onClick={() => handleCardFlip(card.id)}
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.2)', 
                                  color: 'white',
                                  border: '1px solid rgba(255,255,255,0.5)',
                                  py: 1.5,
                                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                }}
                              >
                                Back to Front
                              </Button>
                            </motion.div>
                          </Box>
                        </Card>
                      </Card>
                    </Box>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Marketplace Section */}
      <Box 
        sx={{ py: 10 }}
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.8 }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    backgroundColor: '#79854E', // Olive green
                    borderRadius: 2
                  }
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Refugee Marketplace
                </motion.span>
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: false, amount: 0.8 }}
            >
              <Typography variant="h6" sx={{ mt: 4, mb: 2, maxWidth: 800, mx: 'auto', color: 'text.secondary' }}>
                Discover unique products and services created by talented refugee entrepreneurs
              </Typography>
            </motion.div>
          </Box>
          
          {/* Marketplace Categories */}
          <Box sx={{ position: 'relative' }}>
            {/* Animated background elements */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    background: `rgba(${i % 2 ? '121, 133, 78' : '211, 97, 53'}, 0.1)`,
                    borderRadius: '50%',
                    width: `${40 + i * 20}px`,
                    height: `${40 + i * 20}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
              ))}
            </Box>
            
            <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
              {[
                {
                  id: 'handmade',
                  title: 'Handmade & Artisan Products',
                  description: 'Discover unique handcrafted items that showcase cultural heritage and exceptional craftsmanship.',
                  icon: <Brush sx={{ fontSize: 60, color: '#79854E' }} />,
                  items: 120,
                  sellers: 45
                },
                {
                  id: 'digital',
                  title: 'Digital Products & Services',
                  description: 'Access professional digital services including design, translation, tutoring and technical skills.',
                  icon: <Computer sx={{ fontSize: 60, color: '#2A7D6F' }} />,
                  items: 85,
                  sellers: 38
                },
                {
                  id: 'food',
                  title: 'Bakery & Cultural Foods',
                  description: 'Taste authentic cultural cuisines, specialty baked goods, and traditional recipes from around the world.',
                  icon: <Restaurant sx={{ fontSize: 60, color: '#D36135' }} />,
                  items: 95,
                  sellers: 32
                }
              ].map((category, index) => (
                <Grid item xs={12} md={4} key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: false, amount: 0.4 }}
                    whileHover={{ y: -10, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse'
                          }}
                        >
                          {category.icon}
                        </motion.div>
                      </Box>
                      
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {category.title}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ textAlign: 'center', mb: 3 }}>
                        {category.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Chip 
                          icon={<Inventory />} 
                          label={`${category.items}+ Items`} 
                          size="small" 
                          sx={{ bgcolor: alpha('#79854E', 0.1), color: '#79854E' }} 
                        />
                        <Chip 
                          icon={<People />} 
                          label={`${category.sellers} Sellers`} 
                          size="small" 
                          sx={{ bgcolor: alpha('#2A7D6F', 0.1), color: '#2A7D6F' }} 
                        />
                      </Box>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <motion.div
                          whileHover={{ 
                            scale: 1.05, 
                            boxShadow: `0 8px 20px ${alpha('#79854E', 0.4)}`,
                          }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            fullWidth
                            component={Link}
                            to="/marketplace"
                            endIcon={
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  repeatType: 'loop',
                                  ease: 'easeInOut'
                                }}
                              >
                                <KeyboardArrowRight />
                              </motion.div>
                            }
                            sx={{
                              bgcolor: '#79854E',
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600,
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.2)}, transparent)`,
                                transition: 'left 0.7s ease',
                              },
                              '&:hover': { 
                                bgcolor: darken('#79854E', 0.1),
                                '&::before': {
                                  left: '100%',
                                }
                              }
                            }}
                          >
                            <motion.span
                              animate={{ 
                                color: ['#fff', '#f5f5f5', '#fff']
                              }}
                              transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                repeatType: 'reverse'
                              }}
                            >
                              Explore {category.title.split(' ')[0]}
                            </motion.span>
                          </Button>
                        </motion.div>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: false, amount: 0.8 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/marketplace"
                  endIcon={<Store />}
                  sx={{ 
                    borderColor: '#79854E', 
                    color: '#79854E',
                    borderWidth: 2,
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': { 
                      borderColor: '#79854E', 
                      bgcolor: 'rgba(121, 133, 78, 0.04)',
                      borderWidth: 2
                    }
                  }}
                >
                  Visit Full Marketplace
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* AI Learning Hub */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(135deg, rgba(42, 125, 111, 0.05) 0%, rgba(211, 97, 53, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            style={{ 
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '200px',
              height: '200px',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              background: 'radial-gradient(circle at center, rgba(42, 125, 111, 0.2), rgba(42, 125, 111, 0))',
              filter: 'blur(20px)'
            }}
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            style={{ 
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: '250px',
              height: '250px',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              background: 'radial-gradient(circle at center, rgba(211, 97, 53, 0.15), rgba(211, 97, 53, 0))',
              filter: 'blur(25px)'
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                fontWeight: 700, 
                mb: 6,
                background: 'linear-gradient(90deg, #2A7D6F, #D36135)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              AI Learning Hub
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 15,
                  delay: 0.3
                }}
                style={{ display: 'inline-block', marginLeft: '16px' }}
              >
                <Chip 
                  label="New" 
                  size="small" 
                  color="primary" 
                  sx={{ 
                    backgroundColor: '#2A7D6F', 
                    height: 24,
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(42, 125, 111, 0.3)'
                  }} 
                />
              </motion.div>
            </Typography>
          </motion.div>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
                  Future-Ready Skills for Refugees
                </Typography>
                <Typography paragraph sx={{ fontSize: '1.1rem' }}>
                  Our new AI Learning Hub provides cutting-edge tools and resources to help refugees 
                  develop technology skills for the future job market.
                </Typography>
                <Typography paragraph>
                  Learn to use AI tools, develop digital literacy, and access online courses in multiple languages.
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(42, 125, 111, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={Link} 
                    to="/ai-hub" 
                    startIcon={<AutoAwesome />}
                    sx={{ 
                      backgroundColor: '#2A7D6F', 
                      mt: 2,
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#236256' }
                    }}
                  >
                    <motion.span
                      animate={{ 
                        color: ['#fff', '#f0f0f0', '#fff']
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      Explore AI Hub
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      whileHover={{ 
                        y: -10,
                        boxShadow: '0 20px 30px rgba(0,0,0,0.1)'
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Card sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
                      }}>
                        <Box sx={{ 
                          height: 160, 
                          position: 'relative', 
                          backgroundColor: '#e8f5f3', 
                          overflow: 'hidden' 
                        }}>
                          <motion.div
                            animate={{ 
                              rotate: [0, 360],
                              opacity: [0.4, 0.6, 0.4]
                            }}
                            transition={{ 
                              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                              opacity: { duration: 3, repeat: Infinity, repeatType: 'reverse' }
                            }}
                            style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%',
                              backgroundImage: patterns[0],
                              backgroundSize: '30px 30px'
                            }}
                          />
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '100%',
                              position: 'relative',
                              zIndex: 1
                            }}
                          >
                            <Code sx={{ fontSize: 80, color: '#2A7D6F' }} />
                          </motion.div>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                              fontWeight: 600,
                              color: '#2A7D6F',
                              borderBottom: '2px solid rgba(42, 125, 111, 0.2)',
                              pb: 1
                            }}>
                              AI Learning Resources
                            </Typography>
                          </motion.div>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Learn to use AI tools and develop tech skills for the future job market with our comprehensive courses.
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            flexWrap: 'wrap', 
                            mb: 2 
                          }}>
                            <Chip size="small" label="Beginner Friendly" sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: '#2A7D6F' }} />
                            <Chip size="small" label="6 Languages" sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: '#2A7D6F' }} />
                          </Box>
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button 
                              variant="outlined" 
                              fullWidth 
                              component={Link} 
                              to="/ai-hub/learning"
                              endIcon={<KeyboardArrowRight />}
                              sx={{ 
                                borderColor: '#2A7D6F', 
                                color: '#2A7D6F',
                                borderWidth: 2,
                                '&:hover': { 
                                  borderColor: '#2A7D6F', 
                                  backgroundColor: 'rgba(42, 125, 111, 0.05)',
                                  borderWidth: 2
                                }
                              }}
                            >
                              Start Learning
                            </Button>
                          </motion.div>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <motion.div
                      whileHover={{ 
                        y: -10,
                        boxShadow: '0 20px 30px rgba(0,0,0,0.1)'
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Card sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
                      }}>
                        <Box sx={{ 
                          height: 160, 
                          position: 'relative', 
                          backgroundColor: '#f9f1ed', 
                          overflow: 'hidden' 
                        }}>
                          <motion.div
                            animate={{ 
                              rotate: [0, -360],
                              opacity: [0.4, 0.6, 0.4]
                            }}
                            transition={{ 
                              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                              opacity: { duration: 4, repeat: Infinity, repeatType: 'reverse' }
                            }}
                            style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%',
                              backgroundImage: patterns[1],
                              backgroundSize: '30px 30px'
                            }}
                          />
                          <motion.div
                            animate={{ 
                              y: [0, -5, 0, 5, 0],
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              repeatType: 'loop'
                            }}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '100%',
                              position: 'relative',
                              zIndex: 1
                            }}
                          >
                            <SmartToy sx={{ fontSize: 80, color: '#D36135' }} />
                          </motion.div>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                              fontWeight: 600,
                              color: '#D36135',
                              borderBottom: '2px solid rgba(211, 97, 53, 0.2)',
                              pb: 1
                            }}>
                              AI Career Assistant
                            </Typography>
                          </motion.div>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Get personalized career guidance powered by AI to help you find the right path in your new community.
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            flexWrap: 'wrap', 
                            mb: 2 
                          }}>
                            <Chip size="small" label="Personalized" sx={{ bgcolor: 'rgba(211, 97, 53, 0.1)', color: '#D36135' }} />
                            <Chip size="small" label="Resume Help" sx={{ bgcolor: 'rgba(211, 97, 53, 0.1)', color: '#D36135' }} />
                          </Box>
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button 
                              variant="outlined" 
                              fullWidth 
                              component={Link} 
                              to="/ai-hub/career"
                              endIcon={<KeyboardArrowRight />}
                              sx={{ 
                                borderColor: '#D36135', 
                                color: '#D36135',
                                borderWidth: 2,
                                '&:hover': { 
                                  borderColor: '#D36135', 
                                  backgroundColor: 'rgba(211, 97, 53, 0.05)',
                                  borderWidth: 2
                                }
                              }}
                            >
                              Get Guidance
                            </Button>
                          </motion.div>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box 
        sx={{ py: 10 }}
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.3 }}
        ref={testimonialsRef}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.8 }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    backgroundColor: '#D36135', // Terracotta
                    borderRadius: 2
                  }
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Community Voices
                </motion.span>
              </Typography>
            </motion.div>
            
            {isMedium && (
              <Box sx={{ mt: 4, mb: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<KeyboardArrowRight />}
                    sx={{ 
                      borderColor: '#D36135', 
                      color: '#D36135',
                      '&:hover': { borderColor: '#D36135', bgcolor: 'rgba(211, 97, 53, 0.04)' }
                    }}
                    component={Link}
                    to="/testimonials"
                  >
                    View All Testimonials
                  </Button>
                </motion.div>
              </Box>
            )}
          </Box>
          
          {/* Animated Testimonial Carousel */}
          <Box sx={{ position: 'relative', overflow: 'hidden', py: 4 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated background elements */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      background: `rgba(${i % 2 ? '211, 97, 53' : '42, 125, 111'}, 0.1)`,
                      borderRadius: '50%',
                      width: `${30 + i * 15}px`,
                      height: `${30 + i * 15}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                ))}
              </Box>
              
              {/* Testimonial carousel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 4, 
                      borderRadius: 4,
                      position: 'relative',
                      zIndex: 1,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      maxWidth: 800,
                      mx: 'auto',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        backgroundImage: patterns[activeTestimonial % patterns.length],
                        backgroundSize: '30px 30px',
                        opacity: 0.1
                      }} 
                    />
                    
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Avatar 
                                src={testimonials[activeTestimonial].avatar} 
                                sx={{ 
                                  width: 120, 
                                  height: 120, 
                                  border: '4px solid white',
                                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                  mb: 2
                                }} 
                              />
                            </motion.div>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                              {testimonials[activeTestimonial].name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              From {testimonials[activeTestimonial].origin}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Joined {testimonials[activeTestimonial].joinedDate}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                              {testimonials[activeTestimonial].services.map((service, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={service} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: alpha('#2A7D6F', 0.1),
                                    color: '#2A7D6F',
                                    fontWeight: 500
                                  }} 
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Box sx={{ display: 'flex', height: '100%' }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontStyle: 'italic', 
                                lineHeight: 1.8,
                                position: 'relative',
                                pl: 4,
                                '&::before': {
                                  content: '"\\201C"',
                                  position: 'absolute',
                                  left: 0,
                                  top: -20,
                                  fontSize: '4rem',
                                  color: '#D36135',
                                  opacity: 0.5,
                                  fontFamily: 'Georgia, serif'
                                }
                              }}
                            >
                              {testimonials[activeTestimonial].text}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation dots */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                {testimonials.map((_, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Box 
                      onClick={() => setActiveTestimonial(index)}
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        mx: 1,
                        cursor: 'pointer',
                        bgcolor: activeTestimonial === index ? '#D36135' : 'rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                  </motion.div>
                ))}
              </Box>
              
              {/* Navigation arrows */}
              <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', px: 2, transform: 'translateY(-50%)', zIndex: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton 
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.8)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <KeyboardArrowRight sx={{ transform: 'rotate(180deg)' }} />
                  </IconButton>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton 
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.8)', 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
          
          {!isMedium && (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  endIcon={<KeyboardArrowRight />}
                  sx={{ 
                    borderColor: '#D36135', 
                    color: '#D36135',
                    '&:hover': { borderColor: '#D36135', bgcolor: 'rgba(211, 97, 53, 0.04)' }
                  }}
                  component={Link}
                  to="/testimonials"
                >
                  View All Testimonials
                </Button>
              </motion.div>
            </Box>
          )}
        </Container>
      </Box>

      {/* Upcoming Events Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography 
              variant="h4" 
              align={isMobile ? 'center' : 'left'}
              sx={{ 
                fontWeight: 700, 
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: isMobile ? '50%' : '0',
                  transform: isMobile ? 'translateX(-50%)' : 'none',
                  width: 80,
                  height: 4,
                  backgroundColor: '#79854E', // Olive green
                  borderRadius: 2
                }
              }}
            >
              Upcoming Events
            </Typography>
            
            {!isMobile && (
              <Box>
                <Button 
                  variant="outlined" 
                  endIcon={<Event />}
                  sx={{ 
                    borderColor: '#79854E', 
                    color: '#79854E',
                    '&:hover': { borderColor: '#79854E', bgcolor: 'rgba(121, 133, 78, 0.04)' }
                  }}
                  component={Link}
                  to="/events"
                >
                  View All Events
                </Button>
              </Box>
            )}
          </Box>
          
          <Grid container spacing={4}>
            {upcomingEvents.map((event, index) => (
              <Grid item xs={12} md={4} key={event.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      transform: hoveredCard === `event-${index}` ? 'translateY(-8px)' : 'none',
                      boxShadow: hoveredCard === `event-${index}` ? '0 12px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    onMouseEnter={() => setHoveredCard(`event-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={event.image}
                        alt={event.title}
                      />
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
                          zIndex: 1
                        }}
                      />
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          bottom: 10,
                          left: 10,
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Chip 
                          icon={<Event sx={{ color: 'white !important' }} />} 
                          label={event.date} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(121, 133, 78, 0.9)', 
                            color: 'white',
                            fontWeight: 500,
                            mr: 1,
                            backdropFilter: 'blur(4px)'
                          }} 
                        />
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          icon={<Group />} 
                          label={`${event.attendees} attending`} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha('#2A7D6F', 0.1), 
                            color: '#2A7D6F',
                            fontWeight: 500 
                          }} 
                        />
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleFavoriteToggle(event.id);
                            }}
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.8)', 
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } 
                            }}
                          >
                            {favorites.includes(event.id) ? (
                              <Star sx={{ fontSize: 18, color: '#D36135' }} />
                            ) : (
                              <StarBorder sx={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }} />
                            )}
                          </IconButton>
                        </motion.div>
                      </Box>
                      
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                        {event.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Place sx={{ color: '#D36135', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {event.description}
                      </Typography>
                    </CardContent>
                    
                    <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          endIcon={<KeyboardArrowRight />}
                          sx={{ 
                            borderColor: '#79854E', 
                            color: '#79854E',
                            '&:hover': { borderColor: '#79854E', bgcolor: 'rgba(121, 133, 78, 0.04)' }
                          }}
                        >
                          <motion.span
                            initial={{ opacity: 1 }}
                            whileHover={{
                              opacity: [1, 0.8, 1],
                              transition: { duration: 0.3, repeat: Infinity }
                            }}
                          >
                            Register
                          </motion.span>
                        </Button>
                      </motion.div>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button 
                variant="contained" 
                endIcon={<KeyboardArrowRight />}
                sx={{ 
                  bgcolor: '#79854E', 
                  '&:hover': { bgcolor: '#68733f' }
                }}
                component={Link}
                to="/events"
              >
                View All Events
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{
          background: `linear-gradient(135deg, #2A7D6F 0%, #1a4d44 100%)`,
          color: '#fff',
          py: 10,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: patterns[2],
            opacity: 0.2
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Join Our Community Today
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, maxWidth: 800, mx: 'auto' }}>
            Connect with refugees, access resources, and build a better future together
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/register"
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(211, 97, 53, 0.4)',
              mb: 2,
              backgroundColor: '#D36135',
              '&:hover': { backgroundColor: '#b85530' }
            }}
          >
            Create Your Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
