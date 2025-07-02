const fs = require('fs');
const path = require('path');

// Target files to check
const targetFiles = [
  path.resolve('client/src/components/career-fair/AvailabilityForm.js'),
  path.resolve('testing/component-integration-tests.js')
];

// Simple JSX structure checker
function checkJsxBalance(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Count elements
  const tagCounts = {};
  const issues = [];
  
  lines.forEach((line, idx) => {
    // Check for opening tags (simplified, not comprehensive)
    const openMatches = line.match(/<([A-Z][a-zA-Z]+)[^>/]*>/g);
    const closeMatches = line.match(/<\/([A-Z][a-zA-Z]+)>/g);
    
    if (openMatches) {
      openMatches.forEach(match => {
        const tagName = match.match(/<([A-Z][a-zA-Z]+)/)[1];
        tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
      });
    }
    
    if (closeMatches) {
      closeMatches.forEach(match => {
        const tagName = match.match(/<\/([A-Z][a-zA-Z]+)>/)[1];
        if (!tagCounts[tagName]) {
          issues.push(`Extra closing tag </${tagName}> at line ${idx+1}`);
        } else {
          tagCounts[tagName]--;
          // Clean up zero counts
          if (tagCounts[tagName] === 0) {
            delete tagCounts[tagName];
          }
        }
      });
    }
    
    // Look for common JS/JSX lint issues
    if (line.includes('for(') || line.includes('if(') || line.includes('while(')) {
      issues.push(`Missing space after control statement at line ${idx+1}`);
    }
  });
  
  // Check for unclosed tags
  Object.entries(tagCounts).forEach(([tag, count]) => {
    issues.push(`Unclosed <${tag}> tag: ${count} instances`);
  });
  
  return {
    file: path.basename(filePath),
    balanced: Object.keys(tagCounts).length === 0 && issues.length === 0,
    unclosedTags: tagCounts,
    issues
  };
}

// Run the checks
console.log('Checking for lint issues...');
console.log('=========================');

let allClear = true;
for (const file of targetFiles) {
  const result = checkJsxBalance(file);
  
  if (result.balanced) {
    console.log(`✅ ${result.file} - No balance issues found`);
  } else {
    allClear = false;
    console.log(`❌ ${result.file} - Issues found:`);
    
    if (Object.keys(result.unclosedTags).length > 0) {
      console.log('  Unclosed tags:');
      Object.entries(result.unclosedTags).forEach(([tag, count]) => {
        console.log(`    - ${tag}: ${count} instances`);
      });
    }
    
    if (result.issues.length > 0) {
      console.log('  Issues:');
      result.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    }
  }
  console.log();
}

if (allClear) {
  console.log('✅ All checked files have balanced JSX structure');
} else {
  console.log('⚠️ Some files have JSX structure issues - see details above');
}
