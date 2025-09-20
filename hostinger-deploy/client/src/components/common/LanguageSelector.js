import React, { useState, useContext } from 'react';
import { 
  Box, Menu, MenuItem, IconButton, 
  Typography, ListItemIcon, ListItemText 
} from '@mui/material';
import { Language, KeyboardArrowDown } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Create a context for language
export const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: () => {}
});

// Available languages
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ps', name: 'پښتو', flag: '🇦🇫' }
];

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => useContext(LanguageContext);

const LanguageSelector = ({ variant = 'icon' }) => {
  const theme = useTheme();
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    handleClose();
  };
  
  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === language) || AVAILABLE_LANGUAGES[0];
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <Box>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="select language"
          sx={{ color: theme.palette.primary.main }}
        >
          <Language />
        </IconButton>
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'language-button',
          }}
        >
          {AVAILABLE_LANGUAGES.map((lang) => (
            <MenuItem 
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              selected={lang.code === language}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                {lang.flag}
              </ListItemIcon>
              <ListItemText>{lang.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }
  
  // Button variant with text
  return (
    <Box>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1,
          px: 2,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'rgba(42, 125, 111, 0.08)',
          }
        }}
      >
        <Typography component="span" sx={{ mr: 0.5 }}>
          {currentLanguage.flag}
        </Typography>
        <Typography component="span" sx={{ mr: 0.5 }}>
          {currentLanguage.name}
        </Typography>
        <KeyboardArrowDown fontSize="small" />
      </Box>
      <Menu
        id="language-menu-full"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <MenuItem 
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={lang.code === language}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              {lang.flag}
            </ListItemIcon>
            <ListItemText>{lang.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
