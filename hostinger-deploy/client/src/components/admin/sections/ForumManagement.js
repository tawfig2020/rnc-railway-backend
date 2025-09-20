import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, IconButton, Snackbar, Alert,
  Tabs, Tab, Divider, Grid, Card, CardContent
} from '@mui/material';
import { 
  Delete, Edit, Check, Block, Info,
  QuestionAnswer, Forum as ForumIcon, Flag,
  FilterList, Search
} from '@mui/icons-material';

const ForumManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch questions on component mount
  useEffect(() => {
    // Simulated fetch - in a real app, this would be an API call
    const fetchQuestions = async () => {
      try {
        // Mocked data for demonstration
        const mockQuestions = [
          {
            id: 1,
            title: "How do I access free health services in Jordan as a refugee?",
            body: "I recently arrived in Jordan with my family and we need to access healthcare services. Are there free clinics or hospitals available for refugees? What documentation do we need to bring?",
            author: "Ahmed K.",
            authorId: "user123",
            date: "2025-07-06T14:30:00",
            category: "life",
            status: "active",
            flags: 0,
            answersCount: 3
          },
          {
            id: 2,
            title: "What is the best app to learn English in Pashto or Arabic?",
            body: "I want to improve my English skills but need an app that offers instructions in either Pashto or Arabic. Which apps have you found most helpful? Preferably free or low-cost options.",
            author: "Fatima S.",
            authorId: "user456",
            date: "2025-07-06T11:45:00",
            category: "digital",
            status: "active",
            flags: 1,
            answersCount: 7
          },
          {
            id: 3,
            title: "Where can I find cheap electronics?",
            body: "Looking for cheap electronics and gadgets. Any recommendations?",
            author: "Omar J.",
            authorId: "user789",
            date: "2025-07-05T09:15:00",
            category: "digital",
            status: "removed",
            flags: 4,
            answersCount: 2
          },
          {
            id: 4,
            title: "How to get my previous education credentials recognized?",
            body: "I have a degree in Engineering from my home country, but I'm having trouble getting it recognized here. Has anyone gone through this process successfully? What steps should I take?",
            author: "Sara N.",
            authorId: "user101",
            date: "2025-07-04T16:20:00",
            category: "mentorship",
            status: "active",
            flags: 0,
            answersCount: 8
          }
        ];

        setQuestions(mockQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedItem(null);
  };

  // Handle delete action
  const handleDelete = () => {
    if (selectedItem) {
      // In a real app, this would be an API call
      // For now, we'll just update the state
      const updatedQuestions = questions.map(q => 
        q.id === selectedItem.id ? {...q, status: 'removed'} : q
      );
      
      setQuestions(updatedQuestions);
      setNotification({
        open: true,
        message: `Question "${selectedItem.title}" has been removed successfully`,
        severity: 'success'
      });
      handleCloseDeleteDialog();
    }
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  // Filter questions based on active tab
  const getFilteredQuestions = () => {
    if (tabValue === 0) return questions; // All questions
    if (tabValue === 1) return questions.filter(q => q.status === 'active'); // Active questions
    if (tabValue === 2) return questions.filter(q => q.status === 'removed'); // Removed questions
    if (tabValue === 3) return questions.filter(q => q.flags > 0); // Flagged questions
    return questions;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Forum Management</Typography>
      
      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Questions', count: questions.length, icon: <QuestionAnswer color="primary" />, color: 'primary.light' },
          { title: 'Active Questions', count: questions.filter(q => q.status === 'active').length, icon: <Check color="success" />, color: 'success.light' },
          { title: 'Removed Questions', count: questions.filter(q => q.status === 'removed').length, icon: <Block color="error" />, color: 'error.light' },
          { title: 'Flagged Content', count: questions.filter(q => q.flags > 0).length, icon: <Flag color="warning" />, color: 'warning.light' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: stat.color, color: 'white' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4">{stat.count}</Typography>
                  <Typography variant="body2">{stat.title}</Typography>
                </Box>
                <Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Forum Guidelines */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Info sx={{ mr: 1 }} color="primary" /> Forum Management Guidelines
        </Typography>
        <Typography variant="body2" paragraph>
          As a forum administrator, you are responsible for ensuring that the discussion environment remains respectful, supportive, and relevant to the RNC community.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">When to Remove Content:</Typography>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Hate speech or discriminatory content</li>
              <li>Spam or promotional material</li>
              <li>Content unrelated to refugee needs or concerns</li>
              <li>Personal attacks or harassment</li>
              <li>Sharing of sensitive personal information</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">When to Flag Content for Review:</Typography>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Potentially misleading information</li>
              <li>Borderline inappropriate content</li>
              <li>Content that may need factual verification</li>
              <li>Multiple user reports on the same content</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Best Practices:</Typography>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Always explain removal reasons when possible</li>
              <li>Address reported content within 24 hours</li>
              <li>Consider warnings before removing first-time violations</li>
              <li>Be consistent in applying community standards</li>
            </ul>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Questions" icon={<ForumIcon />} iconPosition="start" />
          <Tab label="Active" icon={<Check />} iconPosition="start" />
          <Tab label="Removed" icon={<Block />} iconPosition="start" />
          <Tab label="Flagged" icon={<Flag />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Questions table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Flags</TableCell>
              <TableCell align="center">Answers</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredQuestions().map((question) => (
              <TableRow key={question.id}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">{question.title}</Typography>
                </TableCell>
                <TableCell>{question.author}</TableCell>
                <TableCell>{formatDate(question.date)}</TableCell>
                <TableCell>
                  <Chip 
                    label={question.category} 
                    size="small" 
                    color={
                      question.category === 'legal' ? 'secondary' :
                      question.category === 'digital' ? 'primary' :
                      question.category === 'life' ? 'success' : 'info'
                    } 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={question.status} 
                    size="small" 
                    color={question.status === 'active' ? 'success' : 'error'} 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  {question.flags > 0 ? (
                    <Chip 
                      label={question.flags} 
                      size="small" 
                      color="warning" 
                    />
                  ) : (
                    '0'
                  )}
                </TableCell>
                <TableCell align="center">{question.answersCount}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    size="small" 
                    onClick={() => {
                      // View question details (in a real app this would navigate or open a modal)
                      window.open(`/forum/question/${question.id}`, '_blank');
                    }}
                  >
                    <Info fontSize="small" />
                  </IconButton>
                  {question.status === 'active' && (
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteClick(question)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                  {question.status === 'removed' && (
                    <IconButton 
                      color="success" 
                      size="small"
                      onClick={() => {
                        // Restore question
                        const updatedQuestions = questions.map(q => 
                          q.id === question.id ? {...q, status: 'active'} : q
                        );
                        
                        setQuestions(updatedQuestions);
                        setNotification({
                          open: true,
                          message: `Question "${question.title}" has been restored`,
                          severity: 'success'
                        });
                      }}
                    >
                      <Check fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {getFilteredQuestions().length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" sx={{ py: 3 }}>
                    No questions found matching the selected filter.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Remove Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the question &quot;{selectedItem?.title}&quot;? 
            This question will no longer be visible to users.
          </DialogContentText>
          <TextField
            
            margin="dense"
            label="Reason for removal (optional)"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForumManagement;
