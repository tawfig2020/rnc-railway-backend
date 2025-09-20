import React, { useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Typography, Pagination, CircularProgress, Avatar,
  Tooltip, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  CheckCircle as CompleteIcon,
  PauseCircle as PendingIcon,
  Cancel as FailedIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';

// DonationList component for DonationManagement
const DonationList = ({
  donations,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onViewDonation,
  onStatusUpdate,
  onDeleteDonation
}) => {
  // State for menu anchor
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    let color;
    let icon;
    let label = status;
    
    switch (status) {
      case 'completed':
        color = 'success';
        icon = <CompleteIcon fontSize="small" />;
        break;
      case 'pending':
        color = 'warning';
        icon = <PendingIcon fontSize="small" />;
        break;
      case 'failed':
        color = 'error';
        icon = <FailedIcon fontSize="small" />;
        break;
      default:
        color = 'default';
        icon = null;
    }
    
    return (
      <Chip 
        label={label} 
        color={color}
        size="small"
        variant="outlined"
        icon={icon}
      />
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Open menu
  const handleOpenMenu = (event, donationId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDonationId(donationId);
  };

  // Close menu
  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedDonationId(null);
  };

  // Handle status update from menu
  const handleStatusChange = (status) => {
    if (selectedDonationId) {
      onStatusUpdate(selectedDonationId, status);
    }
    handleCloseMenu();
  };

  // Handle delete from menu
  const handleDelete = () => {
    if (selectedDonationId && onDeleteDonation) {
      onDeleteDonation(selectedDonationId);
    }
    handleCloseMenu();
  };

  // Get donor name (handle anonymous donations)
  const getDonorName = (donation) => {
    if (donation.anonymous) return 'Anonymous';
    if (donation.donor && donation.donor.name) return donation.donor.name;
    return donation.name || 'Unknown';
  };

  return (
    <Paper sx={{ mt: 2, mb: 3 }}>
      <TableContainer>
        <Table aria-label="donations table">
          <TableHead>
            <TableRow>
              <TableCell>Donor</TableCell>
              <TableCell>Campaign</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !donations.length ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography>No donations found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        alt={getDonorName(donation)} 
                        src={donation.donor?.avatar || ''} 
                        sx={{ width: 40, height: 40, mr: 2, bgcolor: donation.anonymous ? 'gray' : undefined }}
                      >
                        {getDonorName(donation).charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {getDonorName(donation)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {donation.email || 'No email provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {donation.campaign ? (
                      <Typography variant="body2">
                        {donation.campaign.title || 'Unknown Campaign'}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        General Donation
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(donation.amount)}
                    </Typography>
                    {donation.recurringFrequency && (
                      <Chip 
                        label={`${donation.recurringFrequency}`}
                        size="small" 
                        color="info" 
                        variant="outlined" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(donation.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderStatusChip(donation.status)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        color="primary"
                        onClick={() => onViewDonation(donation)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleOpenMenu(e, donation._id)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleStatusChange('completed')}>
          <ListItemIcon>
            <CompleteIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Completed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('pending')}>
          <ListItemIcon>
            <PendingIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Mark as Pending</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('failed')}>
          <ListItemIcon>
            <FailedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Mark as Failed</ListItemText>
        </MenuItem>
        {onDeleteDonation && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Donation</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default DonationList;
