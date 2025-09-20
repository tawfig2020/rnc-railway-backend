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
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

// Campaign filters component for CampaignManagement
const CampaignFilters = ({ filters, onFilterChange }) => {
  // Local state for filter values
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Fetch categories for filter dropdown
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
      category: '',
      search: '',
      startDate: '',
      endDate: '',
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

      {/* Search bar always visible */}
      <Box mb={2} sx={{ display: 'flex' }}>
        <TextField
          name="search"
          label="Search Campaigns"
          value={localFilters.search}
          onChange={handleFilterChange}
          fullWidth
          size="small"
          placeholder="Search by title, description, or keywords"
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={applyFilters}
          sx={{ ml: 1 }}
        >
          Search
        </Button>
      </Box>

      <Collapse in={expanded || Object.values(filters).some(val => val !== '' && val !== 'newest')}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            {/* Campaign Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={localFilters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={localFilters.category}
                  label="Category"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
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
                  <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="amount-high">Highest Amount</MenuItem>
                  <MenuItem value="amount-low">Lowest Amount</MenuItem>
                  <MenuItem value="progress-high">Highest Progress</MenuItem>
                  <MenuItem value="end-date">End Date (Soonest)</MenuItem>
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

export default CampaignFilters;
