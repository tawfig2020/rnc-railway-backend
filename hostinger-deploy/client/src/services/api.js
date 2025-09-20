/**
 * API Service Configuration
 * This file centralizes API configurations for the RNC Malaysia application
 * Enhanced with refresh token support for improved security
 */

import axios from 'axios';
import { refreshTokens } from './authService';

// Determine the base URL for API requests based on environment
let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  // Development environment - connect to local backend
  baseURL = 'http://localhost:5000/api';
} else {
  // Production environment - connect to deployed backend
  baseURL = process.env.REACT_APP_API_URL || 'https://rncplatform.onrender.com/api';
}

// Create axios instance with default config
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration - attempt to refresh token
    if (
      error.response && 
      error.response.status === 401 && 
      error.response.data && 
      error.response.data.code === 'TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await refreshTokens();
        
        // Update the token in the failed request and retry
        originalRequest.headers['x-auth-token'] = newToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other 401 errors (not token expiration)
    if (error.response && error.response.status === 401 && (!error.response.data || error.response.data.code !== 'TOKEN_EXPIRED')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
