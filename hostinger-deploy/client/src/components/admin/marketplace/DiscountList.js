import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Grid,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as EnableIcon,
  ToggleOff as DisableIcon,
  LocalOffer as DiscountIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const DiscountList = ({
  discounts,
  loading,
  pagination,
  filters,
  onPageChange,
  onLimitChange,
  onFilterChange,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  const handleActionClick = (event, discountId) => {
    setAnchorEl(event.currentTarget);
    setSelectedDiscountId(discountId);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedDiscountId(null);
  };

  const handleEdit = () => {
    const discount = discounts.find(d => d._id === selectedDiscountId);
    onEdit(discount);
    handleActionClose();
  };

  const handleDelete = () => {
    onDelete(selectedDiscountId);
    handleActionClose();
  };

  const handleToggleStatus = () => {
    onToggleStatus(selectedDiscountId);
    handleActionClose();
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSort = (field) => {
    let order = 'desc';
    if (filters.sort === field && filters.order === 'desc') {
      order = 'asc';
    }
    onFilterChange({ ...filters, sort: field, order });
    handleSortClose();
  };

  const handleSearchChange = (event) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  const handleFilterChange = (event) => {
    onFilterChange({ ...filters, [event.target.name]: event.target.value });
  };

  // Format discount value based on discount type
  const formatDiscountValue = (discount) => {
    switch (discount.discountType) {
      case 'percentage':
        return `${discount.value}%`;
      case 'fixed':
        return `$${discount.value.toFixed(2)}`;
      case 'shipping':
        return 'Free Shipping';
      default:
        return discount.value;
    }
  };

  // Get status badge color
  const getStatusColor = (discount) => {
    const now = new Date();
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);
    
    if (!discount.isActive) {
      return 'error';
    } else if (now < start) {
      return 'info'; // upcoming
    } else if (now > end) {
      return 'error'; // expired
    } else {
      return 'success'; // active
    }
  };

  // Get status text
  const getStatusText = (discount) => {
    const now = new Date();
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);
    
    if (!discount.isActive) {
      return 'Inactive';
    } else if (now < start) {
      return 'Upcoming';
    } else if (now > end) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  return (
    <Box>
      {/* Filter controls */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search discounts..."
              size="small"
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
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                name="isActive"
                value={filters.isActive}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Discount Type</InputLabel>
              <Select
                labelId="type-filter-label"
                name="discountType"
                value={filters.discountType}
                label="Discount Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
                <MenuItem value="shipping">Shipping</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2} textAlign="right">
            <Tooltip title="Sort Options">
              <IconButton onClick={handleSortClick}>
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={() => handleSort('code')}>
                Code {filters.sort === 'code' && (filters.order === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem onClick={() => handleSort('value')}>
                Value {filters.sort === 'value' && (filters.order === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem onClick={() => handleSort('startDate')}>
                Start Date {filters.sort === 'startDate' && (filters.order === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem onClick={() => handleSort('endDate')}>
                End Date {filters.sort === 'endDate' && (filters.order === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem onClick={() => handleSort('usageCount')}>
                Usage Count {filters.sort === 'usageCount' && (filters.order === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem onClick={() => handleSort('createdAt')}>
                Created {filters.sort === 'createdAt' && (filters.order === 'asc' ? '↑' : '↓')}
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Paper>

      {/* Results table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="discounts table">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from(new Array(pagination.limit)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                </TableRow>
              ))
            ) : discounts.length > 0 ? (
              // Discount list
              discounts.map((discount) => (
                <TableRow key={discount._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DiscountIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="bold">
                        {discount.code}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {discount.description && discount.description.substring(0, 50)}
                      {discount.description && discount.description.length > 50 && '...'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {discount.discountType === 'percentage' && 'Percentage'}
                    {discount.discountType === 'fixed' && 'Fixed Amount'}
                    {discount.discountType === 'shipping' && 'Free Shipping'}
                  </TableCell>
                  <TableCell>{formatDiscountValue(discount)}</TableCell>
                  <TableCell>
                    {new Date(discount.startDate).toLocaleDateString()}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {formatDistanceToNow(new Date(discount.startDate), { addSuffix: true })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(discount.endDate).toLocaleDateString()}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {formatDistanceToNow(new Date(discount.endDate), { addSuffix: true })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {discount.usageCount} / {discount.usageLimit || '∞'}
                    {discount.usageLimit && (
                      <Box sx={{ mt: 0.5, width: '100%' }}>
                        <Box
                          sx={{
                            height: 4,
                            width: '100%',
                            bgcolor: 'grey.300',
                            borderRadius: 1,
                            position: 'relative'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                              width: `${Math.min(100, (discount.usageCount / discount.usageLimit) * 100)}%`
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(discount)}
                      color={getStatusColor(discount)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      aria-label="actions" 
                      onClick={(e) => handleActionClick(e, discount._id)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No discounts found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={onPageChange}
          onRowsPerPageChange={onLimitChange}
        />
      </TableContainer>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {discounts.find(d => d._id === selectedDiscountId)?.isActive ? (
            <>
              <DisableIcon fontSize="small" sx={{ mr: 1 }} />
              Disable
            </>
          ) : (
            <>
              <EnableIcon fontSize="small" sx={{ mr: 1 }} />
              Enable
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DiscountList;
