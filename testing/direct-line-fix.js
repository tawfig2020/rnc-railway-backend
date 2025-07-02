const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the file into lines
console.log(`Making direct line fix to ${targetFile}...`);
const content = fs.readFileSync(targetFile, 'utf8');
const lines = content.split('\n');

// Find the problem line (around line 130)
let foundExtraTag = false;
for (let i = 125; i < 135; i++) {
  if (lines[i] && lines[i].includes('</RadioGroup>')) {
    console.log(`Found RadioGroup closing tag at line ${i+1}: "${lines[i].trim()}"`); 
    // Check if there's an extra closing tag on this line
    const match = lines[i].match(/<\/RadioGroup>/g);
    if (match && match.length > 1) {
      console.log(`Found multiple RadioGroup closing tags on line ${i+1}`);
      lines[i] = lines[i].replace(/<\/RadioGroup>\s*<\/RadioGroup>/, '</RadioGroup>');
      foundExtraTag = true;
    } else if (i > 0 && lines[i-1] && lines[i-1].includes('</RadioGroup>')) {
      console.log(`Found duplicate RadioGroup closing tags on lines ${i} and ${i+1}`);
      lines[i] = lines[i].replace(/<\/RadioGroup>/, '');
      foundExtraTag = true;
    }
  }
}

// Make a backup
fs.writeFileSync(`${targetFile}.direct`, content, 'utf8');
console.log(`Direct line backup created at ${targetFile}.direct`);

// Only write if we found and fixed something
if (foundExtraTag) {
  // Write fixed content
  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log('Direct line fix applied - problematic line has been corrected!');
} else {
  console.log('No extra RadioGroup tags found by direct inspection. Manual intervention needed.');
  
  // Let's replace the entire component with a minimal version to demonstrate
  const simplifiedContent = content.replace(
    /return \([\s\S]*\);/,
    `return (
    <ErrorBoundary fallbackMessage="There was an error loading the availability form. Please try again later.">
      <Box className="availability-form" data-testid="availability-form">
        <Typography variant="h5">Availability & Preferences</Typography>
        <Paper elevation={2} sx={{ p: 3, m: 2 }}>
          <Typography>Form content will be displayed here.</Typography>
        </Paper>
      </Box>
    </ErrorBoundary>
  );`
  );
  
  fs.writeFileSync(`${targetFile}.simplified`, simplifiedContent, 'utf8');
  console.log('Created a simplified version at ' + targetFile + '.simplified');
  console.log('You can use this version as a temporary replacement if needed.');
}

// Print manual fix instructions
console.log('\nIf issues persist, you can manually edit the file:\n');
console.log('1. Open the component file in your editor');
console.log('2. Look at line 130 and surrounding lines');
console.log('3. Remove any extra </RadioGroup> tags');
console.log('4. Ensure each opening tag has exactly one matching closing tag');
