import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Stepper, Step, StepLabel,
  TextField, MenuItem, FormControl, InputLabel, Select,
  FormHelperText, CircularProgress, Alert, Grid, Chip
} from '@mui/material';
import { 
  CloudUpload, CheckCircleOutline, Person, 
  Volunteer, Description, ArrowForward, ArrowBack
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Upload categories
const UPLOAD_CATEGORIES = [
  { 
    value: 'resume', 
    label: 'Resume/CV', 
    icon: <Description />,
    description: 'Upload your resume or CV for job opportunities',
    allowedFormats: '.pdf, .doc, .docx',
    maxSize: '5MB'
  },
  { 
    value: 'talent', 
    label: 'Talent Portfolio', 
    icon: <Person />,
    description: 'Share your skills, artwork, or other talents',
    allowedFormats: '.pdf, .jpg, .png, .mp4 (max 2 min)',
    maxSize: '20MB'
  },
  { 
    value: 'volunteer', 
    label: 'Volunteer Application', 
    icon: <Volunteer />,
    description: 'Apply to become a volunteer at RNC',
    allowedFormats: '.pdf, .doc, .docx',
    maxSize: '5MB'
  }
];

const UploadPortal = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  
  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    
    // Validate file size
    const selectedCategory = UPLOAD_CATEGORIES.find(cat => cat.value === category);
    const maxSizeInBytes = parseInt(selectedCategory.maxSize) * 1024 * 1024;
    
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${selectedCategory.maxSize}`);
    } else {
      setError('');
    }
  };
  
  // Handle form field changes
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle category selection
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setFiles([]);
    setError('');
  };
  
  // Move to next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Move to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Submit the form
  const handleSubmit = async () => {
    setUploading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload the files and form data to your server
      console.log('Uploaded files:', files);
      console.log('Form data:', formData);
      
      setCompleted(true);
      setActiveStep(3);
    } catch (err) {
      setError('An error occurred during upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setActiveStep(0);
    setCategory('');
    setFiles([]);
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setError('');
    setCompleted(false);
  };
  
  // Define steps
  const steps = ['Select Category', 'Upload Files', 'Add Information', 'Complete'];
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return !!category;
      case 1:
        return files.length > 0 && !error;
      case 2:
        return formData.name && formData.email;
      default:
        return true;
    }
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              What would you like to upload?
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                {UPLOAD_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                        {cat.icon}
                      </Box>
                      {cat.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {category && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(42, 125, 111, 0.08)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {UPLOAD_CATEGORIES.find(cat => cat.value === category)?.description}
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case 1:
        const selectedCategory = UPLOAD_CATEGORIES.find(cat => cat.value === category);
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload your {selectedCategory.label}
            </Typography>
            
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Allowed formats: {selectedCategory.allowedFormats}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum size: {selectedCategory.maxSize}
              </Typography>
            </Box>
            
            <Box
              sx={{
                border: '2px dashed',
                borderColor: theme.palette.primary.main,
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: 'rgba(42, 125, 111, 0.04)',
                mb: 3
              }}
            >
              <input
                type="file"
                multiple
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Select Files
                </Button>
              </label>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                or drag and drop files here
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {files.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files:
                </Typography>
                <Grid container spacing={1}>
                  {files.map((file, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                        onDelete={() => {
                          const newFiles = [...files];
                          newFiles.splice(index, 1);
                          setFiles(newFiles);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Please provide your information
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {completed ? (
              <>
                <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Upload Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Thank you for your submission. We will review your files and get back to you soon.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{ mt: 2 }}
                >
                  Upload Something Else
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Please review your submission
                </Typography>
                
                <Box sx={{ textAlign: 'left', mt: 2 }}>
                  <Typography variant="subtitle2">Category:</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {UPLOAD_CATEGORIES.find(cat => cat.value === category)?.label}
                  </Typography>
                  
                  <Typography variant="subtitle2">Files:</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {files.map(file => file.name).join(', ')}
                  </Typography>
                  
                  <Typography variant="subtitle2">Contact Information:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.name} • {formData.email} {formData.phone ? `• ${formData.phone}` : ''}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CloudUpload sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Upload Portal
        </Typography>
      </Box>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {getStepContent(activeStep)}
      
      {error && activeStep !== 1 && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0 || activeStep === 3}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 && !completed ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={uploading || !isStepValid()}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </Button>
          ) : (
            activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!isStepValid()}
                endIcon={<ArrowForward />}
              >
                Next
              </Button>
            )
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default UploadPortal;
