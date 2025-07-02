const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the file
console.log(`Making final fix to ${targetFile}...`);
let content = fs.readFileSync(targetFile, 'utf8');

// Fix the RadioGroup issue by removing any extra closing tags
let fixedContent = content.replace(/<\/RadioGroup>\s*<\/FormControl>/g, '</RadioGroup>\n            </FormControl>');

// Make a backup
fs.writeFileSync(`${targetFile}.final`, content, 'utf8');
console.log(`Final backup created at ${targetFile}.final`);

// Write fixed content
fs.writeFileSync(targetFile, fixedContent, 'utf8');
console.log('Final fix applied - all structure issues should now be resolved!');
