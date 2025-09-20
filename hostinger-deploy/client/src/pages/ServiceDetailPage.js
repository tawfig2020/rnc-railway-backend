import React from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Service details database - this would ideally come from your backend API
const serviceDetails = {
  // Language Programs
  'english-bridge-program': {
    title: 'English Bridge Program',
    category: 'Language Programs',
    description: 'Our English Bridge Program helps refugees develop essential English language skills needed for education, employment, and daily life in their host communities.',
    content: [
      'Structured curriculum designed specifically for refugees and asylum seekers',
      'Multiple proficiency levels from beginner to advanced',
      'Focus on practical, everyday English for immediate use',
      'Certified teachers with experience working with diverse communities',
      'Regular assessment to track progress and adjust learning plans'
    ]
  },
  'bahasa-melayu-refugees': {
    title: 'Bahasa Melayu for Refugees',
    category: 'Language Programs',
    description: 'Our Bahasa Melayu courses help refugees integrate into Malaysian society through language acquisition.',
    content: [
      'Basic conversational Malay for everyday interactions',
      'Cultural context and local customs integrated into lessons',
      'Community-based learning approach',
      'Peer practice sessions with native speakers',
      'Focus on practical vocabulary for work, shopping, and accessing services'
    ]
  },
  
  // Skills & Entrepreneurship
  'design-thinking-refugee-entrepreneurs': {
    title: 'Design Thinking for Refugee Entrepreneurs (DTRE)',
    category: 'Skills & Entrepreneurship',
    description: 'Empowering refugee entrepreneurs through design thinking methodologies to create innovative business solutions.',
    content: [
      'Human-centered design approach tailored for refugee contexts',
      'Problem identification and solution ideation workshops',
      'Prototyping and testing business concepts',
      'Mentorship from established entrepreneurs and designers',
      'Access to micro-grants for promising business ideas'
    ]
  },
  'vibe-coding-ai': {
    title: 'Vibe Coding with AI (non-coders)',
    category: 'Skills & Entrepreneurship',
    description: 'Introducing coding and AI concepts to refugees with no prior programming experience.',
    content: [
      'Basics of programming logic without complex syntax',
      'Introduction to AI tools accessible to non-technical users',
      'Hands-on projects using no-code and low-code platforms',
      'Digital skill building with practical applications',
      'Creating simple automation solutions for small businesses'
    ]
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    category: 'Skills & Entrepreneurship',
    description: 'Teaching refugees essential digital marketing skills to promote businesses and build online presence.',
    content: [
      'Social media marketing fundamentals',
      'Content creation for various platforms',
      'Basic SEO and web analytics',
      'Email marketing campaigns',
      'Digital advertising on small budgets',
      'Building and managing online business reputation'
    ]
  },
  'financial-literacy': {
    title: 'Financial Literacy: Budgeting, Pricing, Packaging',
    category: 'Skills & Entrepreneurship',
    description: 'Equipping refugees with financial knowledge to manage resources and build sustainable businesses.',
    content: [
      'Personal and business budgeting principles',
      'Determining effective pricing strategies',
      'Product packaging and presentation for value perception',
      'Basic accounting and financial record-keeping',
      'Accessing micro-finance and managing credit',
      'Long-term financial planning and savings strategies'
    ]
  },
  'it-digital-skills-women': {
    title: 'IT & Digital Skills for Women and Girls',
    category: 'Skills & Entrepreneurship',
    description: 'A women-centric program designed to bridge the gender gap in digital literacy among refugee communities.',
    content: [
      'Safe and supportive learning environment for women and girls',
      'Basic computer skills and internet navigation',
      'Introduction to productivity software and tools',
      'Mobile digital skills for business and education',
      'Online safety and digital rights awareness',
      'Mentorship from women in technology fields'
    ]
  },
  
  // Vocational Training
  'baking-catering': {
    title: 'Baking & Catering',
    category: 'Vocational Training',
    description: 'Professional culinary training focused on baking and catering skills that can lead to employment or entrepreneurship.',
    content: [
      'Fundamentals of baking techniques and food safety',
      'Menu planning and nutritional considerations',
      'Food presentation and packaging',
      'Business aspects of catering and bakery operations',
      'Hands-on practice in commercial kitchens',
      'Opportunities to cater community events and build portfolio'
    ]
  },
  'soap-making': {
    title: 'Soap Making',
    category: 'Vocational Training',
    description: 'Teaching the craft of artisanal soap production as a sustainable livelihood option.',
    content: [
      'Understanding ingredients and their properties',
      'Cold and hot process soap making techniques',
      'Creating natural colorants and fragrances',
      'Packaging and branding handmade soaps',
      'Safety protocols and quality control',
      'Business planning for small-scale production'
    ]
  },
  'arts-crafts': {
    title: 'Arts & Crafts Project',
    category: 'Vocational Training',
    description: 'Developing marketable skills in various arts and crafts while preserving cultural heritage.',
    content: [
      'Traditional and contemporary crafting techniques',
      'Working with diverse materials and tools',
      'Product design and development',
      'Quality standards for marketable handicrafts',
      'Cultural storytelling through artistic expression',
      'Collective marketing and sales opportunities'
    ]
  },
  
  // Career Development
  'cv-cover-letter': {
    title: 'CV & Cover Letter Writing',
    category: 'Career Development',
    description: 'Workshops focused on creating professional job application materials tailored for the local job market.',
    content: [
      'CV formatting and structure adapted to Malaysian employer expectations',
      'Highlighting transferable skills and relevant experience',
      'Addressing employment gaps in refugee contexts',
      'Persuasive cover letter writing techniques',
      'Digital and print-ready document preparation',
      'Personalized feedback and revision support'
    ]
  },
  'interview-preparation': {
    title: 'Interview Preparation & Mock Interviews',
    category: 'Career Development',
    description: 'Comprehensive interview coaching to build confidence and competence in job interview situations.',
    content: [
      'Common interview questions and effective responses',
      'Cultural norms in Malaysian professional settings',
      'Body language and professional presentation',
      'Addressing refugee status and background appropriately',
      'Practice with industry professionals as interviewers',
      'Feedback and improvement strategies'
    ]
  },
  'freelancing-remote-work': {
    title: 'Freelancing & Remote Work Skills',
    category: 'Career Development',
    description: 'Training on how to access and succeed in the gig economy and remote work opportunities.',
    content: [
      'Setting up profiles on major freelancing platforms',
      'Identifying marketable skills for online work',
      'Client communication and project management',
      'Time management and productivity techniques',
      'Setting rates and managing payments',
      'Building a portfolio and client base'
    ]
  },
  'ai-job-searching': {
    title: 'AI-Powered Job Searching',
    category: 'Career Development',
    description: 'Leveraging AI tools to enhance job searching efficiency and success rates.',
    content: [
      'Using AI for personalized job matching',
      'Optimizing applications for Applicant Tracking Systems',
      'AI tools for skills assessment and development',
      'Automated job alerts and application tracking',
      'Networking through AI-enhanced platforms',
      'Ethical considerations and limitations of AI in job searching'
    ]
  }
};

const ServiceDetailPage = () => {
  const { category, serviceId } = useParams();
  const navigate = useNavigate();
  
  const lookupKey = serviceId.toLowerCase();
  
  const service = serviceDetails[lookupKey] || {
    title: 'Service Not Found',
    category: category ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '',
    description: 'The requested service information is not available.',
    content: ['Please return to the services page and select a valid service.']
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/our-services">
          Our Services
        </Link>
        {category && (
          <Link 
            component={RouterLink} 
            underline="hover" 
            color="inherit" 
            to={`/our-services/${category}`}
          >
            {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
        )}
        <Typography color="text.primary">{service.title}</Typography>
      </Breadcrumbs>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          {service.title}
        </Typography>
        <Typography variant="subtitle1" color="secondary.main" gutterBottom>
          {service.category}
        </Typography>
        <Typography variant="body1" paragraph>
          {service.description}
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Program Highlights
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          {service.content.map((item, index) => (
            <Typography component="li" variant="body1" key={index} sx={{ mb: 1 }}>
              {item}
            </Typography>
          ))}
        </Box>
        
        {/* Call to action */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Box 
            component="button"
            onClick={() => {
              // Navigate to program registration with the service information
              navigate(`/program-registration/${lookupKey}`, {
                state: { programName: service.title }
              });
            }}
            sx={{ 
              bgcolor: 'secondary.main',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'secondary.dark',
              }
            }}
          >
            Join Program
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ServiceDetailPage;
