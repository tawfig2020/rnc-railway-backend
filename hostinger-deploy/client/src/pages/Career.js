import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, List, ListItem, 
  ListItemText, ListItemIcon, Box, Paper, Breadcrumbs, Link, Tooltip, 
  Chip, CardActionArea, Divider, CircularProgress, useMediaQuery, Menu,
  MenuItem, Fade, Zoom, Grow, IconButton, Avatar
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { 
  Work, Description, School, Assessment, Group, Language, CheckCircle,
  AccessTime, Star, StarBorder, ArrowForward, PeopleAlt, Translate,
  FormatQuote, LocationOn, PlayArrow, Home, ChevronRight, InfoOutlined,
  Public, FilterList, EmojiEvents, Event, BusinessCenter, CalendarMonth,
  Check, Handshake
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { partnershipPlaceholderImage } from '../assets/partnership-placeholder';

const Career = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for interactive elements
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAnimation, setShowAnimation] = useState(false);
  const [language, setLanguage] = useState('en'); // For multilingual support
  
  // Display animations after initial render
  useEffect(() => {
    setShowAnimation(true);
  }, []);
  
  // Simulate loading when buttons are clicked
  const handleButtonClick = (action) => {
    setLoading(action);
    setTimeout(() => setLoading(false), 1500);
  };
  
  // Background pattern for visual interest
  const backgroundPattern = `radial-gradient(circle at 50% 0, rgba(42, 125, 111, 0.1), rgba(42, 125, 111, 0.05) 70%, transparent 1.5rem),
                            radial-gradient(circle at 6.7% 75%, rgba(211, 97, 53, 0.05), transparent 1.5rem)`;
  
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(to bottom, #F9F4EF, rgba(249, 244, 239, 0.7))`,
        pt: 4, 
        pb: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: backgroundPattern,
          backgroundSize: '100% 100%',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 0
        }
      }}
    >
      {/* Breadcrumb Navigation */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Work sx={{ mr: 0.5 }} fontSize="inherit" />
            Career Development
          </Typography>
        </Breadcrumbs>
        
        {/* Language Selection */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="Change language">
            <Button
              size="small"
              startIcon={<Translate />}
              variant="outlined"
              sx={{ 
                borderColor: '#2A7D6F',
                color: '#2A7D6F',
                '&:hover': { borderColor: '#2A7D6F', bgcolor: 'rgba(42, 125, 111, 0.04)' }
              }}
            >
              {language === 'en' ? 'English' : language === 'ar' ? 'العربية' : language === 'fr' ? 'Français' : 'English'}
            </Button>
          </Tooltip>
        </Box>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', position: 'relative', mb: 6 }}>
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
            Career Development
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
            Explore opportunities, build professional skills, and connect with employers who value your unique background.
          </Typography>
        </Box>

        {/* Career Fair Announcement Section */}
        <Paper 
          elevation={4}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #2A7D6F 0%, #1B5A50 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('/assets/pattern-dots.svg')`,
              backgroundSize: '350px',
              opacity: 0.1,
              zIndex: 0
            }
          }}
        >
          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ fontSize: 28, mr: 1.5, color: '#D36135' }} />
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                  Career Fair & Networking Event
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                July 15-17, 2025 | Refugee Network Centre, Ampang
              </Typography>
              
              <Typography sx={{ mb: 3 }}>
                Connect directly with employers who value refugee talent at our upcoming Career Fair! Meet with companies looking to hire, participate in on-the-spot interviews, and expand your professional network.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Chip 
                  icon={<BusinessCenter sx={{ color: '#D36135 !important' }} />} 
                  label="20+ Employers" 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                
                <Chip 
                  icon={<CheckCircle sx={{ color: '#D36135 !important' }} />} 
                  label="On-site Interviews" 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                
                <Chip 
                  icon={<CalendarMonth sx={{ color: '#D36135 !important' }} />} 
                  label="3-Day Event" 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
              </Box>
              
              <Button
                component={RouterLink}
                to="/career/fair-registration"
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: '#D36135', 
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#A4492A'
                  },
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(211, 97, 53, 0.3)'
                }}
              >
                Register Now
              </Button>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="/assets/career-fair-illustration.svg"
                alt="Career Fair Illustration"
                sx={{ 
                  width: '100%',
                  maxWidth: 300,
                  mx: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      
      {/* Feature Cards Section */}
      <Grid container spacing={5} sx={{ mt: 2, mb: 6 }}>
        {/* Job Board Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Zoom in={showAnimation} style={{ transitionDelay: '100ms' }}>
            <Card 
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                transform: hoveredCard === 'jobs' ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === 'jobs' 
                  ? '0 12px 28px rgba(0,0,0,0.15)' 
                  : '0 6px 16px rgba(0,0,0,0.08)',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredCard('jobs')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '6px', 
                bgcolor: '#2A7D6F' 
              }} />
              
              <CardContent sx={{ p: 4, pb: 2 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha('#2A7D6F', 0.1), 
                      color: '#2A7D6F',
                      width: 56, 
                      height: 56,
                      mr: 2
                    }}
                  >
                    <Public sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2A7D6F' }}>
                      🌐 Job Board
                    </Typography>
                    <Chip 
                      size="small" 
                      label="Most Popular" 
                      sx={{ 
                        bgcolor: alpha('#D36135', 0.1), 
                        color: '#D36135',
                        fontWeight: 500,
                        mt: 0.5
                      }} 
                    />
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Discover employment opportunities tailored for your skills and background.
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Search, filter, and apply to job openings posted by trusted organizations supporting refugee and migrant communities.
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Tooltip title="Jobs added in the last week">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                      <Typography variant="caption" color="text.secondary">
                        48 new listings
                      </Typography>
                    </Box>
                  </Tooltip>
                  
                  <Tooltip title="Available in multiple languages">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                      <Typography variant="caption" color="text.secondary">
                        6 languages
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </CardContent>
              
              <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  endIcon={loading === 'jobs' ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  onClick={() => handleButtonClick('jobs')}
                  disabled={loading === 'jobs'}
                  sx={{ 
                    bgcolor: '#2A7D6F',
                    '&:hover': { bgcolor: '#236256' },
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  🔍 View Jobs
                </Button>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                  Real-time listings updated daily
                </Typography>
              </Box>
            </Card>
          </Zoom>
        </Grid>

        {/* Resume Builder Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Zoom in={showAnimation} style={{ transitionDelay: '200ms' }}>
            <Card 
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                transform: hoveredCard === 'resume' ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === 'resume' 
                  ? '0 12px 28px rgba(0,0,0,0.15)' 
                  : '0 6px 16px rgba(0,0,0,0.08)',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredCard('resume')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '6px', 
                bgcolor: '#D36135' 
              }} />
              
              <CardContent sx={{ p: 4, pb: 2 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha('#D36135', 0.1), 
                      color: '#D36135',
                      width: 56, 
                      height: 56,
                      mr: 2
                    }}
                  >
                    <Description sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#D36135' }}>
                    📄 Resume Builder
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Create impressive resumes and cover letters with AI guidance.
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use our smart resume builder to craft professional documents based on your experience, strengths, and language preference — no design skills needed!
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Tooltip title="Available templates">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assessment sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                      <Typography variant="caption" color="text.secondary">
                        12 templates
                      </Typography>
                    </Box>
                  </Tooltip>
                  
                  <Tooltip title="Success rate">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                      <Typography variant="caption" color="text.secondary">
                        4.8/5 rating
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </CardContent>
              
              <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  endIcon={loading === 'resume' ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  onClick={() => handleButtonClick('resume')}
                  disabled={loading === 'resume'}
                  sx={{ 
                    bgcolor: '#D36135',
                    '&:hover': { bgcolor: '#b8512e' },
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  ✍️ Build Resume
                </Button>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                  Save, edit, and download in PDF or Word
                </Typography>
              </Box>
            </Card>
          </Zoom>
        </Grid>

        {/* Training Programs Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Zoom in={showAnimation} style={{ transitionDelay: '300ms' }}>
            <Card 
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                transform: hoveredCard === 'training' ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === 'training' 
                  ? '0 12px 28px rgba(0,0,0,0.15)' 
                  : '0 6px 16px rgba(0,0,0,0.08)',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredCard('training')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '6px', 
                bgcolor: '#79854E' 
              }} />
              
              <CardContent sx={{ p: 4, pb: 2 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha('#79854E', 0.1), 
                      color: '#79854E',
                      width: 56, 
                      height: 56,
                      mr: 2
                    }}
                  >
                    <School sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#79854E' }}>
                    📚 Training & Vocational Programs
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  Build job-ready skills with guided training paths.
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Access self-paced and instructor-led programs to boost your confidence, gain certifications, and prepare for the workforce — in your native language.
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Tooltip title="Available courses">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <School sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                      <Typography variant="caption" color="text.secondary">
                        28 programs
                      </Typography>
                    </Box>
                  </Tooltip>
                  
                  <Tooltip title="Certification provided">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                      <Typography variant="caption" color="text.secondary">
                        18 certifications
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </CardContent>
              
              <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  endIcon={loading === 'training' ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  onClick={() => handleButtonClick('training')}
                  disabled={loading === 'training'}
                  sx={{ 
                    bgcolor: '#79854E',
                    '&:hover': { bgcolor: '#677244' },
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  🎓 View Programs
                </Button>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                  Includes free and sponsored courses
                </Typography>
              </Box>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Success Stories / Testimonials */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align={isMobile ? 'center' : 'left'}
          sx={{ 
            fontWeight: 700, 
            color: '#2A7D6F',
            mb: 4,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: isMobile ? '50%' : 0,
              transform: isMobile ? 'translateX(-50%)' : 'none',
              width: 60,
              height: 3,
              backgroundColor: '#D36135',
              borderRadius: 2
            }
          }}
        >
          Success Stories
        </Typography>
        
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: backgroundPattern,
              backgroundSize: '100% 100%',
              opacity: 0.4,
              pointerEvents: 'none',
              zIndex: 0
            }
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Fade in={showAnimation} timeout={800}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src="https://randomuser.me/api/portraits/women/32.jpg" 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        border: '3px solid #fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        mr: 2
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A7D6F' }}>
                        Amina Khalid
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Syrian refugee, now employed as UI Designer
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: alpha('#2A7D6F', 0.05), 
                    p: 2, 
                    borderRadius: 2,
                    borderLeft: `4px solid #2A7D6F`,
                    position: 'relative'
                  }}>
                    <FormatQuote sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      left: -10, 
                      color: alpha('#2A7D6F', 0.2),
                      fontSize: 40
                    }} />
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      After completing the resume builder and applying through the job board, I landed my first internship in my new country. Thank you, RNC!
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={8} sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#D36135', mb: 2 }}>
                How It Works
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Grow in={showAnimation} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                      <Box sx={{ 
                        bgcolor: alpha('#2A7D6F', 0.1), 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2A7D6F' }}>1</Typography>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Create Your Profile
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Set up your account with your skills, experience, and language preferences.
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Grow in={showAnimation} style={{ transformOrigin: '0 0 0' }} timeout={1500}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                      <Box sx={{ 
                        bgcolor: alpha('#D36135', 0.1), 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#D36135' }}>2</Typography>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Build Your Materials
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use our tools to create professional resumes and prepare for interviews.
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Grow in={showAnimation} style={{ transformOrigin: '0 0 0' }} timeout={2000}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                      <Box sx={{ 
                        bgcolor: alpha('#79854E', 0.1), 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#79854E' }}>3</Typography>
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Apply & Succeed
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Apply to jobs with confidence and get ongoing support as you grow your career.
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* Career Resources */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align={isMobile ? 'center' : 'left'}
          sx={{ 
            fontWeight: 700, 
            color: '#2A7D6F',
            mb: 4,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: isMobile ? '50%' : 0,
              transform: isMobile ? 'translateX(-50%)' : 'none',
              width: 60,
              height: 3,
              backgroundColor: '#D36135',
              borderRadius: 2
            }
          }}
        >
          Additional Resources
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3, 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                },
                height: '100%'
              }}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#2A7D6F', 0.1), color: '#2A7D6F' }}>
                    <School />
                  </Avatar>
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                    Career Guidance
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get personalized career advice from experts who understand the unique challenges faced by refugees.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <ArrowForward sx={{ fontSize: 16, color: '#2A7D6F' }} />
                  <Typography variant="body2" color="#2A7D6F" sx={{ ml: 1, fontWeight: 600 }}>
                    Schedule a session
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3, 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                },
                height: '100%'
              }}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#D36135', 0.1), color: '#D36135' }}>
                    <Work />
                  </Avatar>
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                    Industry Reports
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Access market analysis and employment trends to help you identify high-demand fields in your area.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <ArrowForward sx={{ fontSize: 16, color: '#D36135' }} />
                  <Typography variant="body2" color="#D36135" sx={{ ml: 1, fontWeight: 600 }}>
                    View reports
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3, 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                },
                height: '100%'
              }}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#79854E', 0.1), color: '#79854E' }}>
                    <Group />
                  </Avatar>
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                    Networking Events
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Connect with professionals and potential employers through regular virtual and in-person networking events.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <ArrowForward sx={{ fontSize: 16, color: '#79854E' }} />
                  <Typography variant="body2" color="#79854E" sx={{ ml: 1, fontWeight: 600 }}>
                    Find events
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3, 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                },
                height: '100%'
              }}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha('#8B5E83', 0.1), color: '#8B5E83' }}>
                    <EmojiEvents />
                  </Avatar>
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                    Mentorship Program
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get paired with experienced professionals in your field who can provide guidance and support as you build your career.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <ArrowForward sx={{ fontSize: 16, color: '#8B5E83' }} />
                  <Typography variant="body2" color="#8B5E83" sx={{ ml: 1, fontWeight: 600 }}>
                    Find a mentor
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Call to Action */}
      <Box 
        sx={{
          background: `linear-gradient(135deg, #2A7D6F 0%, #1a4d44 100%)`,
          color: '#fff',
          py: 6,
          textAlign: 'center',
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: backgroundPattern,
            backgroundSize: '50px 50px',
            opacity: 0.1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Start Your Career Journey?
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Join thousands of refugees who have found meaningful employment and professional growth through our platform.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: '#D36135',
                '&:hover': { bgcolor: '#b8512e' },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Create Account
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: '#fff',
                color: '#fff',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Browse Resources
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Partnership Application Section */}
      <Box sx={{ mb: 8 }}>
        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #F9F4EF 0%, #F2EAE1 100%)',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center'
            }}
          >
            {/* Left content - Text */}
            <Box 
              sx={{ 
                flex: 1, 
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: '#2A7D6F'
                }}
              >
                Partner With Us
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                Are you an employer looking to hire talented, motivated refugees?
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4 }}>
                Join our network of partner companies committed to creating inclusive workplaces 
                and providing opportunities for refugees to rebuild their careers. Our partnerships 
                help connect employers with diverse talent while supporting the economic 
                integration of refugees in their new communities.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <Avatar sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: '#2A7D6F' }}>
                    <Check />
                  </Avatar>
                  <Typography variant="body1" sx={{ ml: 1.5, fontWeight: 500 }}>
                    Access to diverse talent
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <Avatar sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: '#2A7D6F' }}>
                    <Check />
                  </Avatar>
                  <Typography variant="body1" sx={{ ml: 1.5, fontWeight: 500 }}>
                    Recruitment support
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: '#2A7D6F' }}>
                    <Check />
                  </Avatar>
                  <Typography variant="body1" sx={{ ml: 1.5, fontWeight: 500 }}>
                    Diversity & inclusion resources
                  </Typography>
                </Box>
              </Box>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  component={RouterLink}
                  to="/partnership-application"
                  variant="contained" 
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    bgcolor: '#2A7D6F',
                    '&:hover': { bgcolor: '#1B5A50' },
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    alignSelf: 'flex-start'
                  }}
                >
                  Apply for Partnership
                </Button>
              </motion.div>
            </Box>
            
            {/* Right content - Image */}
            <Box 
              sx={{ 
                flex: 1,
                position: 'relative',
                height: { xs: '300px', md: '450px' },
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src={partnershipPlaceholderImage}
                alt="Partnership with Refugee Network Centre"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50%',
                  background: 'linear-gradient(0deg, rgba(42,125,111,0.6) 0%, rgba(42,125,111,0) 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  width: '100%',
                  textAlign: 'center',
                  color: 'white',
                  px: 3
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Join 50+ partner companies
                </Typography>
                <Typography variant="body1">
                  creating opportunities for refugees
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default Career;
