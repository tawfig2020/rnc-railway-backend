import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Chip, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, MenuItem, Select, FormControl, InputLabel,
  CircularProgress, Pagination, Snackbar, Alert, FormHelperText
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import api from '../../../services/api';

// Product management component for the admin panel
const ProductManagement = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    vendor: ''
  });
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    vendor: '',
    status: 'pending'
  });
  const [formErrors, setFormErrors] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch products when component mounts or filters/page change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  // Fetch product categories and vendors when component mounts
  useEffect(() => {
    fetchCategories();
    fetchVendors();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let queryString = `?page=${page}`;
      if (filters.search) queryString += `&search=${filters.search}`;
      if (filters.category) queryString += `&category=${filters.category}`;
      if (filters.status) queryString += `&status=${filters.status}`;
      if (filters.vendor) queryString += `&vendor=${filters.vendor}`;
      
      const response = await api.get(`/products/admin/all${queryString}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      showSnackbar('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch product categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setVendors(response.data.vendors);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setPage(1); // Reset to first page when filters change
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Open dialog for adding/editing product
  const handleOpenDialog = (product = null) => {
    if (product) {
      // Editing existing product
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        vendor: product.vendor._id,
        status: product.status
      });
      setProductImages(product.images || []);
    } else {
      // Adding new product
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        vendor: '',
        status: 'pending'
      });
      setProductImages([]);
    }
    setOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Product name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.stock) {
      errors.stock = 'Stock quantity is required';
    } else if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.vendor) errors.vendor = 'Vendor is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const productData = new FormData();
    Object.keys(formData).forEach(key => {
      productData.append(key, formData[key]);
    });
    
    // If there are new images to upload
    if (selectedImages.length > 0) {
      selectedImages.forEach(image => {
        productData.append('productImages', image);
      });
    }
    
    setLoading(true);
    
    try {
      let response;
      if (currentProduct) {
        // Update existing product
        response = await api.put(`/products/${currentProduct._id}`, productData, {
          headers: { 
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          }
        });
        showSnackbar('Product updated successfully', 'success');
      } else {
        // Create new product
        response = await api.post('/products/admin', productData, {
          headers: { 
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          }
        });
        showSnackbar('Product created successfully', 'success');
      }
      
      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      showSnackbar('Error saving product', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await api.delete(`/products/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        showSnackbar('Product deleted successfully', 'success');
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        showSnackbar('Failed to delete product', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      await api.put(`/products/${id}/status`, { status }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      showSnackbar('Product status updated', 'success');
      fetchProducts();
    } catch (err) {
      console.error('Error updating status:', err);
      showSnackbar('Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  // Show image preview dialog
  const handleOpenImageDialog = (images) => {
    setProductImages(images);
    setImageDialogOpen(true);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Render status chip based on status
  const renderStatusChip = (status) => {
    let color;
    switch (status) {
      case 'active':
        color = 'success';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'rejected':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>
      
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField 
              name="search"
              label="Search Products"
              fullWidth
              variant="outlined"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                label="Category"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Vendor</InputLabel>
              <Select
                name="vendor"
                value={filters.vendor}
                label="Vendor"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Vendors</MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor._id} value={vendor._id}>
                    {vendor.businessName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Add Product Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>
      
      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !products.length ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <IconButton size="small" onClick={() => handleOpenImageDialog(product.images)}>
                        <ImageIcon />
                      </IconButton>
                    ) : (
                      'No image'
                    )}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.vendor ? product.vendor.businessName : 'N/A'}</TableCell>
                  <TableCell>{renderStatusChip(product.status)}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
      
      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price ($)"
                fullWidth
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stock"
                label="Stock Quantity"
                fullWidth
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                error={!!formErrors.stock}
                helperText={formErrors.stock}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <FormHelperText>{formErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.vendor} required>
                <InputLabel>Vendor</InputLabel>
                <Select
                  name="vendor"
                  value={formData.vendor}
                  label="Vendor"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Vendor</MenuItem>
                  {vendors.map((vendor) => (
                    <MenuItem key={vendor._id} value={vendor._id}>
                      {vendor.businessName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.vendor && (
                  <FormHelperText>{formErrors.vendor}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="product-images"
                multiple
                type="file"
                onChange={handleImageSelect}
              />
              <label htmlFor="product-images">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<ImageIcon />}
                >
                  Upload Images
                </Button>
              </label>
              {selectedImages.length > 0 && (
                <Typography variant="body2" mt={1}>
                  {selectedImages.length} new image(s) selected
                </Typography>
              )}
              {productImages.length > 0 && (
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Current Images:
                  </Typography>
                  <Button size="small" onClick={() => handleOpenImageDialog(productImages)}>
                    View {productImages.length} image(s)
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Image Preview Dialog */}
      <Dialog 
        open={imageDialogOpen} 
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Product Images</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {productImages.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  component="img"
                  src={image.startsWith('http') ? image : `/uploads/${image}`}
                  alt={`Product ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;
