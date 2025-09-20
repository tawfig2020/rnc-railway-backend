import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { generateWavePattern } from '../../assets/pattern-generator';

// Company logo placeholders using inline SVGs (would be replaced with actual partner logos)
const companyLogos = [
  {
    name: "TechInnovate",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' width='100' height='40'%3E%3Crect width='100%25' height='100%25' fill='rgba(42, 125, 111, 0.1)'/%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' fill='%232A7D6F' text-anchor='middle'%3ETechInnovate%3C/text%3E%3C/svg%3E`
  },
  {
    name: "GlobalHR Partners",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' width='100' height='40'%3E%3Crect width='100%25' height='100%25' fill='rgba(211, 97, 53, 0.1)'/%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' fill='%23D36135' text-anchor='middle'%3EGlobalHR%3C/text%3E%3C/svg%3E`
  },
  {
    name: "GreenPath Industries",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' width='100' height='40'%3E%3Crect width='100%25' height='100%25' fill='rgba(121, 133, 78, 0.1)'/%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' fill='%2379854E' text-anchor='middle'%3EGreenPath%3C/text%3E%3C/svg%3E`
  },
  {
    name: "Cloud Solutions",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' width='100' height='40'%3E%3Crect width='100%25' height='100%25' fill='rgba(42, 125, 111, 0.1)'/%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' fill='%232A7D6F' text-anchor='middle'%3ECloud Sol.%3C/text%3E%3C/svg%3E`
  },
  {
    name: "Global Manufacturing",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' width='100' height='40'%3E%3Crect width='100%25' height='100%25' fill='rgba(211, 97, 53, 0.1)'/%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' fill='%23D36135' text-anchor='middle'%3EGlobal Mfg.%3C/text%3E%3C/svg%3E`
  },
  {
    name: "Healthcare Plus",
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' width='100' height='40'%3E%3Crect width='100%25' height='100%25' fill='rgba(121, 133, 78, 0.1)'/%3E%3Ctext x='50' y='25' font-family='Arial' font-size='14' fill='%2379854E' text-anchor='middle'%3EHealthcare+%3C/text%3E%3C/svg%3E`
  }
];

const CompanyLogosSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      sx={{
        py: 6,
        position: 'relative',
        overflow: 'hidden',
        mb: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: generateWavePattern('#2A7D6F', 0.03, 120),
          backgroundSize: '120px 60px',
          opacity: 0.7,
          zIndex: -1
        }
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              color: '#2A7D6F',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                backgroundColor: '#D36135',
                borderRadius: '2px'
              }
            }}
          >
            Our Partner Companies
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              mt: 3, 
              mb: 5,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Join these forward-thinking organizations committed to creating diverse and inclusive workplaces
          </Typography>
        </motion.div>
        
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            mt: 4
          }}
        >
          {companyLogos.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  width: { xs: '130px', md: '160px' },
                  height: { xs: '80px', md: '100px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box
                  component="img"
                  src={company.logo}
                  alt={company.name}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </Paper>
            </motion.div>
          ))}
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography 
              variant="body1" 
              color="primary.dark" 
              sx={{ 
                fontWeight: 500,
                display: 'inline-block',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  bottom: -2,
                  left: 0,
                  backgroundColor: '#2A7D6F',
                  transformOrigin: 'center',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease-out'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)'
                }
              }}
            >
              View all partner companies
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyLogosSection;
