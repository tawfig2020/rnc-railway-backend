import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Avatar,
  Chip,
  CardMedia,
  CardActionArea,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  IconButton,
  LinearProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  Collapse,
  TextareaAutosize,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Search,
  FilterList,
  VolunteerActivism,
  People,
  Business,
  Lightbulb,
  Public,
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  LocationOn,
  CalendarToday,
  ArrowForward,
  Close,
  Send,
  Comment,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

const CommunityProjects = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for project submission dialog
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    fundingGoal: '',
    tags: []
  });
  const [formErrors, setFormErrors] = useState({});
  
  // State for project interaction
  const [likedProjects, setLikedProjects] = useState([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [supportedProjects, setSupportedProjects] = useState([]);
  
  // State for comments
  const [projectComments, setProjectComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  
  // Success messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load user interactions from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedProjects');
    const savedBookmarks = localStorage.getItem('bookmarkedProjects');
    const savedSupports = localStorage.getItem('supportedProjects');
    const savedComments = localStorage.getItem('projectComments');
    
    if (savedLikes) setLikedProjects(JSON.parse(savedLikes));
    if (savedBookmarks) setBookmarkedProjects(JSON.parse(savedBookmarks));
    if (savedSupports) setSupportedProjects(JSON.parse(savedSupports));
    if (savedComments) setProjectComments(JSON.parse(savedComments));
  }, []);
  
  // Save user interactions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
    localStorage.setItem('bookmarkedProjects', JSON.stringify(bookmarkedProjects));
    localStorage.setItem('supportedProjects', JSON.stringify(supportedProjects));
    localStorage.setItem('projectComments', JSON.stringify(projectComments));
  }, [likedProjects, bookmarkedProjects, supportedProjects, projectComments]);

  // Sample community projects
  const projects = [
    {
      id: 1,
      title: 'Refugee Tech Hub',
      category: 'Social Enterprise',
      description: 'A collaborative space where refugees can develop tech skills, work on projects, and connect with mentors in the industry.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Berlin, Germany',
      participants: 45,
      progress: 75,
      fundingGoal: 15000,
      fundingCurrent: 11250,
      tags: ['Technology', 'Education', 'Entrepreneurship'],
      founder: {
        name: 'Amir Hassan',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Tech Entrepreneur'
      }
    },
    {
      id: 2,
      title: 'Cultural Cuisine Cooperative',
      category: 'Social Enterprise',
      description: 'A food cooperative that celebrates refugee culinary traditions while providing employment opportunities and cultural exchange.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Paris, France',
      participants: 28,
      progress: 90,
      fundingGoal: 10000,
      fundingCurrent: 9000,
      tags: ['Food', 'Culture', 'Employment'],
      founder: {
        name: 'Fatima Khalil',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        role: 'Chef & Community Organizer'
      }
    },
    {
      id: 3,
      title: 'Artisan Craft Collective',
      category: 'Local Initiative',
      description: 'A collective of refugee artisans preserving traditional crafts and creating sustainable livelihoods through fair trade sales.',
      image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Toronto, Canada',
      participants: 32,
      progress: 60,
      fundingGoal: 8000,
      fundingCurrent: 4800,
      tags: ['Crafts', 'Culture', 'Sustainable Business'],
      founder: {
        name: 'Nadia Ahmed',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        role: 'Artisan & Entrepreneur'
      }
    },
    {
      id: 4,
      title: 'Community Garden Initiative',
      category: 'Local Initiative',
      description: 'A urban agriculture project that provides fresh produce, therapeutic activities, and community building for refugee families.',
      image: 'https://images.unsplash.com/photo-1590856029620-9f6d3fdcf41f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Melbourne, Australia',
      participants: 54,
      progress: 85,
      fundingGoal: 6000,
      fundingCurrent: 5100,
      tags: ['Agriculture', 'Sustainability', 'Mental Health'],
      founder: {
        name: 'Ibrahim Osman',
        avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
        role: 'Urban Farming Specialist'
      }
    },
    {
      id: 5,
      title: 'Refugee Youth Mentorship',
      category: 'Local Initiative',
      description: 'Connects refugee youth with mentors in their fields of interest to provide guidance, support, and opportunities.',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'Stockholm, Sweden',
      participants: 76,
      progress: 65,
      fundingGoal: 12000,
      fundingCurrent: 7800,
      tags: ['Youth', 'Education', 'Mentorship'],
      founder: {
        name: 'Sofia Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        role: 'Education Consultant'
      }
    },
    {
      id: 6,
      title: 'Digital Storytelling Archive',
      category: 'Cultural Project',
      description: 'A digital platform preserving and sharing refugee stories, cultural heritage, and oral histories through multimedia.',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      location: 'New York, USA',
      participants: 40,
      progress: 50,
      fundingGoal: 20000,
      fundingCurrent: 10000,
      tags: ['Technology', 'Culture', 'History'],
      founder: {
        name: 'Ahmed Khalid',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        role: 'Digital Media Specialist'
      }
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Project submission dialog handlers
  const handleOpenSubmitDialog = () => {
    setOpenSubmitDialog(true);
  };
  
  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
    setFormErrors({});
  };
  
  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({
      ...projectFormData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateProjectForm = () => {
    const errors = {};
    if (!projectFormData.title.trim()) errors.title = 'Project title is required';
    if (!projectFormData.category) errors.category = 'Please select a category';
    if (!projectFormData.description.trim()) errors.description = 'Project description is required';
    if (!projectFormData.location.trim()) errors.location = 'Location is required';
    if (!projectFormData.fundingGoal || isNaN(projectFormData.fundingGoal)) {
      errors.fundingGoal = 'Please enter a valid funding goal amount';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitProject = () => {
    if (!validateProjectForm()) return;
    
    // Here you would typically make an API call to save the project
    console.log('Submitting project:', projectFormData);
    
    // For demo purposes, show success message
    setSnackbar({
      open: true,
      message: 'Your project has been submitted successfully! It will be reviewed by our team.',
      severity: 'success'
    });
    
    // Close dialog and reset form
    setOpenSubmitDialog(false);
    setProjectFormData({
      title: '',
      category: '',
      description: '',
      location: '',
      fundingGoal: '',
      tags: []
    });
  };
  
  // Project interaction handlers
  const handleToggleLike = (projectId) => {
    if (likedProjects.includes(projectId)) {
      setLikedProjects(likedProjects.filter(id => id !== projectId));
    } else {
      setLikedProjects([...likedProjects, projectId]);
      setSnackbar({
        open: true,
        message: 'Project liked! Thanks for your support.',
        severity: 'success'
      });
    }
  };
  
  const handleToggleBookmark = (projectId) => {
    if (bookmarkedProjects.includes(projectId)) {
      setBookmarkedProjects(bookmarkedProjects.filter(id => id !== projectId));
    } else {
      setBookmarkedProjects([...bookmarkedProjects, projectId]);
      setSnackbar({
        open: true,
        message: 'Project saved to your bookmarks!',
        severity: 'success'
      });
    }
  };
  
  const handleSupportProject = (projectId) => {
    if (!supportedProjects.includes(projectId)) {
      setSupportedProjects([...supportedProjects, projectId]);
      setSnackbar({
        open: true,
        message: 'Thank you for supporting this project!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'You are already supporting this project. Thank you!',
        severity: 'info'
      });
    }
  };
  
  const handleShareProject = (project) => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href + '?project=' + project.id,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      // Copy link to clipboard
      navigator.clipboard.writeText(window.location.href + '?project=' + project.id)
        .then(() => {
          setSnackbar({
            open: true,
            message: 'Project link copied to clipboard!',
            severity: 'success'
          });
        })
        .catch(err => console.log('Error copying text: ', err));
    }
  };
  
  // Comment functionality
  const handleCommentChange = (projectId, value) => {
    setCommentInputs({
      ...commentInputs,
      [projectId]: value
    });
  };
  
  const handleToggleComments = (projectId) => {
    setExpandedComments({
      ...expandedComments,
      [projectId]: !expandedComments[projectId]
    });
  };
  
  const handleSubmitComment = (projectId) => {
    const commentText = commentInputs[projectId]?.trim();
    if (!commentText) return;
    
    const newComment = {
      id: Date.now(),
      text: commentText,
      author: 'Current User',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: new Date().toISOString()
    };
    
    const existingComments = projectComments[projectId] || [];
    const updatedComments = [newComment, ...existingComments];
    
    setProjectComments({
      ...projectComments,
      [projectId]: updatedComments
    });
    
    // Clear input
    setCommentInputs({
      ...commentInputs,
      [projectId]: ''
    });
    
    // Ensure comments are expanded
    setExpandedComments({
      ...expandedComments,
      [projectId]: true
    });
  };
  
  // Snackbar close handler
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Filter projects based on search query and selected tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All Projects
    if (tabValue === 1) return matchesSearch && project.category === 'Social Enterprise';
    if (tabValue === 2) return matchesSearch && project.category === 'Local Initiative';
    if (tabValue === 3) return matchesSearch && project.category === 'Cultural Project';
    
    return false;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 1 }}>
        Community Projects
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
        Discover and support refugee-led initiatives and social enterprise projects making a difference in communities around the world.
      </Typography>

      {/* Project Feature Banner */}
      <Paper 
        elevation={3}
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          mb: 6,
          backgroundImage: 'linear-gradient(to right, rgba(42, 125, 111, 0.9), rgba(42, 125, 111, 0.7)), url(https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ p: { xs: 3, md: 6 }, color: 'white' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1 }}>
                FEATURED PROJECT
              </Typography>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700, my: 2 }}>
                Launch Your Own Community Initiative
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, maxWidth: 600 }}>
                Have an idea that could benefit your community? We provide resources, funding connections, and mentorship to help you turn your vision into reality.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={handleOpenSubmitDialog}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(211, 97, 53, 0.4)',
                }}
              >
                Submit Your Project Idea
              </Button>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)', 
                  p: 3, 
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  How It Works
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Lightbulb sx={{ mr: 2, color: theme.palette.secondary.light }} />
                  <Box>
                    <Typography variant="subtitle2">Submit Your Idea</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Share your vision with our community</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <People sx={{ mr: 2, color: theme.palette.secondary.light }} />
                  <Box>
                    <Typography variant="subtitle2">Build Your Team</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Connect with others who share your passion</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Business sx={{ mr: 2, color: theme.palette.secondary.light }} />
                  <Box>
                    <Typography variant="subtitle2">Access Resources</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Get funding, mentorship, and support</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              startIcon={<FilterList />}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All Projects" />
          <Tab label="Social Enterprises" />
          <Tab label="Local Initiatives" />
          <Tab label="Cultural Projects" />
        </Tabs>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
              },
              overflow: 'hidden',
            }}>
              <CardActionArea>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16, 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 4,
                    py: 0.5,
                    px: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    <Typography variant="caption" fontWeight={600} color="primary">
                      {project.category}
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={project.founder.avatar} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">
                        {project.founder.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.founder.role}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                    {project.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.participants} participants
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Funding Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${project.fundingCurrent} of ${project.fundingGoal}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.progress} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        mb: 0.5,
                        bgcolor: 'rgba(0,0,0,0.05)'
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {project.progress}% funded
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {project.tags.map((tag, index) => (
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
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      sx={{ px: 3 }}
                      onClick={() => handleSupportProject(project.id)}
                      disabled={supportedProjects.includes(project.id)}
                    >
                      {supportedProjects.includes(project.id) ? 'Supported' : 'Support'}
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleLike(project.id)}
                        color={likedProjects.includes(project.id) ? 'secondary' : 'default'}
                      >
                        {likedProjects.includes(project.id) ? 
                          <Favorite fontSize="small" /> : 
                          <FavoriteBorder fontSize="small" />}
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleShareProject(project)}
                      >
                        <Share fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleBookmark(project.id)}
                        color={bookmarkedProjects.includes(project.id) ? 'primary' : 'default'}
                      >
                        {bookmarkedProjects.includes(project.id) ? 
                          <Bookmark fontSize="small" /> : 
                          <BookmarkBorder fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {/* Comments section */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      startIcon={<Comment />}
                      endIcon={expandedComments[project.id] ? <ExpandLess /> : <ExpandMore />}
                      size="small"
                      onClick={() => handleToggleComments(project.id)}
                      sx={{ textTransform: 'none' }}
                    >
                      {(projectComments[project.id]?.length || 0) > 0 ? 
                        `Comments (${projectComments[project.id]?.length})` : 
                        'Add a comment'}
                    </Button>
                    
                    <Collapse in={expandedComments[project.id]}>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            fullWidth
                            placeholder="Write a comment..."
                            size="small"
                            value={commentInputs[project.id] || ''}
                            onChange={(e) => handleCommentChange(project.id, e.target.value)}
                          />
                          <IconButton 
                            color="primary"
                            onClick={() => handleSubmitComment(project.id)}
                            disabled={!commentInputs[project.id]?.trim()}
                          >
                            <Send />
                          </IconButton>
                        </Box>
                        
                        {projectComments[project.id] && projectComments[project.id].length > 0 && (
                          <List sx={{ py: 0 }}>
                            {projectComments[project.id].map((comment) => (
                              <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemAvatar>
                                  <Avatar src={comment.avatar} sx={{ width: 32, height: 32 }} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={comment.author}
                                  secondary={
                                    <>
                                      <Typography variant="body2" component="span">
                                        {comment.text}
                                      </Typography>
                                      <Typography variant="caption" display="block" color="text.secondary">
                                        {new Date(comment.timestamp).toLocaleString()}
                                      </Typography>
                                    </>
                                  }
                                  primaryTypographyProps={{
                                    variant: 'subtitle2',
                                    fontWeight: 600
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* How to Support Section */}
      <Paper sx={{ p: 4, mt: 6, borderRadius: 3, bgcolor: '#F9F4EF' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          How to Support Community Projects
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main, 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 4px 14px rgba(42, 125, 111, 0.2)',
              }}>
                <VolunteerActivism sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Volunteer Your Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contribute your skills and expertise to help projects succeed.
              </Typography>
              <Button 
                variant="text" 
                color="primary" 
                endIcon={<ArrowForward />}
                sx={{ mt: 2 }}
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'Redirecting to volunteer opportunities page',
                    severity: 'info'
                  });
                  // You would typically use React Router here
                  // history.push('/volunteer-opportunities');
                }}
              >
                Browse Opportunities
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.secondary.main, 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 4px 14px rgba(211, 97, 53, 0.2)',
              }}>
                <Public sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Spread the Word
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share projects on social media to increase their visibility.
              </Typography>
              <Button 
                variant="text" 
                color="secondary" 
                endIcon={<ArrowForward />}
                sx={{ mt: 2 }}
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'Sharing resources with your network',
                    severity: 'info'
                  });
                  // Open sharing dialog or redirect to sharing page
                  // For example:
                  if (navigator.share) {
                    navigator.share({
                      title: 'Refugee Network Centre - Community Projects',
                      text: 'Check out these amazing community projects at the Refugee Network Centre!',
                      url: window.location.href,
                    });
                  }
                }}
              >
                Share Resources
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#79854E', 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 4px 14px rgba(121, 133, 78, 0.2)',
              }}>
                <Business sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Provide Resources
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Donate funds, materials, or space to help projects grow.
              </Typography>
              <Button 
                variant="text" 
                sx={{ 
                  mt: 2, 
                  color: '#79854E',
                  '&:hover': {
                    backgroundColor: 'rgba(121, 133, 78, 0.04)',
                  }
                }} 
                endIcon={<ArrowForward />}
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: 'Redirecting to donation options page',
                    severity: 'info'
                  });
                  // You would typically use React Router here
                  // history.push('/donate');
                }}
              >
                Donation Options
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Project Submission Dialog */}
      <Dialog 
        open={openSubmitDialog} 
        onClose={handleCloseSubmitDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h5" fontWeight={600}>Submit Your Project Idea</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseSubmitDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Tell us about your project idea, and our team will review it. If approved, your project will be published on our platform where it can receive community support and resources.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={projectFormData.title}
                onChange={handleProjectFormChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!formErrors.category}
                required
              >
                <InputLabel>Project Category</InputLabel>
                <Select
                  name="category"
                  value={projectFormData.category}
                  onChange={handleProjectFormChange}
                  label="Project Category"
                >
                  <MenuItem value="Social Enterprise">Social Enterprise</MenuItem>
                  <MenuItem value="Local Initiative">Local Initiative</MenuItem>
                  <MenuItem value="Cultural Project">Cultural Project</MenuItem>
                  <MenuItem value="Educational Program">Educational Program</MenuItem>
                  <MenuItem value="Health & Wellness">Health & Wellness</MenuItem>
                </Select>
                {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={projectFormData.description}
                onChange={handleProjectFormChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={projectFormData.location}
                onChange={handleProjectFormChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Funding Goal ($)"
                name="fundingGoal"
                type="number"
                value={projectFormData.fundingGoal}
                onChange={handleProjectFormChange}
                error={!!formErrors.fundingGoal}
                helperText={formErrors.fundingGoal}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={projectFormData.tags}
                onChange={handleProjectFormChange}
                placeholder="e.g. Education, Technology, Youth"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmitProject}
          >
            Submit Project
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CommunityProjects;
