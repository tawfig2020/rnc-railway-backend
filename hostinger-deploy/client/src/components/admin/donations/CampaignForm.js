import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Chip,
  FormHelperText, InputAdornment, IconButton, Alert,
  Stack, Divider, CircularProgress, Dialog, DialogContent,
  DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Close as ClearIcon,
  Upload as UploadIcon,
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon
} from '@mui/icons-material';
import axios from 'axios';

// Campaign form for creating and editing campaigns
const CampaignForm = ({ campaign, isEditing, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: '',
    startDate: null,
    endDate: null,
    targetAmount: '',
    location: '',
    beneficiary: '',
    tags: [],
    mainImage: null,
    logo: null,
    additionalImages: []
  });
  
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState({
    mainImage: null,
    logo: null,
    additionalImages: []
  });
  const [previewImages, setPreviewImages] = useState({
    mainImage: '',
    logo: '',
    additionalImages: []
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Load existing campaign data if editing
  useEffect(() => {
    if (isEditing && campaign) {
      // Create a copy of the campaign object for form data
      const campaignCopy = { ...campaign };
      
      // Format dates for the form
      if (campaignCopy.startDate) {
        campaignCopy.startDate = new Date(campaignCopy.startDate);
      }
      if (campaignCopy.endDate) {
        campaignCopy.endDate = new Date(campaignCopy.endDate);
      }
      
      // Set initial form data
      setFormData(campaignCopy);
      
      // Set preview images for existing images
      const previews = {
        mainImage: campaign.mainImage ? 
          (campaign.mainImage.startsWith('http') ? campaign.mainImage : `/uploads/${campaign.mainImage}`) : '',
        logo: campaign.logo ? 
          (campaign.logo.startsWith('http') ? campaign.logo : `/uploads/${campaign.logo}`) : '',
        additionalImages: campaign.additionalImages ? 
          campaign.additionalImages.map(img => img.startsWith('http') ? img : `/uploads/${img}`) : []
      };
      
      setPreviewImages(previews);
    } else {
      // Reset form for new campaign
      resetForm();
    }
  }, [isEditing, campaign]);
  
  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/campaigns/categories', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: '',
      startDate: null,
      endDate: null,
      targetAmount: '',
      location: '',
      beneficiary: '',
      tags: [],
      mainImage: null,
      logo: null,
      additionalImages: []
    });
    
    setFiles({
      mainImage: null,
      logo: null,
      additionalImages: []
    });
    
    setPreviewImages({
      mainImage: '',
      logo: '',
      additionalImages: []
    });
    
    setErrors({});
    setTagInput('');
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Generate slug from title
    if (name === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  // Add tag to form data
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Remove tag from form data
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle image file selection
  const handleFileChange = (e, type) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    if (type === 'mainImage' || type === 'logo') {
      // Single file upload
      const file = fileList[0];
      
      // Preview file
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImages(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Store file for upload
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        [type]: file.name
      }));
      
    } else if (type === 'additionalImages') {
      // Multiple files upload
      const newFiles = Array.from(fileList);
      const maxFiles = 5 - (files.additionalImages?.length || 0);
      
      if (newFiles.length > maxFiles) {
        alert(`You can only upload up to 5 additional images`);
        return;
      }
      
      // Preview files
      const newPreviews = [];
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result);
          
          if (newPreviews.length === newFiles.length) {
            setPreviewImages(prev => ({
              ...prev,
              additionalImages: [...prev.additionalImages, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Store files for upload
      setFiles(prev => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), ...newFiles]
      }));
      
      // Update form data with file names
      setFormData(prev => ({
        ...prev,
        additionalImages: [
          ...(prev.additionalImages || []), 
          ...newFiles.map(file => file.name)
        ]
      }));
    }
    
    // Clear error for this field if exists
    if (errors[type]) {
      setErrors({
        ...errors,
        [type]: ''
      });
    }
  };
  
  // Remove image file
  const handleRemoveFile = (type, index = null) => {
    if (type === 'mainImage' || type === 'logo') {
      // Remove single file
      setFiles(prev => ({
        ...prev,
        [type]: null
      }));
      
      setPreviewImages(prev => ({
        ...prev,
        [type]: ''
      }));
      
      setFormData(prev => ({
        ...prev,
        [type]: null
      }));
      
    } else if (type === 'additionalImages' && index !== null) {
      // Remove specific additional image
      const updatedFiles = [...files.additionalImages];
      updatedFiles.splice(index, 1);
      
      const updatedPreviews = [...previewImages.additionalImages];
      updatedPreviews.splice(index, 1);
      
      const updatedFormImages = [...(formData.additionalImages || [])];
      updatedFormImages.splice(index, 1);
      
      setFiles(prev => ({
        ...prev,
        additionalImages: updatedFiles
      }));
      
      setPreviewImages(prev => ({
        ...prev,
        additionalImages: updatedPreviews
      }));
      
      setFormData(prev => ({
        ...prev,
        additionalImages: updatedFormImages
      }));
    }
  };
  
  // Open image preview dialog
  const handleOpenPreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Full description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than zero';
    }
    
    if (!isEditing && !files.mainImage) {
      newErrors.mainImage = 'Main image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Submit form data and files
      onSubmit(formData, files);
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button 
          startIcon={<BackIcon />} 
          onClick={onCancel}
          variant="outlined"
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          type="submit"
          disabled={loading}
        >
          {isEditing ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </Box>
      
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Campaign' : 'New Campaign'}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        
        <Grid container spacing={3}>
          {/* Campaign Title */}
          <Grid item xs={12} md={8}>
            <TextField
              id="title"
              name="title"
              label="Campaign Title"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title || ''}
            />
          </Grid>
          
          {/* Campaign Slug */}
          <Grid item xs={12} md={4}>
            <TextField
              id="slug"
              name="slug"
              label="Slug (for URL)"
              fullWidth
              required
              value={formData.slug}
              onChange={handleChange}
              error={Boolean(errors.slug)}
              helperText={errors.slug || 'Used in the URL, e.g., your-campaign-name'}
            />
          </Grid>
          
          {/* Short Description */}
          <Grid item xs={12}>
            <TextField
              id="shortDescription"
              name="shortDescription"
              label="Short Description"
              fullWidth
              required
              multiline
              rows={2}
              value={formData.shortDescription}
              onChange={handleChange}
              error={Boolean(errors.shortDescription)}
              helperText={errors.shortDescription || 'Brief summary shown in listings (100-150 characters)'}
            />
          </Grid>
          
          {/* Full Description */}
          <Grid item xs={12}>
            <TextField
              id="description"
              name="description"
              label="Full Description"
              fullWidth
              required
              multiline
              rows={6}
              value={formData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description || 'Detailed campaign description with all important information'}
            />
          </Grid>
          
          {/* Category */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={Boolean(errors.category)}>
              <InputLabel>Category</InputLabel>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Target Amount */}
          <Grid item xs={12} md={6}>
            <TextField
              id="targetAmount"
              name="targetAmount"
              label="Target Amount"
              fullWidth
              required
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 1, step: 0.01 }
              }}
              value={formData.targetAmount}
              onChange={handleChange}
              error={Boolean(errors.targetAmount)}
              helperText={errors.targetAmount || ''}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Timeline & Location
        </Typography>
        
        <Grid container spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="startDate"
                    fullWidth
                    required
                    error={Boolean(errors.startDate)}
                    helperText={errors.startDate || ''}
                  />
                )}
              />
            </Grid>
            
            {/* End Date */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => handleDateChange('endDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="endDate"
                    fullWidth
                    required
                    error={Boolean(errors.endDate)}
                    helperText={errors.endDate || ''}
                  />
                )}
                minDate={formData.startDate || undefined}
              />
            </Grid>
          </LocalizationProvider>
          
          {/* Location */}
          <Grid item xs={12} md={6}>
            <TextField
              id="location"
              name="location"
              label="Location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              helperText="Where is this campaign taking place? (Optional)"
            />
          </Grid>
          
          {/* Beneficiary */}
          <Grid item xs={12} md={6}>
            <TextField
              id="beneficiary"
              name="beneficiary"
              label="Beneficiary"
              fullWidth
              value={formData.beneficiary}
              onChange={handleChange}
              helperText="Who will benefit from this campaign? (Optional)"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Media
        </Typography>
        
        <Grid container spacing={3}>
          {/* Main Image */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Main Campaign Image
              </Typography>
              
              {previewImages.mainImage ? (
                <Box position="relative" mb={2}>
                  <img
                    src={previewImages.mainImage}
                    alt="Main campaign"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenPreview(previewImages.mainImage)}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                    onClick={() => handleRemoveFile('mainImage')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Upload Main Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'mainImage')}
                  />
                </Button>
              )}
              
              {errors.mainImage && (
                <FormHelperText error>{errors.mainImage}</FormHelperText>
              )}
              <Typography variant="caption" color="text.secondary">
                This will be the primary image displayed in listings and at the top of your campaign page.
              </Typography>
            </Box>
          </Grid>
          
          {/* Logo */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Campaign Logo (Optional)
              </Typography>
              
              {previewImages.logo ? (
                <Box position="relative" mb={2}>
                  <img
                    src={previewImages.logo}
                    alt="Campaign logo"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenPreview(previewImages.logo)}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                    onClick={() => handleRemoveFile('logo')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logo')}
                  />
                </Button>
              )}
              
              <Typography variant="caption" color="text.secondary">
                Upload an organization logo or icon that represents this campaign.
              </Typography>
            </Box>
          </Grid>
          
          {/* Additional Images */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Additional Images (Optional)
            </Typography>
            
            <Grid container spacing={2}>
              {/* Preview existing additional images */}
              {previewImages.additionalImages.map((img, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box position="relative">
                    <img
                      src={img}
                      alt={`Additional ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOpenPreview(img)}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                      onClick={() => handleRemoveFile('additionalImages', index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              
              {/* Add more images button */}
              {previewImages.additionalImages.length < 5 && (
                <Grid item xs={6} sm={4} md={3}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CameraIcon />}
                    sx={{ 
                      height: '150px', 
                      width: '100%', 
                      display: 'flex', 
                      flexDirection: 'column' 
                    }}
                  >
                    Add Images
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      ({5 - previewImages.additionalImages.length} remaining)
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, 'additionalImages')}
                    />
                  </Button>
                </Grid>
              )}
            </Grid>
            
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              You can upload up to 5 additional images to showcase your campaign.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tags
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={handleTagInputChange}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton 
                color="primary"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                <AddIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag, index) => (
                <Chip 
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  deleteIcon={<ClearIcon />}
                />
              ))}
              {!formData.tags.length && (
                <Typography variant="body2" color="text.secondary">
                  No tags added yet. Tags help people find your campaign.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box mb={3} display="flex" justifyContent="space-between">
        <Button 
          startIcon={<CancelIcon />} 
          onClick={onCancel}
          variant="outlined"
          color="error"
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          type="submit"
          disabled={loading}
        >
          {isEditing ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </Box>
      
      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 1 }}>
          <img 
            src={previewImage} 
            alt="Preview"
            style={{ 
              width: '100%',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default CampaignForm;
