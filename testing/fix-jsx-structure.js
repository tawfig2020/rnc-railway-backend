const fs = require('fs');

// Target file path
const targetFilePath = 'client/src/components/career-fair/AvailabilityForm.js';

// Read the file content
const content = fs.readFileSync(targetFilePath, 'utf8');

// Simple indentation fixer that ensures proper nesting
function fixIndentation(content) {
  const lines = content.split('\n');
  let indentLevel = 0;
  const indentSize = 2;
  const fixedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      fixedLines.push('');
      continue;
    }
    
    // Check for closing tags first to maintain proper indentation
    if (line.match(/<\/[A-Za-z][^>]*>/)) {
      // This is a closing tag, reduce indent before adding
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add the properly indented line
    fixedLines.push(' '.repeat(indentLevel * indentSize) + line);
    
    // Check for opening tags to increase indent for next lines
    if (line.match(/<[A-Za-z][^>]*>/) && 
        !line.match(/<\/[A-Za-z][^>]*>$/) && 
        !line.match(/\/>$/)) {
      // This has an opening tag without a closing tag on the same line
      indentLevel++;
    }
  }
  
  return fixedLines.join('\n');
}

// Apply the fix
const fixedContent = fixIndentation(content);

// Write the fixed content back to the file
fs.writeFileSync(targetFilePath, fixedContent, 'utf8');

console.log(`Fixed indentation in ${targetFilePath}`);
