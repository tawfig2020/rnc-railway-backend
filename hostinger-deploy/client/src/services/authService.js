/**
 * Authentication Service
 * Handles token management, refresh, and authentication state
 */

import axios from 'axios';

// Set base URL based on environment
// With proxy configuration, we can use relative URLs in development
const baseURL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://rncplatform.onrender.com/api'
  : '/api'; // Use proxy in development

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue of callbacks to execute after token refresh
let refreshSubscribers = [];

/**
 * Subscribe callback to be executed after token refresh
 * @param {Function} callback - Function to execute after token refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Execute all callbacks with the new token
 * @param {String} token - New access token
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh access token using refresh token
 * @returns {Promise} Promise with new tokens or error
 */
export const refreshTokens = async () => {
  // Prevent multiple simultaneous refresh requests
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    isRefreshing = false;
    return Promise.reject(new Error('No refresh token available'));
  }

  try {
    const response = await axios.post(`${baseURL}/refresh-token`, { refreshToken });
    
    const { accessToken, refreshToken: newRefreshToken, user } = response.data;
    
    // Store new tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Execute callbacks with new token
    onTokenRefreshed(accessToken);
    isRefreshing = false;
    
    return accessToken;
  } catch (error) {
    isRefreshing = false;
    
    // Clear auth data on refresh failure
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
    
    return Promise.reject(error);
  }
};

/**
 * Login user and store tokens
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Promise} Promise with user data or error
 */
/**
 * Register user and store tokens
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with user data or error
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, userData);
    
    // Handle different response structures
    let accessToken, refreshToken, user, message;
    
    if (response.data.success) {
      // New structure: { success: true, accessToken, refreshToken, user }
      accessToken = response.data.accessToken;
      refreshToken = response.data.refreshToken;
      user = response.data.user;
      message = response.data.message;
    } else if (response.data.token) {
      // Legacy structure: { token, user }
      accessToken = response.data.token;
      refreshToken = response.data.refreshToken;
      user = response.data.user;
      message = response.data.message;
    } else {
      // Registration successful but no token (email verification required)
      message = response.data.message || 'Registration successful. Please check your email for verification.';
      return { success: true, message, requiresVerification: true };
    }
    
    // Store tokens and user data if provided
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return { success: true, user, message, requiresVerification: !accessToken };
  } catch (error) {
    console.error('Registration error:', error);
    return Promise.reject(error);
  }
};

/**
 * Login user and store tokens
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Promise} Promise with user data or error
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    // Handle different response structures
    let accessToken, refreshToken, user;
    
    if (response.data.success) {
      // New structure: { success: true, accessToken, refreshToken, user }
      accessToken = response.data.accessToken;
      refreshToken = response.data.refreshToken;
      user = response.data.user;
    } else if (response.data.token) {
      // Legacy structure: { token, user }
      accessToken = response.data.token;
      refreshToken = response.data.refreshToken;
      user = response.data.user;
    } else {
      throw new Error('Invalid response structure from login API');
    }
    
    // Store tokens and user data
    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Logout user and clear tokens
 * @returns {Promise} Promise with success or error
 */
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      // Revoke refresh token on server
      await axios.post(`${baseURL}/refresh-token/revoke`, { refreshToken });
    }
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    // Still clear local storage even if server request fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return { success: true, error };
  }
};

/**
 * Check if user is authenticated
 * @returns {Boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user data
 * @returns {Object|null} User data or null if not authenticated
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get user role
 * @returns {String|null} User role or null if not authenticated
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export default {
  login,
  logout,
  refreshTokens,
  isAuthenticated,
  getCurrentUser,
  getUserRole
};
