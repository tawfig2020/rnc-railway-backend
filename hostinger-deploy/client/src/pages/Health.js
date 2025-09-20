import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { MedicalServices, LocalHospital, FitnessCenter, LocalPharmacy } from '@mui/icons-material';

const Health = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Health Resources
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Medical Services */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <LocalHospital sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Medical Services
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Find healthcare providers and medical facilities near you.
              </Typography>
              <Button variant="contained" color="primary" fullWidth>
                Find Services
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Mental Health */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <MedicalServices sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Mental Health Support
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Access counseling services and mental health resources.
              </Typography>
              <Button variant="contained" color="primary" fullWidth>
                Get Support
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Wellness Programs */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <FitnessCenter sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Wellness Programs
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Participate in fitness classes and wellness workshops.
              </Typography>
              <Button variant="contained" color="primary" fullWidth>
                Join Programs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Health Resources List */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Important Health Resources
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocalPharmacy />
                </ListItemIcon>
                <ListItemText primary="Emergency Medical Guide" secondary="Download our comprehensive guide" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MedicalServices />
                </ListItemIcon>
                <ListItemText primary="Healthcare Provider Directory" secondary="Find certified healthcare providers" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FitnessCenter />
                </ListItemIcon>
                <ListItemText primary="Wellness Program Schedule" secondary="View upcoming wellness events" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default Health;
