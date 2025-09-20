import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, IconButton,
  Checkbox, FormControlLabel
} from '@mui/material';
import { Close, MailOutline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const NewsletterPopup = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Show popup after 5 seconds
  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem('rnc_newsletter_popup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Set flag in localStorage so popup doesn't show again for a while
    localStorage.setItem('rnc_newsletter_popup', 'true');
    
    // Reset after 7 days
    setTimeout(() => {
      localStorage.removeItem('rnc_newsletter_popup');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!consent) {
      setError('Please agree to receive our newsletter');
      return;
    }
    
    // In a real app, you would send this to your API
    console.log('Newsletter signup:', { email, consent });
    
    // Show success message
    setSubmitted(true);
    
    // Close after 3 seconds
    setTimeout(() => {
      handleClose();
      // Reset form
      setEmail('');
      setConsent(false);
      setSubmitted(false);
      setError('');
    }, 3000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 450
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <MailOutline sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
          <DialogTitle sx={{ p: 0 }}>
            Stay Connected with RNC
          </DialogTitle>
        </Box>
        
        <DialogContent sx={{ p: 0 }}>
          {!submitted ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Subscribe to our newsletter for updates on events, opportunities, and success stories from our refugee community.
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                  helperText={error}
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                  }
                  label="I agree to receive newsletters and updates from Refugee Network Center"
                />
                
                <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
                  <Button onClick={handleClose} color="inherit">
                    Not Now
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={!email || !consent}
                  >
                    Subscribe
                  </Button>
                </DialogActions>
              </form>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Thank You for Subscribing!
              </Typography>
              <Typography variant="body1">
                You'll receive our next newsletter soon.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default NewsletterPopup;
