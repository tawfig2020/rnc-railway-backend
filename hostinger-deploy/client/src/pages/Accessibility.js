import React from 'react';
import { Container, Typography, Box, Paper, Breadcrumbs, Link, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Home, ChevronRight, Accessibility, CheckCircle, WbIncandescent } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const AccessibilityPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 6, 
      background: `linear-gradient(to bottom, #F9F4EF, rgba(249, 244, 239, 0.7))`,
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Accessibility sx={{ mr: 0.5 }} fontSize="inherit" />
            Accessibility
          </Typography>
        </Breadcrumbs>

        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            color: '#2A7D6F',
            mb: 4,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: 100,
              height: 4,
              backgroundColor: '#D36135',
              borderRadius: 2
            }
          }}
        >
          Accessibility Statement
        </Typography>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            Our Commitment
          </Typography>
          <Typography paragraph>
            The Refugee Network Centre (RNC) is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            Conformance Status
          </Typography>
          <Typography paragraph>
            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
          </Typography>
          
          <Typography paragraph>
            The following measures have been taken to ensure accessibility:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#2A7D6F' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Semantic HTML" 
                secondary="We use appropriate HTML elements to ensure proper structure and navigation."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#2A7D6F' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Alt Text for Images" 
                secondary="All informative images have meaningful alternative text descriptions."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#2A7D6F' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Color Contrast" 
                secondary="We maintain sufficient contrast between text and background colors."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#2A7D6F' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Keyboard Navigation" 
                secondary="All functionality is operable through a keyboard interface."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#2A7D6F' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Responsive Design" 
                secondary="Our website adapts to different screen sizes and orientations."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#2A7D6F' }} />
              </ListItemIcon>
              <ListItemText 
                primary="ARIA Attributes" 
                secondary="We use ARIA landmarks and labels where appropriate to enhance navigation."
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            Assistance Available
          </Typography>
          <Typography paragraph>
            If you encounter any barriers to accessibility on our website, please don&apos;t hesitate to contact us. We&apos;re here to help and are committed to making our digital content accessible to all users.
          </Typography>

          <Typography paragraph>
            You may:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <WbIncandescent sx={{ color: '#D36135' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Contact our support team" 
                secondary="Email: refugeenc@gmail.com or call +60 18-203 5784"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WbIncandescent sx={{ color: '#D36135' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Request alternative formats" 
                secondary="We can provide information in different formats upon request"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WbIncandescent sx={{ color: '#D36135' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Report accessibility issues" 
                secondary="Feedback helps us improve our accessibility efforts"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            Compatibility with Browsers and Assistive Technology
          </Typography>
          <Typography paragraph>
            Our website is designed to be compatible with the following assistive technologies:
          </Typography>
          <ul>
            <li>
              <Typography>Screen readers (including NVDA, JAWS, and VoiceOver)</Typography>
            </li>
            <li>
              <Typography>Screen magnifiers</Typography>
            </li>
            <li>
              <Typography>Speech recognition software</Typography>
            </li>
            <li>
              <Typography>Keyboard-only navigation</Typography>
            </li>
          </ul>
          
          <Typography paragraph>
            We support the last two versions of major browsers including Chrome, Firefox, Safari, and Edge.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2A7D6F' }}>
            Ongoing Improvements
          </Typography>
          <Typography paragraph>
            We are committed to ongoing accessibility improvements. Our website undergoes regular testing with assistive technologies and we welcome your feedback to help us identify areas for improvement.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: '#2A7D6F', mt: 2 }}>
            Contact Information
          </Typography>
          <Typography paragraph>
            For questions or concerns regarding accessibility, please contact:
          </Typography>
          <Typography paragraph>
            Email: refugeenc@gmail.com<br />
            Phone: +60 18-203 5784<br />
            Address: 43-2, Jalan Sulaiman 3, Taman Putra Sulaiman, 68000 Ampang, Selangor, Malaysia
          </Typography>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Last Updated: July 5, 2025
        </Typography>
      </Container>
    </Box>
  );
};

export default AccessibilityPage;
