import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert, Grid,
  FormControlLabel, Switch, Snackbar
} from '@mui/material';
import { 
  Add, Edit, Delete, Event, LocationOn, AccessTime, 
  People, CheckCircle, Cancel, Visibility
} from '@mui/icons-material';

// Event categories
const EVENT_CATEGORIES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'networking', label: 'Networking' },
  { value: 'career', label: 'Career Fair' },
  { value: 'cultural', label: 'Cultural Event' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'community', label: 'Community Gathering' }
];

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterUpcoming, setFilterUpcoming] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'workshop',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    description: '',
    capacity: '',
    registrationRequired: true,
    registrationUrl: '',
    featuredImage: '',
    organizer: ''
  });

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle event approval/rejection
  const handleEventApproval = async (eventId, approved) => {
    try {
      // In a real app, this would make an API call to update the event status
      // await axios.put(`/api/events/${eventId}`, { 
      //   status: approved ? 'approved' : 'rejected' 
      // });

      // For demo purposes, we'll update the local state directly
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return { 
            ...event, 
            status: approved ? 'approved' : 'rejected'
          };
        }
        return event;
      });

      setEvents(updatedEvents);
      setSuccessMessage(`Event ${approved ? 'approved' : 'rejected'} successfully`);
      
      setNotification({
        open: true,
        message: `Event ${approved ? 'approved' : 'rejected'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      setError(`Failed to ${approved ? 'approve' : 'reject'} event: ${error.message}`);
      
      setNotification({
        open: true,
        message: `Failed to ${approved ? 'approve' : 'reject'} event: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleEvents = [
        { 
          id: 1, 
          title: 'Career Fair 2025', 
          category: 'career', 
          date: '2025-07-15', 
          startTime: '10:00',
          endTime: '16:00',
          location: 'Community Center',
          address: '123 Main St, City',
          description: 'Annual career fair with employers from various industries',
          capacity: 200,
          registrationRequired: true,
          registrationUrl: '/career/fair-registration',
          featuredImage: 'career-fair.jpg',
          organizer: 'Career Department'
        },
        { 
          id: 2, 
          title: 'Resume Workshop', 
          category: 'workshop', 
          date: '2025-06-25', 
          startTime: '14:00',
          endTime: '16:00',
          location: 'Training Room B',
          address: '123 Main St, City',
          description: 'Learn how to create an effective resume',
          capacity: 30,
          registrationRequired: true,
          registrationUrl: '/workshops/register',
          featuredImage: 'resume-workshop.jpg',
          organizer: 'Career Department'
        },
        { 
          id: 3, 
          title: 'Community Celebration', 
          category: 'cultural', 
          date: '2025-08-10', 
          startTime: '18:00',
          endTime: '22:00',
          location: 'City Park',
          address: '500 Park Ave, City',
          description: 'Annual celebration of our diverse community',
          capacity: 500,
          registrationRequired: false,
          registrationUrl: '',
          featuredImage: 'community-celebration.jpg',
          organizer: 'Cultural Affairs'
        },
        { 
          id: 4, 
          title: 'Fundraising Dinner', 
          category: 'fundraising', 
          date: '2025-09-20', 
          startTime: '19:00',
          endTime: '22:00',
          location: 'Grand Hotel',
          address: '200 Hotel Blvd, City',
          description: 'Annual fundraising dinner for our programs',
          capacity: 150,
          registrationRequired: true,
          registrationUrl: '/fundraising/dinner-tickets',
          featuredImage: 'fundraising-dinner.jpg',
          organizer: 'Development Team'
        }
      ];
      
      setEvents(sampleEvents);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
      console.error('Error fetching events:', err);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Filter events based on date
  const filteredEvents = filterUpcoming
    ? events.filter(event => new Date(event.date) >= new Date())
    : events;

  // Toggle upcoming filter
  const handleToggleFilter = () => {
    setFilterUpcoming(!filterUpcoming);
  };

  // Open dialog for adding/editing event
  const handleOpenDialog = (event = null) => {
    if (event) {
      // Edit mode
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        category: event.category,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        address: event.address,
        description: event.description,
        capacity: event.capacity,
        registrationRequired: event.registrationRequired,
        registrationUrl: event.registrationUrl,
        featuredImage: event.featuredImage,
        organizer: event.organizer
      });
    } else {
      // Add mode
      setSelectedEvent(null);
      setFormData({
        title: '',
        category: 'workshop',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        address: '',
        description: '',
        capacity: '',
        registrationRequired: true,
        registrationUrl: '',
        featuredImage: '',
        organizer: ''
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedEvent) {
        // Update existing event
        // In a real app, this would be an API call
        const updatedEvents = events.map(event => 
          event.id === selectedEvent.id ? { ...event, ...formData } : event
        );
        setEvents(updatedEvents);
        setSuccessMessage('Event updated successfully');
      } else {
        // Add new event
        // In a real app, this would be an API call
        const newEvent = {
          id: events.length + 1,
          ...formData
        };
        setEvents([...events, newEvent]);
        setSuccessMessage('Event added successfully');
      }
      
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to save event');
      console.error('Error saving event:', err);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (event) => {
    setEventToDelete(event);
    setConfirmDelete(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setEventToDelete(null);
  };

  // Delete event
  const handleDeleteEvent = async () => {
    try {
      // In a real app, this would be an API call
      const updatedEvents = events.filter(event => event.id !== eventToDelete.id);
      setEvents(updatedEvents);
      setSuccessMessage('Event deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Event Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Event
        </Button>
      </Box>

      {/* Success message */}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Error message */}
      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {/* Filter controls */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={filterUpcoming} 
              onChange={handleToggleFilter} 
              color="primary" 
            />
          }
          label="Show upcoming events only"
        />
      </Box>

      {/* Events table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Registration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading events...</TableCell>
              </TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No events found</TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={event.category}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{event.capacity}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small"
                        color="info"
                        title="View Details"
                        onClick={() => handleOpenDialog(event)}
                      >
                        <Visibility />
                      </IconButton>
                      {event.status !== 'approved' && (
                        <IconButton 
                          size="small"
                          color="success"
                          title="Approve Event"
                          onClick={() => handleEventApproval(event.id, true)}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      {event.status !== 'rejected' && (
                        <IconButton 
                          size="small"
                          color="error"
                          title="Reject Event"
                          onClick={() => handleEventApproval(event.id, false)}
                        >
                          <Cancel />
                        </IconButton>
                      )}
                      <IconButton 
                        size="small"
                        color="primary"
                        title="Edit Event"
                        onClick={() => handleOpenDialog(event)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small"
                        color="error"
                        title="Delete Event"
                        onClick={() => handleOpenDeleteDialog(event)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Event Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 2, mt: 1 }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="date"
                  label="Event Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="startTime"
                  label="Start Time"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="endTime"
                  label="End Time"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="location"
                  label="Location Name"
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="capacity"
                  label="Capacity"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="organizer"
                  label="Organizer"
                  fullWidth
                  variant="outlined"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="description"
                  label="Event Description"
                  fullWidth
                  variant="outlined"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="registrationRequired"
                      checked={formData.registrationRequired}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Registration Required"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="registrationUrl"
                  label="Registration URL"
                  fullWidth
                  variant="outlined"
                  value={formData.registrationUrl}
                  onChange={handleInputChange}
                  disabled={!formData.registrationRequired}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="featuredImage"
                  label="Featured Image URL"
                  fullWidth
                  variant="outlined"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  placeholder="e.g., /images/events/event-name.jpg"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event &quot;{eventToDelete?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManagement;
