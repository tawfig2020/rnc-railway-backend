# Security Enhancements for RNC Malaysia Application

## JWT Security Improvements

We've implemented the following security enhancements to improve the JWT authentication system:

### 1. Shorter-Lived Access Tokens
- Reduced JWT token expiration from 30 days to 1 hour
- Improves security by limiting the window of opportunity for token misuse
- Configured in `config/config.js`

### 2. Refresh Token Implementation
- Added a new `RefreshToken` model to store and manage refresh tokens
- Refresh tokens have a longer lifespan (7 days) but are securely stored in the database
- Each refresh token is linked to a specific user and can be revoked
- Implemented token rotation - each use of a refresh token invalidates it and issues a new one

### 3. Enhanced Token Payload
- Access tokens now include additional user information (role, email)
- Makes authorization checks more efficient
- Improves security by allowing more specific claims

### 4. Token Refresh Mechanism
- New endpoint: `/api/refresh-token` for obtaining new access tokens
- New endpoint: `/api/refresh-token/revoke` for logging out and revoking tokens
- Frontend automatically refreshes tokens when they expire

### 5. Improved Error Handling
- Better error messages for token-related issues
- Specific error code for expired tokens to trigger automatic refresh

## Rate Limiting

Added rate limiting to protect against brute force attacks and DoS attempts:

### 1. Standard Rate Limiting
- Applied to all API routes
- Limits each IP to 100 requests per 15-minute window
- Configured in `config/config.js`

### 2. Strict Authentication Rate Limiting
- Applied specifically to authentication endpoints (login, register, token refresh)
- Limits each IP to 10 requests per 15-minute window
- Prevents brute force password guessing

## Frontend Updates

The frontend has been updated to work with the new authentication system:

### 1. Token Management
- Stores both access and refresh tokens in localStorage
- Automatically refreshes expired access tokens
- Handles token rotation

### 2. Authentication Service
- New `authService.js` centralizes authentication logic
- Provides login, logout, and token refresh functionality
- Maintains user session state

### 3. API Service
- Updated to use the new token format
- Automatically handles token expiration and refresh
- Redirects to login when authentication fails

## How to Test

1. **Login Flow**:
   - Login with valid credentials
   - Check that both access token and refresh token are stored in localStorage
   - Access protected routes

2. **Token Expiration**:
   - Manually expire an access token (edit localStorage)
   - Attempt to access a protected route
   - Verify automatic token refresh occurs

3. **Rate Limiting**:
   - Make multiple rapid requests to login endpoint
   - Verify rate limiting kicks in after 10 attempts

## Security Best Practices

- Never store sensitive information in client-side storage
- Always use HTTPS in production
- Implement proper CORS configuration
- Regularly rotate and revoke unused refresh tokens
- Consider implementing additional security measures like IP binding for refresh tokens
