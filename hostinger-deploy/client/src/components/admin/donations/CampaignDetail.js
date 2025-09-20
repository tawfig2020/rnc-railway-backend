import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Button, Chip, Divider, 
  Tabs, Tab, Card, CardContent, CardMedia, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, CircularProgress,
  LinearProgress, Alert, Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  PlayArrow as ActivateIcon,
  Flag as CompleteIcon,
  PauseCircle as DraftIcon,
  AddCircleOutline as AddUpdateIcon,
  Check as ApproveIcon,
  Clear as RejectIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  AttachMoney as DonationIcon,
  Comment as CommentIcon,
  DateRange as DateIcon,
  BarChart as ProgressIcon
} from '@mui/icons-material';

// Campaign detail component for CampaignManagement
const CampaignDetail = ({ 
  campaign, 
  onBack, 
  onEdit,
  onStatusUpdate,
  onAddUpdate,
  onModerateComment,
  loading 
}) => {
  // State variables
  const [tabValue, setTabValue] = useState(0);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format datetime for updates and comments
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        variant="outlined"
      />
    );
  };
  
  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    if (!current || !target) return 0;
    const percentage = (current / target) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Open status dialog
  const handleOpenStatusDialog = () => {
    setNewStatus(campaign.status);
    setStatusDialogOpen(true);
  };
  
  // Handle status update
  const handleUpdateStatus = () => {
    onStatusUpdate(campaign._id, newStatus);
    setStatusDialogOpen(false);
  };
  
  // Open update dialog
  const handleOpenUpdateDialog = () => {
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateDialogOpen(true);
  };
  
  // Handle add update
  const handleAddUpdate = () => {
    if (!updateTitle.trim() || !updateContent.trim()) return;
    
    onAddUpdate(campaign._id, {
      title: updateTitle,
      content: updateContent
    });
    setUpdateDialogOpen(false);
  };
  
  // Open image dialog
  const handleOpenImage = (imagePath) => {
    setSelectedImage(imagePath);
    setImageDialogOpen(true);
  };
  
  // Handle comment moderation
  const handleCommentAction = (commentId, action) => {
    onModerateComment(campaign._id, commentId, action);
  };

  return (
    <>
      {/* Back button and header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button 
          startIcon={<BackIcon />} 
          onClick={onBack}
          variant="outlined"
        >
          Back to Campaigns
        </Button>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onEdit}
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit Campaign
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenStatusDialog}
          >
            Change Status
          </Button>
        </Box>
      </Box>

      {/* Campaign Header Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Left side with title and description */}
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h5" component="h2" sx={{ mr: 2 }}>
                {campaign.title}
              </Typography>
              {renderStatusChip(campaign.status)}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created on {formatDate(campaign.createdAt)} | Updated on {formatDate(campaign.updatedAt)}
            </Typography>
            
            <Typography variant="body1" paragraph mt={2}>
              {campaign.shortDescription}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" mt={2}>
              <Chip 
                label={`Category: ${campaign.category}`} 
                variant="outlined" 
                sx={{ mr: 1, mb: 1 }} 
              />
              <Chip 
                icon={<DateIcon />}
                label={`Start: ${formatDate(campaign.startDate)}`}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                icon={<DateIcon />}
                label={`End: ${formatDate(campaign.endDate)}`}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
              {campaign.tags && campaign.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }} 
                />
              ))}
            </Box>
          </Grid>
          
          {/* Right side with funding progress */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Funding Progress
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(campaign.currentAmount, campaign.targetAmount)} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(calculateProgress(campaign.currentAmount, campaign.targetAmount))}%
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h5" gutterBottom align="center">
                  ${campaign.currentAmount?.toFixed(2) || '0'}
                  <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                    of ${campaign.targetAmount?.toFixed(2) || '0'}
                  </Typography>
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2">
                  <strong>Donations:</strong> {campaign.donationsCount || 0}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Avg. Donation:</strong> ${campaign.averageDonation ? campaign.averageDonation.toFixed(2) : '0.00'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Days Remaining:</strong> {campaign.daysRemaining || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Campaign Tabs */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="campaign tabs">
            <Tab label="Details" id="tab-0" />
            <Tab label="Updates" id="tab-1" />
            <Tab label="Comments" id="tab-2" />
            <Tab label="Donations" id="tab-3" />
            <Tab label="Media" id="tab-4" />
          </Tabs>
        </Box>
        
        {/* Details Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Full Description
              </Typography>
              <Typography variant="body1" paragraph>
                {campaign.description || 'No detailed description provided.'}
              </Typography>
              
              {campaign.location && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {campaign.location}
                  </Typography>
                </>
              )}
              
              {campaign.beneficiary && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Beneficiary
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {campaign.beneficiary}
                  </Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <ProgressIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Campaign Timeline
                </Typography>
              </Box>
              
              <List>
                {campaign.createdAt && (
                  <ListItem>
                    <ListItemText 
                      primary="Campaign Created" 
                      secondary={formatDate(campaign.createdAt)} 
                    />
                  </ListItem>
                )}
                {campaign.startDate && (
                  <ListItem>
                    <ListItemText 
                      primary="Campaign Start" 
                      secondary={formatDate(campaign.startDate)} 
                    />
                  </ListItem>
                )}
                {campaign.endDate && (
                  <ListItem>
                    <ListItemText 
                      primary="Campaign End" 
                      secondary={formatDate(campaign.endDate)} 
                    />
                  </ListItem>
                )}
              </List>
              
              {campaign.statusHistory && campaign.statusHistory.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom mt={2}>
                    Status Changes
                  </Typography>
                  <List dense>
                    {campaign.statusHistory.slice().reverse().map((statusChange, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`Changed to ${statusChange.status}`}
                          secondary={formatDateTime(statusChange.date)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Updates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Campaign Updates
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddUpdateIcon />}
              onClick={handleOpenUpdateDialog}
            >
              Add Update
            </Button>
          </Box>
          
          {campaign.updates && campaign.updates.length > 0 ? (
            campaign.updates.slice().reverse().map((update, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {update.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Posted on {formatDateTime(update.date)}
                </Typography>
                <Typography variant="body1" paragraph>
                  {update.content}
                </Typography>
                {update.image && (
                  <Box mt={2}>
                    <img 
                      src={update.image.startsWith('http') ? update.image : `/uploads/${update.image}`}
                      alt={update.title}
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleOpenImage(update.image)}
                    />
                  </Box>
                )}
              </Paper>
            ))
          ) : (
            <Alert severity="info">No updates have been posted for this campaign yet.</Alert>
          )}
        </TabPanel>
        
        {/* Comments Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Comments ({campaign.comments?.length || 0})
          </Typography>
          
          {campaign.comments && campaign.comments.length > 0 ? (
            <List>
              {campaign.comments.slice().reverse().map((comment, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>
                        {comment.user ? comment.user.name.charAt(0).toUpperCase() : 
                         comment.name ? comment.name.charAt(0).toUpperCase() : 'A'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {comment.user ? comment.user.name : comment.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(comment.date)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {comment.approved ? (
                        <Chip label="Approved" color="success" size="small" />
                      ) : (
                        <Chip label="Pending" color="warning" size="small" />
                      )}
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" paragraph mt={2}>
                    {comment.content}
                  </Typography>
                  
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    {!comment.approved && (
                      <Tooltip title="Approve">
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleCommentAction(comment._id, 'approve')}
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {comment.approved && (
                      <Tooltip title="Unapprove">
                        <IconButton 
                          size="small" 
                          color="warning"
                          onClick={() => handleCommentAction(comment._id, 'reject')}
                        >
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleCommentAction(comment._id, 'delete')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </List>
          ) : (
            <Alert severity="info">No comments have been posted for this campaign yet.</Alert>
          )}
        </TabPanel>
        
        {/* Donations Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Recent Donations
          </Typography>
          
          {campaign.recentDonations && campaign.recentDonations.length > 0 ? (
            <List>
              {campaign.recentDonations.map((donation, index) => (
                <ListItem key={index} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <DonationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="body1">
                        ${donation.amount.toFixed(2)} by {donation.anonymous ? 'Anonymous' : donation.donor?.name || donation.name || 'Anonymous'}
                      </Typography>
                    }
                    secondary={
                      <>
                        {formatDateTime(donation.date)}
                        {donation.message && (
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            "{donation.message}"
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">No donations have been made to this campaign yet.</Alert>
          )}
        </TabPanel>
        
        {/* Media Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Campaign Media
          </Typography>
          
          <Grid container spacing={2}>
            {/* Main Image */}
            {campaign.mainImage && (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={campaign.mainImage.startsWith('http') ? campaign.mainImage : `/uploads/${campaign.mainImage}`}
                    alt="Main Campaign Image"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenImage(campaign.mainImage)}
                  />
                  <CardContent>
                    <Typography variant="body2">Main Campaign Image</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {/* Logo */}
            {campaign.logo && (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={campaign.logo.startsWith('http') ? campaign.logo : `/uploads/${campaign.logo}`}
                    alt="Campaign Logo"
                    sx={{ cursor: 'pointer', objectFit: 'contain' }}
                    onClick={() => handleOpenImage(campaign.logo)}
                  />
                  <CardContent>
                    <Typography variant="body2">Campaign Logo</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {/* Additional Images */}
            {campaign.additionalImages && campaign.additionalImages.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.startsWith('http') ? image : `/uploads/${image}`}
                    alt={`Campaign Image ${index + 1}`}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenImage(image)}
                  />
                  <CardContent>
                    <Typography variant="body2">Additional Image {index + 1}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {!campaign.mainImage && !campaign.logo && (!campaign.additionalImages || campaign.additionalImages.length === 0) && (
              <Grid item xs={12}>
                <Alert severity="info" icon={<ImageIcon />}>
                  No media has been uploaded for this campaign.
                </Alert>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Box>
      
      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Campaign Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Current Status: {renderStatusChip(campaign.status)}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Draft:</strong> Campaign is not visible to the public and can be edited.
            </Typography>
            <Typography variant="body2">
              <strong>Active:</strong> Campaign is live and accepting donations.
            </Typography>
            <Typography variant="body2">
              <strong>Completed:</strong> Campaign has ended and no longer accepts donations.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Update Dialog */}
      <Dialog 
        open={updateDialogOpen} 
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Campaign Update</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Update Title"
            fullWidth
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            required
          />
          
          <TextField
            margin="normal"
            label="Update Content"
            fullWidth
            multiline
            rows={6}
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
            required
          />
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Updates will be visible to all campaign visitors and donors.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUpdate}
            variant="contained"
            color="primary"
            disabled={loading || !updateTitle.trim() || !updateContent.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Post Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Image Dialog */}
      <Dialog 
        open={imageDialogOpen} 
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <img 
            src={selectedImage.startsWith('http') ? selectedImage : `/uploads/${selectedImage}`} 
            alt="Campaign Media"
            style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// TabPanel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default CampaignDetail;
