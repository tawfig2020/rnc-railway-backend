import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Typography, Pagination, CircularProgress, Avatar,
  LinearProgress, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  PlayArrow as ActivateIcon,
  Flag as CompleteIcon,
  PauseCircle as DraftIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';

// Campaign list component for CampaignManagement
const CampaignList = ({ 
  campaigns, 
  loading, 
  error, 
  page, 
  totalPages, 
  onPageChange, 
  onViewCampaign,
  onEditCampaign,
  onStatusUpdate
}) => {
  // State for menu anchor
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = React.useState(null);
  
  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    let color;
    let label = status;
    
    switch (status) {
      case 'active':
        color = 'success';
        break;
      case 'completed':
        color = 'primary';
        break;
      case 'draft':
        color = 'default';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        variant="outlined"
      />
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    if (!current || !target) return 0;
    const percentage = (current / target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  // Open menu
  const handleOpenMenu = (event, campaignId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCampaignId(campaignId);
  };

  // Close menu
  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedCampaignId(null);
  };

  // Handle status update from menu
  const handleStatusChange = (status) => {
    if (selectedCampaignId) {
      onStatusUpdate(selectedCampaignId, status);
    }
    handleCloseMenu();
  };

  // Handle edit from menu
  const handleEdit = () => {
    const campaign = campaigns.find(c => c._id === selectedCampaignId);
    if (campaign) {
      onEditCampaign(campaign);
    }
    handleCloseMenu();
  };

  return (
    <Paper sx={{ mt: 2, mb: 3 }}>
      <TableContainer>
        <Table aria-label="campaigns table">
          <TableHead>
            <TableRow>
              <TableCell>Campaign</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !campaigns.length ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography>No campaigns found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        alt={campaign.title}
                        src={campaign.mainImage ? 
                          (campaign.mainImage.startsWith('http') ? campaign.mainImage : `/uploads/${campaign.mainImage}`)
                          : '/static/campaign-placeholder.jpg'
                        }
                        variant="rounded"
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {campaign.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {campaign.shortDescription?.substring(0, 60) || 'No description'}
                          {campaign.shortDescription?.length > 60 ? '...' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{campaign.category}</TableCell>
                  <TableCell>{formatDate(campaign.startDate)}</TableCell>
                  <TableCell>{formatDate(campaign.endDate)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(campaign.currentAmount, campaign.targetAmount)} 
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount))}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      ${campaign.currentAmount?.toFixed(2) || '0'} of ${campaign.targetAmount?.toFixed(2) || '0'}
                    </Typography>
                  </TableCell>
                  <TableCell>{renderStatusChip(campaign.status)}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        color="primary"
                        onClick={() => onViewCampaign(campaign)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Campaign">
                      <IconButton 
                        size="small"
                        color="secondary"
                        onClick={() => onEditCampaign(campaign)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleOpenMenu(e, campaign._id)}
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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Campaign</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('active')}>
          <ListItemIcon>
            <ActivateIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Set as Active</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>
          <ListItemIcon>
            <CompleteIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Mark as Completed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('draft')}>
          <ListItemIcon>
            <DraftIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to Draft</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default CampaignList;
