import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Translate as TranslateIcon,
  Build as BuildIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

const serviceSections = [
  {
    theme: 'Language Programs',
    icon: <TranslateIcon fontSize="large" color="primary" />,
    description: 'Bridging communication gaps and fostering integration through language proficiency.',
    subpages: [
      { name: 'English Bridge Program', path: '/our-services/language-programs/english-bridge-program' },
      { name: 'Bahasa Melayu for Refugees', path: '/our-services/language-programs/bahasa-melayu-refugees' },
    ],
  },
  {
    theme: 'Skills & Entrepreneurship',
    icon: <BuildIcon fontSize="large" color="primary" />,
    description: 'Empowering refugees with practical skills and entrepreneurial knowledge to build sustainable livelihoods.',
    subpages: [
      { name: 'Design Thinking for Refugee Entrepreneurs (DTRE)', path: '/our-services/skills-entrepreneurship/design-thinking-refugee-entrepreneurs' },
      { name: 'Vibe Coding with AI (non-coders)', path: '/our-services/skills-entrepreneurship/vibe-coding-ai' },
      { name: 'Digital Marketing', path: '/our-services/skills-entrepreneurship/digital-marketing' },
      { name: 'Financial Literacy: Budgeting, Pricing, Packaging', path: '/our-services/skills-entrepreneurship/financial-literacy' },
      { name: 'IT & Digital Skills for Women and Girls', path: '/our-services/skills-entrepreneurship/it-digital-skills-women' },
    ],
  },
  {
    theme: 'Vocational Training',
    icon: <SchoolIcon fontSize="large" color="primary" />,
    description: 'Providing hands-on vocational training for in-demand trades and crafts.',
    subpages: [
      { name: 'Baking & Catering', path: '/our-services/vocational-training/baking-catering' },
      { name: 'Soap Making', path: '/our-services/vocational-training/soap-making' },
      { name: 'Arts & Crafts Project', path: '/our-services/vocational-training/arts-crafts' },
    ],
  },
  {
    theme: 'Career Development',
    icon: <WorkIcon fontSize="large" color="primary" />,
    description: 'Supporting refugees in navigating the job market and advancing their careers.',
    subpages: [
      { name: 'CV & Cover Letter Writing', path: '/our-services/career-development/cv-cover-letter' },
      { name: 'Interview Preparation & Mock Interviews', path: '/our-services/career-development/interview-preparation' },
      { name: 'Freelancing & Remote Work Skills', path: '/our-services/career-development/freelancing-remote-work' },
      { name: 'AI-Powered Job Searching', path: '/our-services/career-development/ai-job-searching' },
    ],
  },
];

const OurServicesPage = () => {
  const location = useLocation();
  const languageProgramsRef = useRef(null);
  const skillsEntrepreneurshipRef = useRef(null);
  const vocationalTrainingRef = useRef(null);
  const careerDevelopmentRef = useRef(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle initial load and scrolling to section based on hash
  useEffect(() => {
    setIsLoaded(true);
    
    // Get the hash from the URL (e.g., #language-programs)
    const hash = location.hash;
    
    // If there's a hash, scroll to the appropriate section
    if (hash) {
      // Remove the # character
      const sectionId = hash.substring(1);
      
      // Find the correct ref based on the section ID
      let targetRef = null;
      switch(sectionId) {
        case 'language-programs':
          targetRef = languageProgramsRef;
          break;
        case 'skills-entrepreneurship':
          targetRef = skillsEntrepreneurshipRef;
          break;
        case 'vocational-training':
          targetRef = vocationalTrainingRef;
          break;
        case 'career-development':
          targetRef = careerDevelopmentRef;
          break;
        default:
          break;
      }
      
      // If we found a matching ref, scroll to it
      if (targetRef && targetRef.current) {
        // Add a small delay to ensure the page has rendered
        setTimeout(() => {
          window.scrollTo({
            top: targetRef.current.offsetTop - 80, // 80px offset for the navbar
            behavior: 'smooth'
          });
          
          // Add visual highlight effect to the section
          targetRef.current.style.transition = 'background-color 0.5s';
          targetRef.current.style.backgroundColor = 'rgba(211, 97, 53, 0.1)';
          
          // Remove highlight after 1.5 seconds
          setTimeout(() => {
            targetRef.current.style.backgroundColor = 'transparent';
          }, 1500);
        }, 500);
      }
    }
  }, [location]);
  
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h2" component="h1" gutterBottom textAlign="center" color="primary.main">
        Our Services
      </Typography>
      <Typography variant="h5" component="p" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
        Showcasing RNC&apos;s unique, refugee-led programs designed to empower and build self-reliance.
      </Typography>

      <Grid container spacing={4}>
        {serviceSections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper 
              elevation={3} 
              sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}
              ref={index === 0 ? languageProgramsRef : 
                  index === 1 ? skillsEntrepreneurshipRef : 
                  index === 2 ? vocationalTrainingRef : 
                  index === 3 ? careerDevelopmentRef : null}
              id={index === 0 ? 'language-programs' : 
                  index === 1 ? 'skills-entrepreneurship' : 
                  index === 2 ? 'vocational-training' : 
                  index === 3 ? 'career-development' : ''}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {section.icon}
                <Typography variant="h5" component="h2" sx={{ ml: 2 }}>
                  {section.theme}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {section.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/program-registration/${section.theme.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                  state={{ programName: section.theme }}
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    boxShadow: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                >
                  Join Program
                </Button>
              </Box>
              <List dense>
                {section.subpages.map((subpage, subIndex) => (
                  <ListItem 
                    key={subIndex} 
                    disablePadding 
                    component={Link} 
                    to={subpage.path}
                    sx={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        textDecoration: 'none' 
                      } 
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <ChevronRightIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={subpage.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OurServicesPage;
