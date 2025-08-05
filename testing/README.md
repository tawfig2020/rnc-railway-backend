# RNC Platform Testing Suite

A comprehensive testing framework for the Refugee Network Centre (RNC) platform, covering unit tests, integration tests, end-to-end tests, and cross-browser compatibility testing.

## 🚀 Quick Start

### Prerequisites

1. **Servers Running**: Ensure both frontend and backend servers are running:
   ```bash
   # Terminal 1: Backend server
   cd /path/to/rnc-project
   npm start  # Should run on port 5000
   
   # Terminal 2: Frontend server  
   cd /path/to/rnc-project/client
   npm start  # Should run on port 3000
   ```

2. **Dependencies**: Install testing dependencies:
   ```bash
   cd testing
   npm install
   ```

### Running Tests

```bash
# Run all tests (comprehensive suite)
npm run test:all

# Quick test run (skips time-intensive tests)
npm run test:quick

# CI/CD friendly (skips browser-dependent tests)
npm run test:ci

# Individual test suites
npm run test:unit           # React component unit tests
npm run test:integration    # API integration tests
npm run test:e2e           # End-to-end user flow tests
npm run test:cross-browser # Cross-browser compatibility tests
```

## 📋 Test Coverage

### 1. Unit Tests (`test:unit`)
- **Location**: `client/src/**/__tests__/`
- **Framework**: Jest + React Testing Library
- **Coverage**: React components, utilities, services
- **Features**:
  - Component rendering tests
  - User interaction testing
  - Form validation testing
  - Accessibility testing
  - Mock API responses

**Example Components Tested**:
- `Navbar.test.js` - Navigation functionality
- `Register.test.js` - User registration flow
- `Donate.test.js` - Donation form and payment integration

### 2. Integration Tests (`test:integration`)
- **Location**: `testing/`
- **Framework**: Custom Node.js test runner
- **Coverage**: API endpoints, database operations, authentication
- **Features**:
  - API endpoint testing
  - Authentication flow testing
  - Database CRUD operations
  - Error handling validation

### 3. End-to-End Tests (`test:e2e`)
- **Location**: `testing/e2e-integration-tests.js`
- **Framework**: Puppeteer
- **Coverage**: Complete user workflows
- **Features**:
  - User registration and login
  - Donation flow testing
  - Marketplace purchase flow
  - Volunteer application process
  - Form validation testing
  - Navigation testing

### 4. Cross-Browser Tests (`test:cross-browser`)
- **Location**: `testing/cross-browser-tests.js`
- **Framework**: Puppeteer with multiple browser configs
- **Coverage**: Browser compatibility across devices
- **Features**:
  - Desktop browsers (Chrome, Firefox, Safari)
  - Mobile device simulation
  - Tablet device simulation
  - Responsive design testing
  - Performance testing
  - Accessibility validation

## 🛠️ Test Configuration

### Jest Configuration
- **File**: `testing/jest.config.js`
- **Features**:
  - Module path mapping
  - Coverage thresholds (70% minimum)
  - Custom test environment setup
  - Mock configurations

### Test Setup
- **Global Setup**: `testing/global-setup.js`
- **Test Setup**: `testing/test-setup.js`
- **Global Teardown**: `testing/global-teardown.js`

### Babel Configuration
- **File**: `testing/babel.config.js`
- **Purpose**: Transpile JSX and modern JavaScript for tests

## 📊 Test Reports

### Coverage Reports
- **Location**: `testing/coverage/`
- **Formats**: HTML, LCOV, JSON, Text
- **Thresholds**: 70% minimum for branches, functions, lines, statements

### Cross-Browser Reports
- **Location**: `testing/reports/`
- **Format**: JSON with detailed browser compatibility results
- **Screenshots**: `testing/screenshots/cross-browser/`

### Comprehensive Reports
- **Location**: `testing/reports/comprehensive-test-report-*.json`
- **Content**: Complete test suite results with timing and status

## 🎯 Key Test Scenarios

### User Registration Flow
1. Form validation (empty fields, invalid email, weak password)
2. Password confirmation matching
3. Successful registration with API call
4. Error handling for existing users
5. Loading states and user feedback

### Donation Flow
1. Amount selection (predefined and custom)
2. Donor information collection
3. Payment method selection (Stripe/PayPal)
4. Payment form validation
5. Success/error handling
6. Receipt generation

### Marketplace Purchase Flow
1. Product browsing and selection
2. Add to cart functionality
3. Cart management
4. Checkout process
5. Shipping information
6. Payment processing

### Admin Functionality
1. Admin login with correct credentials
2. Marketplace management (categories, products, discounts)
3. User management
4. Analytics and reporting

## 🌐 Cross-Browser Support

### Desktop Browsers
- **Chrome**: Latest version, 1920x1080
- **Firefox**: Latest version, 1920x1080
- **Safari**: Latest version, 1440x900

### Mobile Devices
- **iPhone**: 375x667 viewport
- **Android**: Various viewport sizes

### Tablet Devices
- **iPad**: 768x1024 viewport

## 🔧 Troubleshooting

### Common Issues

1. **Servers Not Running**
   ```
   Error: Cannot connect to http://localhost:3000 or http://localhost:5000
   Solution: Ensure both frontend and backend servers are running
   ```

2. **Port Conflicts**
   ```
   Error: Port already in use
   Solution: Check if other applications are using ports 3000 or 5000
   ```

3. **Test Timeouts**
   ```
   Error: Test timeout exceeded
   Solution: Increase timeout in jest.config.js or check for infinite loops
   ```

4. **Puppeteer Issues**
   ```
   Error: Could not find browser
   Solution: npm install puppeteer --force
   ```

### Debug Mode

Run tests with additional logging:
```bash
# Enable verbose output
DEBUG=true npm run test:all

# Run with browser visible (for E2E tests)
HEADLESS=false npm run test:e2e
```

## 📈 Performance Testing

### Metrics Tracked
- Page load times
- API response times
- Bundle size analysis
- Memory usage
- Network requests

### Performance Thresholds
- Page load: < 3 seconds
- API response: < 1 second
- First Contentful Paint: < 2 seconds

## 🔒 Security Testing

### Basic Security Checks
- HTTPS enforcement (production)
- Security headers validation
- Sensitive file exposure prevention
- Input validation and sanitization
- SQL injection protection

## 📝 Writing New Tests

### Unit Test Example
```javascript
// client/src/components/__tests__/MyComponent.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import MyComponent from '../MyComponent';

const Wrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />, { wrapper: Wrapper });
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Test Example
```javascript
// testing/my-integration-test.js
const axios = require('axios');

describe('My API Integration', () => {
  test('should handle API request', async () => {
    const response = await axios.get('http://localhost:5000/api/endpoint');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('expectedField');
  });
});
```

## 🚀 Continuous Integration

### GitHub Actions Example
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:ci
```

## 📞 Support

For issues with the testing suite:
1. Check the troubleshooting section above
2. Review test logs in `testing/reports/`
3. Ensure all dependencies are installed
4. Verify server configurations match the memory notes

## 🔄 Maintenance

### Regular Tasks
- Update test dependencies monthly
- Review and update test coverage thresholds
- Add tests for new features
- Update browser compatibility matrix
- Review and clean up old test reports

### Test Data Management
- Use factories for consistent test data
- Clean up test data after each run
- Avoid hardcoded test values
- Use environment-specific configurations
