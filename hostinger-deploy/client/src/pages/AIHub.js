import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Tab,
  Tabs,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  LinearProgress,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Code,
  SmartToy,
  Terminal,
  ArrowForward,
  GitHub,
  PlayArrow,
  Save,
  StarBorder,
  MenuBook,
  School,
  AccountTree,
  Laptop,
  Lightbulb,
  Chat,
  FolderOpen,
  Settings,
} from '@mui/icons-material';

const AIHub = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [codeExample, setCodeExample] = useState(

`// Simple AI greeting function
function greetUser(name) {
  const time = new Date().getHours();
  let greeting = "";
  
  if (time < 12) {
    greeting = "Good morning";
  } else if (time < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  
  return \`\${greeting}, \${name}! Welcome to RNC-AI Hub.\`;
}

// Try it with your name
console.log(greetUser("Developer"));`
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    content: '',
    actionText: '',
    actionLink: ''
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Handle dialog open
  const handleOpenDialog = (title, content, actionText = 'Learn More', actionLink = '#') => {
    setDialogContent({
      title,
      content,
      actionText,
      actionLink
    });
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
  
  // Show notification
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Sample learning paths
  const learningPaths = [
    {
      id: 1,
      title: 'AI Basics for Beginners',
      description: 'Start your AI journey with no coding experience required',
      level: 'Beginner',
      duration: '8 weeks',
      projects: 3,
      icon: <School fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      id: 2,
      title: 'Web Development with AI Tools',
      description: 'Learn to build websites using AI-powered tools and frameworks',
      level: 'Intermediate',
      duration: '10 weeks',
      projects: 5,
      icon: <Laptop fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      id: 3,
      title: 'AI Solution Architecture',
      description: 'Design and implement AI solutions for real-world problems',
      level: 'Advanced',
      duration: '12 weeks',
      projects: 2,
      icon: <AccountTree fontSize="large" />,
      color: '#79854E',
    },
  ];

  // Sample AI mentors
  const aiMentors = [
    {
      id: 1,
      name: 'CodeBuddy',
      specialty: 'Programming Assistant',
      description: 'Helps with code, debugging, and learning programming concepts',
      image: `https://ui-avatars.com/api/?name=Code+Buddy&background=2A7D6F&color=fff&size=128`,
    },
    {
      id: 2,
      name: 'CareerGuide',
      specialty: 'Career Development',
      description: 'Assists with resume building, interview prep, and job searching',
      image: `https://ui-avatars.com/api/?name=Career+Guide&background=D36135&color=fff&size=128`,
    },
    {
      id: 3,
      name: 'ProjectPal',
      specialty: 'Project Management',
      description: 'Helps plan and track your coding projects from start to finish',
      image: `https://ui-avatars.com/api/?name=Project+Pal&background=79854E&color=fff&size=128`,
    },
  ];

  // Sample projects
  const projects = [
    {
      id: 1,
      title: 'Personal Portfolio Website',
      difficulty: 'Beginner',
      description: 'Build your first website to showcase your skills and experience',
      skills: ['HTML', 'CSS', 'JavaScript'],
      estimatedTime: '2-4 hours',
    },
    {
      id: 2,
      title: 'Community Resource Finder App',
      difficulty: 'Intermediate',
      description: 'Create an app that helps refugees find local resources and services',
      skills: ['React', 'API Integration', 'Geolocation'],
      estimatedTime: '8-12 hours',
    },
    {
      id: 3,
      title: 'Language Learning Chatbot',
      difficulty: 'Advanced',
      description: 'Develop an AI-powered chatbot that helps users practice new languages',
      skills: ['Python', 'Natural Language Processing', 'AI Models'],
      estimatedTime: '15-20 hours',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          RNC-AI Hub
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Your coding and AI development zone. Learn, build, and innovate with the support of AI tools and a community of learners.
        </Typography>
      </Box>

      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<Terminal />} label="Coding Zone" />
          <Tab icon={<SmartToy />} label="AI Mentors" />
          <Tab icon={<AccountTree />} label="Learning Paths" />
          <Tab icon={<GitHub />} label="Projects" />
        </Tabs>
      </Box>

      {/* Coding Zone Tab */}
      {tabValue === 0 && (
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#2d2d2d', p: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                      script.js
                    </Typography>
                    <Box>
                      <IconButton size="small" sx={{ color: '#fff', mr: 1 }}>
                        <Save fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#fff' }}>
                        <PlayArrow fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    p: 0, 
                    bgcolor: '#1e1e1e', 
                    borderBottomLeftRadius: 8, 
                    borderBottomRightRadius: 8,
                    fontFamily: 'monospace',
                    fontSize: 14,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '40px',
                      height: '100%',
                      backgroundColor: '#252525',
                      borderRight: '1px solid #333',
                    }
                  }}>
                    <TextField
                      multiline
                      fullWidth
                      value={codeExample}
                      onChange={(e) => setCodeExample(e.target.value)}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: 'none' },
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          color: '#d4d4d4',
                          p: 2,
                          pl: 6,
                          lineHeight: 1.7,
                        },
                        '& .MuiInputBase-root': {
                          bgcolor: 'transparent',
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Console Output
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ 
                        bgcolor: '#f5f5f5', 
                        p: 2, 
                        borderRadius: 1, 
                        fontFamily: 'monospace',
                        fontSize: 14,
                        color: '#333',
                        height: 120,
                        overflowY: 'auto',
                      }}>
                        &gt; Good afternoon, Developer! Welcome to RNC-AI Hub.
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        AI Assistant
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ height: 120, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          Need help with your code? Ask me anything!
                        </Typography>
                        <TextField 
                          size="small" 
                          fullWidth 
                          placeholder="Type your question here..."
                          sx={{ mt: 'auto' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 2, mb: 3, height: 'calc(100% - 24px)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Start Here → Build This App
                  </Typography>
                  
                  <List sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 1, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <MenuBook fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Step 1: Learn basic JavaScript" 
                        secondary="Variables, functions, conditionals"
                      />
                      <Chip label="Completed" size="small" color="success" variant="outlined" />
                    </ListItem>
                    
                    <ListItem sx={{ px: 1, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Code fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Step 2: Build a simple greeting app" 
                        secondary="Create your first interactive application"
                      />
                      <Chip label="In Progress" size="small" color="primary" variant="outlined" />
                    </ListItem>
                    
                    <ListItem sx={{ px: 1, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FolderOpen fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Step 3: Add user input features" 
                        secondary="Forms, validation, and user interaction"
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 1, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Settings fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Step 4: Integrate an API" 
                        secondary="Connect to external data sources"
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 1, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Laptop fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Step 5: Deploy your application" 
                        secondary="Share your work with the world"
                      />
                    </ListItem>
                  </List>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Your Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={30} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: 'rgba(0,0,0,0.05)'
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      30% completed
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3 }}
                    endIcon={<ArrowForward />}
                    onClick={() => handleOpenDialog(
                      'Continue Your Learning Journey', 
                      'Pick up where you left off with our interactive JavaScript course. You were learning about functions and conditionals.', 
                      'Go to Course', 
                      '/courses/javascript-fundamentals'
                    )}
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
            Featured Coding Resources
          </Typography>
          
          <Grid container spacing={3}>
            {[
              { title: 'JavaScript Fundamentals', icon: <Code />, color: theme.palette.primary.main },
              { title: 'Building Web Applications', icon: <Laptop />, color: theme.palette.secondary.main },
              { title: 'Working with APIs', icon: <Settings />, color: '#79854E' },
            ].map((resource, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: resource.color, mr: 2 }}>
                      {resource.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {resource.title}
                    </Typography>
                  </Box>
                  <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => handleOpenDialog(
                    resource.title + ' Resources', 
                    'Access comprehensive learning materials, tutorials, and examples for ' + resource.title + '.',
                    'Access Resources',
                    `/resources/${resource.title.toLowerCase().replace(/ /g, '-')}`
                  )}
                >
                  Access Resources
                </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* AI Mentors Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Meet Your AI Mentors
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Our AI mentors provide personalized guidance, answer your questions, and help you on your learning journey.
          </Typography>
          
          <Grid container spacing={4}>
            {aiMentors.map((mentor) => (
              <Grid item xs={12} md={4} key={mentor.id}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  },
                }}>
                  <Box sx={{ position: 'relative', pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      src={mentor.image}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        border: '4px solid white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {mentor.name}
                    </Typography>
                    <Chip 
                      label={mentor.specialty} 
                      color="primary" 
                      variant="outlined" 
                      sx={{ mt: 1, mb: 2 }} 
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" paragraph align="center">
                      {mentor.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      startIcon={<Chat />}
                      sx={{ mt: 2 }}
                      onClick={() => {
                        showNotification(`Starting conversation with ${mentor.name}...`, 'info');
                        setTimeout(() => {
                          handleOpenDialog(
                            `Chat with ${mentor.name}`, 
                            `${mentor.name} is ready to assist you with ${mentor.specialty.toLowerCase()}. What would you like help with today?`,
                            'Open Chat Interface',
                            `/ai-chat/${mentor.id}`
                          );
                        }, 1000);
                      }}
                    >
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Paper sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: '#F9F4EF' }}>
            <Typography variant="h6" gutterBottom>
              How AI Mentors Help You
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Lightbulb color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Personalized Learning
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Receive tailored guidance based on your skill level and learning pace.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Code color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Code Review & Help
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Get your code reviewed and receive suggestions for improvement.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    24/7 Assistance
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Access help whenever you need it, with no scheduling required.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}

      {/* Learning Paths Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Choose Your Learning Path
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Follow structured learning paths from beginner to advanced levels. Each path includes courses, projects, and assessments.
          </Typography>
          
          <Grid container spacing={4}>
            {learningPaths.map((path) => (
              <Grid item xs={12} key={path.id}>
                <Card sx={{ 
                  borderRadius: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '8px', 
                    height: '100%',
                    bgcolor: path.color,
                  }} />
                  <CardContent sx={{ pl: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar sx={{ bgcolor: path.color, mr: 2 }}>
                            {path.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                              {path.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={path.level} 
                                size="small" 
                                sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: 'primary.main' }} 
                              />
                              <Chip 
                                label={`${path.duration}`} 
                                size="small" 
                                sx={{ bgcolor: 'rgba(211, 97, 53, 0.1)', color: 'secondary.main' }} 
                              />
                              <Chip 
                                label={`${path.projects} Projects`} 
                                size="small" 
                                sx={{ bgcolor: 'rgba(121, 133, 78, 0.1)', color: '#79854E' }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                          {path.description}
                        </Typography>
                        <List dense>
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <ArrowForward fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Structured weekly learning modules" />
                          </ListItem>
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <ArrowForward fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Hands-on projects with real-world applications" />
                          </ListItem>
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <ArrowForward fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="AI mentor support throughout your journey" />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="large"
                          sx={{ mb: 2 }}
                          onClick={() => handleOpenDialog(
                            `Start: ${path.title}`, 
                            `You're about to begin the ${path.title} learning path. This ${path.level.toLowerCase()} course will take approximately ${path.duration} to complete. Ready to start?`,
                            'Begin Learning Path',
                            `/learning-paths/${path.id}/start`
                          )}
                        >
                          Start This Path
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          onClick={() => navigate(`/learning-paths/${path.id}/curriculum`)}
                        >
                          View Curriculum
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Projects Tab */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Build These Projects
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Apply your skills to real-world projects. Start from beginner-friendly tasks and progress to advanced challenges.
          </Typography>
          
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} md={4} key={project.id}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                        {project.title}
                      </Typography>
                      <Chip 
                        label={project.difficulty} 
                        size="small" 
                        color={
                          project.difficulty === 'Beginner' ? 'primary' : 
                          project.difficulty === 'Intermediate' ? 'secondary' : 
                          'default'
                        }
                      />
                    </Box>
                    
                    <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                      {project.description}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Skills You&apos;ll Learn:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.skills.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Estimated time: {project.estimatedTime}
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={() => handleOpenDialog(
                        `Start: ${project.title}`, 
                        `You're about to begin the ${project.title} project. This ${project.difficulty.toLowerCase()}-level project will take approximately ${project.estimatedTime} to complete.`,
                        'Begin Project',
                        `/projects/${project.id}/start`
                      )}
                    >
                      Start Project
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              startIcon={<GitHub />}
              component="a"
              href="https://github.com/refugee-network-community/ai-learning-projects"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse More Projects on GitHub
            </Button>
          </Box>
        </Box>
      )}
      {/* Dialog for interactions */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {dialogContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {dialogContent.actionLink && (
            <Button 
              onClick={() => {
                handleCloseDialog();
                if (dialogContent.actionLink.startsWith('http')) {
                  window.open(dialogContent.actionLink, '_blank');
                } else {
                  navigate(dialogContent.actionLink);
                }
              }} 
              color="primary" 
              variant="contained"
            >
              {dialogContent.actionText}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AIHub;
