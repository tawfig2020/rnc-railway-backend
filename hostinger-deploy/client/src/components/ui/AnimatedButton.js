import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { buttonVariants } from '../../styles/animations';

const AnimatedButton = ({ children, variant = 'contained', color = 'primary', ...props }) => {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
    >
      <Button
        variant={variant}
        color={color}
        sx={{
          borderRadius: '50px',
          textTransform: 'none',
          px: 3,
          py: variant === 'contained' ? 1.2 : 1,
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease-in-out',
          },
          '&:hover::after': {
            transform: 'translateX(100%)',
          }
        }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
