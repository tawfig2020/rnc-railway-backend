/**
 * Data Sanitizer Middleware
 * Handles data type conversions and format mismatches between frontend and backend
 * Solves the systematic issue of array/string, number/string conversions
 */

/**
 * Sanitize request body data types
 * Converts common frontend data formats to backend-expected formats
 */
const sanitizeData = (req, res, next) => {
  if (!req.body) {
    return next();
  }

  const body = req.body;

  // 1. Handle Tags - Convert string to array or keep array
  if (body.tags !== undefined) {
    if (typeof body.tags === 'string') {
      // Split comma-separated string into array
      body.tags = body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (!Array.isArray(body.tags)) {
      // If it's neither string nor array, convert to empty array
      body.tags = [];
    }
  }

  // 2. Handle Numbers - Convert string numbers to actual numbers
  const numberFields = [
    'goal', 'fundingGoal', 'fundingCurrent', 'raised',
    'participants', 'progress', 'price', 'quantity',
    'duration', 'capacity', 'enrolled', 'minimumDonation',
    'donorsCount', 'priority', 'stock', 'rating'
  ];

  numberFields.forEach(field => {
    if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
      const parsed = parseFloat(body[field]);
      if (!isNaN(parsed)) {
        body[field] = parsed;
      } else {
        // Invalid number, set to 0 or undefined based on field
        body[field] = ['goal', 'fundingGoal', 'price'].includes(field) ? undefined : 0;
      }
    }
  });

  // 3. Handle Dates - Convert string dates to Date objects
  const dateFields = [
    'startDate', 'endDate', 'date', 'deadline',
    'publishedAt', 'expiresAt', 'scheduledFor'
  ];

  dateFields.forEach(field => {
    if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
      const date = new Date(body[field]);
      if (!isNaN(date.getTime())) {
        body[field] = date;
      } else {
        // Invalid date, set to undefined
        body[field] = undefined;
      }
    }
  });

  // 4. Handle Booleans - Convert string booleans to actual booleans
  const booleanFields = [
    'featured', 'active', 'published', 'verified',
    'isEmailVerified', 'allowDonationsAfterEnd', 'enabled'
  ];

  booleanFields.forEach(field => {
    if (body[field] !== undefined) {
      if (typeof body[field] === 'string') {
        body[field] = body[field].toLowerCase() === 'true' || body[field] === '1';
      } else {
        body[field] = Boolean(body[field]);
      }
    }
  });

  // 5. Handle Arrays - Ensure array fields are actually arrays
  const arrayFields = [
    'images', 'videos', 'documents', 'links',
    'categories', 'skills', 'languages', 'interests'
  ];

  arrayFields.forEach(field => {
    if (body[field] !== undefined) {
      if (!Array.isArray(body[field])) {
        if (typeof body[field] === 'string') {
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(body[field]);
            body[field] = Array.isArray(parsed) ? parsed : [body[field]];
          } catch (e) {
            // Not JSON, treat as single item or comma-separated
            body[field] = body[field].split(',').map(item => item.trim()).filter(item => item.length > 0);
          }
        } else {
          // Convert single value to array
          body[field] = [body[field]];
        }
      }
    }
  });

  // 6. Handle Nested Objects - Parse JSON strings
  const objectFields = [
    'founder', 'address', 'metadata',
    'socialSharing', 'suggestedDonations', 'impactMetrics'
  ];

  objectFields.forEach(field => {
    if (body[field] !== undefined && typeof body[field] === 'string') {
      try {
        body[field] = JSON.parse(body[field]);
      } catch (e) {
        // Not valid JSON, leave as is (don't log warning for expected strings)
        if (field !== 'location') {
          console.warn(`Failed to parse ${field} as JSON:`, e.message);
        }
      }
    }
  });

  // 7. Trim String Fields
  const stringFields = [
    'title', 'name', 'description', 'summary', 'slug',
    'email', 'phone', 'organizationName', 'contactEmail',
    'beneficiaries', 'category', 'status', 'location' // Added location
  ];

  stringFields.forEach(field => {
    if (body[field] !== undefined && typeof body[field] === 'string') {
      body[field] = body[field].trim();
    }
  });

  // 8. Handle Empty Strings - Convert to undefined for optional fields
  Object.keys(body).forEach(key => {
    if (body[key] === '' || body[key] === 'undefined' || body[key] === 'null') {
      body[key] = undefined;
    }
  });

  next();
};

/**
 * Sanitize query parameters
 * Converts query string parameters to appropriate types
 */
const sanitizeQuery = (req, res, next) => {
  if (!req.query) {
    return next();
  }

  const query = req.query;

  // Convert numeric query params
  ['page', 'limit', 'perPage', 'skip', 'offset'].forEach(field => {
    if (query[field] !== undefined) {
      const parsed = parseInt(query[field]);
      if (!isNaN(parsed)) {
        query[field] = parsed;
      }
    }
  });

  // Convert boolean query params
  ['featured', 'active', 'published', 'verified'].forEach(field => {
    if (query[field] !== undefined) {
      query[field] = query[field].toLowerCase() === 'true' || query[field] === '1';
    }
  });

  next();
};

module.exports = {
  sanitizeData,
  sanitizeQuery
};
