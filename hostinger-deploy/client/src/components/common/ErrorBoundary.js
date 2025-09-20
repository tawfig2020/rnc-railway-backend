import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Optional: Send error to a logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            m: 2, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: '#fff8f8',
            border: '1px solid #ffcdd2'
          }}
        >
          <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {this.props.fallbackMessage || "We're sorry, but there was an error loading this component."}
          </Typography>
          
          {this.props.showErrorDetails && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              textAlign: 'left',
              maxHeight: '200px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              <Typography variant="body2" component="pre">
                {this.state.error && this.state.error.toString()}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleReset}
              sx={{ mr: 2 }}
            >
              Try Again
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Box>
        </Paper>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
