import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, LinearProgress, CircularProgress, useTheme } from '@mui/material';

export const AnimatedLinearProgress = ({ 
  value = 0, 
  label, 
  color = 'primary', 
  height = 8, 
  showPercentage = true,
  animate = true,
  sx = {}
}) => {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setProgress(value);
    }
  }, [value, animate]);

  return (
    <Box sx={{ width: '100%', mb: 2, ...sx }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ position: 'relative', borderRadius: height/2, overflow: 'hidden' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: height,
            borderRadius: height/2,
            backgroundColor: 'rgba(0,0,0,0.06)',
            '& .MuiLinearProgress-bar': {
              background: typeof color === 'string' 
                ? `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`
                : `linear-gradient(90deg, ${color[0]}, ${color[1]})`,
              borderRadius: height/2,
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          }}
        />
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress > 3 ? progress - 3 : 0}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3))',
            zIndex: 1,
            borderRadius: height/2,
          }}
        />
      </Box>
    </Box>
  );
};

export const AnimatedCircularProgress = ({ 
  value = 0, 
  label, 
  size = 80, 
  thickness = 4,
  color = 'primary',
  showPercentage = true,
  animate = true,
  sx = {}
}) => {
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setProgress(value);
    }
  }, [value, animate]);

  const gradientId = `circularGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...sx }}>
      <Box sx={{ position: 'relative' }}>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={typeof color === 'string' ? theme.palette[color].main : color[0]} />
              <stop offset="100%" stopColor={typeof color === 'string' ? theme.palette[color].light : color[1]} />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{ 
            color: 'rgba(0,0,0,0.06)', 
            position: 'absolute'
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            size={size}
            thickness={thickness}
            sx={{ 
              color: `url(#${gradientId})`,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </motion.div>
        {showPercentage && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="caption"
                component="div"
                sx={{ fontWeight: 'bold', fontSize: size > 70 ? '1rem' : '0.8rem' }}
              >
                {`${Math.round(progress)}%`}
              </Typography>
            </motion.div>
          </Box>
        )}
      </Box>
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontWeight: 'medium', textAlign: 'center' }}
          >
            {label}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default { AnimatedLinearProgress, AnimatedCircularProgress };
