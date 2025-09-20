import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Divider, Chip, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  EmojiPeople,
  Diversity3,
  LocalLibrary,
  AccountBalance,
  Public,
  School,
  KeyboardArrowDown,
  Favorite
} from '@mui/icons-material';

const TeamMember = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: '0 auto',
  transition: 'transform 0.4s, box-shadow 0.4s',
  overflow: 'hidden',
  borderRadius: 12,
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
  },
  '& .MuiCardMedia-root': {
    transition: 'transform 0.6s ease',
  },
  '&:hover .MuiCardMedia-root': {
    transform: 'scale(1.05)',
  }
}));

const StoryCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  borderRadius: theme.spacing(2),
  background: '#fff',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
}));

const ValueIcon = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  width: 70,
  height: 70,
  margin: '0 auto 16px',
  color: 'white',
  background: color || '#3f51b5',
  boxShadow: `0 8px 20px ${alpha(color || '#3f51b5', 0.3)}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

const ScrollPrompt = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: 40,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#fff',
  zIndex: 3
}));

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // Refs for scroll targets
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  
  // Handle scroll animation effects
  const { ref: heroInViewRef, inView: heroInView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  
  const { ref: storyInViewRef, inView: storyInView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });
  
  const { ref: missionInViewRef, inView: missionInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  const { ref: teamInViewRef, inView: teamInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out',
      once: false,
    });
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle scroll to section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Hero animation variants
  const heroTextVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };
  
  const teamMembers = [
    {
      name: 'Omar Youcef',
      role: 'Program Manager, Co-Founder',
      bio: 'A dedicated humanitarian professional leveraging extensive experience in community mobilization, program coordination, and advocacy within the refugee context in Malaysia.',
      avatar: '/images/team/omar.jpg',
      expertise: ['Community Mobilization', 'Program Coordination', 'Advocacy']
    },
    {
      name: 'Dr. Taufeeq Ibrahim',
      role: 'Co-Founder, Education Specialist',
      bio: 'An educator and researcher with a PhD in ICT, bringing strong academic foundation and practical expertise to designing educational programs for refugee empowerment.',
      avatar: '/images/team/taufeeq.jpg',
      expertise: ['Education', 'Research', 'Program Design']
    },
  ];
  
  const coreValues = [
    { 
      title: 'Empowerment', 
      description: 'We believe in building the capabilities of refugees to become agents of change in their own lives and communities.',
      icon: EmojiPeople,
      color: '#D36135' // Terracotta
    },
    { 
      title: 'Solidarity', 
      description: 'We stand together with refugees, fostering unity, respect, and mutual support.',
      icon: Diversity3,
      color: '#43C6AC' // Teal
    },
    { 
      title: 'Learning', 
      description: 'We commit to continuous education and skill development as pathways to opportunity.',
      icon: LocalLibrary,
      color: '#6a11cb' // Purple
    },
    { 
      title: 'Dignity', 
      description: 'We honor the inherent worth of every person regardless of their circumstances.',
      icon: Favorite,
      color: '#79854E' // Olive green
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        ref={heroRef}
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/team-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          pt: { xs: 12, md: 15 },
          pb: { xs: 8, md: 10 },
          textAlign: 'center',
          minHeight: '60vh', /* Reduced from 90vh to 60vh to fix empty space */
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginTop: '-20px', /* Negative margin to remove space below navigation */
          zIndex: 1
        }}
        component={motion.div}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={heroTextVariants}
      >
        <Container maxWidth="md">
          <motion.div variants={heroTextVariants}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                mb: 3 
              }}
            >
              Empowering Refugees Through Education, Skills, and Solidarity
            </Typography>
          </motion.div>
          
          <motion.div variants={heroTextVariants}>
            <Typography 
              variant="h5" 
              paragraph
              sx={{ 
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              Learn about the people and the passion driving RNC forward
            </Typography>
          </motion.div>
          
          <motion.div variants={heroTextVariants}>
            <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 18px rgba(0,0,0,0.5)' }
                }}
                onClick={() => scrollToSection(teamRef)}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meet the Team
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2, transform: 'translateY(-3px)' } 
                }}
                onClick={() => scrollToSection(missionRef)}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Mission
              </Button>
            </Box>
          </motion.div>
        </Container>
        
        <ScrollPrompt 
          onClick={() => scrollToSection(storyRef)}
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          <Typography variant="body2" sx={{ color: 'white', mb: 1, opacity: 0.9 }}>
            Scroll to explore
          </Typography>
          <KeyboardArrowDown sx={{ color: 'white', fontSize: 32, opacity: 0.9 }} />
        </ScrollPrompt>
      </Box>

      {/* Our Story */}
      <Box 
        ref={storyRef}
        sx={{ 
          py: 10, 
          background: '#FCFAF7',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url(/images/pattern-light.svg)`,
            backgroundSize: '400px',
            opacity: 0.04,
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }} ref={storyInViewRef}>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h3" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(90deg, #2A7D6F 0%, #79854E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Our Story
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={storyInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Divider sx={{ 
                width: '80px', 
                margin: '0 auto', 
                borderColor: '#79854E', 
                borderWidth: 3,
                borderRadius: 1,
                my: 3
              }} />
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: storyInView ? 1 : 0.5, opacity: storyInView ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Favorite sx={{ fontSize: '100px', color: '#e91e63', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
            </motion.div>
          </Box>

          <StoryCard data-aos="fade-up" data-aos-delay="200">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={storyInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Box
                    component="img"
                    src="/images/rnc-founding.jpg"
                    alt="RNC Founding"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      mb: { xs: 4, md: 0 }
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight={600} data-aos="fade-up">
                    The Birth of Our Vision
                  </Typography>
                  <Typography variant="body1" paragraph data-aos="fade-up" data-aos-delay="100">
                    The Refugee Network Center (RNC) was born not from charity but from conviction.
                  </Typography>
                  <Typography variant="body1" paragraph data-aos="fade-up" data-aos-delay="150">
                    In 2018, through the Transformational Leadership in Action (TLIA) program by Same Skies, a diverse group of 13 individuals, refugees and allies from Yemen, Myanmar, Afghanistan, Iran, Algeria, Indonesia, Australia, Nauru, the Netherlands, and Germany, came together in Malaysia. We conducted research, visited refugee communities, and held focus group discussions across the Klang Valley. One need stood out above all: livelihood. Refugees in Malaysia were struggling not just to survive but to live with dignity.
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary" paragraph data-aos="fade-up" data-aos-delay="200">
                    From this realization, RNC was born in March 2019.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StoryCard>

          <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 6 }}>
            <Typography variant="body1" paragraph data-aos="fade-up" data-aos-delay="100">
              We opened a physical center offering English classes, jewelry making, tailoring, art and makeup workshops, bag-making enterprises, and job matching. We organized bazaars for refugee vendors and helped them sell their products to third parties. When the COVID-19 pandemic hit, we adapted by shifting our programs online and focusing on English and Bahasa classes and digital literacy for children and also for adults.
            </Typography>
            
            <Box sx={{ my: 5 }} data-aos="fade-up" data-aos-delay="150">
              <Card elevation={0} sx={{ bgcolor: alpha('#79854E', 0.1), p: 3, borderRadius: 2, borderLeft: '4px solid #79854E' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Our Core Belief
                </Typography>
                <Typography variant="body1">
                  Since 2022, our focus has sharpened on one core belief: empowerment through skills. We now deliver training that enables refugees to work legally and sustainably from home. These include digital business, marketing, freelancing, coding, and IT, alongside practical income-generating skills like baking and creative arts.
                </Typography>
              </Card>
            </Box>
            
            <Typography variant="body1" paragraph data-aos="fade-up" data-aos-delay="200">
              At RNC, we believe in self-reliance over dependency. We don&apos;t view refugees as beneficiaries of aid, we see them as leaders, creators, and professionals. While this approach may not attract crowds seeking handouts, it continues to attract those determined to build a better future for themselves and their families.
            </Typography>
            
            <Typography variant="body1" fontWeight={700} paragraph textAlign="center" data-aos="fade-up" data-aos-delay="250" sx={{ my: 4, fontSize: '1.2rem', color: '#2A7D6F' }}>
              And it&apos;s working.
            </Typography>
            
            <Typography variant="body1" paragraph data-aos="fade-up" data-aos-delay="300">
              Today, our classrooms and programs are filled with people from diverse nationalities. We are supported by a network of refugee and non-refugee volunteers, and a growing number of partners and donors who believe in the same thing we do: refugees have the power to transform their own lives if given the chance.
            </Typography>
            
            <Typography variant="h6" fontStyle="italic" textAlign="center" data-aos="fade-up" data-aos-delay="350" sx={{ mt: 5, fontWeight: 500 }}>
              This is our story. And we&apos;re just getting started.
            </Typography>
          </Box>
        </Container>
      </Box>



      {/* Vision & Mission */}
      <Box 
        id="mission" 
        ref={missionRef}
        sx={{ 
          bgcolor: '#F5F9FC', 
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'url(/images/dots-pattern.svg)',
            backgroundSize: '200px',
            opacity: 0.05,
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }} ref={missionInViewRef}>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h3" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Our Vision & Mission
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={missionInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Divider sx={{ 
                width: '80px', 
                margin: '0 auto', 
                borderColor: '#43C6AC', 
                borderWidth: 3,
                borderRadius: 1,
                my: 3
              }} />
            </motion.div>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }} data-aos="fade-up" data-aos-delay="200">
              Guided by clear principles to create lasting positive change
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6} data-aos="fade-right" data-aos-delay="300">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card 
                  elevation={6} 
                  sx={{ 
                    height: '100%', 
                    p: 4, 
                    textAlign: 'center', 
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0,
                      width: '150px',
                      height: '150px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '0 0 0 150px',
                      zIndex: 0
                    }} 
                  />
                  <Box position="relative" zIndex={1}>
                    <Public sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Vision</Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                      A just and inclusive society where refugees are empowered with the skills, knowledge, and opportunities to advocate for their rights and integrate meaningfully into the communities they live in.
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left" data-aos-delay="400">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card 
                  elevation={6} 
                  sx={{ 
                    height: '100%', 
                    p: 4, 
                    textAlign: 'center', 
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0,
                      width: '150px',
                      height: '150px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '0 150px 0 0',
                      zIndex: 0
                    }} 
                  />
                  <Box position="relative" zIndex={1}>
                    <School sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Mission</Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                      Refugee Network Center Malaysia (RNC) is a refugee-led organization committed to empowering refugees through education, skills development, and entrepreneurship. We create pathways to self-reliance by providing training, promoting economic participation, and advocating for dignity, equity, and refugee inclusion in Malaysia.
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Core Values */}
          <Box sx={{ mt: 8, mb: 3, textAlign: 'center' }} data-aos="fade-up">
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Core Values
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 5 }}>
              These principles guide everything we do
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {coreValues.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={value.title} data-aos="zoom-in" data-aos-delay={100 + (index * 100)}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }
                    }}
                  >
                    <ValueIcon color={value.color}>
                      <value.icon fontSize="large" />
                    </ValueIcon>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: value.color }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box 
        id="team" 
        ref={teamRef}
        sx={{ 
          py: 12,
          background: 'linear-gradient(to bottom, #fff 0%, #F9F4EF 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" ref={teamInViewRef}>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7 }}
            >
              <Typography 
                variant="h3" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(90deg, #D36135 0%, #79854E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Meet the Team
              </Typography>
            </motion.div>
            <Divider sx={{ 
              width: '80px', 
              margin: '0 auto', 
              borderColor: '#D36135', 
              borderWidth: 3,
              borderRadius: 1,
              my: 3
            }} />
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }} data-aos="fade-up">
              A dedicated group of professionals committed to refugee empowerment
            </Typography>
          </Box>
          
          <Grid container spacing={6} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} data-aos="fade-up" data-aos-delay={index * 150}>
                <TeamMember>
                  <CardMedia
                    component="img"
                    height="320"
                    image={member.avatar}
                    alt={member.name}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div" fontWeight={600}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom fontWeight={500} sx={{ mb: 2 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {member.bio}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {member.expertise.map((skill) => (
                        <Chip 
                          key={skill} 
                          label={skill} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha('#79854E', 0.1),
                            color: '#79854E',
                            fontWeight: 500
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </TeamMember>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 8 }} data-aos="fade-up">
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              href="/team"
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
              endIcon={<KeyboardArrowDown />}
            >
              View Full Team
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 12, 
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/images/community-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(41, 125, 111, 0.9) 0%, rgba(121, 133, 78, 0.9) 100%)',
            zIndex: 0
          }
        }}
        data-aos="fade"
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom fontWeight={700}>
            Our strength lies in our people.
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 5, opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            If you&apos;re passionate about education, equality, and human rights, let&apos;s connect.
          </Typography>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                href="/contact"
                sx={{ 
                  px: 4, 
                  py: 1.8,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }
                }}
              >
                Contact Our Team
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                href="/volunteer"
                sx={{ 
                  px: 4, 
                  py: 1.8,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Volunteer With Us
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
