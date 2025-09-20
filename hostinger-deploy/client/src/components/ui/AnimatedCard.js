import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardMedia, CardActions, Typography, Box } from '@mui/material';
import { cardVariants } from '../../styles/animations';

const AnimatedCard = ({ 
  children, 
  image, 
  title, 
  subtitle, 
  actions, 
  delay = 0, 
  elevation = 2,
  sx = {},
  ...props 
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ delay: delay * 0.1 }}
    >
      <Card 
        elevation={elevation} 
        sx={{ 
          borderRadius: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          background: theme => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          ...sx 
        }}
        {...props}
      >
        {image && (
          <CardMedia
            component="img"
            height="180"
            image={image}
            alt={title}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {title && (
            <Typography 
              gutterBottom 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: theme => theme.palette.primary.main
              }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {subtitle}
            </Typography>
          )}
          
          {children}
        </CardContent>
        
        {actions && (
          <CardActions sx={{ p: 2, pt: 0 }}>
            <Box sx={{ width: '100%' }}>
              {actions}
            </Box>
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
