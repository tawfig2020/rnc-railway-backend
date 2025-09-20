import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, TextField, FormControl, InputLabel,
  Select, MenuItem, Button, Box, IconButton, Collapse,
  Typography
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../../services/api';

// Order filters component for OrderManagement
const OrderFilters = ({ filters, onFilterChange }) => {
  // Local state for filter values
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);
  const [vendors, setVendors] = useState([]);
  
  // Fetch vendors for filter dropdown
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/vendors', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setVendors(response.data.vendors || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    
    fetchVendors();
  }, []);

  // Handle filter value changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value
    });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setLocalFilters({
      ...localFilters,
      [name]: date ? date.toISOString().split('T')[0] : ''
    });
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const resetValues = {
      status: '',
      vendor: '',
      startDate: '',
      endDate: '',
      minTotal: '',
      maxTotal: '',
      sort: 'newest'
    };
    setLocalFilters(resetValues);
    onFilterChange(resetValues);
  };

  // Toggle filter expansion
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Box>
          <IconButton size="small" onClick={toggleExpanded}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded || Object.values(filters).some(val => val !== '')}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            {/* Order Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Order Status</InputLabel>
                <Select
                  name="status"
                  value={localFilters.status}
                  label="Order Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Vendor Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Vendor</InputLabel>
                <Select
                  name="vendor"
                  value={localFilters.vendor}
                  label="Vendor"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Vendors</MenuItem>
                  {vendors.map(vendor => (
                    <MenuItem key={vendor._id} value={vendor._id}>
                      {vendor.businessName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sort"
                  value={localFilters.sort}
                  label="Sort By"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="total-high">Highest Amount</MenuItem>
                  <MenuItem value="total-low">Lowest Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={localFilters.startDate ? new Date(localFilters.startDate) : null}
                onChange={(date) => handleDateChange('startDate', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" />
                )}
                maxDate={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
              />
            </Grid>

            {/* End Date Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={localFilters.endDate ? new Date(localFilters.endDate) : null}
                onChange={(date) => handleDateChange('endDate', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" />
                )}
                minDate={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
              />
            </Grid>

            {/* Min Total Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="minTotal"
                label="Min Total"
                type="number"
                value={localFilters.minTotal}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                InputProps={{ 
                  startAdornment: '$',
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Max Total Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="maxTotal"
                label="Max Total"
                type="number"
                value={localFilters.maxTotal}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                InputProps={{ 
                  startAdornment: '$',
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Filter Action Buttons */}
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" gap={1} height="100%" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  fullWidth
                >
                  Apply Filters
                </Button>
                <IconButton 
                  color="error" 
                  onClick={resetFilters}
                  size="small"
                  title="Clear Filters"
                >
                  <ClearIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Collapse>
    </Paper>
  );
};

export default OrderFilters;
