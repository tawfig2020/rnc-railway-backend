import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Button, Chip, Divider,
  Card, CardContent, List, ListItem, ListItemText, Avatar,
  ListItemAvatar, Dialog, DialogTitle, DialogContent, 
  DialogActions, FormControl, InputLabel, Select, MenuItem, 
  TextField, CircularProgress, Alert, IconButton, Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Receipt as ReceiptIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  CheckCircle as CompleteIcon,
  PauseCircle as PendingIcon,
  Cancel as FailedIcon,
  Delete as DeleteIcon,
  EditNote as EditIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Campaign as CampaignIcon,
  EventNote as EventIcon,
  BusinessCenter as MethodIcon
} from '@mui/icons-material';

// DonationDetail component for viewing and managing individual donations
const DonationDetail = ({ 
  donation, 
  onBack, 
  onStatusUpdate,
  onDelete,
  onSendReceipt 
}) => {
  // State variables
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(donation.status);
  const [loading, setLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [adminNote, setAdminNote] = useState(donation.adminNotes || '');
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    let color;
    let icon;
    let label = status;
    
    switch (status) {
      case 'completed':
        color = 'success';
        icon = <CompleteIcon />;
        break;
      case 'pending':
        color = 'warning';
        icon = <PendingIcon />;
        break;
      case 'failed':
        color = 'error';
        icon = <FailedIcon />;
        break;
      default:
        color = 'default';
        icon = null;
    }
    
    return (
      <Chip 
        label={label} 
        color={color}
        variant="outlined"
        icon={icon}
      />
    );
  };
  
  // Get donor name (handle anonymous donations)
  const getDonorName = () => {
    if (donation.anonymous) return 'Anonymous';
    if (donation.donor && donation.donor.name) return donation.donor.name;
    return donation.name || 'Unknown';
  };
  
  // Handle status dialog open
  const handleOpenStatusDialog = () => {
    setNewStatus(donation.status);
    setStatusDialogOpen(true);
  };
  
  // Handle status update
  const handleUpdateStatus = async () => {
    setLoading(true);
    await onStatusUpdate(donation._id, newStatus);
    setStatusDialogOpen(false);
    setLoading(false);
  };
  
  // Handle delete dialog open
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  // Handle delete donation
  const handleDelete = async () => {
    setLoading(true);
    await onDelete(donation._id);
    setLoading(false);
  };
  
  // Handle email receipt dialog open
  const handleOpenEmailDialog = () => {
    setEmailMessage(`Dear ${getDonorName()},\n\nThank you for your generous donation of ${formatCurrency(donation.amount)} to ${donation.campaign ? donation.campaign.title : 'our organization'}.\n\nYour support is greatly appreciated and will help us to continue our important work.\n\nBest regards,\nRefugee Aid Network`);
    setEmailDialogOpen(true);
  };
  
  // Handle send receipt email
  const handleSendReceipt = async () => {
    setLoading(true);
    if (onSendReceipt) {
      await onSendReceipt(donation._id, emailMessage);
    }
    setEmailDialogOpen(false);
    setLoading(false);
  };
  
  // Handle print receipt
  const handlePrintReceipt = () => {
    // Open printable receipt in new window
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow pop-ups to print the receipt');
      return;
    }
    
    // Create receipt content
    printWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { max-width: 200px; margin-bottom: 20px; }
            .receipt-box { border: 1px solid #ccc; padding: 20px; margin-bottom: 30px; }
            .receipt-id { font-size: 14px; color: #666; margin-bottom: 20px; }
            .amount { font-size: 24px; font-weight: bold; margin: 20px 0; }
            .detail-row { display: flex; margin: 10px 0; }
            .detail-label { width: 140px; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Refugee Aid Network</h2>
            <p>Official Donation Receipt</p>
          </div>
          
          <div class="receipt-box">
            <div class="receipt-id">
              Receipt ID: ${donation._id || 'Unknown'}
            </div>
            
            <h3>Thank you for your donation!</h3>
            <div class="amount">${formatCurrency(donation.amount)}</div>
            
            <div class="detail-row">
              <div class="detail-label">Donor:</div>
              <div>${getDonorName()}</div>
            </div>
            
            ${donation.email ? `
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div>${donation.email}</div>
              </div>
            ` : ''}
            
            <div class="detail-row">
              <div class="detail-label">Date:</div>
              <div>${formatDate(donation.date)}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Campaign:</div>
              <div>${donation.campaign ? donation.campaign.title : 'General Donation'}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Payment Method:</div>
              <div>${donation.paymentMethod || 'Online Payment'}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Transaction ID:</div>
              <div>${donation.transactionId || 'N/A'}</div>
            </div>
            
            ${donation.recurringFrequency ? `
              <div class="detail-row">
                <div class="detail-label">Recurring:</div>
                <div>Yes - ${donation.recurringFrequency}</div>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Refugee Aid Network is a registered non-profit organization.</p>
            <p>This receipt can be used for tax purposes. Thank you for your support!</p>
          </div>
        </body>
      </html>
    `);
    
    // Print and close
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      // printWindow.close();
    }, 500);
  };
  
  // Handle note dialog open
  const handleOpenNoteDialog = () => {
    setAdminNote(donation.adminNotes || '');
    setNoteDialogOpen(true);
  };
  
  // Handle save note
  const handleSaveNote = async () => {
    setLoading(true);
    // Implementation would be added once backend endpoint exists
    // await onUpdateNote(donation._id, adminNote);
    setNoteDialogOpen(false);
    setLoading(false);
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
          Back to Donations
        </Button>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReceiptIcon />}
            onClick={handlePrintReceipt}
            sx={{ mr: 1 }}
          >
            Print Receipt
          </Button>
          
          {donation.email && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={handleOpenEmailDialog}
              sx={{ mr: 1 }}
            >
              Email Receipt
            </Button>
          )}
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenStatusDialog}
          >
            Update Status
          </Button>
        </Box>
      </Box>

      {/* Donation Overview Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h5" component="h2" sx={{ mr: 2 }}>
                Donation Details
              </Typography>
              {renderStatusChip(donation.status)}
            </Box>
            
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="h4" component="div" sx={{ mr: 2 }}>
                {formatCurrency(donation.amount)}
              </Typography>
              {donation.recurringFrequency && (
                <Chip 
                  label={`Recurring ${donation.recurringFrequency}`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" mt={1}>
              Transaction ID: {donation.transactionId || 'N/A'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Donation Date: {formatDate(donation.date)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Campaign Information
                </Typography>
                
                {donation.campaign ? (
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      alt={donation.campaign.title}
                      src={donation.campaign.mainImage ? 
                        (donation.campaign.mainImage.startsWith('http') ? donation.campaign.mainImage : `/uploads/${donation.campaign.mainImage}`)
                        : ''
                      }
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      <CampaignIcon />
                    </Avatar>
                    
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {donation.campaign.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {donation.campaign.shortDescription?.substring(0, 60) || ''}
                        {donation.campaign.shortDescription?.length > 60 ? '...' : ''}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body1">
                    General Donation (Not tied to a specific campaign)
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Donor Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h6" gutterBottom>
                Donor Information
              </Typography>
              <Tooltip title="Add Note">
                <IconButton size="small" color="primary" onClick={handleOpenNoteDialog}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Donor Name" 
                  secondary={getDonorName()} 
                />
              </ListItem>
              
              {donation.email && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={donation.email} 
                  />
                </ListItem>
              )}
              
              {donation.phone && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <CallIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Phone" 
                    secondary={donation.phone} 
                  />
                </ListItem>
              )}
              
              {donation.address && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <HomeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Address" 
                    secondary={donation.address} 
                  />
                </ListItem>
              )}
              
              {donation.anonymous && (
                <ListItem>
                  <ListItemText 
                    primary="Anonymous Donation" 
                    secondary="Donor requested to remain anonymous" 
                  />
                </ListItem>
              )}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Admin Notes
            </Typography>
            
            <Typography variant="body2" sx={{ fontStyle: donation.adminNotes ? 'normal' : 'italic' }}>
              {donation.adminNotes || 'No admin notes have been added for this donation.'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MoneyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Amount" 
                  secondary={formatCurrency(donation.amount)} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Date" 
                  secondary={formatDate(donation.date)} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MethodIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Payment Method" 
                  secondary={donation.paymentMethod || 'Online Payment'} 
                />
              </ListItem>
              
              {donation.transactionId && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ReceiptIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Transaction ID" 
                    secondary={donation.transactionId} 
                  />
                </ListItem>
              )}
              
              {donation.recurringFrequency && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <RepeatIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Recurring Donation" 
                    secondary={donation.recurringFrequency} 
                  />
                </ListItem>
              )}
            </List>
            
            {donation.donationMessage && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Donor Message
                </Typography>
                <Typography variant="body2" paragraph sx={{ fontStyle: 'italic' }}>
                  "{donation.donationMessage}"
                </Typography>
              </>
            )}
            
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteDialog}
              >
                Delete Donation
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Donation Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Current Status: {renderStatusChip(donation.status)}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Completed:</strong> Donation has been successfully processed and funds received.
            </Typography>
            <Typography variant="body2">
              <strong>Pending:</strong> Donation is being processed but has not been completed.
            </Typography>
            <Typography variant="body2">
              <strong>Failed:</strong> Donation processing failed or was rejected.
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
      
      {/* Delete Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Donation</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this donation record? This action cannot be undone.
          </Alert>
          <Typography variant="body1" gutterBottom>
            Donation Amount: <strong>{formatCurrency(donation.amount)}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Donor: <strong>{getDonorName()}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: <strong>{formatDate(donation.date)}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete Donation'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Email Receipt Dialog */}
      <Dialog 
        open={emailDialogOpen} 
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Email Receipt to Donor</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Recipient Email"
            fullWidth
            value={donation.email || ''}
            disabled
          />
          
          <TextField
            margin="normal"
            label="Message"
            fullWidth
            multiline
            rows={8}
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendReceipt}
            variant="contained"
            color="primary"
            disabled={loading || !donation.email}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Admin Note Dialog */}
      <Dialog 
        open={noteDialogOpen} 
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Admin Notes</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Admin Notes"
            fullWidth
            multiline
            rows={6}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add notes about this donation or donor for internal reference"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveNote}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Note'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DonationDetail;
