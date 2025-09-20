import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert, Tab, Tabs
} from '@mui/material';
import { Add, Edit, Delete, Article, Visibility } from '@mui/icons-material';

// Content types
const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'page', label: 'Page' },
  { value: 'resource', label: 'Resource' },
  { value: 'announcement', label: 'Announcement' }
];

// Content statuses
const CONTENT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'review', label: 'Under Review', color: 'warning' },
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'archived', label: 'Archived', color: 'error' }
];

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [contentType, setContentType] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'blog',
    author: '',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    content: '',
    summary: '',
    featuredImage: ''
  });

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  // Fetch content from API
  const fetchContent = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleContent = [
        { 
          id: 1, 
          title: 'Welcome to RNC', 
          type: 'page', 
          author: 'Admin User', 
          status: 'published', 
          date: '2025-06-01',
          content: 'Welcome to the Refugee Network Centre...',
          summary: 'Introduction to our organization',
          featuredImage: 'welcome.jpg'
        },
        { 
          id: 2, 
          title: 'Career Fair Announcement', 
          type: 'announcement', 
          author: 'Staff Member', 
          status: 'published', 
          date: '2025-06-10',
          content: 'Join us for our upcoming career fair...',
          summary: 'Information about our annual career fair',
          featuredImage: 'career-fair.jpg'
        },
        { 
          id: 3, 
          title: 'Success Stories', 
          type: 'blog', 
          author: 'Volunteer Coordinator', 
          status: 'draft', 
          date: '2025-06-12',
          content: 'Read about the success stories of our community members...',
          summary: 'Inspiring stories from our community',
          featuredImage: 'success.jpg'
        },
        { 
          id: 4, 
          title: 'Educational Resources', 
          type: 'resource', 
          author: 'Education Team', 
          status: 'published', 
          date: '2025-05-20',
          content: 'Access our educational resources here...',
          summary: 'Collection of educational materials',
          featuredImage: 'education.jpg'
        }
      ];
      
      setContent(sampleContent);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch content');
      setLoading(false);
      console.error('Error fetching content:', err);
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

  // Handle content type tab change
  const handleContentTypeChange = (event, newValue) => {
    setContentType(newValue);
  };

  // Filter content by type
  const filteredContent = contentType === 'all' 
    ? content 
    : content.filter(item => item.type === contentType);

  // Open dialog for adding/editing content
  const handleOpenDialog = (contentItem = null) => {
    if (contentItem) {
      // Edit mode
      setSelectedContent(contentItem);
      setFormData({
        title: contentItem.title,
        type: contentItem.type,
        author: contentItem.author,
        status: contentItem.status,
        date: contentItem.date,
        content: contentItem.content,
        summary: contentItem.summary,
        featuredImage: contentItem.featuredImage
      });
    } else {
      // Add mode
      setSelectedContent(null);
      setFormData({
        title: '',
        type: 'blog',
        author: '',
        status: 'draft',
        date: new Date().toISOString().split('T')[0],
        content: '',
        summary: '',
        featuredImage: ''
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContent(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedContent) {
        // Update existing content
        // In a real app, this would be an API call
        const updatedContent = content.map(item => 
          item.id === selectedContent.id ? { ...item, ...formData } : item
        );
        setContent(updatedContent);
        setSuccessMessage('Content updated successfully');
      } else {
        // Add new content
        // In a real app, this would be an API call
        const newContent = {
          id: content.length + 1,
          ...formData
        };
        setContent([...content, newContent]);
        setSuccessMessage('Content added successfully');
      }
      
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to save content');
      console.error('Error saving content:', err);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (contentItem) => {
    setContentToDelete(contentItem);
    setConfirmDelete(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setContentToDelete(null);
  };

  // Delete content
  const handleDeleteContent = async () => {
    try {
      // In a real app, this would be an API call
      const updatedContent = content.filter(item => item.id !== contentToDelete.id);
      setContent(updatedContent);
      setSuccessMessage('Content deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete content');
      console.error('Error deleting content:', err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Preview content (in a real app, this would navigate to a preview page)
  const handlePreviewContent = (contentItem) => {
    alert(`Preview for: ${contentItem.title}`);
    // In a real app, you would navigate to a preview page or open a modal
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Content Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Content
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

      {/* Content type tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={contentType} 
          onChange={handleContentTypeChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label="All Content" />
          <Tab value="blog" label="Blog Posts" />
          <Tab value="page" label="Pages" />
          <Tab value="resource" label="Resources" />
          <Tab value="announcement" label="Announcements" />
        </Tabs>
      </Paper>

      {/* Content table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading content...</TableCell>
              </TableRow>
            ) : filteredContent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No content found</TableCell>
              </TableRow>
            ) : (
              filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Chip 
                      label={CONTENT_TYPES.find(type => type.value === item.type)?.label || item.type}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.status} 
                      color={CONTENT_STATUSES.find(status => status.value === item.status)?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handlePreviewContent(item)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(item)}
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

      {/* Add/Edit Content Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedContent ? 'Edit Content' : 'Add New Content'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 2, mt: 1 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="type"
                  label="Content Type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {CONTENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
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
                  {CONTENT_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="dense"
                name="author"
                label="Author"
                fullWidth
                variant="outlined"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
              
              <TextField
                margin="dense"
                name="date"
                label="Publication Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.date}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <TextField
              margin="dense"
              name="summary"
              label="Summary"
              fullWidth
              variant="outlined"
              value={formData.summary}
              onChange={handleInputChange}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="content"
              label="Content"
              fullWidth
              variant="outlined"
              value={formData.content}
              onChange={handleInputChange}
              multiline
              rows={6}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="featuredImage"
              label="Featured Image URL"
              fullWidth
              variant="outlined"
              value={formData.featuredImage}
              onChange={handleInputChange}
              placeholder="e.g., /images/featured.jpg"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedContent ? 'Update Content' : 'Create Content'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;${contentToDelete?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteContent} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentManagement;
