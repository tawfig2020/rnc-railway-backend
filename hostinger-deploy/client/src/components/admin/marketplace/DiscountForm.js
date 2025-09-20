import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  InputAdornment,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Autocomplete
} from '@mui/material';
import {
  LocalOffer as DiscountIcon,
  Category as CategoryIcon,
  Inventory as ProductIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../../services/api';

const DiscountForm = ({ open, discount, onClose, onSubmit }) => {
  const initialState = {
    code: '',
    description: '',
    discountType: 'percentage',
    value: '',
    minPurchase: 0,
    maxDiscount: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    isActive: true,
    usageLimit: '',
    perUserLimit: '',
    applicableProducts: [],
    applicableCategories: [],
    excludedProducts: []
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Load form data from discount when editing
  useEffect(() => {
    if (discount) {
      // Convert dates to Date objects
      const startDate = discount.startDate ? new Date(discount.startDate) : new Date();
      const endDate = discount.endDate ? new Date(discount.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      setFormData({
        code: discount.code || '',
        description: discount.description || '',
        discountType: discount.discountType || 'percentage',
        value: discount.value || '',
        minPurchase: discount.minPurchase || 0,
        maxDiscount: discount.maxDiscount || '',
        startDate,
        endDate,
        isActive: discount.isActive !== undefined ? discount.isActive : true,
        usageLimit: discount.usageLimit || '',
        perUserLimit: discount.perUserLimit || '',
        applicableProducts: discount.applicableProducts || [],
        applicableCategories: discount.applicableCategories || [],
        excludedProducts: discount.excludedProducts || []
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
    setTabValue(0);
    
    // Fetch products and categories when form opens
    if (open) {
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount, open]);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'x-auth-token': token };
      
      // Fetch products
      const productsRes = await api.get('/products?limit=100', { headers });
      setProducts(productsRes.data.products);
      
      // Fetch categories
      const categoriesRes = await api.get('/categories?limit=100', { headers });
      setCategories(categoriesRes.data.categories);
      
      setLoadingOptions(false);
    } catch (err) {
      console.error('Error fetching form options:', err);
      setLoadingOptions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
    
    // Clear error when date is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProductsChange = (event, newValues) => {
    setFormData(prev => ({ ...prev, applicableProducts: newValues.map(v => v._id) }));
  };

  const handleCategoriesChange = (event, newValues) => {
    setFormData(prev => ({ ...prev, applicableCategories: newValues.map(v => v._id) }));
  };

  const handleExcludedProductsChange = (event, newValues) => {
    setFormData(prev => ({ ...prev, excludedProducts: newValues.map(v => v._id) }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.code.trim()) {
      newErrors.code = 'Discount code is required';
    } else if (formData.code.length > 15) {
      newErrors.code = 'Code cannot exceed 15 characters';
    }
    
    if (!formData.discountType) {
      newErrors.discountType = 'Discount type is required';
    }
    
    if (formData.value === '' || isNaN(formData.value)) {
      newErrors.value = 'Valid discount value is required';
    } else if (formData.discountType === 'percentage' && (formData.value <= 0 || formData.value > 100)) {
      newErrors.value = 'Percentage must be between 0 and 100';
    } else if (formData.value < 0) {
      newErrors.value = 'Value cannot be negative';
    }
    
    if (formData.minPurchase && formData.minPurchase < 0) {
      newErrors.minPurchase = 'Minimum purchase cannot be negative';
    }
    
    if (formData.maxDiscount !== '' && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'Maximum discount cannot be negative';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.usageLimit !== '' && (isNaN(formData.usageLimit) || formData.usageLimit < 1)) {
      newErrors.usageLimit = 'Usage limit must be a positive number';
    }
    
    if (formData.perUserLimit !== '' && (isNaN(formData.perUserLimit) || formData.perUserLimit < 1)) {
      newErrors.perUserLimit = 'Per user limit must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Convert string inputs to numbers
    const preparedData = {
      ...formData,
      value: parseFloat(formData.value),
      minPurchase: formData.minPurchase === '' ? 0 : parseFloat(formData.minPurchase),
      maxDiscount: formData.maxDiscount === '' ? null : parseFloat(formData.maxDiscount),
      usageLimit: formData.usageLimit === '' ? null : parseInt(formData.usageLimit),
      perUserLimit: formData.perUserLimit === '' ? null : parseInt(formData.perUserLimit)
    };
    
    try {
      await onSubmit(preparedData);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting discount:', error);
      setLoading(false);
      
      if (error.response && error.response.data && error.response.data.errors) {
        // Map API validation errors to form fields
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    }
  };

  const getProductById = (id) => {
    return products.find(product => product._id === id) || null;
  };

  const getCategoryById = (id) => {
    return categories.find(category => category._id === id) || null;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <DiscountIcon sx={{ mr: 1 }} />
        {discount ? 'Edit Discount' : 'Create Discount'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Basic Info" />
          <Tab label="Restrictions" />
        </Tabs>
        
        {/* Basic Info Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code || 'Code will be converted to uppercase'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DiscountIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.discountType}>
                <InputLabel id="discount-type-label">Discount Type</InputLabel>
                <Select
                  labelId="discount-type-label"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  label="Discount Type"
                >
                  <MenuItem value="percentage">Percentage Discount</MenuItem>
                  <MenuItem value="fixed">Fixed Amount Discount</MenuItem>
                  <MenuItem value="shipping">Free Shipping</MenuItem>
                </Select>
                {errors.discountType && <FormHelperText>{errors.discountType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                error={!!errors.value}
                helperText={errors.value || 
                  (formData.discountType === 'percentage' ? 'Percentage value (0-100)' : 
                   formData.discountType === 'fixed' ? 'Fixed discount amount' : 
                   'Not applicable for shipping discounts')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {formData.discountType === 'percentage' ? '%' : '$'}
                    </InputAdornment>
                  )
                }}
                disabled={formData.discountType === 'shipping'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Purchase Amount"
                name="minPurchase"
                type="number"
                value={formData.minPurchase}
                onChange={handleChange}
                error={!!errors.minPurchase}
                helperText={errors.minPurchase || 'Minimum amount required to use this discount'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Discount Amount"
                name="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={handleChange}
                error={!!errors.maxDiscount}
                helperText={errors.maxDiscount || 'Leave empty for no maximum (optional)'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description || 'Optional description of the discount'}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Validity Period</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(date) => handleDateChange('startDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="End Date"
                      value={formData.endDate}
                      onChange={(date) => handleDateChange('endDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        
        {/* Restrictions Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                error={!!errors.usageLimit}
                helperText={errors.usageLimit || 'Maximum number of times this discount can be used (leave empty for unlimited)'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Per User Limit"
                name="perUserLimit"
                type="number"
                value={formData.perUserLimit}
                onChange={handleChange}
                error={!!errors.perUserLimit}
                helperText={errors.perUserLimit || 'Maximum times one user can use this discount (leave empty for unlimited)'}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Applicable Categories
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Select specific categories to restrict this discount to. Leave empty to apply to all categories.
              </Typography>
              <Autocomplete
                multiple
                loading={loadingOptions}
                options={categories}
                getOptionLabel={(option) => option.name || ''}
                value={formData.applicableCategories.map(id => getCategoryById(id)).filter(Boolean)}
                onChange={handleCategoriesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Categories"
                    placeholder="Select categories"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <ProductIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Applicable Products
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Select specific products to restrict this discount to. Leave empty to apply to all products.
              </Typography>
              <Autocomplete
                multiple
                loading={loadingOptions}
                options={products}
                getOptionLabel={(option) => option.name || ''}
                value={formData.applicableProducts.map(id => getProductById(id)).filter(Boolean)}
                onChange={handleProductsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Products"
                    placeholder="Select products"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <ProductIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Excluded Products
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Select specific products to exclude from this discount.
              </Typography>
              <Autocomplete
                multiple
                loading={loadingOptions}
                options={products}
                getOptionLabel={(option) => option.name || ''}
                value={formData.excludedProducts.map(id => getProductById(id)).filter(Boolean)}
                onChange={handleExcludedProductsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Products to Exclude"
                    placeholder="Select products"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {discount ? 'Update' : 'Create'} Discount
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscountForm;
