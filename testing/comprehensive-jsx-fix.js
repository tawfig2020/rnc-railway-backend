const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the file
console.log(`Reading ${targetFile}...`);
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Count opening and closing tags for each component
const tagPattern = /<(\/?)(Box|Paper|FormControl|RadioGroup|Grid)([^>]*)>/g;
let match;
let tagStack = [];
let lineMap = {};
let lineNumber = 1;

// Parse the file to map tags to line numbers
for (const line of content.split('\n')) {
  // Check for opening tags <Tag>
  const openTagMatches = [...line.matchAll(/<([A-Z][a-zA-Z0-9]*)[^/>]*(?<!\/)>/g)];
  for (const m of openTagMatches) {
    const tag = m[1];
    if (!lineMap[tag]) lineMap[tag] = { opening: [], closing: [] };
    lineMap[tag].opening.push(lineNumber);
  }
  
  // Check for closing tags </Tag>
  const closeTagMatches = [...line.matchAll(/<\/([A-Z][a-zA-Z0-9]*)>/g)];
  for (const m of closeTagMatches) {
    const tag = m[1];
    if (!lineMap[tag]) lineMap[tag] = { opening: [], closing: [] };
    lineMap[tag].closing.push(lineNumber);
  }
  
  lineNumber++;
}

// Check tag balance
const tagAnalysis = {};

for (const [tag, positions] of Object.entries(lineMap)) {
  const openingCount = positions.opening.length;
  const closingCount = positions.closing.length;
  
  tagAnalysis[tag] = { 
    openingCount, 
    closingCount, 
    balance: openingCount - closingCount,
    lastOpening: positions.opening[positions.opening.length - 1],
    lastClosing: positions.closing[positions.closing.length - 1]
  };
}

// Show analysis
console.log('\nTag balance analysis:');
console.log('====================')
for (const [tag, data] of Object.entries(tagAnalysis)) {
  if (data.balance !== 0) {
    console.log(
      `${tag}: ${data.openingCount} openings, ${data.closingCount} closings, ` +
      `Balance: ${data.balance > 0 ? '+' + data.balance + ' (missing closings)' : data.balance + ' (extra closings)'}`
    );
  }
}

// Create a simple fix by adding missing closing tags or removing extra ones
let lines = content.split('\n');
let modified = false;

function addClosingTag(tag, position) {
  const indentation = lines[position - 1].match(/^(\s*)/);
  const indent = indentation ? indentation[1] : '';
  lines.splice(position, 0, `${indent}</${tag}>`);
  return true;
}

function removeExtraClosingTag(tag, position) {
  if (lines[position - 1].trim() === `</${tag}>`) {
    lines.splice(position - 1, 1);
    return true;
  }
  return false;
}

// Fix missing closing tags
for (const [tag, data] of Object.entries(tagAnalysis)) {
  if (data.balance > 0) {
    // Missing closing tags - add them
    console.log(`Adding ${data.balance} missing </${tag}> tags`);
    // Add before the end of the component return statement
    const targetPosition = lines.length - 4; // Before the last few lines with closing bracket
    
    for (let i = 0; i < data.balance; i++) {
      addClosingTag(tag, targetPosition);
      modified = true;
    }
  } else if (data.balance < 0) {
    // Extra closing tags - find and remove them
    console.log(`Need to remove ${Math.abs(data.balance)} extra </${tag}> tags`);
    // This is more complex and would need a more sophisticated analysis
    // For now, we'll just log that manual intervention is needed
    console.log('  Manual fix required for extra closing tags');
  }
}

// If modifications were made, write back to the file
if (modified) {
  const newContent = lines.join('\n');
  
  // Make a backup
  fs.writeFileSync(`${targetFile}.bak`, content, 'utf8');
  console.log('\nBackup file created: ' + targetFile + '.bak');
  
  // Write fixed content
  fs.writeFileSync(targetFile, newContent, 'utf8');
  console.log('File updated with fixes!');
} else {
  console.log('\nNo automatic fixes were applied. Manual editing recommended.');
}

// Manual instructions
console.log('\nRecommended manual fixes:');
console.log('1. Open the file in your editor');
console.log('2. Review the structure and ensure each opening tag has exactly one corresponding closing tag');
console.log('3. Remove any extra closing tags identified above');
console.log('4. Run the lint checking script again to verify the structure is correct');
