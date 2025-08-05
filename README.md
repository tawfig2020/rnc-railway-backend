# Refugee Network Centre

A comprehensive platform designed to support refugees in their education, health, social connections, and career development.

## Features

- User Authentication (Refugees, Volunteers, Staff, Admin)
- Comprehensive Refugee Profiles
- Health Records Management
- Support Request Tracking
- Education Resources and Courses
- Career Development Tools
- Social Networking
- Resource Directory
- Event Management

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT with role-based access control
- **Styling**: Tailwind CSS
- **File Storage**: Cloudinary (configured)
- **Email**: Nodemailer (configured)

## Database Models

- **User**: Authentication and basic user information
- **Profile**: Detailed refugee information including education, work history, family
- **HealthRecord**: Medical history, medications, and health-related information
- **Support**: Support request tracking system
- **BlogPost**: News and announcements
- **Course**: Educational materials and learning resources
- **Event**: Community events and activities
- **Resource**: General resources directory

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Environment Setup

1. Create a `.env` file in the root directory based on the `.env.example` template:

```env
NODE_ENV=development

# MongoDB URIs
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/refugee-network
MONGO_URI_TEST=mongodb+srv://username:password@cluster.mongodb.net/refugee-network-test
MONGO_URI_DEV=mongodb+srv://username:password@cluster.mongodb.net/refugee-network-dev

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@refugeenetwork.org
FROM_NAME=Refugee Network Centre
```

### Installation

1. Install server dependencies:

   ```bash
   npm install
   ```

2. Install client dependencies:

   ```bash
   cd client && npm install
   ```

### Database Seeding

To populate your database with sample data for testing:

```bash
# Import all data
node seeder.js -i

# Delete all data
node seeder.js -d
```

### Running the Application

1. Start development server (backend and frontend concurrently):

   ```bash
   npm run dev
   ```

2. Backend only:

   ```bash
   npm run server
   ```

3. Frontend only:

   ```bash
   npm run client
   ```

4. Access the application at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

```text
POST /api/auth/register - Register a new user
POST /api/auth/login - Login and get JWT token
GET /api/auth/me - Get current user profile (requires auth)
PUT /api/auth/update - Update user profile (requires auth)
PUT /api/auth/change-password - Change password (requires auth)
```

### Profile Endpoints

```text
GET /api/profiles - Get all profiles (requires admin/staff)
GET /api/profiles/me - Get current user's profile
GET /api/profiles/user/:user_id - Get profile by user ID
POST /api/profiles - Create or update user profile
DELETE /api/profiles - Delete user profile
```

### Health Record Endpoints

```text
GET /api/health - Get all health records (requires admin/staff)
GET /api/health/me - Get current user's health record
GET /api/health/:id - Get health record by ID
POST /api/health - Create or update health record
PUT /api/health/medications - Add medication to health record
DELETE /api/health/:id - Delete health record
```

### Support Request Endpoints

```text
GET /api/support - Get all support requests (with role-based filtering)
GET /api/support/user/:user_id - Get support requests by user ID
GET /api/support/assigned - Get support requests assigned to current user
GET /api/support/:id - Get support request by ID
POST /api/support - Create a new support request
PUT /api/support/:id - Update a support request
PUT /api/support/:id/feedback - Add feedback to a support request
DELETE /api/support/:id - Delete a support request
```

## Authentication and Authorization

The application implements JWT-based authentication with role-based access control:

- **auth.js**: Base authentication middleware that verifies JWT tokens
- **adminAuth.js**: Restricts routes to admin users only
- **staffAuth.js**: Restricts routes to staff and admin users
- **volunteerAuth.js**: Restricts routes to volunteers, staff, and admin users

To use role-based protection, chain the middleware in your route definitions:

```javascript
router.get('/admin-only', auth, adminAuth, (req, res) => {
  // Only admin users can access
});
```

## Error Handling

The application uses a centralized error handling middleware that properly formats:

- Mongoose validation errors
- Duplicate key errors
- Cast errors (invalid IDs)
- JWT authentication errors
- General server errors

HTTP status codes are properly set for each type of error.
