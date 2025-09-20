import React from 'react';
import { Box, Typography, Link, Stack, IconButton } from '@mui/material';
import { Facebook, Instagram, YouTube, LinkedIn, Twitter } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SocialMediaLinks = ({ variant = 'footer' }) => {
  const theme = useTheme();
  
  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com/refugeenetworkcenter' },
    { name: 'Instagram', icon: <Instagram />, url: 'https://instagram.com/refugeenetworkcenter' },
    { name: 'YouTube', icon: <YouTube />, url: 'https://youtube.com/refugeenetworkcenter' },
    { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://linkedin.com/company/refugeenetworkcenter' },
    { name: 'Twitter', icon: <Twitter />, url: 'https://twitter.com/refugeenetwork' }
  ];

  // Footer variant with icons and text
  if (variant === 'footer') {
    return (
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Connect with Us on Social Media
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Stay updated, get inspired, and join the movement. Follow the Refugee Network Center (RNC) on our official platforms:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {socialLinks.map((social) => (
            <IconButton 
              key={social.name}
              component={Link}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(42, 125, 111, 0.08)',
                }
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Stack>
        <Stack spacing={1}>
          {socialLinks.map((social) => (
            <Box key={social.name} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ mr: 1, color: theme.palette.primary.main }}>
                {social.icon}
              </Box>
              <Link 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="inherit"
              >
                {social.name}
              </Link>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }
  
  // Compact variant with just icons
  return (
    <Stack direction="row" spacing={1}>
      {socialLinks.map((social) => (
        <IconButton 
          key={social.name}
          component={Link}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          size="small"
          sx={{ 
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(42, 125, 111, 0.08)',
            }
          }}
        >
          {social.icon}
        </IconButton>
      ))}
    </Stack>
  );
};

export default SocialMediaLinks;
