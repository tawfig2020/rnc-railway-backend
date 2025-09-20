import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  LinearProgress,
  Avatar,
  CardMedia,
  CardActionArea,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Search,
  FilterList,
  School,
  Language,
  Code,
  Brush,
  MusicNote,
  Business,
  Check,
  Star,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';

const Courses = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    skillLevel: '',
    language: '',
    courseType: '',
  });

  // Sample user progress data
  const userProgress = [
    { id: 1, title: 'Digital Literacy Fundamentals', progress: 80, totalModules: 5, completedModules: 4 },
    { id: 2, title: 'Web Development Basics', progress: 45, totalModules: 10, completedModules: 4 },
    { id: 3, title: 'English for Professional Settings', progress: 60, totalModules: 8, completedModules: 5 },
  ];

  // Sample courses data
  const courses = [
    {
      id: 1,
      title: 'Digital Literacy Fundamentals',
      category: 'Digital Skills',
      level: 'Beginner',
      language: 'Multiple Languages',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      students: 1240,
      icon: <School />,
      color: theme.palette.primary.main,
    },
    {
      id: 2,
      title: 'Web Development Basics',
      category: 'Programming',
      level: 'Beginner',
      language: 'English',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
      instructor: 'Michael Chen',
      rating: 4.6,
      students: 890,
      icon: <Code />,
      color: '#79854E',
    },
    {
      id: 3,
      title: 'English for Professional Settings',
      category: 'Language',
      level: 'Intermediate',
      language: 'English',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      instructor: 'Emma Wilson',
      rating: 4.9,
      students: 1560,
      icon: <Language />,
      color: theme.palette.secondary.main,
    },
    {
      id: 4,
      title: 'Creative Design with Free Tools',
      category: 'Design',
      level: 'All Levels',
      language: 'Multiple Languages',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698',
      instructor: 'Jamal Ibrahim',
      rating: 4.7,
      students: 720,
      icon: <Brush />,
      color: '#D36135',
    },
    {
      id: 5,
      title: 'Entrepreneurship Fundamentals',
      category: 'Business',
      level: 'Intermediate',
      language: 'English, Arabic',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      instructor: 'Leila Hassan',
      rating: 4.5,
      students: 640,
      icon: <Business />,
      color: theme.palette.primary.dark,
    },
    {
      id: 6,
      title: 'Music Production Basics',
      category: 'Creative Arts',
      level: 'Beginner',
      language: 'English, French',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      instructor: 'Omar Diallo',
      rating: 4.6,
      students: 480,
      icon: <MusicNote />,
      color: '#79854E',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      skillLevel: '',
      language: '',
      courseType: '',
    });
  };

  // Render star ratings
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} sx={{ fontSize: 18, color: '#FFB400' }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" sx={{ fontSize: 18, color: '#FFB400' }} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorder key={`empty-${i}`} sx={{ fontSize: 18, color: '#FFB400' }} />);
    }
    
    return stars;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 1 }}>
        Courses & Learning
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
        Build your skills with our diverse range of courses designed for refugees. Filter by skill level, language, and subject area.
      </Typography>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All Courses" />
          <Tab label="My Learning" />
          <Tab label="Teach a Skill" />
        </Tabs>
      </Box>

      {/* All Courses Tab */}
      {tabValue === 0 && (
        <>
          {/* Search and Filter Bar */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search courses..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120, flex: 1 }}>
                    <InputLabel>Skill Level</InputLabel>
                    <Select
                      name="skillLevel"
                      value={filters.skillLevel}
                      onChange={handleFilterChange}
                      label="Skill Level"
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120, flex: 1 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={filters.language}
                      onChange={handleFilterChange}
                      label="Language"
                    >
                      <MenuItem value="">All Languages</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Arabic">Arabic</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="Swahili">Swahili</MenuItem>
                    </Select>
                  </FormControl>
                  <Button 
                    variant="outlined" 
                    startIcon={<FilterList />}
                    onClick={clearFilters}
                    sx={{ height: 40 }}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Course Grid */}
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                  },
                }}>
                  <CardActionArea>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={course.image}
                        alt={course.title}
                      />
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        left: 12, 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: course.color,
                      }}>
                        {course.icon}
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                          {course.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          label={course.level} 
                          size="small" 
                          sx={{ bgcolor: 'rgba(42, 125, 111, 0.1)', color: 'primary.main' }} 
                        />
                        <Chip 
                          label={course.category} 
                          size="small" 
                          sx={{ bgcolor: 'rgba(211, 97, 53, 0.1)', color: 'secondary.main' }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Instructor: {course.instructor}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex' }}>
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(course.rating) 
                              ? <Star key={i} sx={{ fontSize: 16, color: '#FFB400' }} />
                              : <StarBorder key={i} sx={{ fontSize: 16, color: '#FFB400' }} />
                          ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          ({course.rating}) · {course.students} students
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Available in: {course.language}
                      </Typography>
                      <Button variant="contained" color="primary" fullWidth>
                        Enroll Now
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* My Learning Tab */}
      {tabValue === 1 && (
        <Box>
          <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Learning Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Track your progress across all courses. Continue where you left off or explore new content.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                {userProgress.map((course) => (
                  <Box key={course.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.completedModules}/{course.totalModules} modules
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: course.progress >= 75 ? theme.palette.success.main : theme.palette.primary.main,
                        }
                      }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {course.progress}% complete
                      </Typography>
                      <Button size="small" color="primary">
                        Continue Learning
                      </Button>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="outlined" color="primary">
                  View All Courses
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Recommended For You
          </Typography>
          <Grid container spacing={3}>
            {courses.slice(0, 3).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                  },
                }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={course.image}
                      alt={course.title}
                    />
                    <CardContent>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                        {course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                        <Chip label={course.level} size="small" />
                        <Chip label={course.category} size="small" />
                      </Box>
                      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Start Learning
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Teach a Skill Tab */}
      {tabValue === 2 && (
        <Box>
          <Card sx={{ mb: 4, borderRadius: 3, bgcolor: '#F9F4EF', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', md: 300 } }}
                image="https://images.unsplash.com/photo-1544531585-9847b68c8c86"
                alt="Teacher with students"
              />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  Learn a Skill, Teach a Skill
                </Typography>
                <Typography variant="body1" paragraph>
                  Share your knowledge and expertise with others in our community. Create courses, workshops, or one-on-one sessions to help fellow refugees develop valuable skills.
                </Typography>
                <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                  Benefits of teaching:
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Check sx={{ color: theme.palette.success.main }} />
                      <Typography variant="body2">Build your professional portfolio</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Check sx={{ color: theme.palette.success.main }} />
                      <Typography variant="body2">Earn community recognition</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Check sx={{ color: theme.palette.success.main }} />
                      <Typography variant="body2">Help others succeed</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Check sx={{ color: theme.palette.success.main }} />
                      <Typography variant="body2">Strengthen your own skills</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Button variant="contained" color="primary" size="large">
                  Apply to Become a Teacher
                </Button>
              </CardContent>
            </Box>
          </Card>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Community Teachers
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`} 
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {['Fatima Khalil', 'Ahmed Hassan', 'Maria Sanchez'][item-1]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {['Language Instructor', 'Programming Teacher', 'Business Coach'][item-1]}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {[
                      'Teaching Arabic and English to beginners and intermediate learners. Cultural orientation classes available.',
                      'Web development and coding for all levels. Specialized in helping beginners start their tech journey.',
                      'Business planning, entrepreneurship, and market research for refugee-led businesses.'
                    ][item-1]}
                  </Typography>
                  <Button variant="outlined" color="primary" fullWidth>
                    View Courses
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Courses;
