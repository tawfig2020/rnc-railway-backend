import React, { useState } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  CardMedia, Tabs, Tab, Divider, Button, Chip, 
  Paper, Avatar, IconButton
} from '@mui/material';
import { 
  Event, Article, History, CalendarMonth, 
  LocationOn, AccessTime, Share, BookmarkBorder
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Mock data for events
const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Refugee Employment Workshop",
    date: "June 25, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "RNC Community Hall",
    image: "https://source.unsplash.com/random/400x300/?workshop",
    description: "Join us for a comprehensive workshop on employment opportunities for refugees. Learn about resume building, interview skills, and connect with potential employers.",
    category: "Workshop"
  },
  {
    id: 2,
    title: "Cultural Exchange Bazaar",
    date: "July 10, 2025",
    time: "11:00 AM - 6:00 PM",
    location: "City Park",
    image: "https://source.unsplash.com/random/400x300/?bazaar",
    description: "Experience diverse cultures through food, crafts, and performances. Support refugee artisans and entrepreneurs while enjoying a day of cultural celebration.",
    category: "Bazaar"
  },
  {
    id: 3,
    title: "Language Learning Seminar",
    date: "July 18, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "RNC Learning Center",
    image: "https://source.unsplash.com/random/400x300/?language",
    description: "Discover effective methods for language acquisition and cultural integration. This seminar will feature expert speakers and interactive learning sessions.",
    category: "Seminar"
  }
];

const PRESS_RELEASES = [
  {
    id: 1,
    title: "RNC Receives Government Grant for Vocational Training",
    date: "June 10, 2025",
    author: "RNC Media Team",
    summary: "The Refugee Network Centre has been awarded a substantial grant to expand its vocational training programs, enabling more refugees to gain valuable skills for employment.",
    image: "https://source.unsplash.com/random/400x300/?grant"
  },
  {
    id: 2,
    title: "New Partnership with Tech Companies to Provide Digital Skills Training",
    date: "May 28, 2025",
    author: "RNC Media Team",
    summary: "Leading tech companies have partnered with RNC to offer digital skills training programs, creating pathways to employment in the technology sector for refugees.",
    image: "https://source.unsplash.com/random/400x300/?technology"
  },
  {
    id: 3,
    title: "RNC Annual Report Shows Significant Impact in Refugee Integration",
    date: "May 15, 2025",
    author: "RNC Media Team",
    summary: "The latest annual report reveals that RNC programs have successfully helped over 500 refugees find employment and housing in the past year.",
    image: "https://source.unsplash.com/random/400x300/?report"
  }
];

const PAST_EVENTS = [
  {
    id: 1,
    title: "International Refugee Day Celebration",
    date: "June 20, 2024",
    image: "https://source.unsplash.com/random/400x300/?celebration",
    summary: "Over 1,000 community members joined us to celebrate the resilience and contributions of refugees in our society.",
    gallery: ["https://source.unsplash.com/random/100x100/?refugee", "https://source.unsplash.com/random/100x100/?community", "https://source.unsplash.com/random/100x100/?celebration"]
  },
  {
    id: 2,
    title: "Entrepreneurship Workshop Series",
    date: "April 5-26, 2024",
    image: "https://source.unsplash.com/random/400x300/?entrepreneur",
    summary: "A four-week workshop series that equipped 50 refugees with business skills, resulting in 10 new small business launches.",
    gallery: ["https://source.unsplash.com/random/100x100/?business", "https://source.unsplash.com/random/100x100/?workshop", "https://source.unsplash.com/random/100x100/?entrepreneur"]
  },
  {
    id: 3,
    title: "Healthcare Access Forum",
    date: "March 12, 2024",
    image: "https://source.unsplash.com/random/400x300/?healthcare",
    summary: "Healthcare providers and refugees came together to address barriers to healthcare access and develop community solutions.",
    gallery: ["https://source.unsplash.com/random/100x100/?healthcare", "https://source.unsplash.com/random/100x100/?doctor", "https://source.unsplash.com/random/100x100/?hospital"]
  }
];

const GUEST_COLUMNS = [
  {
    id: 1,
    title: "The Power of Community Integration",
    author: "Sarah Johnson",
    role: "Volunteer Coordinator",
    date: "June 5, 2025",
    image: "https://source.unsplash.com/random/100x100/?woman",
    content: "After three years of volunteering with RNC, I've witnessed firsthand the transformative power of community integration programs. When refugees are welcomed and supported by local communities, both sides benefit immensely...",
  },
  {
    id: 2,
    title: "Education as a Path to Empowerment",
    author: "Dr. Ahmed Hassan",
    role: "Education Partner",
    date: "May 22, 2025",
    image: "https://source.unsplash.com/random/100x100/?professor",
    content: "As an educator working closely with refugee students, I've seen how access to quality education can completely transform lives. When we remove barriers to learning and provide tailored support...",
  },
  {
    id: 3,
    title: "From Refugee to Entrepreneur",
    author: "Fatima Al-Zahra",
    role: "Business Partner",
    date: "May 10, 2025",
    image: "https://source.unsplash.com/random/100x100/?entrepreneur",
    content: "My journey from arriving as a refugee to launching my own successful business was made possible through the support of organizations like RNC. The entrepreneurship program provided me with...",
  }
];

const EventsNews = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Events & News
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Stay informed and engaged with the latest happenings at the Refugee Network Centre
        </Typography>
        <Divider />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }
          }}
        >
          <Tab icon={<Event />} label="Upcoming Events" iconPosition="start" />
          <Tab icon={<Article />} label="Press Releases" iconPosition="start" />
          <Tab icon={<History />} label="Past Events" iconPosition="start" />
          <Tab icon={<Article />} label="Guest Columns" iconPosition="start" />
        </Tabs>

        {/* Upcoming Events Tab */}
        {tabValue === 0 && (
          <Box>
            <Grid container spacing={3}>
              {UPCOMING_EVENTS.map((event) => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Chip 
                        label={event.category} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 1 }} 
                      />
                      <Typography variant="h5" component="h2" gutterBottom>
                        {event.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        {event.description}
                      </Typography>
                      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary">
                          Register
                        </Button>
                        <Box>
                          <IconButton size="small">
                            <Share fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <BookmarkBorder fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="outlined" size="large">
                View All Events
              </Button>
            </Box>
          </Box>
        )}

        {/* Press Releases Tab */}
        {tabValue === 1 && (
          <Box>
            <Grid container spacing={3}>
              {PRESS_RELEASES.map((press) => (
                <Grid item xs={12} key={press.id}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={press.image}
                          alt={press.title}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography variant="caption" color="text.secondary">
                          {press.date} • {press.author}
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 1 }}>
                          {press.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {press.summary}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button variant="text" color="primary">
                            Read Full Press Release
                          </Button>
                          <Box>
                            <IconButton size="small">
                              <Share fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="outlined" size="large">
                View All Press Releases
              </Button>
            </Box>
          </Box>
        )}

        {/* Past Events Tab */}
        {tabValue === 2 && (
          <Box>
            <Grid container spacing={4}>
              {PAST_EVENTS.map((event) => (
                <Grid item xs={12} key={event.id}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={5}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={event.image}
                          alt={event.title}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <Typography variant="caption" color="text.secondary">
                          {event.date}
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 1 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {event.summary}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                          Event Gallery
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {event.gallery.map((img, index) => (
                            <Box 
                              key={index}
                              component="img"
                              src={img}
                              alt={`Gallery image ${index + 1}`}
                              sx={{ 
                                width: 80, 
                                height: 80, 
                                borderRadius: 1,
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }}
                            />
                          ))}
                          <Box 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'rgba(0,0,0,0.04)',
                              cursor: 'pointer'
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              +12 more
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button 
                          variant="outlined" 
                          color="primary"
                          sx={{ mt: 2 }}
                        >
                          View Event Details
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="outlined" size="large">
                View All Past Events
              </Button>
            </Box>
          </Box>
        )}

        {/* Guest Columns Tab */}
        {tabValue === 3 && (
          <Box>
            <Grid container spacing={4}>
              {GUEST_COLUMNS.map((column) => (
                <Grid item xs={12} key={column.id}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={column.image} 
                        alt={column.author}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" component="h3">
                          {column.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {column.role} • {column.date}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="h5" component="h2" gutterBottom>
                      {column.title}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {column.content}
                    </Typography>
                    
                    <Button 
                      variant="text" 
                      color="primary"
                    >
                      Read Full Article
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="outlined" size="large">
                View All Guest Columns
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default EventsNews;
