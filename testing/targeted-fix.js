const fs = require('fs');
const path = require('path');

// Target file
const targetFile = path.resolve('client/src/components/career-fair/AvailabilityForm.js');

// Read the file
console.log(`Reading ${targetFile}...`);
let content = fs.readFileSync(targetFile, 'utf8');
let lines = content.split('\n');

// Lines with known problematic extra closing tags
const problematicLines = [
  { lineText: '        </Paper>', problemType: 'extra Paper tag' },
  { lineText: '      </Paper>', problemType: 'extra Paper tag' },
  { lineText: '    </RadioGroup>', problemType: 'extra RadioGroup tag' },
];

// Find and remove problematic lines
let removedLines = [];
let newLines = [];
let lineNum = 0;

for (const line of lines) {
  lineNum++;
  let shouldKeep = true;
  
  for (const problem of problematicLines) {
    if (line.trim() === problem.lineText.trim()) {
      console.log(`Line ${lineNum}: Removed ${problem.problemType} - ${line.trim()}`);
      shouldKeep = false;
      removedLines.push({ num: lineNum, text: line, problem: problem.problemType });
      break;
    }
  }
  
  if (shouldKeep) {
    newLines.push(line);
  }
}

// Check if we made any removals
if (removedLines.length > 0) {
  console.log(`\nRemoved ${removedLines.length} problematic lines`);
  
  // Make a backup
  fs.writeFileSync(`${targetFile}.bak2`, content, 'utf8');
  console.log('Backup file created: ' + targetFile + '.bak2');
  
  // Write fixed content
  const newContent = newLines.join('\n');
  fs.writeFileSync(targetFile, newContent, 'utf8');
  console.log('File updated with targeted fixes!');
} else {
  console.log('No problematic lines were found or removed.');
}
