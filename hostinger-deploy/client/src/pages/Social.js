import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Button, List, ListItem, 
  ListItemText, ListItemIcon, Box, Paper, Breadcrumbs, Link, Tooltip, 
  Chip, Divider, CircularProgress, useMediaQuery, Menu, MenuItem, Fade, 
  Zoom, Grow, IconButton, Avatar, TextField, InputAdornment, Tab, Tabs,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { 
  People, Group, Event, LocationOn, Chat, Home, ChevronRight, Translate,
  Search, NotificationsNone, VolunteerActivism, ArrowForward, CheckCircle,
  PersonAdd, Place, AccessTime, Language, SupportAgent, Psychology, School,
  LocalLibrary, Healing, Forum, CelebrationOutlined, DateRange, SupervisedUserCircle,
  Public, Phone, DevicesOutlined
} from '@mui/icons-material';

const Social = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for interactive elements
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [language, setLanguage] = useState('en'); // For multilingual support
  const [openDialog, setOpenDialog] = useState(null);
  
  // Display animations after initial render
  useEffect(() => {
    setShowAnimation(true);
  }, []);
  
  // Simulate loading when buttons are clicked
  const handleButtonClick = (action) => {
    setLoading(action);
    setTimeout(() => setLoading(false), 1500);
  };
  
  // Handle dialog open/close
  const handleOpenDialog = (dialogType) => {
    setOpenDialog(dialogType);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(null);
  };
  
  // Background pattern for visual interest
  const backgroundPattern = `radial-gradient(circle at 50% 0, rgba(121, 133, 78, 0.1), rgba(121, 133, 78, 0.05) 70%, transparent 1.5rem),
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Group sx={{ mr: 0.5 }} fontSize="inherit" />
            Community & Social Support
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
            Community & Social Support
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            Connect with others who understand your journey, access support services, and participate in community events.
          </Typography>
          
          {/* Search & Filter Bar */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 1, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 3,
              maxWidth: 700,
              mx: 'auto',
              mb: 3
            }}
          >
            <TextField
              placeholder="Search communities, events or services..."
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#2A7D6F', 
                borderRadius: 2,
                '&:hover': { bgcolor: '#236256' }
              }}
            >
              Search
            </Button>
          </Paper>
        </Box>
      
        {/* Main Feature Cards */}
        <Grid container spacing={6} sx={{ mt: 2, mb: 6 }}>
          {/* Community Groups Card */}
          <Grid item xs={12} sm={6} lg={4}>
            <Zoom in={showAnimation} style={{ transitionDelay: '100ms' }}>
              <Card 
                elevation={4}
                sx={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'groups' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredCard === 'groups' 
                    ? '0 12px 28px rgba(0,0,0,0.15)' 
                    : '0 6px 16px rgba(0,0,0,0.08)',
                  position: 'relative',
                  background: 'linear-gradient(to bottom right, white, #f9f9f9)'
                }}
                onMouseEnter={() => setHoveredCard('groups')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '8px', 
                  bgcolor: '#2A7D6F'
                }} />
                
                <CardContent sx={{ p: 4, pb: 2 }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha('#2A7D6F', 0.1), 
                        color: '#2A7D6F',
                        width: 64, 
                        height: 64,
                        mr: 2,
                        transition: 'all 0.3s ease',
                        transform: hoveredCard === 'groups' ? 'rotate(5deg)' : 'rotate(0deg)',
                      }}
                    >
                      <SupervisedUserCircle sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2A7D6F' }}>
                      👥 Community Groups
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Join support groups that understand your journey.
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Find and connect with local and online groups that share your background, interests, language, or challenges. Build friendships, exchange ideas, and grow together.
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      size="small" 
                      label="Cultural" 
                      sx={{ bgcolor: alpha('#2A7D6F', 0.1), color: '#2A7D6F' }} 
                    />
                    <Chip 
                      size="small" 
                      label="Educational" 
                      sx={{ bgcolor: alpha('#D36135', 0.1), color: '#D36135' }} 
                    />
                    <Chip 
                      size="small" 
                      label="Mental Health" 
                      sx={{ bgcolor: alpha('#79854E', 0.1), color: '#79854E' }} 
                    />
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    size="large"
                    endIcon={loading === 'groups' ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                    onClick={() => handleButtonClick('groups')}
                    disabled={loading === 'groups'}
                    sx={{ 
                      bgcolor: '#2A7D6F',
                      '&:hover': { bgcolor: '#236256' },
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    🔎 Find Groups
                  </Button>
                </Box>
              </Card>
            </Zoom>
          </Grid>

          {/* Community Events Card */}
          <Grid item xs={12} sm={6} lg={4}>
            <Zoom in={showAnimation} style={{ transitionDelay: '200ms' }}>
              <Card 
                elevation={4}
                sx={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'events' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredCard === 'events' 
                    ? '0 12px 28px rgba(0,0,0,0.15)' 
                    : '0 6px 16px rgba(0,0,0,0.08)',
                  position: 'relative',
                  background: 'linear-gradient(to bottom right, white, #f9f9f9)'
                }}
                onMouseEnter={() => setHoveredCard('events')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '8px', 
                  bgcolor: '#D36135'
                }} />
                
                <CardContent sx={{ p: 4, pb: 2 }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha('#D36135', 0.1), 
                        color: '#D36135',
                        width: 64, 
                        height: 64,
                        mr: 2,
                        transition: 'all 0.3s ease',
                        transform: hoveredCard === 'events' ? 'rotate(5deg)' : 'rotate(0deg)',
                      }}
                    >
                      <CelebrationOutlined sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#D36135' }}>
                      📅 Community Events
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Celebrate, learn, and participate in meaningful gatherings.
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Discover upcoming events, workshops, festivals, and support circles happening near you or online. Stay engaged and feel at home.
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Tooltip title="New this week">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateRange sx={{ fontSize: 16, mr: 0.5, color: '#D36135' }} />
                        <Typography variant="caption" color="text.secondary">
                          12 upcoming events
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="Available online">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DevicesOutlined sx={{ fontSize: 16, mr: 0.5, color: '#D36135' }} />
                        <Typography variant="caption" color="text.secondary">
                          8 virtual events
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
                    endIcon={loading === 'events' ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                    onClick={() => handleButtonClick('events')}
                    disabled={loading === 'events'}
                    sx={{ 
                      bgcolor: '#D36135',
                      '&:hover': { bgcolor: '#b8512e' },
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    🎉 View Events
                  </Button>
                  <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                    Events updated weekly — check back often!
                  </Typography>
                </Box>
              </Card>
            </Zoom>
          </Grid>

          {/* Support Services Card */}
          <Grid item xs={12} sm={6} lg={4}>
            <Zoom in={showAnimation} style={{ transitionDelay: '300ms' }}>
              <Card 
                elevation={4}
                sx={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'support' ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredCard === 'support' 
                    ? '0 12px 28px rgba(0,0,0,0.15)' 
                    : '0 6px 16px rgba(0,0,0,0.08)',
                  position: 'relative',
                  background: 'linear-gradient(to bottom right, white, #f9f9f9)'
                }}
                onMouseEnter={() => setHoveredCard('support')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '8px', 
                  bgcolor: '#79854E'
                }} />
                
                <CardContent sx={{ p: 4, pb: 2 }}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha('#79854E', 0.1), 
                        color: '#79854E',
                        width: 64, 
                        height: 64,
                        mr: 2,
                        transition: 'all 0.3s ease',
                        transform: hoveredCard === 'support' ? 'rotate(5deg)' : 'rotate(0deg)',
                      }}
                    >
                      <SupportAgent sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#79854E' }}>
                      🧑‍⚕️ Support Services
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Access free, confidential help when you need it most.
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Browse mental health, legal, housing, education, and counseling services — tailored for refugees and migrants. Available in multiple languages.
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Tooltip title="Available languages">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Language sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                        <Typography variant="caption" color="text.secondary">
                          6 languages
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    <Tooltip title="24/7 Support">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 16, mr: 0.5, color: '#79854E' }} />
                        <Typography variant="caption" color="text.secondary">
                          Always available
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
                    endIcon={loading === 'support' ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                    onClick={() => handleButtonClick('support')}
                    disabled={loading === 'support'}
                    sx={{ 
                      bgcolor: '#79854E',
                      '&:hover': { bgcolor: '#677244' },
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    🤝 Get Support
                  </Button>
                  <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1 }}>
                    Trained professionals ready to assist you
                  </Typography>
                </Box>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
        {/* Community Resources Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: '#2A7D6F', 
              mb: 3, 
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              fontWeight: 600,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                backgroundColor: '#D36135',
                borderRadius: 2
              }
            }}
          >
            Additional Resources
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Grow in={showAnimation} style={{ transformOrigin: '0 0 0', transitionDelay: '400ms' }}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 4,
                    overflow: 'hidden',
                    height: '100%',
                    background: 'linear-gradient(to bottom right, white, #f9f9f9)'
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#2A7D6F', mb: 1 }}>
                        <Public sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                        Community Resources
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Discover additional resources to help you settle and thrive in your new community.
                      </Typography>
                    </Box>
                    
                    <List sx={{ p: 0 }}>
                      <ListItem 
                        button
                        sx={{ 
                          py: 2,
                          borderBottom: '1px solid rgba(0,0,0,0.06)',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: alpha('#2A7D6F', 0.04) }
                        }}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: alpha('#2A7D6F', 0.1), color: '#2A7D6F' }}>
                            <LocationOn />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              Local Services Directory
                            </Typography>
                          } 
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Find nearby health clinics, legal aid, education, housing and food assistance
                            </Typography>
                          } 
                        />
                        <ChevronRight color="action" />
                      </ListItem>
                      
                      <ListItem 
                        button
                        sx={{ 
                          py: 2,
                          borderBottom: '1px solid rgba(0,0,0,0.06)',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: alpha('#D36135', 0.04) }
                        }}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: alpha('#D36135', 0.1), color: '#D36135' }}>
                            <Forum />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              Online Forums & Discussions
                            </Typography>
                          } 
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Connect with others, ask questions, and share your experiences in moderated forums
                            </Typography>
                          } 
                        />
                        <Chip 
                          label="New" 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha('#D36135', 0.1), 
                            color: '#D36135',
                            fontWeight: 500,
                            mr: 1
                          }} 
                        />
                        <ChevronRight color="action" />
                      </ListItem>
                      
                      <ListItem 
                        button
                        sx={{ 
                          py: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: alpha('#79854E', 0.04) }
                        }}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: alpha('#79854E', 0.1), color: '#79854E' }}>
                            <VolunteerActivism />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              Volunteer Opportunities
                            </Typography>
                          } 
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Contribute to your community, gain experience, and build local connections
                            </Typography>
                          } 
                        />
                        <ChevronRight color="action" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
            
            {/* Buddy Match Feature */}
            <Grid item xs={12} md={4}>
              <Grow in={showAnimation} style={{ transitionDelay: '500ms' }}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 4,
                    overflow: 'hidden',
                    height: '100%',
                    background: 'linear-gradient(145deg, #2A7D6F 0%, #236256 100%)',
                    color: 'white',
                    position: 'relative',
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%',
                      opacity: 0.1,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-20 20l1.732 1-10 17.32-1.732-1 10-17.32zM58.16 4.134l1 1.732-17.32 10-1-1.732 17.32-10zm-40 40l1 1.732-17.32 10-1-1.732 17.32-10zM80 9v2H60V9h20zM20 69v2H0v-2h20zm79.32-55l-1 1.732-17.32-10L82 4l17.32 10zm-80 80l-1 1.732-17.32-10L2 84l17.32 10zm96.546-75.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM38.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zM60 29v2H40v-2h20zm19.32 5l-1 1.732-17.32-10L62 24l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM111 40h-2V20h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zM40 49v2H20v-2h20zm19.32 5l-1 1.732-17.32-10L42 44l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM91 60h-2V40h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM39.32 74l-1 1.732-17.32-10L22 64l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM71 80h-2V60h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM120 89v2h-20v-2h20zm-84.134 9.16l-1.732 1-10-17.32 1.732-1 10 17.32zM51 100h-2V80h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM100 109v2H80v-2h20zm19.32 5l-1 1.732-17.32-10 1-1.732 17.32 10zM31 120h-2v-20h2v20z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                      pointerEvents: 'none'
                    }}
                  />
                  <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          width: 56, 
                          height: 56,
                          mr: 2 
                        }}
                      >
                        <PersonAdd sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Buddy Match
                      </Typography>
                    </Box>
                    
                    <Typography sx={{ mb: 3, fontWeight: 300 }}>
                      Get matched with an experienced community member who can help guide you in your new home.
                    </Typography>
                    
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      mb: 3,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircle sx={{ fontSize: 18, mr: 1 }} /> Personal guidance & support
                      </Typography>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircle sx={{ fontSize: 18, mr: 1 }} /> Language & cultural exchange
                      </Typography>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ fontSize: 18, mr: 1 }} /> Friendship & community connection
                      </Typography>
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        bgcolor: 'white', 
                        color: '#2A7D6F',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)'
                        },
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2
                      }}
                      onClick={() => handleOpenDialog('buddy')}
                    >
                      Find a Buddy
                    </Button>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>
        
        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4, 
            mt: 6,
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(211, 97, 53, 0.1) 0%, rgba(121, 133, 78, 0.1) 100%)',
            border: '1px solid rgba(211, 97, 53, 0.2)'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: '#D36135', fontWeight: 600 }}>
            Join Our Supportive Community Today
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
            Sign up for an account to connect with other community members, receive personalized recommendations, and stay updated on events and resources.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: '#D36135',
                '&:hover': { bgcolor: '#b8512e' },
                borderRadius: 2,
                px: 4
              }}
            >
              Sign Up
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: '#79854E',
                color: '#79854E',
                '&:hover': { borderColor: '#79854E', bgcolor: 'rgba(121, 133, 78, 0.04)' },
                borderRadius: 2,
                px: 4
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
        
        {/* Buddy Match Dialog */}
        <Dialog
          open={openDialog === 'buddy'}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#2A7D6F', color: 'white', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonAdd sx={{ mr: 1 }} />
              Buddy Match Registration
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Fill out this form to be matched with a community buddy who can help guide you in your new home.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Preferred Language"
                  fullWidth
                  variant="outlined"
                  size="small"
                  select
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ar">Arabic</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fa">Persian</MenuItem>
                  <MenuItem value="sw">Swahili</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country of Origin"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="What are you interested in getting help with?"
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCloseDialog}
              sx={{ 
                bgcolor: '#2A7D6F',
                '&:hover': { bgcolor: '#236256' }
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Social;
