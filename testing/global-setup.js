/**
 * Global Setup for Jest Tests
 * Runs once before all tests
 */

const chalk = require('chalk');

module.exports = async () => {
  console.log(chalk.blue('\n🚀 Setting up test environment...'));
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.REACT_APP_API_URL = 'http://localhost:5000/api';
  process.env.REACT_APP_FRONTEND_URL = 'http://localhost:3000';
  
  // Suppress console warnings in tests
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress specific React warnings that are not relevant for tests
      if (
        message.includes('componentWillMount') ||
        message.includes('componentWillReceiveProps') ||
        message.includes('ReactDOM.render is deprecated') ||
        message.includes('Warning: React.createFactory')
      ) {
        return;
      }
    }
    originalWarn.apply(console, args);
  };
  
  // Global test timeout
  jest.setTimeout(30000);
  
  console.log(chalk.green('✅ Test environment setup complete'));
};
