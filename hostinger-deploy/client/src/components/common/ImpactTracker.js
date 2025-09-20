import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, 
  CircularProgress, Tooltip, Divider 
} from '@mui/material';
import { 
  School, Work, Store, People, 
  Diversity3, Volunteer, TrendingUp 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import CountUp from 'react-countup';

// Mock data - in a real app, this would come from your API
const INITIAL_STATS = {
  programs: 24,
  vendors: 48,
  jobsMatched: 156,
  refugeesHelped: 720,
  volunteers: 85,
  courses: 32,
  growthRate: 12 // percentage
};

const ImpactTracker = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update one stat
      const keys = Object.keys(stats);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      
      setStats(prevStats => ({
        ...prevStats,
        [randomKey]: prevStats[randomKey] + (Math.random() > 0.5 ? 1 : 0)
      }));
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [stats]);
  
  // Stat items configuration
  const statItems = [
    { 
      key: 'programs', 
      label: 'Active Programs', 
      icon: <School sx={{ color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main
    },
    { 
      key: 'vendors', 
      label: 'Partner Vendors', 
      icon: <Store sx={{ color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main
    },
    { 
      key: 'jobsMatched', 
      label: 'Jobs Matched', 
      icon: <Work sx={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main
    },
    { 
      key: 'refugeesHelped', 
      label: 'Refugees Helped', 
      icon: <Diversity3 sx={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main
    },
    { 
      key: 'volunteers', 
      label: 'Active Volunteers', 
      icon: <Volunteer sx={{ color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main
    },
    { 
      key: 'courses', 
      label: 'Training Courses', 
      icon: <School sx={{ color: theme.palette.error.main }} />,
      color: theme.palette.error.main
    }
  ];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        background: 'linear-gradient(to right, rgba(42, 125, 111, 0.05), rgba(42, 125, 111, 0.1))'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Impact Tracker
        </Typography>
        <Box 
          sx={{ 
            ml: 2,
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'success.light',
            color: 'success.contrastText',
            borderRadius: 1,
            px: 1,
            py: 0.5
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            +{stats.growthRate}% this month
          </Typography>
        </Box>
      </Box>
      
      <Tooltip title="Live data - updates every 30 seconds" placement="top">
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            mb: 2,
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1,
            px: 1,
            py: 0.5
          }}
        >
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: 'success.main',
              mr: 1,
              animation: 'pulse 2s infinite'
            }}
          />
          <Typography variant="caption" color="text.secondary">
            LIVE STATS
          </Typography>
        </Box>
      </Tooltip>
      
      <Grid container spacing={3}>
        {statItems.map((item) => (
          <Grid item xs={6} sm={4} md={2} key={item.key}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 1.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box sx={{ mb: 1 }}>
                {item.icon}
              </Box>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  color: item.color
                }}
              >
                <CountUp 
                  end={stats[item.key]} 
                  duration={2.5}
                  separator=","
                />
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
      
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Paper>
  );
};

export default ImpactTracker;
