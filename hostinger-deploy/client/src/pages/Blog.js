import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Link as RouterLink } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// MUI Components
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Avatar,
  Chip,
  CardMedia,
  CardActionArea,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';

// Icons
import {
  Search,
  ArrowForward,
  Bookmark,
  BookmarkBorder,
  Clear,
  EventNote,
  School,
  MedicalServices,
  Work,
  People,
  LanguageOutlined,
} from '@mui/icons-material';

// Styles
const styles = {
  featuredCard: (theme) => ({
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: theme.shadows[8],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[12],
      '& .MuiCardMedia-root': {
        transform: 'scale(1.05)',
      },
    },
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
  }),
  blogCard: (theme) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    overflow: 'hidden',
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
      '& .MuiCardMedia-root': {
        transform: 'scale(1.05)',
      },
    },
  }),
  cardMedia: {
    transition: 'transform 0.5s ease-in-out',
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  tagChip: (theme) => ({
    mr: 1,
    mb: 1,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.dark,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  }),
  searchInput: (theme) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 50,
    '& .MuiOutlinedInput-root': {
      borderRadius: 50,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }),
};

const Blog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPosts, setSavedPosts] = useState(() => {
    // Load saved posts from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedPosts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const postsPerPage = 6;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: true
    });
  }, []);

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
      } 
    },
  };

  // Sample data for the blog
  const mockPosts = [
    {
      id: 1,
      title: "My Journey from Survival to Start-up",
      author: "Fatima Al-Hariri",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      image: "https://images.unsplash.com/photo-1607748851687-ba9a10438621",
      excerpt: "When I fled Syria in 2018, I never imagined that three years later I would be running my own catering business.",
      date: "May 15, 2023",
      readTime: 8,
      tags: ["Entrepreneurship", "Success Stories"],
    },
    {
      id: 2,
      title: "Education Without Borders: Learning in Transit",
      author: "Mohammed Khan",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754",
      excerpt: "How refugee children are continuing their education despite displacement and uncertainty.",
      date: "May 2, 2023",
      readTime: 5,
      tags: ["Education", "Children"],
    },
    {
      id: 3,
      title: "The Art of Resilience: Creative Expression in Refugee Camps",
      author: "Amara Okafor",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      image: "https://images.unsplash.com/photo-1518398046578-8cca57782e17",
      excerpt: "How art programs in refugee camps are helping people process trauma and preserve cultural identity.",
      date: "April 28, 2023",
      readTime: 6,
      tags: ["Art", "Culture"],
    },
  ];

  const popularTopics = [
    { name: 'Education', count: 42, icon: <School /> },
    { name: 'Health', count: 31, icon: <MedicalServices /> },
    { name: 'Employment', count: 38, icon: <Work /> },
    { name: 'Community', count: 24, icon: <People /> },
    { name: 'Language', count: 29, icon: <LanguageOutlined /> },
  ];

  const upcomingEvents = [
    { title: 'Career Workshop', date: 'June 10', location: 'Community Center' },
    { title: 'Language Exchange', date: 'June 15', location: 'Virtual' },
    { title: 'Health Clinic', date: 'June 18', location: 'Downtown Hub' },
  ];

  // Toggle save post functionality
  const toggleSave = (postId) => {
    setSavedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  // Filtered posts based on search query and active tab
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'saved') return matchesSearch && savedPosts.includes(post.id);
    
    return matchesSearch;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Loading state UI
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Loading stories...
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <Box sx={{ height: 200, bgcolor: 'rgba(0, 0, 0, 0.08)' }} />
                <CardContent>
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', height: 24, width: '60%', mb: 2 }} />
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', height: 16, width: '90%', mb: 1 }} />
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', height: 16, width: '80%', mb: 1 }} />
                  <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)', height: 16, width: '40%' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div variants={fadeInUpVariants}>
          <Typography 
            variant="h3" 
            component="h1" 
            align="center" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: 'linear-gradient(90deg, #2A7D6F 0%, #79854E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              lineHeight: 1.2
            }}
            data-aos="fade-up"
          >
            Stories from Our Community
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 6, maxWidth: 800, mx: 'auto', mt: 3 }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Discover inspiring stories, cultural insights, and achievements from our global refugee community.
          </Typography>
        </motion.div>
        
        {/* Search Bar */}
        <Box sx={{ mb: 6 }}>
          <animated.div>
            <TextField
              fullWidth
              placeholder="Search for stories, topics, or authors..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 700,
                mx: 'auto',
                display: 'flex',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 50,
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </animated.div>
        </Box>

        {/* Main Content and Sidebar Layout */}
        <Grid container spacing={4}>
          {/* Main Content Area */}
          <Grid item xs={12} md={8}>
            {/* Blog Posts Grid */}
            <Grid container spacing={4}>
              {currentPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card sx={styles.blogCard(theme)}>
                    <CardActionArea component={RouterLink} to={`/blog/${post.id}`}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.image}
                        alt={post.title}
                        sx={styles.cardMedia}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(42, 125, 111, 0.1)', 
                                color: 'primary.main',
                                fontWeight: 500,
                              }} 
                            />
                          ))}
                        </Box>
                        
                        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
                          {post.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                          {post.excerpt.substring(0, 120)}...
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar src={post.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {post.author}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {post.date} • {post.readTime} min read
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Button 
                            variant="text" 
                            color="primary"
                            endIcon={<ArrowForward />}
                            sx={{ fontWeight: 500 }}
                          >
                            Read More
                          </Button>
                          <Box>
                            <IconButton 
                              size="small"
                              onClick={() => toggleSave(post.id)}
                              color={savedPosts.includes(post.id) ? 'primary' : 'default'}
                            >
                              {savedPosts.includes(post.id) ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Load More Button */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{ px: 4 }}
              >
                Load More Stories
              </Button>
            </Box>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Share Your Story Card */}
            <Card sx={{ mb: 4, borderRadius: 16, bgcolor: '#2A7D6F', color: 'white' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Share Your Story
                </Typography>
                <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                  Your journey matters. Submit your story to inspire others and connect with our global community.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  sx={{ fontWeight: 600, bgcolor: '#D36135' }}
                >
                  Submit Now
                </Button>
              </CardContent>
            </Card>
            
            {/* Popular Topics */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 16 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Popular Topics
              </Typography>
              <List sx={{ p: 0 }}>
                {popularTopics.map((topic, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      px: 0, 
                      py: 1,
                      borderBottom: index < popularTopics.length - 1 ? '1px solid #eee' : 'none',
                    }}
                    button
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: '#2A7D6F' }}>
                        {topic.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={topic.name} 
                      secondary={`${topic.count} articles`} 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <ArrowForward fontSize="small" sx={{ color: '#2A7D6F' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {/* Upcoming Events */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 16 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Upcoming Events
              </Typography>
              <List sx={{ p: 0 }}>
                {upcomingEvents.map((event, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      px: 0, 
                      py: 1.5,
                      borderBottom: index < upcomingEvents.length - 1 ? '1px solid #eee' : 'none',
                    }}
                    button
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'rgba(211, 97, 53, 0.1)', color: '#D36135' }}>
                        <EventNote />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={event.title} 
                      secondary={`${event.date} • ${event.location}`} 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                sx={{ mt: 2 }}
              >
                View All Events
              </Button>
            </Paper>
            
            {/* Newsletter Signup */}
            <Paper sx={{ p: 3, borderRadius: 16, bgcolor: '#F9F4EF' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Subscribe to Newsletter
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                Get the latest stories and updates delivered to your inbox.
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Your email address"
                size="small"
                sx={{ mb: 2, bgcolor: 'white' }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ bgcolor: '#2A7D6F' }}
              >
                Subscribe
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Blog;
