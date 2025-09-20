import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

// Sample course data
const SAMPLE_COURSES = [
  {
    id: 1,
    title: "English Language Basics",
    category: "language",
    instructor: "Sarah Johnson",
    startDate: "2025-07-10",
    endDate: "2025-09-15",
    schedule: "Mon, Wed 18:00-20:00",
    location: "Room 101",
    capacity: 20,
    enrolled: 15,
    status: "active"
  },
  {
    id: 2,
    title: "Computer Skills Workshop",
    category: "technology",
    instructor: "Michael Chen",
    startDate: "2025-07-15",
    endDate: "2025-08-20",
    schedule: "Tue, Thu 16:00-18:00",
    location: "Computer Lab",
    capacity: 15,
    enrolled: 12,
    status: "active"
  },
  {
    id: 3,
    title: "Job Interview Preparation",
    category: "career",
    instructor: "Emily Rodriguez",
    startDate: "2025-08-05",
    endDate: "2025-09-02",
    schedule: "Fri 17:00-19:00",
    location: "Meeting Room A",
    capacity: 25,
    enrolled: 18,
    status: "active"
  },
  {
    id: 4,
    title: "Cultural Orientation",
    category: "culture",
    instructor: "David Okafor",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    schedule: "Sat 10:00-12:00",
    location: "Community Hall",
    capacity: 30,
    enrolled: 30,
    status: "completed"
  }
];

// Course categories
const COURSE_CATEGORIES = [
  { value: 'language', label: 'Language' },
  { value: 'technology', label: 'Technology' },
  { value: 'career', label: 'Career Development' },
  { value: 'culture', label: 'Cultural' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'legal', label: 'Legal' },
  { value: 'finance', label: 'Financial Literacy' }
];

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'language',
    instructor: '',
    startDate: '',
    endDate: '',
    schedule: '',
    location: '',
    capacity: '',
    description: '',
    status: 'active'
  });

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      setCourses(SAMPLE_COURSES);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
      console.error('Error fetching courses:', err);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open dialog for adding/editing course
  const handleOpenDialog = (course = null) => {
    if (course) {
      // Edit mode
      setSelectedCourse(course);
      setFormData({
        title: course.title,
        category: course.category,
        instructor: course.instructor,
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule,
        location: course.location,
        capacity: course.capacity,
        description: course.description || '',
        status: course.status
      });
    } else {
      // Add mode
      setSelectedCourse(null);
      setFormData({
        title: '',
        category: 'language',
        instructor: '',
        startDate: '',
        endDate: '',
        schedule: '',
        location: '',
        capacity: '',
        description: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedCourse) {
        // Update existing course
        // In a real app, this would be an API call
        const updatedCourses = courses.map(course => 
          course.id === selectedCourse.id ? { 
            ...course, 
            ...formData,
            enrolled: course.enrolled // Preserve enrolled count
          } : course
        );
        setCourses(updatedCourses);
        setSuccessMessage('Course updated successfully');
      } else {
        // Add new course
        // In a real app, this would be an API call
        const newCourse = {
          id: courses.length + 1,
          ...formData,
          enrolled: 0 // New courses start with 0 enrolled
        };
        setCourses([...courses, newCourse]);
        setSuccessMessage('Course added successfully');
      }
      
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to save course');
      console.error('Error saving course:', err);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (course) => {
    setCourseToDelete(course);
    setConfirmDelete(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setCourseToDelete(null);
  };

  // Delete course
  const handleDeleteCourse = async () => {
    try {
      // In a real app, this would be an API call
      const updatedCourses = courses.filter(course => course.id !== courseToDelete.id);
      setCourses(updatedCourses);
      setSuccessMessage('Course deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete course');
      console.error('Error deleting course:', err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Course Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Course
        </Button>
      </Box>

      {/* Success message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Courses table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading courses...</TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No courses found</TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    <Chip 
                      label={COURSE_CATEGORIES.find(cat => cat.value === course.category)?.label || course.category}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.schedule}</TableCell>
                  <TableCell>{`${course.enrolled}/${course.capacity}`}</TableCell>
                  <TableCell>
                    <Chip 
                      label={course.status}
                      color={getStatusColor(course.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(course)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(course)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedCourse ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Course Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 2, mt: 1 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {COURSE_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              margin="dense"
              name="instructor"
              label="Instructor"
              fullWidth
              variant="outlined"
              value={formData.instructor}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="dense"
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                margin="dense"
                name="endDate"
                label="End Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="dense"
                name="schedule"
                label="Schedule (e.g., Mon, Wed 18:00-20:00)"
                fullWidth
                variant="outlined"
                value={formData.schedule}
                onChange={handleInputChange}
                required
              />
              
              <TextField
                margin="dense"
                name="location"
                label="Location"
                fullWidth
                variant="outlined"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Box>
            
            <TextField
              margin="dense"
              name="capacity"
              label="Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="description"
              label="Course Description"
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the course &quot;{courseToDelete?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCourse} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManagement;
