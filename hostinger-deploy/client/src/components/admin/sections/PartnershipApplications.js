import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  Alert, TextField
} from '@mui/material';
import { Visibility, Delete, Email, Check, Clear } from '@mui/icons-material';

// Sample partnership application data
const SAMPLE_APPLICATIONS = [
  {
    id: 1,
    organizationName: "Global Education Initiative",
    contactName: "Robert Chen",
    email: "robert@globaledu.org",
    phone: "555-123-4567",
    dateApplied: "2025-05-15",
    status: "pending",
    partnershipType: "Educational",
    description: "Seeking to partner on educational programs for refugees",
    website: "https://www.globaledu.org"
  },
  {
    id: 2,
    organizationName: "TechForAll",
    contactName: "Samantha Lee",
    email: "sam@techforall.org",
    phone: "555-987-6543",
    dateApplied: "2025-05-28",
    status: "approved",
    partnershipType: "Technology",
    description: "Offering tech training programs and equipment donations",
    website: "https://www.techforall.org"
  },
  {
    id: 3,
    organizationName: "Community Health Partners",
    contactName: "Dr. James Wilson",
    email: "jwilson@chp.org",
    phone: "555-456-7890",
    dateApplied: "2025-06-05",
    status: "pending",
    partnershipType: "Healthcare",
    description: "Providing free health screenings and mental health support",
    website: "https://www.communityhealthpartners.org"
  },
  {
    id: 4,
    organizationName: "Legal Aid Society",
    contactName: "Maria Rodriguez",
    email: "mrodriguez@legalaid.org",
    phone: "555-222-3333",
    dateApplied: "2025-06-10",
    status: "rejected",
    partnershipType: "Legal Services",
    description: "Pro bono legal assistance for asylum seekers",
    website: "https://www.legalaidsociety.org"
  }
];

const PartnershipApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: ''
  });

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch applications from API
  const fetchApplications = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      setApplications(SAMPLE_APPLICATIONS);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch partnership applications');
      setLoading(false);
      console.error('Error fetching applications:', err);
    }
  };

  // Handle view application details
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  // Close view dialog
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedApplication(null);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (application) => {
    setApplicationToDelete(application);
    setConfirmDeleteOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDeleteOpen(false);
    setApplicationToDelete(null);
  };

  // Delete application
  const handleDeleteApplication = async () => {
    try {
      // In a real app, this would be an API call
      const updatedApplications = applications.filter(app => app.id !== applicationToDelete.id);
      setApplications(updatedApplications);
      setSuccessMessage('Application deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete application');
      console.error('Error deleting application:', err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Open email dialog
  const handleOpenEmailDialog = (application) => {
    setSelectedApplication(application);
    setEmailContent({
      subject: `Your Partnership Application with Refugee Network Centre`,
      message: `Dear ${application.contactName},\n\nThank you for your interest in partnering with the Refugee Network Centre.\n\n[Your message here]\n\nBest regards,\nThe RNC Team`
    });
    setEmailDialogOpen(true);
  };

  // Close email dialog
  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
    setSelectedApplication(null);
  };

  // Handle email content change
  const handleEmailContentChange = (e) => {
    const { name, value } = e.target;
    setEmailContent({
      ...emailContent,
      [name]: value
    });
  };

  // Send email
  const handleSendEmail = async () => {
    try {
      // In a real app, this would be an API call to send the email
      console.log('Sending email:', {
        to: selectedApplication.email,
        subject: emailContent.subject,
        message: emailContent.message
      });
      
      setSuccessMessage(`Email sent to ${selectedApplication.organizationName}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      handleCloseEmailDialog();
    } catch (err) {
      setError('Failed to send email');
      console.error('Error sending email:', err);
    }
  };

  // Update application status
  const handleUpdateStatus = async (application, newStatus) => {
    try {
      // In a real app, this would be an API call
      const updatedApplications = applications.map(app => 
        app.id === application.id ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);
      
      setSuccessMessage(`Application status updated to ${newStatus}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to update application status');
      console.error('Error updating status:', err);
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Partnership Applications</Typography>
      </Box>

      {/* Success message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Applications table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Organization</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Partnership Type</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading applications...</TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No applications found</TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.organizationName}</TableCell>
                  <TableCell>{application.contactName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={application.partnershipType}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{application.dateApplied}</TableCell>
                  <TableCell>
                    <Chip 
                      label={application.status}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewApplication(application)}
                      title="View Details"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenEmailDialog(application)}
                      title="Send Email"
                    >
                      <Email fontSize="small" />
                    </IconButton>
                    {application.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleUpdateStatus(application, 'approved')}
                          title="Approve"
                        >
                          <Check fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleUpdateStatus(application, 'rejected')}
                          title="Reject"
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(application)}
                      title="Delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Partnership Application Details
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Organization Information</Typography>
                <Typography><strong>Organization Name:</strong> {selectedApplication.organizationName}</Typography>
                <Typography><strong>Website:</strong> <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer">{selectedApplication.website}</a></Typography>
                <Typography><strong>Partnership Type:</strong> {selectedApplication.partnershipType}</Typography>
                <Typography><strong>Date Applied:</strong> {selectedApplication.dateApplied}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedApplication.status}
                    color={getStatusColor(selectedApplication.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Typography><strong>Contact Name:</strong> {selectedApplication.contactName}</Typography>
                <Typography><strong>Email:</strong> {selectedApplication.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedApplication.phone}</Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom>Partnership Description</Typography>
                <Typography>{selectedApplication.description}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          {selectedApplication && selectedApplication.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  handleUpdateStatus(selectedApplication, 'approved');
                  handleCloseViewDialog();
                }}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
              <Button 
                onClick={() => {
                  handleUpdateStatus(selectedApplication, 'rejected');
                  handleCloseViewDialog();
                }}
                color="error"
                variant="contained"
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the application from &quot;{applicationToDelete?.organizationName}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteApplication} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onClose={handleCloseEmailDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Send Email to {selectedApplication?.organizationName}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="subject"
            label="Subject"
            fullWidth
            variant="outlined"
            value={emailContent.subject}
            onChange={handleEmailContentChange}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="message"
            label="Message"
            fullWidth
            variant="outlined"
            value={emailContent.message}
            onChange={handleEmailContentChange}
            multiline
            rows={8}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained">
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnershipApplications;
