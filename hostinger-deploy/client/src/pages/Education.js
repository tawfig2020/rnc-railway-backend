import React, { useState } from 'react';
import { Container, Grid, Typography, Button, Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, IconButton, Chip, useTheme, alpha } from '@mui/material';
import { School, Book, Language, Assessment, Search, Translate, TrendingUp } from '@mui/icons-material';

import { motion } from 'framer-motion';
import { containerVariants } from '../styles/animations';
import AnimatedCard from '../components/ui/AnimatedCard';
import { AnimatedLinearProgress } from '../components/ui/AnimatedProgress';

const Education = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Sample progress data for demo
  const progressData = {
    language: 15,
    academic: 35,
    skills: 62
  };
  
  // Background patterns/illustrations for cards
  const bgPatterns = {
    language: "url('/images/education/language-pattern.svg')",
    academic: "url('/images/education/academic-pattern.svg')",
    skills: "url('/images/education/skills-pattern.svg')"
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8, py: 2 }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        position: 'relative',
        "&::after": {
          content: '""',
          position: 'absolute',
          bottom: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: '2px',
        }
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            textShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          Education Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
          Access learning resources, courses, and tools to support your educational journey
        </Typography>
      </Box>
      
      {/* Search and Filter Controls */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          gap: 2
        }}
      >
        <TextField
          placeholder="Search resources..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: { xs: '100%', md: '40%' },
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="language">Language Learning</MenuItem>
              <MenuItem value="academic">Academic Resources</MenuItem>
              <MenuItem value="skills">Skill Development</MenuItem>
              <MenuItem value="digital">Digital Literacy</MenuItem>
              <MenuItem value="civic">Civic Education</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton 
            color="primary" 
            aria-label="change language" 
            title="Change language"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.8)', 
              boxShadow: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } 
            }}
          >
            <Translate />
          </IconButton>
        </Box>
      </Box>
      
      {/* Popular Now Section */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600
          }}
        >
          <TrendingUp sx={{ mr: 1, color: theme.palette.secondary.main }} />
          Popular Now
        </Typography>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <Grid container spacing={3}>
            {/* Language Learning Card */}
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedCard
                title="🌍 Language Learning"
                subtitle="Learn English, French, Arabic & more."
                delay={1}
                elevation={3}
                sx={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), ${bgPatterns.language || 'none'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(42,125,111,0.1)',
                  height: '100%'
                }}
                actions={
                  <Box sx={{ width: '100%' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ 
                        borderRadius: '8px',
                        py: 1,
                        fontWeight: 600,
                        boxShadow: 2
                      }}
                    >
                      Start Learning
                    </Button>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label="Beginner" 
                        size="small" 
                        color="secondary" 
                        sx={{ fontWeight: 500 }}
                      />
                      <Typography variant="caption" color="text.secondary" fontWeight="medium">
                        Progress: {progressData.language}%
                      </Typography>
                    </Box>
                    <AnimatedLinearProgress 
                      value={progressData.language} 
                      color="primary"
                      height={8}
                      showPercentage={false}
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                }
              >
                <Typography variant="body2" paragraph>
                  Access interactive language courses with real-time feedback and practice exercises. Learn at your own pace with our multilingual resources.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip size="small" label="English" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                  <Chip size="small" label="French" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                  <Chip size="small" label="Arabic" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                </Box>
              </AnimatedCard>
            </Grid>

            {/* Academic Resources Card */}
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedCard
                title="📘 Academic Resources"
                subtitle="Syllabi, books, curriculum access."
                delay={2}
                elevation={3}
                sx={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), ${bgPatterns.academic || 'none'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(42,125,111,0.1)',
                  height: '100%'
                }}
                actions={
                  <Box sx={{ width: '100%' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      sx={{ 
                        borderRadius: '8px',
                        py: 1,
                        fontWeight: 600,
                        boxShadow: 2
                      }}
                    >
                      Access Resources
                    </Button>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label="Intermediate" 
                        size="small" 
                        color="info" 
                        sx={{ fontWeight: 500 }}
                      />
                      <Typography variant="caption" color="text.secondary" fontWeight="medium">
                        Progress: {progressData.academic}%
                      </Typography>
                    </Box>
                    <AnimatedLinearProgress 
                      value={progressData.academic} 
                      color="info"
                      height={8}
                      showPercentage={false}
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                }
              >
                <Typography variant="body2" paragraph>
                  Comprehensive educational materials including textbooks, syllabi, and academic research tailored for different educational levels and subjects.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip size="small" label="Math" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }} />
                  <Chip size="small" label="Science" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }} />
                  <Chip size="small" label="Humanities" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }} />
                </Box>
              </AnimatedCard>
            </Grid>

            {/* Skill Development Card */}
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedCard
                title="🛠 Skill Development"
                subtitle="Online job-ready skills & soft skills."
                delay={3}
                elevation={3}
                sx={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), ${bgPatterns.skills || 'none'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(42,125,111,0.1)',
                  height: '100%'
                }}
                actions={
                  <Box sx={{ width: '100%' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      sx={{ 
                        borderRadius: '8px',
                        py: 1,
                        fontWeight: 600,
                        boxShadow: 2
                      }}
                    >
                      Explore Courses
                    </Button>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label="Advanced" 
                        size="small" 
                        color="success" 
                        sx={{ fontWeight: 500 }}
                      />
                      <Typography variant="caption" color="text.secondary" fontWeight="medium">
                        Progress: {progressData.skills}%
                      </Typography>
                    </Box>
                    <AnimatedLinearProgress 
                      value={progressData.skills} 
                      color="success"
                      height={8}
                      showPercentage={false}
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                }
              >
                <Typography variant="body2" paragraph>
                  Develop practical skills for employment and personal growth through interactive workshops, courses, and certification programs.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip size="small" label="Digital" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }} />
                  <Chip size="small" label="Professional" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }} />
                  <Chip size="small" label="Leadership" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }} />
                </Box>
              </AnimatedCard>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
      
      {/* Additional Educational Sections */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            pb: 1
          }}
        >
          <School sx={{ mr: 1, color: theme.palette.primary.main }} />
          Expanded Learning Resources
        </Typography>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <Grid container spacing={3}>
            {/* Digital Literacy & Tools */}
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <AnimatedCard
                title="💻 Digital Literacy & Tools"
                subtitle="Learn to use devices, write emails, and navigate the internet securely."
                delay={1}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(42,125,111,0.1)',
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  >
                    Explore Resources
                  </Button>
                }
              >
                <Typography variant="body2">
                  Master essential digital skills from basic computer usage to online security and privacy protection.
                </Typography>
              </AnimatedCard>
            </Grid>

            {/* Civic Education & Rights */}
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <AnimatedCard
                title="⚖️ Civic Education & Rights"
                subtitle="Understand your rights, local laws, and responsibilities in your new country."
                delay={2}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(42,125,111,0.1)',
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  >
                    Learn More
                  </Button>
                }
              >
                <Typography variant="body2">
                  Access resources about legal rights, civic responsibilities, and local community integration.
                </Typography>
              </AnimatedCard>
            </Grid>

            {/* Early Childhood & Parenting Resources */}
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <AnimatedCard
                title="👨‍👩‍👧‍👦 Parenting Resources"
                subtitle="Support your child's learning and explore activities for young kids."
                delay={3}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(42,125,111,0.1)',
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  >
                    Access Materials
                  </Button>
                }
              >
                <Typography variant="body2">
                  Find resources to support your child&apos;s education, development, and wellbeing in a new environment.
                </Typography>
              </AnimatedCard>
            </Grid>

            {/* For Teachers: Syllabus Support */}
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <AnimatedCard
                title="👩‍🏫 For Teachers"
                subtitle="Training, lesson plans, and tools to support 100+ community schools."
                delay={4}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(42,125,111,0.1)',
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  >
                    Teacher Resources
                  </Button>
                }
              >
                <Typography variant="body2">
                  Professional development resources, curriculum guides, and teaching tools for educators working with refugee students.
                </Typography>
              </AnimatedCard>
            </Grid>
            
            {/* AI-Powered Learning Support */}
            <Grid item xs={12}>
              <AnimatedCard
                title="🤖 AI-Powered Learning Support"
                subtitle="Use AI chat tools for homework help, translation, writing, and more."
                delay={5}
                elevation={3}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  p: 1
                }}
                actions={
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      fontWeight: 600 
                    }}
                  >
                    Try AI Assistant
                  </Button>
                }
              >
                <Box sx={{ p: 1 }}>
                  <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                    Our AI learning assistant can help you with:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip size="small" label="1" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2"><strong>Homework help</strong> in multiple subjects</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip size="small" label="2" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2"><strong>Translation</strong> between 30+ languages</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip size="small" label="3" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2"><strong>Writing assistance</strong> for essays & applications</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </AnimatedCard>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
      
      {/* Development Programs for 100+ Community Schools */}
      <Box sx={{ 
        mb: 5, 
        p: 4, 
        borderRadius: 4, 
        background: `linear-gradient(135deg, ${alpha('#2A7D6F', 0.07)} 0%, ${alpha('#79854E', 0.07)} 100%)`,
        border: `1px solid ${alpha('#2A7D6F', 0.1)}`
      }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            color: '#2A7D6F'
          }}
        >
          <School sx={{ mr: 1, color: '#2A7D6F' }} />
          Development Programs for 100+ Community Schools
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Our community-focused programs are adaptable to various syllabi and designed to support educational institutions working with refugee communities.
        </Typography>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <Grid container spacing={3}>
            {/* Teacher Capacity Building Program */}
            <Grid item xs={12} md={6} lg={3}>
              <AnimatedCard
                title="Teacher Capacity Building"
                delay={1}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(42,125,111,0.2)',
                  backgroundColor: alpha('#F9F4EF', 0.8)
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      borderColor: '#2A7D6F',
                      color: '#2A7D6F',
                      '&:hover': {
                        borderColor: '#2A7D6F',
                        backgroundColor: alpha('#2A7D6F', 0.05)
                      }
                    }}
                  >
                    Join Program
                  </Button>
                }
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 500, color: '#2A7D6F' }}>
                    Professional development for educators
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Digital teaching methods</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Inclusive classrooms for refugees</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Remote/blended learning tools</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Localized curriculum adaptation</Typography>
                    </Box>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>

            {/* Community Youth Leadership */}
            <Grid item xs={12} md={6} lg={3}>
              <AnimatedCard
                title="Community Youth Leadership"
                delay={2}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(211,97,53,0.2)',
                  backgroundColor: alpha('#F9F4EF', 0.8)
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      borderColor: '#D36135',
                      color: '#D36135',
                      '&:hover': {
                        borderColor: '#D36135',
                        backgroundColor: alpha('#D36135', 0.05)
                      }
                    }}
                  >
                    Join Program
                  </Button>
                }
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 500, color: '#D36135' }}>
                    Empowering the next generation of leaders
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Peer mentoring and conflict resolution</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Life skills & community organizing</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Student-led media/arts projects</Typography>
                    </Box>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>

            {/* Refugee EdTech Bootcamps */}
            <Grid item xs={12} md={6} lg={3}>
              <AnimatedCard
                title="Refugee EdTech Bootcamps"
                delay={3}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(121,133,78,0.2)',
                  backgroundColor: alpha('#F9F4EF', 0.8)
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      borderColor: '#79854E',
                      color: '#79854E',
                      '&:hover': {
                        borderColor: '#79854E',
                        backgroundColor: alpha('#79854E', 0.05)
                      }
                    }}
                  >
                    Join Program
                  </Button>
                }
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 500, color: '#79854E' }}>
                    Building digital skills for education
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">No-code website building (e.g., Bolt)</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Google Workspace training</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Mobile learning apps training</Typography>
                    </Box>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>

            {/* Parental Involvement Program */}
            <Grid item xs={12} md={6} lg={3}>
              <AnimatedCard
                title="Parental Involvement Program"
                delay={4}
                elevation={2}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(42,125,111,0.2)',
                  backgroundColor: alpha('#F9F4EF', 0.8)
                }}
                actions={
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      borderColor: '#2A7D6F',
                      color: '#2A7D6F',
                      '&:hover': {
                        borderColor: '#2A7D6F',
                        backgroundColor: alpha('#2A7D6F', 0.05)
                      }
                    }}
                  >
                    Join Program
                  </Button>
                }
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" paragraph sx={{ fontWeight: 500, color: '#2A7D6F' }}>
                    Supporting parents as educators
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Workshops on supporting home learning</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Literacy circles</Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">Nutrition and mental health for learning</Typography>
                    </Box>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
      
      {/* Innovative Features */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            color: theme.palette.secondary.main,
            borderBottom: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            pb: 1
          }}
        >
          <span role="img" aria-label="innovation" style={{ marginRight: '8px' }}>✨</span>
          Innovative Learning Features
        </Typography>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <Grid container spacing={4}>
            {/* AI Study Companion */}
            <Grid item xs={12} md={6}>
              <AnimatedCard
                title="🤖 AI Study Companion"
                delay={1}
                elevation={3}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  height: '100%'
                }}
                actions={
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      fontWeight: 600 
                    }}
                  >
                    Ask Study Assistant
                  </Button>
                }
              >
                <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                  GPT-powered chatbot for personalized learning support
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip size="small" label="01" color="secondary" />
                    <Typography variant="body2">Ask questions in your native language and get immediate answers</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip size="small" label="02" color="secondary" />
                    <Typography variant="body2">Get summaries of academic resources and complex materials</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip size="small" label="03" color="secondary" />
                    <Typography variant="body2">Receive step-by-step guidance on homework problems</Typography>
                  </Box>
                </Box>
              </AnimatedCard>
            </Grid>
            
            {/* Local Language Support */}
            <Grid item xs={12} md={6}>
              <AnimatedCard
                title="🌐 Local Language Support"
                delay={2}
                elevation={3}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  height: '100%'
                }}
                actions={
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    sx={{ 
                      borderRadius: '8px',
                      py: 1,
                      fontWeight: 600 
                    }}
                  >
                    Explore Translated Content
                  </Button>
                }
              >
                <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
                  Key courses and resources in multiple languages
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Middle East</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip size="small" label="Arabic" />
                        <Chip size="small" label="Kurdish" />
                        <Chip size="small" label="Dari" />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>South Asia</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip size="small" label="Urdu" />
                        <Chip size="small" label="Pashto" />
                        <Chip size="small" label="Rohingya" />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Africa</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip size="small" label="Swahili" />
                        <Chip size="small" label="Somali" />
                        <Chip size="small" label="Amharic" />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </AnimatedCard>
            </Grid>
            
            {/* Peer-Led Learning & Offline Access (split row) */}
            <Grid item xs={12}>
              <Grid container spacing={4}>
                {/* Peer-Led Learning Hubs */}
                <Grid item xs={12} md={6}>
                  <AnimatedCard
                    title="👥 Peer-Led Learning Hubs"
                    delay={3}
                    elevation={2}
                    sx={{
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      height: '100%'
                    }}
                    actions={
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                      >
                        Find Study Circles
                      </Button>
                    }
                  >
                    <Typography variant="body2" paragraph>
                      Create or join study groups with others in your community or connect virtually with peers around the world.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        p: 1,
                        borderRadius: 1,
                        textAlign: 'center',
                        flex: 1
                      }}>
                        <Typography variant="body2" fontWeight="bold">32</Typography>
                        <Typography variant="caption">Active Groups</Typography>
                      </Box>
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        p: 1,
                        borderRadius: 1,
                        textAlign: 'center',
                        flex: 1
                      }}>
                        <Typography variant="body2" fontWeight="bold">215</Typography>
                        <Typography variant="caption">Members</Typography>
                      </Box>
                      <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        p: 1,
                        borderRadius: 1,
                        textAlign: 'center',
                        flex: 1
                      }}>
                        <Typography variant="body2" fontWeight="bold">8</Typography>
                        <Typography variant="caption">Languages</Typography>
                      </Box>
                    </Box>
                  </AnimatedCard>
                </Grid>

                {/* Offline Access */}
                <Grid item xs={12} md={6}>
                  <AnimatedCard
                    title="💾 Offline Access"
                    delay={4}
                    elevation={2}
                    sx={{
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      height: '100%'
                    }}
                    actions={
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                      >
                        Download Resources
                      </Button>
                    }
                  >
                    <Typography variant="body2" paragraph>
                      Access educational content without an internet connection through downloadable resources and progressive web app features.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip 
                        icon={<span role="img" aria-label="document">📝</span>} 
                        label="PDFs" 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<span role="img" aria-label="audio">🎧</span>} 
                        label="Audio" 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<span role="img" aria-label="print">🖨️</span>} 
                        label="Printables" 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<span role="img" aria-label="app">📱</span>} 
                        label="PWA" 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                  </AnimatedCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Education;
