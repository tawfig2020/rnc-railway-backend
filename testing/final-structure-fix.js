const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the file
let content = fs.readFileSync(targetFile, 'utf8');

// Analyze JSX structure and count opening/closing tags
function analyzeJsxStructure(content) {
  const lines = content.split('\n');
  let boxOpenCount = 0;
  let boxCloseCount = 0;
  
  lines.forEach(line => {
    const openMatches = line.match(/<Box[^>]*>/g);
    const closeMatches = line.match(/<\/Box>/g);
    
    if (openMatches) boxOpenCount += openMatches.length;
    if (closeMatches) boxCloseCount += closeMatches.length;
  });
  
  return { boxOpenCount, boxCloseCount };
}

// Get the current counts
const before = analyzeJsxStructure(content);
console.log('Before fix:');
console.log(`- Box opening tags: ${before.boxOpenCount}`);
console.log(`- Box closing tags: ${before.boxCloseCount}`);

// Fix the structure: replace the end of the component
const endPattern = /<\/Box>\s*<\/Box>\s*<\/Box>\s*<\/ErrorBoundary>/;
const replacement = '</Box>\n      </ErrorBoundary>';

if (endPattern.test(content)) {
  content = content.replace(endPattern, replacement);
  
  // Write the fixed content back
  fs.writeFileSync(targetFile, content, 'utf8');
  
  // Verify the fix
  const after = analyzeJsxStructure(content);
  console.log('\nAfter fix:');
  console.log(`- Box opening tags: ${after.boxOpenCount}`);
  console.log(`- Box closing tags: ${after.boxCloseCount}`);
  console.log('\nStructure fixed successfully!');
} else {
  console.log('Could not find the pattern to fix');
}
