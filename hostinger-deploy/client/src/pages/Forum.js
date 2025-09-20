import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  QuestionAnswer,
  Forum,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  Gavel,
  Devices,
  EmojiObjects,
  People,
  Sort,
  Bookmark,
  BookmarkBorder,
  Create,
  Add,
  ArrowForward,
  HelpOutline,
  MoreVert,
  Report,
  AdminPanelSettings,
  Delete
} from '@mui/icons-material';

const ForumPage = () => {
  const theme = useTheme();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [savedQuestions, setSavedQuestions] = useState([1, 5]);
  const openSortMenu = Boolean(sortMenuAnchor);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // 'user', 'admin', 'moderator'
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({title: '', content: ''});
  
  // Menu state for admin actions
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({open: false, message: '', severity: 'info'});
  
  // Effect to check authentication status on component mount
  useEffect(() => {
    // In a real app, this would verify the user's session from a backend
    // For now, we'll simulate an authenticated user
    const checkAuthStatus = async () => {
      try {
        // Simulated API call to get current user
        // const response = await axios.get('/api/auth/me');
        
        // Mock response
        const mockUser = {
          id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin', // For testing admin functionality
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isMember: true // RNC membership status
        };
        
        setIsAuthenticated(true);
        setCurrentUser(mockUser);
        setUserRole(mockUser.role);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Effect to filter by category when URL parameter changes
  useEffect(() => {
    if (categoryId) {
      // Clear any existing search
      setSearchQuery('');
      
      // Reset to "All Questions" tab when category changes
      setTabValue(0);
      
      // Scroll to top of page for better UX
      window.scrollTo(0, 0);
      
      // If we're on the ask page, don't do any filtering
      if (categoryId === 'ask') return;
      
      // Log active category for debugging
      console.log('Active category:', categoryId);
    }
  }, [categoryId]);

  // Categories
  const categories = [
    { id: 'legal', name: 'Legal Help', icon: <Gavel />, color: theme.palette.secondary.main },
    { id: 'digital', name: 'Digital Tools', icon: <Devices />, color: theme.palette.primary.main },
    { id: 'life', name: 'Life Tips', icon: <EmojiObjects />, color: '#79854E' },
    { id: 'mentorship', name: 'Peer-to-peer Mentorship', icon: <People />, color: '#D36135' },
  ];

  // Sample forum questions
  const questions = [
    {
      id: 1,
      title: "How do I access free health services in Jordan as a refugee?",
      body: "I recently arrived in Jordan with my family and we need to access healthcare services. Are there free clinics or hospitals available for refugees? What documentation do we need to bring?",
      author: "Ahmed K.",
      authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "2 hours ago",
      category: "life",
      upvotes: 15,
      answers: 3,
      views: 89,
      solved: true,
      tags: ["Healthcare", "Jordan", "Documentation"]
    },
    {
      id: 2,
      title: "What is the best app to learn English in Pashto or Arabic?",
      body: "I want to improve my English skills but need an app that offers instructions in either Pashto or Arabic. Which apps have you found most helpful? Preferably free or low-cost options.",
      author: "Fatima S.",
      authorAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
      date: "5 hours ago",
      category: "digital",
      upvotes: 28,
      answers: 7,
      views: 146,
      solved: false,
      tags: ["Language Learning", "Apps", "English"]
    },
    {
      id: 3,
      title: "Can I build a business as a refugee? What legal advice do I need?",
      body: "I used to run a small bakery in my home country. I'd like to start a similar business here, but I'm unsure about the legal requirements. What permits do I need? Are there any restrictions for refugees starting businesses?",
      author: "Ibrahim M.",
      authorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      date: "1 day ago",
      category: "legal",
      upvotes: 34,
      answers: 5,
      views: 212,
      solved: true,
      tags: ["Business", "Legal Requirements", "Entrepreneurship"]
    },
    {
      id: 4,
      title: "How to get my previous education credentials recognized?",
      body: "I have a degree in Engineering from my home country, but I'm having trouble getting it recognized here. Has anyone gone through this process successfully? What steps should I take?",
      author: "Sara N.",
      authorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
      date: "2 days ago",
      category: "mentorship",
      upvotes: 41,
      answers: 8,
      views: 274,
      solved: true,
      tags: ["Education", "Credentials", "Employment"]
    },
    {
      id: 5,
      title: "Tips for finding affordable housing?",
      body: "My family and I are looking for affordable housing options. The current rental market is very expensive. Does anyone have suggestions for finding reasonably priced apartments or housing assistance programs?",
      author: "Omar J.",
      authorAvatar: "https://randomuser.me/api/portraits/men/36.jpg",
      date: "3 days ago",
      category: "life",
      upvotes: 52,
      answers: 12,
      views: 318,
      solved: false,
      tags: ["Housing", "Affordability", "Resources"]
    },
    {
      id: 6,
      title: "Recommended free coding courses for beginners?",
      body: "I'm interested in learning coding but have no prior experience. Are there any free resources or courses you would recommend for absolute beginners? I'm particularly interested in web development.",
      author: "Nadia H.",
      authorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      date: "4 days ago",
      category: "digital",
      upvotes: 38,
      answers: 9,
      views: 245,
      solved: true,
      tags: ["Coding", "Learning", "Web Development"]
    },
    {
      id: 7,
      title: "How to apply for family reunification?",
      body: "I have been granted refugee status, and now I want to apply for family reunification to bring my spouse and children. What is the process and what documentation do I need to prepare?",
      author: "Mohammed A.",
      authorAvatar: "https://randomuser.me/api/portraits/men/78.jpg",
      date: "5 days ago",
      category: "legal",
      upvotes: 47,
      answers: 6,
      views: 298,
      solved: true,
      tags: ["Family Reunification", "Legal Process", "Documentation"]
    },
    {
      id: 8,
      title: "Advice for dealing with cultural adjustment challenges?",
      body: "I've been in my host country for 6 months now and still struggling with cultural adjustment. Would appreciate advice from others who have gone through this process successfully.",
      author: "Leila K.",
      authorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      date: "1 week ago",
      category: "mentorship",
      upvotes: 32,
      answers: 15,
      views: 267,
      solved: false,
      tags: ["Cultural Adjustment", "Mental Health", "Community"]
    },
  ];

  // Expert profiles
  const experts = [
    {
      name: "Dr. Yasmin Rahman",
      expertise: "Immigration Law",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      background: "Immigration attorney with 10+ years experience",
      category: "legal",
    },
    {
      name: "Ahmed Khalid",
      expertise: "Digital Skills Trainer",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      background: "Software engineer & community educator",
      category: "digital",
    },
    {
      name: "Maria Sanchez",
      expertise: "Community Integration",
      avatar: "https://randomuser.me/api/portraits/women/74.jpg",
      background: "Social worker specialized in refugee support",
      category: "life",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortMenuClick = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };
  
  // Admin menu handlers
  const handleAdminMenuClick = (event, questionId) => {
    event.stopPropagation();
    setAdminMenuAnchor(event.currentTarget);
    setSelectedQuestionId(questionId);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
    setSelectedQuestionId(null);
  };
  
  // Handle question deletion by admin
  const handleDeleteQuestion = () => {
    if (selectedQuestionId) {
      // In a real app, this would be an API call
      // For now, we'll just filter out the question from our state
      const updatedQuestions = questions.filter(q => q.id !== selectedQuestionId);
      // questions = updatedQuestions; // This would be updated in a real app through state management
      
      setNotification({
        open: true,
        message: 'Question has been deleted successfully',
        severity: 'success'
      });
      
      handleAdminMenuClose();
    }
  };
  
  // Handle dialog open
  const handleOpenDialog = (title, content) => {
    setDialogContent({title, content});
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const toggleSaved = (questionId) => {
    if (savedQuestions.includes(questionId)) {
      setSavedQuestions(savedQuestions.filter(id => id !== questionId));
    } else {
      setSavedQuestions([...savedQuestions, questionId]);
    }
  };

  // Filter questions based on search query, category, and active tab
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      question.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply category filter if URL has categoryId
    const matchesCategory = categoryId ? question.category === categoryId : true;
    
    if (tabValue === 0) return matchesSearch && matchesCategory; // All Questions
    if (tabValue === 1) return matchesSearch && question.solved && matchesCategory; // Solved
    if (tabValue === 2) return matchesSearch && !question.solved && matchesCategory; // Unsolved
    if (tabValue === 3) return matchesSearch && savedQuestions.includes(question.id) && matchesCategory; // Saved
    
    return false;
  });

  // Get category information by ID
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  // Check if we're on the Ask Question page - use React Router parameter instead of window.location
  const isAskQuestionPage = categoryId === 'ask';

  // Render Ask Question Form if on that page
  if (isAskQuestionPage) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Ask your Question
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Our community is here to help. Ask any question related to refugee life, legal matters, or integration.
          </Typography>
          
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Question Title</Typography>
                <TextField
                  fullWidth
                  placeholder="Write a clear, specific title for your question"
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Category</Typography>
                <TextField
                  select
                  fullWidth
                  defaultValue="life"
                  variant="outlined"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Question Details</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Provide as much detail as possible to help others understand your question"
                  variant="outlined"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Tags</Typography>
                <TextField
                  fullWidth
                  placeholder="Add up to 5 tags separated by commas (e.g., housing, documentation, healthcare)"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    // In a real app, this would submit the form data to an API
                    setNotification({
                      open: true,
                      message: 'Your question has been posted successfully!',
                      severity: 'success'
                    });
                    setTimeout(() => navigate('/forum'), 1500);
                  }}
                  sx={{ mr: 2 }}
                >
                  Post Question
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/forum')}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }

  // Regular Forum page
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 1 }}>
        Q&A and Discussion Forum
        {categoryId && categoryId !== 'ask' && (
          <Chip 
            label={getCategoryInfo(categoryId).name} 
            color="primary" 
            sx={{ ml: 2, fontSize: '1rem', py: 2.5 }}
            onDelete={() => navigate('/forum')}
          />
        )}
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
        Ask questions, share knowledge, and connect with others in our community. Get answers from experts and peers who understand your journey.
      </Typography>

      {/* Categories Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {categories.map((category) => (
          <Grid item xs={6} sm={3} key={category.id}>
            <Card 
              sx={{ 
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${category.color}20`, 
                    color: category.color,
                    width: 60, 
                    height: 60, 
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {category.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {category.name}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  component={RouterLink} 
                  to={`/forum/${category.id}`}
                >
                  Browse
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search and Ask Question Bar */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search questions..."
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
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<Add />}
              size="large"
              sx={{ height: '100%' }}
              onClick={() => {
                if (isAuthenticated) {
                  if (currentUser?.isMember) {
                    navigate('/forum/ask');
                  } else {
                    handleOpenDialog(
                      'RNC Membership Required', 
                      'Only RNC members can post questions in the forum. Please complete your membership registration to participate.'
                    );
                  }
                } else {
                  handleOpenDialog(
                    'Authentication Required', 
                    'Please log in or register to ask questions in the forum.'
                  );
                }
              }}
            >
              Ask a Question
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Main Questions List */}
        <Grid item xs={12} md={8}>
          {/* Filter Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="All Questions" />
              <Tab label="Solved" icon={<CheckCircle fontSize="small" />} iconPosition="start" />
              <Tab label="Unsolved" icon={<HelpOutline fontSize="small" />} iconPosition="start" />
              <Tab label="Saved" icon={<Bookmark fontSize="small" />} iconPosition="start" />
            </Tabs>
            
            <Box>
              <Button
                variant="text"
                color="inherit"
                startIcon={<Sort />}
                onClick={handleSortMenuClick}
              >
                Sort
              </Button>
              <Menu
                anchorEl={sortMenuAnchor}
                open={openSortMenu}
                onClose={handleSortMenuClose}
              >
                <MenuItem onClick={handleSortMenuClose}>Newest</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Most Upvoted</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Most Answered</MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {/* Questions List */}
          <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 4 }}>
            {filteredQuestions.map((question, index) => {
              const categoryInfo = getCategoryInfo(question.category);
              
              return (
                <React.Fragment key={question.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      py: 3, 
                      px: 0,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    {/* Vote Count Column */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, minWidth: 60 }}>
                      <IconButton size="small">
                        <ArrowUpward fontSize="small" />
                      </IconButton>
                      <Typography variant="h6" sx={{ fontWeight: 600, my: 0.5 }}>
                        {question.upvotes}
                      </Typography>
                      <IconButton size="small">
                        <ArrowDownward fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    {/* Question Content */}
                    <Box sx={{ flex: 1, position: 'relative' }}>
                      {/* Admin options */}
                      {(userRole === 'admin' || userRole === 'moderator') && (
                        <IconButton 
                          size="small"
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                          onClick={(e) => handleAdminMenuClick(e, question.id)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          icon={categoryInfo.icon} 
                          label={categoryInfo.name} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${categoryInfo.color}20`,
                            color: categoryInfo.color,
                            fontWeight: 500,
                            mr: 1,
                          }} 
                        />
                        {question.solved && (
                          <Chip 
                            icon={<CheckCircle fontSize="small" />} 
                            label="Solved" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {question.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {question.body.length > 180 ? question.body.substring(0, 180) + '...' : question.body}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {question.tags.map((tag, idx) => (
                          <Chip 
                            key={idx} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={question.authorAvatar} 
                            sx={{ width: 24, height: 24, mr: 1 }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {question.author} asked {question.date}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            <Badge 
                              badgeContent={question.answers} 
                              color="primary" 
                              sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}
                            >
                              <QuestionAnswer fontSize="small" sx={{ mr: 0.5 }} />
                            </Badge>
                            {' '}Answers
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            {question.views} views
                          </Typography>
                          
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaved(question.id);
                            }}
                            color={savedQuestions.includes(question.id) ? 'primary' : 'default'}
                          >
                            {savedQuestions.includes(question.id) ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < filteredQuestions.length - 1 && <Divider variant="fullWidth" component="li" />}
                </React.Fragment>
              );
            })}
          </List>
          
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => window.alert('More questions loaded successfully!')}
            >
              Load More Questions
            </Button>
          </Box>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Ask Question Card */}
          <Card sx={{ mb: 4, borderRadius: 3, bgcolor: theme.palette.primary.main, color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Have a Question?
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                Our community is here to help. Ask any question related to refugee life, legal matters, or integration.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth
                startIcon={<Create />}
                sx={{ fontWeight: 600 }}
                onClick={() => {
                  if (isAuthenticated) {
                    if (currentUser?.isMember) {
                      navigate('/forum/ask');
                    } else {
                      handleOpenDialog(
                        'RNC Membership Required', 
                        'Only RNC members can post questions in the forum. Please complete your membership registration to participate.'
                      );
                    }
                  } else {
                    handleOpenDialog(
                      'Authentication Required', 
                      'Please log in or register to ask questions in the forum.'
                    );
                  }
                }}
              >
                Ask Your Question
              </Button>
            </CardContent>
          </Card>
          
          {/* Expert Profiles */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Community Experts
            </Typography>
            <List sx={{ p: 0 }}>
              {experts.map((expert, index) => {
                const categoryInfo = getCategoryInfo(expert.category);
                
                return (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      px: 0, 
                      py: 2,
                      borderBottom: index < experts.length - 1 ? '1px solid #eee' : 'none',
                    }}
                    button
                  >
                    <ListItemAvatar>
                      <Avatar src={expert.avatar} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={expert.name} 
                      secondary={
                        <>
                          <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                            {expert.expertise}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {expert.background}
                          </Typography>
                        </>
                      } 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Button 
              variant="text" 
              color="primary" 
              fullWidth
              endIcon={<ArrowForward />}
              sx={{ mt: 2 }}
            >
              View All Experts
            </Button>
          </Paper>
          
          {/* Popular Tags */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Popular Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Legal Advice', 'Documentation', 'Healthcare', 'Education', 'Employment', 'Housing', 'Language Learning', 'Technology', 'Cultural Adjustment', 'Family Reunification'].map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  variant="outlined"
                  sx={{ marginBottom: 1 }}
                  clickable
                />
              ))}
            </Box>
          </Paper>
          
          {/* Forum Guidelines */}
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#F9F4EF' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Forum Guidelines
            </Typography>
            <List dense sx={{ p: 0 }}>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText primary="Be respectful and supportive" />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText primary="Provide clear, specific questions" />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText primary="Mark helpful answers as 'Solved'" />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText primary="Share your knowledge with others" />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText primary="Protect your privacy - don't share sensitive information" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      {/* Admin action menu */}
      <Menu
        anchorEl={adminMenuAnchor}
        open={Boolean(adminMenuAnchor)}
        onClose={handleAdminMenuClose}
      >
        <MenuItem onClick={handleDeleteQuestion}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Question
        </MenuItem>
        <MenuItem onClick={handleAdminMenuClose}>
          <Report fontSize="small" sx={{ mr: 1 }} /> Flag as Inappropriate
        </MenuItem>
      </Menu>
      
      {/* Dialog for auth messages and confirmations */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {dialogContent.title === 'Authentication Required' ? (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={() => {
                handleCloseDialog();
                navigate('/login');
              }} color="primary">
                Log In
              </Button>
              <Button onClick={() => {
                handleCloseDialog();
                navigate('/register');
              }} color="secondary">
                Register
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForumPage;
