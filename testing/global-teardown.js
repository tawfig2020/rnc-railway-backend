/**
 * Global Teardown for Jest Tests
 * Runs once after all tests
 */

const chalk = require('chalk');

module.exports = async () => {
  console.log(chalk.blue('\n🧹 Cleaning up test environment...'));
  
  // Clean up any global resources
  // This could include closing database connections, 
  // stopping test servers, etc.
  
  console.log(chalk.green('✅ Test environment cleanup complete'));
};
