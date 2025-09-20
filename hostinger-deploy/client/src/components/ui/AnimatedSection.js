import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { defaultAOSConfig } from '../../styles/animations';

// Initialize AOS for scroll animations
const initAOS = () => {
  AOS.init(defaultAOSConfig);
};

const AnimatedSection = ({
  children,
  title,
  subtitle,
  centered = false,
  pattern = false,
  dark = false,
  containerWidth = 'lg',
  py = 8,
  ...props
}) => {
  useEffect(() => {
    initAOS();
    window.addEventListener('load', AOS.refresh);
    return () => window.removeEventListener('load', AOS.refresh);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: py,
        bgcolor: dark ? 'background.paper' : 'background.default',
        color: dark ? 'common.white' : 'text.primary',
        position: 'relative',
        overflow: 'hidden',
        ...(pattern && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/patterns/pattern1.png")',
            backgroundSize: '500px',
            opacity: 0.03,
            zIndex: 0,
            animation: 'patternMove 30s linear infinite',
            '@keyframes patternMove': {
              '0%': { backgroundPosition: '0% 0%' },
              '100%': { backgroundPosition: '100% 100%' }
            }
          }
        }),
        ...props.sx
      }}
      {...props}
    >
      <Container maxWidth={containerWidth} sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: false, amount: 0.1 }}
        >
          {(title || subtitle) && (
            <Box 
              sx={{ 
                mb: 6, 
                textAlign: centered ? 'center' : 'left',
                maxWidth: centered ? '100%' : '800px',
                mx: centered ? 'auto' : 0
              }}
            >
              {title && (
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h2"
                    component="h2"
                    data-aos="fade-up"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      backgroundImage: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: dark ? 'white' : 'transparent',
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: centered ? '50%' : 0,
                        transform: centered ? 'translateX(-50%)' : 'none',
                        width: centered ? '80px' : '60px',
                        height: '4px',
                        borderRadius: '2px',
                        background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`
                      }
                    }}
                  >
                    {title}
                  </Typography>
                </motion.div>
              )}
              
              {subtitle && (
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    sx={{
                      color: dark ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                      maxWidth: '600px',
                      mx: centered ? 'auto' : 0,
                      lineHeight: 1.6
                    }}
                  >
                    {subtitle}
                  </Typography>
                </motion.div>
              )}
            </Box>
          )}
          
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AnimatedSection;
