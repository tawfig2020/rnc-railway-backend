import React, { useState } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, CardMedia, 
  CardActionArea, Chip, Button, Divider, Breadcrumbs, Link, Tab, Tabs,
  Paper, IconButton, useMediaQuery, useTheme, Tooltip, Pagination
} from '@mui/material';
import { 
  Event, Home, ChevronRight, CalendarMonth, LocationOn, 
  AccessTime, Groups, Share, BookmarkBorder, Bookmark, FilterList, Search
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [savedEvents, setSavedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sample event data - in a real app this would come from an API
  const events = [
    {
      id: 'event3',
      title: 'Digital Skills Workshop',
      category: 'education',
      date: 'November 15, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Learning Center, RNC',
      description: 'Learn essential digital skills including basic computer use, internet safety, and introduction to productivity tools.',
      image: '/assets/events/digital-workshop.jpg',
      featured: false,
      attendance: '45 attending',
      tags: ['Education', 'Digital Skills', 'Workshop']
    },
    {
      id: 'event4',
      title: 'Entrepreneurship Seminar',
      category: 'career',
      date: 'December 10, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Conference Hall, RNC',
      description: 'Discover how to start and grow your own business with expert guidance on business planning, funding opportunities, and marketing strategies.',
      image: '/assets/events/entrepreneurship.jpg',
      featured: false,
      attendance: '75 attending',
      tags: ['Career', 'Business', 'Education']
    },
    {
      id: 'event6',
      title: 'Language Exchange Meetup',
      category: 'education',
      date: 'December 28, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Cafe Area, RNC',
      description: 'Practice language skills in a casual setting. Participants can practice Malay, English, Arabic, and other languages with native speakers.',
      image: '/assets/events/language-exchange.jpg',
      featured: false,
      attendance: '35 attending',
      tags: ['Education', 'Languages', 'Social']
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleSaveEvent = (eventId) => {
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter(id => id !== eventId));
    } else {
      setSavedEvents([...savedEvents, eventId]);
    }
  };

  // Filter events based on selected tab
  const getFilteredEvents = () => {
    let filtered = [...events];
    
    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter(event => event.featured);
    } else if (tabValue === 2) {
      filtered = filtered.filter(event => event.category === 'career');
    } else if (tabValue === 3) {
      filtered = filtered.filter(event => event.category === 'education');
    } else if (tabValue === 4) {
      filtered = filtered.filter(event => ['community', 'youth'].includes(event.category));
    } else if (tabValue === 5) {
      filtered = filtered.filter(event => event.category === 'health' || event.category === 'support');
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const filteredEvents = getFilteredEvents();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(to bottom, #F9F4EF, rgba(249, 244, 239, 0.7))`,
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Event sx={{ mr: 0.5 }} fontSize="inherit" />
            Events
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Community Events
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Discover upcoming events, workshops, and gatherings that bring our community together.
          </Typography>
        </Box>

        {/* Search and Filter Bar */}
        <Paper 
          elevation={1}
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ 
            display: 'flex',
            width: isMobile ? '100%' : 'auto',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 2,
            py: 0.5
          }}>
            <Search color="action" sx={{ mr: 1 }} />
            <input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Filter Events">
              <IconButton 
                color="primary"
                onClick={() => setFiltersOpen(!filtersOpen)}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
            <Button
              component={RouterLink}
              to="/events/calendar"
              variant="outlined"
              color="primary"
              startIcon={<CalendarMonth />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Calendar View
            </Button>
          </Box>
        </Paper>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="event categories"
          sx={{
            mb: 4,
            '& .MuiTabs-indicator': {
              backgroundColor: '#2A7D6F',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              minWidth: 'auto',
              px: { xs: 1.5, sm: 3 },
            }
          }}
        >
          <Tab label="All Events" />
          <Tab label="Featured" />
          <Tab label="Career" />
          <Tab label="Education" />
          <Tab label="Community" />
          <Tab label="Support Services" />
        </Tabs>

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={3}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)'
                        }
                      }}
                    >
                      <CardActionArea component={RouterLink} to={`/events/${event.id}`}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="180"
                            image={event.image || '/assets/event-placeholder.jpg'}
                            alt={event.title}
                          />
                          {event.featured && (
                            <Chip
                              label="Featured"
                              color="secondary"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                        </Box>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                              {event.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSaveEvent(event.id);
                              }}
                              sx={{ color: savedEvents.includes(event.id) ? '#D36135' : 'text.secondary' }}
                            >
                              {savedEvents.includes(event.id) ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.date}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {event.location}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {event.description}
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {event.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(42, 125, 111, 0.1)',
                                  color: '#2A7D6F',
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      <Box
                        sx={{
                          p: 2,
                          pt: 0,
                          mt: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Groups fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.attendance}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/events/${event.id}`}
                          sx={{
                            color: '#2A7D6F',
                            '&:hover': {
                              bgcolor: 'rgba(42, 125, 111, 0.1)',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No events found matching your criteria.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => {
                setTabValue(0);
                setSearchQuery('');
              }}
              sx={{ mt: 2 }}
            >
              View All Events
            </Button>
          </Box>
        )}

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination 
            count={Math.ceil(filteredEvents.length / 9)} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Events;
