import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, TextField, FormControl, InputLabel,
  Select, MenuItem, Button, Box, IconButton, Collapse,
  Typography, InputAdornment
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

// Donation filters component for DonationManagement
const DonationFilters = ({ filters, onFilterChange }) => {
  // Local state for filter values
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  
  // Fetch campaigns for filter dropdown
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/admin/campaigns/list', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setCampaigns(response.data || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    
    fetchCampaigns();
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
      campaignId: '',
      search: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
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
          label="Search Donations"
          value={localFilters.search}
          onChange={handleFilterChange}
          fullWidth
          size="small"
          placeholder="Search by donor name, email, or transaction ID"
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
            {/* Donation Status Filter */}
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
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Campaign Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Campaign</InputLabel>
                <Select
                  name="campaignId"
                  value={localFilters.campaignId}
                  label="Campaign"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Campaigns</MenuItem>
                  <MenuItem value="general">General Donations</MenuItem>
                  {campaigns.map((campaign) => (
                    <MenuItem key={campaign._id} value={campaign._id}>
                      {campaign.title}
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
                  <MenuItem value="amount-high">Amount (High to Low)</MenuItem>
                  <MenuItem value="amount-low">Amount (Low to High)</MenuItem>
                  <MenuItem value="name-asc">Donor Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Donor Name (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="From Date"
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
                label="To Date"
                value={localFilters.endDate ? new Date(localFilters.endDate) : null}
                onChange={(date) => handleDateChange('endDate', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" />
                )}
              />
            </Grid>

            {/* Min Amount Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="minAmount"
                label="Min Amount"
                type="number"
                fullWidth
                size="small"
                value={localFilters.minAmount}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            {/* Max Amount Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="maxAmount"
                label="Max Amount"
                type="number"
                fullWidth
                size="small"
                value={localFilters.maxAmount}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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

export default DonationFilters;
