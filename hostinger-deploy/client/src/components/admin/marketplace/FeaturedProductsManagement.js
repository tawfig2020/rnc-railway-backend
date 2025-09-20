import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TablePagination,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import api from '../../../services/api';

const FeaturedProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    featured: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [categories, setCategories] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    productId: null,
    action: null
  });

  // Fetch products based on filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { page, limit } = pagination;
      const { search, category, featured, sort, order } = filters;
      
      let queryParams = `page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
      if (search) queryParams += `&search=${search}`;
      if (category) queryParams += `&category=${category}`;
      if (featured !== '') queryParams += `&featured=${featured}`;
      
      const res = await api.get(`/products?${queryParams}`);
      
      setProducts(res.data.products);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination.total,
        pages: res.data.pagination.pages
      }));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setLoading(false);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload products when filters or pagination change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleLimitChange = (event) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(event.target.value),
      page: 1
    }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFeaturedFilter = (value) => {
    setFilters(prev => ({ ...prev, featured: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const res = await api.put(`/products/${productId}/featured`, {});
      
      // Update product in state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, featured: res.data.featured }
            : product
        )
      );
      
      setSuccess(res.data.message);
      setConfirmDialog({ open: false, productId: null, action: null });
    } catch (err) {
      console.error('Error toggling featured status:', err);
      setError('Failed to update featured status. Please try again.');
      setConfirmDialog({ open: false, productId: null, action: null });
    }
  };

  const openConfirmDialog = (productId, action) => {
    setConfirmDialog({ open: true, productId, action });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, productId: null, action: null });
  };

  const handleConfirmAction = () => {
    const { productId, action } = confirmDialog;
    
    if (action === 'toggleFeatured') {
      handleToggleFeatured(productId);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const handleViewProduct = (productId) => {
    window.open(`/marketplace/products/${productId}`, '_blank');
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Featured Products Management
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Feature products to highlight them in the marketplace. Featured products appear on the homepage and in special sections.
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                name="category"
                value={filters.category}
                label="Category"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box display="flex" gap={1}>
              <Chip 
                icon={<FilterIcon />}
                label="All Products" 
                color={filters.featured === '' ? 'primary' : 'default'}
                onClick={() => handleFeaturedFilter('')}
                clickable
              />
              <Chip 
                icon={<StarIcon />}
                label="Featured" 
                color={filters.featured === 'true' ? 'primary' : 'default'}
                onClick={() => handleFeaturedFilter('true')}
                clickable
              />
              <Chip 
                icon={<StarBorderIcon />}
                label="Not Featured" 
                color={filters.featured === 'false' ? 'primary' : 'default'}
                onClick={() => handleFeaturedFilter('false')}
                clickable
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Products Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : products.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Featured badge */}
                  {product.featured && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <StarIcon fontSize="small" />
                    </Box>
                  )}
                  
                  {/* Product image */}
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.images && product.images.length > 0
                      ? `/${product.images[0]}`
                      : '/uploads/products/default-product-image.jpg'}
                    alt={product.name}
                  />
                  
                  {/* Product info */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description && product.description.substring(0, 60)}
                      {product.description && product.description.length > 60 && '...'}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary.main">
                        ${product.price.toFixed(2)}
                      </Typography>
                      
                      {product.discountPrice > 0 && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                          ${product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  
                  {/* Actions */}
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      <Tooltip title="View product details">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewProduct(product._id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Edit product">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Button
                      startIcon={product.featured ? <StarBorderIcon /> : <StarIcon />}
                      color={product.featured ? 'warning' : 'primary'}
                      size="small"
                      onClick={() => openConfirmDialog(product._id, 'toggleFeatured')}
                    >
                      {product.featured ? 'Remove Featured' : 'Mark Featured'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          <Box mt={3} display="flex" justifyContent="center">
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page - 1}
              rowsPerPage={pagination.limit}
              rowsPerPageOptions={[12, 24, 48]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
            />
          </Box>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or add new products
          </Typography>
        </Paper>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
      >
        <DialogTitle>
          {confirmDialog.action === 'toggleFeatured' && (
            products.find(p => p._id === confirmDialog.productId)?.featured
              ? 'Remove Featured Status'
              : 'Mark as Featured'
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === 'toggleFeatured' && (
              products.find(p => p._id === confirmDialog.productId)?.featured
                ? 'Are you sure you want to remove this product from featured?'
                : 'Are you sure you want to mark this product as featured?'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeaturedProductsManagement;
