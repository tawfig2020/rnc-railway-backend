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
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  TablePagination,
  Rating,
  Tooltip,
  Avatar,
  Stack
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';
import { format } from 'date-fns';

const ServiceList = ({
  services,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFeature,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  loading
}) => {
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  const handleOpenActionMenu = (event, service) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedService(service);
  };
  
  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
  };
  
  const handleEdit = () => {
    onEdit(selectedService);
    handleCloseActionMenu();
  };
  
  const handleDelete = () => {
    onDelete(selectedService._id);
    handleCloseActionMenu();
  };
  
  const handleStatusChange = (status) => {
    onStatusChange(selectedService._id, status);
    handleCloseActionMenu();
  };
  
  const handleToggleFeature = () => {
    onToggleFeature(selectedService._id);
    handleCloseActionMenu();
  };

  // Helper function to render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case 'active':
        return (
          <Chip 
            icon={<VerifiedIcon />} 
            label="Active" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        );
      case 'pending':
        return (
          <Chip 
            icon={<PendingIcon />} 
            label="Pending" 
            color="warning" 
            size="small" 
            variant="outlined"
          />
        );
      case 'inactive':
        return (
          <Chip 
            icon={<BlockIcon />} 
            label="Inactive" 
            color="error" 
            size="small" 
            variant="outlined"
          />
        );
      default:
        return null;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      legal: '#1565c0',       // blue
      education: '#9c27b0',   // purple
      health: '#2e7d32',      // green
      employment: '#ed6c02',  // orange
      housing: '#5d4037',     // brown
      counseling: '#0288d1',  // light blue
      language: '#7b1fa2',    // deep purple
      cultural: '#c2185b',    // pink
      other: '#757575'        // grey
    };
    
    return categoryColors[category] || categoryColors.other;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader aria-label="services table">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Featured</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell align="right">Metrics</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={service.image}
                      alt={service.name}
                      variant="rounded"
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" component="div">
                        {service.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {service.shortDescription}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={service.category?.charAt(0).toUpperCase() + service.category?.slice(1)} 
                    size="small"
                    sx={{ 
                      bgcolor: `${getCategoryColor(service.category)}20`, 
                      color: getCategoryColor(service.category),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {service.provider?.name}
                  </Typography>
                  {service.provider?.organization && (
                    <Typography variant="caption" color="text.secondary">
                      {service.provider.organization}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>{renderStatusChip(service.status)}</TableCell>
                
                <TableCell align="center">
                  <Tooltip title={service.isFeatured ? "Featured" : "Not Featured"}>
                    <IconButton 
                      size="small" 
                      color={service.isFeatured ? "primary" : "default"}
                      onClick={() => onToggleFeature(service._id)}
                    >
                      {service.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Rating 
                      value={service.averageRating || 0} 
                      precision={0.1} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {service.averageRating ? service.averageRating.toFixed(1) : '-'}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="right">
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      {service.metrics?.views || 0} views
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.metrics?.applications || 0} applications
                    </Typography>
                  </Stack>
                </TableCell>
                
                <TableCell align="right">
                  {formatDate(service.createdAt)}
                </TableCell>
                
                <TableCell align="center">
                  <IconButton
                    aria-label="more"
                    aria-controls="service-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleOpenActionMenu(e, service)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(e, newPage + 1)}
        onRowsPerPageChange={onLimitChange}
      />

      {/* Action Menu */}
      <Menu
        id="service-menu"
        anchorEl={actionMenuAnchor}
        keepMounted
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Service
        </MenuItem>
        
        <MenuItem onClick={handleToggleFeature}>
          {selectedService?.isFeatured ? (
            <>
              <StarBorderIcon fontSize="small" sx={{ mr: 1 }} />
              Remove from Featured
            </>
          ) : (
            <>
              <StarIcon fontSize="small" sx={{ mr: 1 }} />
              Mark as Featured
            </>
          )}
        </MenuItem>
        
        {selectedService?.status !== 'active' && (
          <MenuItem onClick={() => handleStatusChange('active')}>
            <VerifiedIcon fontSize="small" sx={{ mr: 1 }} color="success" />
            Set as Active
          </MenuItem>
        )}
        
        {selectedService?.status !== 'pending' && (
          <MenuItem onClick={() => handleStatusChange('pending')}>
            <PendingIcon fontSize="small" sx={{ mr: 1 }} color="warning" />
            Set as Pending
          </MenuItem>
        )}
        
        {selectedService?.status !== 'inactive' && (
          <MenuItem onClick={() => handleStatusChange('inactive')}>
            <BlockIcon fontSize="small" sx={{ mr: 1 }} color="error" />
            Set as Inactive
          </MenuItem>
        )}
        
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" />
          Delete Service
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ServiceList;
