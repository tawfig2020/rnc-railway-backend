const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the file
console.log(`Fixing ${targetFile}...`);
let content = fs.readFileSync(targetFile, 'utf8');

// Fix the ending structure
let fixedContent = content.replace(
  /<\/Box>\s*<\/Box>\s*<\/ErrorBoundary>\s*\);\s*<\/Box>/s,
  '</Box>\n    </ErrorBoundary>\n  );\n'
);

// Make a backup
fs.writeFileSync(`${targetFile}.final.bak`, content, 'utf8');
console.log('Backup file created: ' + targetFile + '.final.bak');

// Write fixed content
fs.writeFileSync(targetFile, fixedContent, 'utf8');
console.log('Final structure fixed!\n');
console.log('The component should now have proper JSX structure and compile without errors.');
