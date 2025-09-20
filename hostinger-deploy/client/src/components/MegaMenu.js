import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Translate as TranslateIcon,
  Build as BuildIcon,
  School as SchoolIcon, // Vocational Training icon
  Work as WorkIcon, // Career Development icon
  // Keeping some existing icons if they are relevant for specific items, or use generic ones
  MenuBook as CoursesIcon,
  Code as CodingIcon,
  Computer as DigitalSkillsIcon,
  Engineering as VocationalTrainingIcon, // More specific for vocational perhaps
  Badge as JobReadinessIcon,
  Palette as ArtsIcon,
  Groups as CommunityIcon,
  AttachMoney as FinancialLiteracyIcon,
  Campaign as DigitalMarketingIcon,
  Lightbulb as DesignThinkingIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Create a custom component that combines ListItem styling with Link functionality
const StyledListItem = React.forwardRef(({ to, onClick, children, ...rest }, ref) => {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      ref={ref}
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        display: 'block',
        width: '100%'
      }}
      {...rest}
    >
      <ListItem 
        sx={{
          borderRadius: theme => theme.shape.borderRadius * 1.5,
          '&:hover': {
            backgroundColor: 'rgba(42, 125, 111, 0.08)',
          },
          transition: 'all 0.2s ease',
          marginBottom: 0.5,
          padding: '8px 16px',
        }}
      >
        {children}
      </ListItem>
    </Link>
  );
});

StyledListItem.displayName = 'StyledListItem';

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const MegaMenu = ({ open, anchorEl, handleClose }) => {
  const languageProgramItems = [
    { icon: <TranslateIcon color="primary" />, text: 'English Bridge Program', link: '/our-services#language-programs' },
    { icon: <TranslateIcon color="primary" />, text: 'Bahasa Melayu for Refugees', link: '/our-services#language-programs' },
  ];

  const skillsAndEntrepreneurshipItems = [
    { icon: <DesignThinkingIcon color="primary" />, text: 'Design Thinking (DTRE)', link: '/our-services#skills-entrepreneurship' },
    { icon: <CodingIcon color="primary" />, text: 'Vibe Coding with AI', link: '/our-services#skills-entrepreneurship' },
    { icon: <DigitalMarketingIcon color="primary" />, text: 'Digital Marketing', link: '/our-services#skills-entrepreneurship' },
    { icon: <FinancialLiteracyIcon color="primary" />, text: 'Financial Literacy', link: '/our-services#skills-entrepreneurship' },
    { icon: <DigitalSkillsIcon color="primary" />, text: 'IT & Digital Skills for Women', link: '/our-services#skills-entrepreneurship' },
  ];

  const vocationalTrainingItems = [
    { icon: <VocationalTrainingIcon color="primary" />, text: 'Baking & Catering', link: '/our-services#vocational-training' },
    { icon: <ArtsIcon color="primary" />, text: 'Soap Making', link: '/our-services#vocational-training' },
    { icon: <ArtsIcon color="primary" />, text: 'Arts & Crafts Project', link: '/our-services#vocational-training' },
  ];

  const careerDevelopmentItems = [
    { icon: <JobReadinessIcon color="primary" />, text: 'CV & Cover Letter Writing', link: '/our-services#career-development' },
    { icon: <WorkIcon color="primary" />, text: 'Interview Preparation', link: '/our-services#career-development' },
    { icon: <CodingIcon color="primary" />, text: 'Freelancing & Remote Work', link: '/our-services#career-development' },
    { icon: <WorkIcon color="primary" />, text: 'AI-Powered Job Searching', link: '/our-services#career-development' },
  ];

  return (
    <Popper 
      open={open} 
      anchorEl={anchorEl} 
      role={undefined} 
      placement="bottom-start" 
      transition 
      disablePortal
      style={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'left top' }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              width: '900px', // Increased width for 4 columns 
              mt: 1.5, 
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="h6" fontWeight="bold">
                    Our Services
                  </Typography>
                  <Typography variant="body2">
                    Comprehensive support for refugee communities
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Language Programs Column */}
                    <Grid item xs={3}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TranslateIcon sx={{ mr: 1 }} />
                          Language Programs
                        </Box>
                      </CategoryTitle>
                      <List dense disablePadding>
                        {languageProgramItems.map((item, index) => (
                          <StyledListItem 
                            key={index} 
                            to={item.link}
                            onClick={handleClose}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                          </StyledListItem>
                        ))}
                      </List>
                      <Link 
                        to="/our-services" 
                        style={{ 
                          display: 'block', 
                          marginTop: '8px', 
                          textAlign: 'right',
                          color: '#2A7D6F', // Deep teal (primary.main)
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        onClick={handleClose}
                      >
                        View All Services →
                      </Link>
                    </Grid>
                    
                    {/* Skills & Entrepreneurship Column */}
                    <Grid item xs={3}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BuildIcon sx={{ mr: 1 }} />
                          Skills & Entrepreneurship
                        </Box>
                      </CategoryTitle>
                      <List dense disablePadding>
                        {skillsAndEntrepreneurshipItems.map((item, index) => (
                          <StyledListItem 
                            key={index} 
                            to={item.link}
                            onClick={handleClose}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                          </StyledListItem>
                        ))}
                      </List>
                      <Link 
                        to="/our-services" 
                        style={{ 
                          display: 'block', 
                          marginTop: '8px', 
                          textAlign: 'right',
                          color: '#2A7D6F', // Deep teal (primary.main)
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        onClick={handleClose}
                      >
                        View All Services →
                      </Link>
                    </Grid>
                    
                    {/* Vocational Training Column */}
                    <Grid item xs={3}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SchoolIcon sx={{ mr: 1 }} />
                          Vocational Training
                        </Box>
                      </CategoryTitle>
                      <List dense disablePadding>
                        {vocationalTrainingItems.map((item, index) => (
                          <StyledListItem 
                            key={index} 
                            to={item.link}
                            onClick={handleClose}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                          </StyledListItem>
                        ))}
                      </List>
                      <Link 
                        to="/our-services" 
                        style={{ 
                          display: 'block', 
                          marginTop: '8px', 
                          textAlign: 'right',
                          color: '#2A7D6F', // Deep teal (primary.main)
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        onClick={handleClose}
                      >
                        View All Services →
                      </Link>
                    </Grid>
                    {/* Career Development Column */}
                    <Grid item xs={3}>
                      <CategoryTitle variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WorkIcon sx={{ mr: 1 }} />
                          Career Development
                        </Box>
                      </CategoryTitle>
                      <List dense disablePadding>
                        {careerDevelopmentItems.map((item, index) => (
                          <StyledListItem 
                            key={index} 
                            to={item.link}
                            onClick={handleClose}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                          </StyledListItem>
                        ))}
                      </List>
                      <Link 
                        to="/our-services" 
                        style={{ 
                          display: 'block', 
                          marginTop: '8px', 
                          textAlign: 'right',
                          color: '#2A7D6F', // Deep teal (primary.main)
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        onClick={handleClose}
                      >
                        View All Services →
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default MegaMenu;
