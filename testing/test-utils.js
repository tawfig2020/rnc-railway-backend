/**
 * Test Utility Functions
 * Provides helper functions for component integration testing
 */

/**
 * Finds an element using multiple possible selectors, trying each in sequence
 * until one is found. This makes tests more robust against minor UI changes.
 * 
 * @param {Page} page - Puppeteer page object
 * @param {Array<string>} selectors - Array of CSS selectors to try
 * @param {Object} options - Additional options
 * @returns {Promise<ElementHandle|null>} - The found element or null
 */
async function findBySelectors(page, selectors, options = {}) {
  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) return element;
    } catch (error) {
      // Continue to next selector
    }
  }
  return null;
}

/**
 * Finds all elements that match any of the provided selectors
 * 
 * @param {Page} page - Puppeteer page object
 * @param {Array<string>} selectors - Array of CSS selectors to try
 * @returns {Promise<Array<ElementHandle>>} - Array of found elements
 */
async function findAllBySelectors(page, selectors) {
  let results = [];
  
  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector);
      results = [...results, ...elements];
    } catch (error) {
      // Continue to next selector
    }
  }
  
  return results;
}

/**
 * Waits for any of the specified selectors to be available in the DOM
 * 
 * @param {Page} page - Puppeteer page object
 * @param {Array<string>} selectors - Array of CSS selectors to wait for
 * @param {Object} options - Wait options like timeout
 * @returns {Promise<string|null>} - The selector that was found or null
 */
async function waitForAnySelector(page, selectors, options = { timeout: 5000 }) {
  try {
    const result = await Promise.race(
      selectors.map(selector => 
        page.waitForSelector(selector, options)
          .then(() => selector)
          .catch(() => null)
      )
    );
    return result;
  } catch (error) {
    return null;
  }
}

/**
 * Safely clicks an element that may be identified by multiple possible selectors
 * 
 * @param {Page} page - Puppeteer page object
 * @param {Array<string>} selectors - Array of possible selectors for the element
 * @returns {Promise<boolean>} - True if click was successful
 */
async function safeClick(page, selectors) {
  const element = await findBySelectors(page, selectors);
  if (element) {
    await element.click();
    return true;
  }
  return false;
}

/**
 * Fills a form field using multiple possible selectors
 * 
 * @param {Page} page - Puppeteer page object
 * @param {Array<string>} selectors - Array of possible selectors for the field
 * @param {string} value - Value to fill
 * @returns {Promise<boolean>} - True if field was filled
 */
async function fillFormField(page, selectors, value) {
  const field = await findBySelectors(page, selectors);
  if (field) {
    await field.type(value);
    return true;
  }
  return false;
}

module.exports = {
  findBySelectors,
  findAllBySelectors,
  waitForAnySelector,
  safeClick,
  fillFormField
};
