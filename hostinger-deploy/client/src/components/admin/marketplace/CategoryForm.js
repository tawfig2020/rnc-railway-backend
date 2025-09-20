import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  CategoryOutlined as CategoryIcon
} from '@mui/icons-material';

const CategoryForm = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    image: '',
    featured: false,
    parentId: '',
    status: 'active',
    displayOrder: 0
  });
  
  const [errors, setErrors] = useState({});
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        icon: initialData.icon || '',
        image: initialData.image || '',
        featured: initialData.featured || false,
        parentId: initialData.parentId || '',
        status: initialData.status || 'active',
        displayOrder: initialData.displayOrder || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        image: '',
        featured: false,
        parentId: '',
        status: 'active',
        displayOrder: 0
      });
    }
    
    setErrors({});
    fetchParentCategories();
  }, [initialData, open]);

  const fetchParentCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories?status=active&limit=100');
      
      // Filter out current category (if editing) to prevent circular references
      const availableParents = initialData
        ? res.data.categories.filter(cat => cat._id !== initialData._id)
        : res.data.categories;
        
      setParentCategories(availableParents);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching parent categories:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare data for submission
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        image: formData.image.trim(),
        featured: formData.featured,
        status: formData.status,
        displayOrder: formData.displayOrder,
      };
      
      // Only include parentId if it's not empty
      if (formData.parentId) {
        categoryData.parentId = formData.parentId;
      }
      
      await onSave(categoryData);
      setSaving(false);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      setSaving(false);
      // Handle validation errors from server
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!saving ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center">
          <CategoryIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {initialData ? 'Edit Category' : 'Add New Category'}
          </Typography>
          {!saving && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                name="name"
                label="Category Name"
                fullWidth
                variant="outlined"
                required
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={saving}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  disabled={saving}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                disabled={saving}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" disabled={loading || saving}>
                <InputLabel id="parent-category-label">Parent Category</InputLabel>
                <Select
                  labelId="parent-category-label"
                  id="parentId"
                  name="parentId"
                  value={formData.parentId || ''}
                  onChange={handleChange}
                  label="Parent Category"
                >
                  <MenuItem value="">
                    <em>None (Root Category)</em>
                  </MenuItem>
                  {parentCategories && parentCategories.length > 0 ? parentCategories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  )) : null}
                </Select>
                {loading && <CircularProgress size={24} sx={{ position: 'absolute', right: 30, top: '50%', marginTop: '-12px' }} />}
                <FormHelperText>
                  {formData.parentId ? 'This will be a subcategory' : 'This will be a root level category'}
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="displayOrder"
                label="Display Order"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.displayOrder}
                onChange={handleChange}
                disabled={saving}
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Lower numbers appear first"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="icon"
                label="Icon URL"
                fullWidth
                variant="outlined"
                value={formData.icon || ''}
                onChange={handleChange}
                disabled={saving}
                InputProps={{
                  startAdornment: (
                    <ImageIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
                helperText="Optional: URL to icon image"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="image"
                label="Category Image URL"
                fullWidth
                variant="outlined"
                value={formData.image || ''}
                onChange={handleChange}
                disabled={saving}
                InputProps={{
                  startAdornment: (
                    <ImageIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
                helperText="Optional: URL to category banner image"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleSwitchChange}
                    name="featured"
                    color="primary"
                    disabled={saving}
                  />
                }
                label="Featured Category"
              />
            </Grid>
            
            {initialData && (
              <Grid item xs={12}>
                <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Category ID: {initialData._id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Created: {new Date(initialData.createdAt).toLocaleString()}
                  </Typography>
                  {initialData.updatedAt && (
                    <Typography variant="body2" color="textSecondary">
                      Last Updated: {new Date(initialData.updatedAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
            startIcon={saving && <CircularProgress size={24} color="inherit" />}
          >
            {saving ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
