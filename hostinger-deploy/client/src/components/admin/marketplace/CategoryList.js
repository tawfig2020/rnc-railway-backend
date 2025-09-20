import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Typography,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

const CategoryList = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onToggleFeatured,
  onUpdateStatus,
  page,
  limit,
  onChangePage,
  onChangeRowsPerPage,
  filterOptions,
  onFilterChange,
  totalCount
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleActionClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(selectedCategory);
    handleCloseMenu();
  };

  const handleDelete = () => {
    onDelete(selectedCategory._id);
    handleCloseMenu();
  };

  const handleToggleFeatured = () => {
    onToggleFeatured(selectedCategory._id, selectedCategory.featured);
    handleCloseMenu();
  };

  const handleUpdateStatus = (status) => {
    onUpdateStatus(selectedCategory._id, status);
    handleCloseMenu();
  };

  const handleFilterChange = (field, value) => {
    onFilterChange({
      ...filterOptions,
      [field]: value
    });
  };

  return (
    <Box>
      {/* Filter Controls */}
      <Box mb={3} display="flex" flexWrap="wrap" gap={2}>
        <TextField
          label="Search Categories"
          variant="outlined"
          size="small"
          value={filterOptions.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterOptions.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Level</InputLabel>
          <Select
            value={filterOptions.parentId || ''}
            onChange={(e) => handleFilterChange('parentId', e.target.value)}
            label="Level"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="root">Root Categories</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Featured</InputLabel>
          <Select
            value={filterOptions.featured || ''}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
            label="Featured"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Featured</MenuItem>
            <MenuItem value="false">Not Featured</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Featured</TableCell>
              <TableCell align="center">Level</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>Loading categories...</Typography>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">No categories found</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try adjusting your filters or create a new category
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {category.image ? (
                        <Avatar 
                          src={category.image} 
                          alt={category.name}
                          variant="rounded"
                          sx={{ width: 30, height: 30, mr: 1 }}
                        />
                      ) : (
                        <Avatar 
                          alt={category.name}
                          variant="rounded"
                          sx={{ width: 30, height: 30, mr: 1, bgcolor: 'primary.main' }}
                        >
                          {category.name.charAt(0)}
                        </Avatar>
                      )}
                      <Typography variant="body1">{category.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {category.description ? (
                      category.description.length > 100 ? 
                        `${category.description.substring(0, 100)}...` : 
                        category.description
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        No description
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={category.status}
                      size="small"
                      color={category.status === 'active' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {category.featured ? (
                      <Tooltip title="Featured">
                        <StarIcon color="warning" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not Featured">
                        <StarBorderIcon color="disabled" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={category.parentId ? 'Subcategory' : 'Root'}
                      size="small"
                      color={category.parentId ? 'info' : 'primary'}
                      variant={category.parentId ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="more actions"
                      onClick={(e) => handleActionClick(e, category)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={limit}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
        <MenuItem onClick={handleToggleFeatured}>
          {selectedCategory?.featured ? (
            <>
              <StarBorderIcon fontSize="small" sx={{ mr: 1 }} /> Remove from Featured
            </>
          ) : (
            <>
              <StarIcon fontSize="small" sx={{ mr: 1 }} /> Mark as Featured
            </>
          )}
        </MenuItem>
        {selectedCategory?.status === 'active' ? (
          <MenuItem onClick={() => handleUpdateStatus('inactive')}>
            Set as Inactive
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleUpdateStatus('active')}>
            Set as Active
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default CategoryList;
