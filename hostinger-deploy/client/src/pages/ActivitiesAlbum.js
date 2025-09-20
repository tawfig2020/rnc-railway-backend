import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, ArrowBack, ArrowForward } from '@mui/icons-material';
import { Helmet } from 'react-helmet';

// Images for Baking category
const bakingImages = [
  { id: 1, src: '/assets/activities/baking/baking-class-1.jpg', alt: 'Baking Class Workshop', title: 'Baking Skills Workshop', description: 'Participants learning professional baking techniques in our community kitchen, fostering both culinary skills and entrepreneurship mindsets through hands-on practice.' },
  { id: 2, src: '/assets/activities/baking/baking-class-instructor (2).jpg', alt: 'Baking Class with Instructor', title: 'Professional Baking Instruction', description: 'Experienced instructors guiding participants through advanced baking techniques, creating a supportive learning environment for skill development and confidence building.' },
  { id: 3, src: '/assets/activities/baking/baking-community-kitchen (2).jpg', alt: 'Community Kitchen Baking', title: 'Community Kitchen Sessions', description: 'Our fully equipped community kitchen provides the perfect space for hands-on baking education and collaborative learning experiences among community members.' },
  { id: 4, src: '/assets/activities/baking/RNC class celeb.jpg', alt: 'RNC Class Celebration', title: 'Baking Class Celebration', description: 'Celebrating the achievements and progress of our baking program participants, showcasing the community spirit and success of our culinary education initiatives.' },
];

// Images for English Class category
const englishClassImages = [
  { id: 1, src: '/assets/activities/english/english-class-1 (2).jpg', alt: 'English Class Workshop', title: 'English Language Learning', description: 'Comprehensive English language classes helping community members develop essential communication skills for education, employment, and successful community integration.' },
  { id: 2, src: '/assets/activities/english/Placement-Test (2).jpg', alt: 'English Placement Test', title: 'English Placement Assessment', description: 'Initial placement test to assess participants English proficiency and determine the appropriate learning level for each student, ensuring personalized learning paths.' },
  { id: 3, src: '/assets/activities/english/english-reading-session.jpg', alt: 'English Reading Workshop', title: 'Reading Comprehension Development', description: 'Focused reading workshops that improve literacy skills, vocabulary expansion, and comprehension abilities essential for academic and professional success.' },
  { id: 4, src: '/assets/activities/english/english-group-learning.jpg', alt: 'Group English Learning', title: 'Collaborative Learning Environment', description: 'Dynamic group learning sessions where participants support each other in their English language journey, fostering peer learning and community connections.' },
  { id: 5, src: '/assets/activities/english/Final-Exam (2).jpg', alt: 'English Final Exam', title: 'Final Assessment', description: 'Comprehensive final exam to evaluate participants progress and mastery of English language skills acquired during the course, celebrating their achievements.' },
  { id: 6, src: '/assets/activities/english/Celbration-english.jpg', alt: 'English Class Celebration', title: 'English Program Celebration', description: 'Celebration events showcasing student achievements and progress in English language learning, building confidence and motivation for continued educational growth.' },
];

// Images for Art category
const artClassImages = [
  { id: 1, src: '/assets/activities/art/art-class-1 (2).JPG', alt: 'Art Class Workshop', title: 'Creative Art Workshop', description: 'Dynamic art workshops where community members explore their creative potential through guided instruction and hands-on practice with various artistic mediums and techniques.' },
  { id: 2, src: '/assets/activities/art/art-individual-work.jpg', alt: 'Individual Art Work', title: 'Personal Art Development', description: 'Participants working on individual art projects, developing personal artistic style and building self-expression skills in a supportive and encouraging environment.' },
  { id: 3, src: '/assets/activities/art/art-collaborative-session (2).JPG', alt: 'Collaborative Art Session', title: 'Group Art Projects', description: 'Community members collaborating on inspiring group art projects, fostering teamwork, communication skills, and shared creative experiences that build lasting connections.' },
  { id: 4, src: '/assets/activities/art/art-creative-expression (2).JPG', alt: 'Creative Expression Workshop', title: 'Creative Expression Sessions', description: 'Participants exploring diverse forms of creative expression, discovering new artistic mediums and developing confidence in their unique creative voice and artistic identity.' },
  { id: 5, src: '/assets/activities/art/art-group-workshop (2).JPG', alt: 'Group Art Workshop', title: 'Collaborative Learning Environment', description: 'Dynamic group workshops where community members learn together, share techniques, and support each other in their artistic journey and personal growth through creative expression.' },
  { id: 6, src: '/assets/activities/art/art-painting-session (2).JPG', alt: 'Painting Workshop', title: 'Painting Techniques Mastery', description: 'Focused painting sessions where participants master various painting techniques, from watercolors to acrylics, building technical skills and artistic confidence through guided practice.' },
  { id: 7, src: '/assets/activities/art/art-skill-development (2).JPG', alt: 'Art Skill Development', title: 'Progressive Skill Building', description: 'Structured skill development sessions focusing on fundamental art techniques, helping participants build a strong foundation for their artistic pursuits and creative expression.' },
  { id: 8, src: '/assets/activities/art/art-community-creativity (3).jpg', alt: 'Community Art Creation', title: 'Community Creative Projects', description: 'Large-scale community art projects that bring people together, fostering social connections while creating meaningful artwork that represents shared experiences and cultural heritage.' },
  { id: 9, src: '/assets/activities/art/art-therapeutic-session.jpg', alt: 'Therapeutic Art Session', title: 'Art Therapy and Healing', description: 'Therapeutic art sessions providing emotional support and healing through creative expression, helping participants process experiences and build resilience through artistic practice.' },
  { id: 10, src: '/assets/activities/art/art-final-showcase.jpg', alt: 'Art Showcase Event', title: 'Community Art Exhibition', description: 'Celebration showcase events where participants display their completed artwork, building pride, confidence, and recognition for their artistic achievements and creative growth within the community.' },
];

const aiCodingClassImages = [
  { id: 1, src: '/assets/activities/ai-coding/coding-class-1 (2).jpg', alt: 'AI Coding Class', title: 'AI Coding Workshop', description: 'Technology workshops equipping participants with in-demand coding skills for the growing digital economy and tech career opportunities.' },
  { id: 2, src: '/assets/activities/ai-coding/group-project-discussion (2).jpg', alt: 'Group Project Discussion', title: 'Group Project Discussion', description: 'Collaborative sessions where participants brainstorm, plan, and develop group coding projects, fostering teamwork and communication skills essential for real-world tech environments.' },
  { id: 3, src: '/assets/activities/ai-coding/debug-fix-errors (2).jpg', alt: 'Debug and Fix Errors', title: 'Debug and Fix Errors', description: 'Hands-on troubleshooting workshops where participants learn to identify, diagnose, and resolve common coding errors, building critical problem-solving skills for software development.' },
  { id: 4, src: '/assets/activities/ai-coding/code-review (2).jpg', alt: 'Code Review Session', title: 'Code Review', description: 'Structured code review sessions where participants learn to analyze, evaluate, and improve code quality, developing essential skills for collaborative software development and quality assurance.' },
  { id: 5, src: '/assets/activities/ai-coding/mvp-validation (2).jpg', alt: 'MVP Validation', title: 'Validating Ideas for MVP', description: 'Strategic workshops focused on evaluating and refining minimum viable product concepts, teaching participants how to transform ideas into practical, testable software solutions.' },
];

const gatheringImages = [
  { id: 1, src: '/assets/activities/gathering/gathering-1 (2).jpg', alt: 'Community Gathering', title: 'Community Event', description: 'Social gatherings that strengthen community bonds, facilitate cultural exchange, and provide critical support networks for community members.' },
  { id: 2, src: '/assets/activities/gathering/volunteer-donor-meeting (2).jpg', alt: 'Volunteer and Donor Meeting', title: 'Meeting with Volunteers & Donors', description: 'Collaborative discussions between volunteers, donors, and community members to share insights, align goals, and strengthen partnerships for sustainable program development.' },
  { id: 3, src: '/assets/activities/gathering/same-skies-welcome (2).jpg', alt: 'Same Skies Welcome', title: 'Welcoming Same Skies', description: 'Special reception and refreshment time to welcome Same Skies representatives, fostering relationships and exploring collaborative opportunities for refugee support initiatives.' },
  { id: 4, src: '/assets/activities/gathering/Training.jpg', alt: 'Training Session', title: 'Community Training', description: 'Educational training sessions designed to build capacity and develop essential skills for community members, fostering personal and professional growth.' },
  { id: 5, src: '/assets/activities/gathering/Trauma Care Course.jpg', alt: 'Trauma Care Course', title: 'Trauma Care Training', description: 'Specialized training courses focused on trauma-informed care, providing community members with tools to support healing and resilience building.' },
  { id: 6, src: '/assets/activities/gathering/event 2 with watermark.jpg', alt: 'Community Event', title: 'Special Community Event', description: 'Memorable community events that celebrate achievements, foster connections, and create lasting bonds among community members and supporters.' },
  { id: 7, src: '/assets/activities/gathering/Celbrtation-gathering.jpg', alt: 'Celebration Gathering', title: 'Community Celebration', description: 'Joyful celebration gatherings that honor milestones, achievements, and cultural traditions, strengthening community spirit and shared identity.' },
];

const entrepreneurshipImages = [
  { id: 1, src: '/assets/activities/entrepreneurship/other-activity-1 (2).jpg', alt: 'Entrepreneurship Activities', title: 'Business Development Programs', description: 'Diverse entrepreneurship programs addressing specific business development needs, from financial literacy to market research, supporting holistic business growth.' },
  { id: 2, src: '/assets/activities/entrepreneurship/entrepreneurship-skills (2).jpg', alt: 'Entrepreneurship Skills', title: 'Business Skills Training', description: 'Comprehensive training programs teaching essential business skills, market analysis, financial planning, and sustainable growth strategies for aspiring refugee entrepreneurs.' },
  { id: 3, src: '/assets/activities/entrepreneurship/personal-business-setup (2).jpg', alt: 'Personal Business Setup', title: 'Setting Up Personal Business', description: 'Practical workshops guiding participants through the step-by-step process of establishing their own businesses, from registration and licensing to operations and marketing.' },
];

const ActivitiesAlbum = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Categories and their corresponding images
  const categories = [
    { name: 'Baking', images: bakingImages },
    { name: 'English Class', images: englishClassImages },
    { name: 'Art Class', images: artClassImages },
    { name: 'AI Coding Class', images: aiCodingClassImages },
    { name: 'Gathering', images: gatheringImages },
    { name: 'Entrepreneurship', images: entrepreneurshipImages },
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const openImageViewer = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const handleNext = () => {
    const nextIndex = (currentImageIndex + 1) % categories[currentTab].images.length;
    setSelectedImage(categories[currentTab].images[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentImageIndex - 1 + categories[currentTab].images.length) % categories[currentTab].images.length;
    setSelectedImage(categories[currentTab].images[prevIndex]);
    setCurrentImageIndex(prevIndex);
  };

  const getCategoryDescription = (categoryIndex) => {
    switch (categoryIndex) {
      case 0: // Baking
        return "Our baking activities provide practical skills for capacity building and self-reliance. Participants learn professional baking techniques, food safety, and entrepreneurship concepts to develop marketable skills that can lead to income-generating opportunities within their communities.";
      case 1: // English Class
        return "English language courses empower community members with essential communication skills for employment, education, and integration. Classes are structured to accommodate diverse learning needs, focusing on practical language usage for everyday situations.";
      case 2: // Art Class
        return "Art classes offer therapeutic expression and cultural preservation while developing creative skills. These workshops cultivate talents that can be channeled into handcrafted products, supporting sustainable livelihood opportunities.";
      case 3: // AI Coding Class
        return "Our AI and coding workshops prepare participants for the digital economy with in-demand technical skills. These classes foster innovation and problem-solving abilities, opening pathways to tech careers and digital entrepreneurship.";
      case 4: // Gathering
        return "Community gatherings strengthen social bonds, facilitate cultural exchange, and provide mutual support networks. These events create spaces for sharing knowledge, celebrating achievements, and building resilience within the community.";
      case 5: // Entrepreneurship
        return "Entrepreneurship programs empower refugees with business skills and opportunities for economic self-reliance. These initiatives cover business planning, financial literacy, market analysis, and practical guidance for establishing sustainable enterprises that contribute to community prosperity.";
      default:
        return "";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Helmet>
        <title>Activities Album | Refugee Network Centre</title>
        <meta name="description" content="Explore our community activities and programs fostering capacity building and self-reliance." />
      </Helmet>
      
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ 
          color: 'primary.main',
          position: 'relative',
          display: 'inline-block',
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '60%',
            height: '4px',
            bottom: '-10px',
            left: '20%',
            backgroundColor: 'secondary.main',
            borderRadius: '2px'
          }
        }}>
          Activities Album
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mt: 3, color: 'text.secondary' }}>
          Discover how our diverse activities foster capacity building and self-reliance within our community. These programs provide valuable skills, cultural exchange, and support networks.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500,
              py: 2
            }
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category.name} />
          ))}
        </Tabs>

        <Box p={4}>
          <Typography variant="h5" gutterBottom fontWeight="600" color="primary.dark">
            {categories[currentTab].name}
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            {getCategoryDescription(currentTab)}
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {categories[currentTab].images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    },
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                  onClick={() => openImageViewer(image, index)}
                >
                  <CardMedia
                    component="img"
                    height="280"
                    image={image.src}
                    alt={image.alt}
                    sx={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 1
                      }}
                    >
                      {image.title}
                    </Typography>
                    {image.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {image.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Image viewer dialog */}
      <Dialog 
        open={Boolean(selectedImage)} 
        onClose={closeImageViewer} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0, overflow: 'hidden' }}>
          {selectedImage && (
            <>
              <IconButton
                onClick={closeImageViewer}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              
              <Box sx={{ position: 'relative' }}>
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.alt} 
                  style={{ 
                    width: '100%', 
                    maxHeight: '80vh', 
                    objectFit: 'contain' 
                  }} 
                />
                
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  p: 2, 
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white'
                }}>
                  <Typography variant="h6">{selectedImage.title}</Typography>
                </Box>
                
                <IconButton
                  onClick={handlePrev}
                  disabled={categories[currentTab].images.length <= 1}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                
                <IconButton
                  onClick={handleNext}
                  disabled={categories[currentTab].images.length <= 1}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ActivitiesAlbum;
