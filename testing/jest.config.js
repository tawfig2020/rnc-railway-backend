/**
 * Jest Configuration for RNC Testing Suite
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  
  // Module paths
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/../client/src/$1',
    '^@components/(.*)$': '<rootDir>/../client/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/../client/src/pages/$1',
    '^@services/(.*)$': '<rootDir>/../client/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/../client/src/utils/$1',
  },
  
  // File extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Transform files
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
    '^.+\\.(png|jpg|jpeg|gif|svg)$': 'jest-transform-file'
  },
  
  // Ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@stripe|@paypal)/)'
  ],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/**/*.(test|spec).(js|jsx)',
    '<rootDir>/../client/src/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/../client/src/**/*.(test|spec).(js|jsx)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    '../client/src/**/*.{js,jsx}',
    '!../client/src/index.js',
    '!../client/src/reportWebVitals.js',
    '!../client/src/**/*.stories.{js,jsx}',
    '!../client/src/**/*.config.{js,jsx}',
    '!../client/src/serviceWorker.js'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 30000,
  
  // Global setup/teardown
  globalSetup: '<rootDir>/global-setup.js',
  globalTeardown: '<rootDir>/global-teardown.js',
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/../client/node_modules'],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Notify mode
  notify: false,
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
