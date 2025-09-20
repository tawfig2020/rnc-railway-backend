import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const ServiceFilters = ({ filterOptions, onFilterChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: '',
    sort: 'newest'
  });
  const [categories, setCategories] = useState([]);
  
  // Initialize local filters from props
  useEffect(() => {
    setLocalFilters({
      search: filterOptions.search || '',
      category: filterOptions.category || '',
      sort: filterOptions.sort || 'newest'
    });
  }, [filterOptions]);
  
  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/services/categories/list', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        
        // Fallback categories if API fails
        setCategories([
          'legal',
          'education',
          'health',
          'employment',
          'housing',
          'counseling',
          'language',
          'cultural',
          'other'
        ]);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };
  
  const handleClear = () => {
    const clearedFilters = {
      search: '',
      category: '',
      sort: 'newest'
    };
    
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="Search Services"
              name="search"
              variant="outlined"
              size="small"
              value={localFilters.search}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: localFilters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setLocalFilters(prev => ({ ...prev, search: '' }));
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                name="sort"
                value={localFilters.sort}
                label="Sort By"
                onChange={handleInputChange}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                <MenuItem value="rating_high">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={handleToggleExpand}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expanded ? 'Less Filters' : 'More Filters'}
            </Button>
          </Grid>
          
          <Grid item>
            <Button type="submit" variant="contained">
              Apply Filters
            </Button>
          </Grid>
          
          <Grid item>
            <Button variant="text" onClick={handleClear}>
              Clear All
            </Button>
          </Grid>
        </Grid>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={localFilters.category}
                    label="Category"
                    onChange={handleInputChange}
                    displayEmpty
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </form>
    </Paper>
  );
};

export default ServiceFilters;
