import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Box, styled } from '@mui/material';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'center',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  marginRight: theme.spacing(3),
  minWidth: 0,
  padding: theme.spacing(1.5, 3),
  borderRadius: '50px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: theme.palette.primary.main,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  }
}));

const AnimatedTabPanel = ({ children, value, index, ...props }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`animated-tabpanel-${index}`}
      aria-labelledby={`animated-tab-${index}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <Box sx={{ py: 4 }}>
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedTabs = ({ 
  tabs = [], 
  initialTab = 0,
  onChange,
  centered = true,
  variant = "fullWidth",
  scrollButtons = "auto",
  orientation = "horizontal",
  sx = {}
}) => {
  const [value, setValue] = useState(initialTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered={centered}
          variant={variant}
          scrollButtons={scrollButtons}
          orientation={orientation}
        >
          {tabs.map((tab, index) => (
            <StyledTab 
              key={index} 
              label={tab.label} 
              icon={tab.icon} 
              iconPosition={tab.iconPosition || "start"}
              disabled={tab.disabled}
            />
          ))}
        </StyledTabs>
      </Box>
      {tabs.map((tab, index) => (
        <AnimatedTabPanel key={index} value={value} index={index}>
          {tab.content}
        </AnimatedTabPanel>
      ))}
    </Box>
  );
};

export default AnimatedTabs;
