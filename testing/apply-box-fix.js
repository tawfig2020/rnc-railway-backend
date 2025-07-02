const fs = require('fs');
const path = require('path');

// Target file path
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read file content
let content = fs.readFileSync(targetFile, 'utf8');

// Find the ErrorBoundary closing tag
const endBoundaryIndex = content.lastIndexOf('</ErrorBoundary>');

if (endBoundaryIndex !== -1) {
  // Insert Box closing tag before ErrorBoundary closing tag
  const updatedContent = 
    content.substring(0, endBoundaryIndex) + 
    '      </Box>\n' + 
    content.substring(endBoundaryIndex);
  
  // Write the updated content back to the file
  fs.writeFileSync(targetFile, updatedContent, 'utf8');
  
  console.log('Successfully added closing Box tag to AvailabilityForm.js');
  console.log('Fixed structure: The main Box wrapper now has a proper closing tag');
} else {
  console.error('Could not find ErrorBoundary closing tag in the file');
}
