const fs = require('fs');
const path = require('path');

// Target file path
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read file content
const content = fs.readFileSync(targetFile, 'utf8');
const lines = content.split('\n');

// Track Box tags
const boxStack = [];
const unbalancedTags = [];

// Analyze line by line
console.log('Analyzing AvailabilityForm.js for tag balance issues...');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Check for Box opening tags
  const openBoxMatches = line.match(/<Box[^>]*>/g);
  if (openBoxMatches) {
    openBoxMatches.forEach(match => {
      boxStack.push({ line: lineNum, text: match });
    });
  }
  
  // Check for Box closing tags
  const closeBoxMatches = line.match(/<\/Box>/g);
  if (closeBoxMatches) {
    if (boxStack.length > 0) {
      closeBoxMatches.forEach(() => boxStack.pop());
    } else {
      console.log(`Warning: Extra closing Box tag at line ${lineNum}`);
    }
  }
}

// Report unclosed tags
if (boxStack.length > 0) {
  console.log('\nFound unclosed Box tags:');
  boxStack.forEach(tag => {
    console.log(`- Line ${tag.line}: ${tag.text}`);
  });
  
  // Find good insertion points
  console.log('\nRecommended fixes:');
  boxStack.forEach(tag => {
    // Find the next major section or parent closing tag
    let insertPoint = -1;
    let depth = 1;
    
    for (let i = tag.line; i < lines.length; i++) {
      const line = lines[i];
      
      // Count opening and closing tags to track nesting
      const openings = (line.match(/<Box[^>]*>/g) || []).length;
      const closings = (line.match(/<\/Box>/g) || []).length;
      
      depth += openings - closings;
      
      // Look for section comments, papers, or other major component changes
      if (depth === 0 || line.includes('Paper') && line.includes('elevation=') || 
          line.includes('{/*') && line.includes('Section') || 
          i > tag.line + 50) { // Don't look too far
        insertPoint = i;
        break;
      }
    }
    
    if (insertPoint > 0) {
      console.log(`  Add '</Box>' before or after line ${insertPoint}: ${lines[insertPoint].trim()}`);
    }
  });
  
  console.log('\nSuggested approach:');
  console.log('1. For each unclosed tag, add a </Box> tag at the recommended line');
  console.log('2. Ensure proper indentation matches the opening tag level');
  console.log('3. Run the lint checker again to verify all tags are balanced');
} else {
  console.log('All Box tags are properly closed!');
}
