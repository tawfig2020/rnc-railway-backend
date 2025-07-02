/**
 * Lint Report Generator
 * 
 * A simple utility to generate reports on common lint issues in the codebase
 * This helps identify and fix issues like unclosed tags systematically
 */

const fs = require('fs');
const path = require('path');
// Handle different versions of chalk
const chalk = (() => {
  const chalkModule = require('chalk');
  // Check if it's chalk v4 or earlier (direct functions) or chalk v5+ (needs to create a new instance)
  return typeof chalkModule === 'function' ? chalkModule : new chalkModule.constructor();
})();

// JSX/React specific lint checks
const jsxChecks = {
  // Check for balanced opening and closing JSX tags
  checkBalancedTags: (content) => {
    const lines = content.split('\n');
    const tags = [];
    const issues = [];
    
    const openingTagRegex = /<([A-Z][a-zA-Z0-9]+)\s*(?![^>]*\/>)[^>]*>/g;
    const closingTagRegex = /<\/([A-Z][a-zA-Z0-9]+)>/g;
    
    lines.forEach((line, lineIndex) => {
      let match;
      
      // Find opening tags
      while ((match = openingTagRegex.exec(line)) !== null) {
        tags.push({
          tag: match[1],
          line: lineIndex + 1,
          type: 'opening'
        });
      }
      
      // Find closing tags
      while ((match = closingTagRegex.exec(line)) !== null) {
        const closingTag = match[1];
        
        // Find the corresponding opening tag
        let found = false;
        for (let i = tags.length - 1; i >= 0; i--) {
          if (tags[i].tag === closingTag && tags[i].type === 'opening') {
            tags.splice(i, 1); // Remove the matched pair
            found = true;
            break;
          }
        }
        
        if (!found) {
          issues.push(`Unexpected closing tag </${closingTag}> at line ${lineIndex + 1} without matching opening tag`);
        }
      }
    });
    
    // Any remaining tags in the stack are unclosed
    tags.forEach(tag => {
      issues.push(`Unclosed tag <${tag.tag}> at line ${tag.line}`);
    });
    
    return issues;
  }
};

// Generate a report for a single file
const lintFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // Run JSX checks for React files
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    issues.push(...jsxChecks.checkBalancedTags(content));
  }
  
  return issues;
};

// Generate a report for a directory
const lintDirectory = (dirPath, fileExtensions = ['.js', '.jsx']) => {
  const report = {};
  
  const processDir = (dir) => {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and hidden folders
        if (item !== 'node_modules' && !item.startsWith('.')) {
          processDir(itemPath);
        }
      } else if (stats.isFile() && fileExtensions.some(ext => itemPath.endsWith(ext))) {
        const issues = lintFile(itemPath);
        
        if (issues.length > 0) {
          report[itemPath] = issues;
        }
      }
    });
  };
  
  processDir(dirPath);
  return report;
};

// Helper function to format the report
const formatReport = (report) => {
  let output = '';
  let totalIssues = 0;
  
  for (const [filePath, issues] of Object.entries(report)) {
    if (issues.length > 0) {
      output += `\n${chalk.yellow(filePath)}:\n`;
      
      issues.forEach(issue => {
        output += `  - ${issue}\n`;
        totalIssues++;
      });
    }
  }
  
  output = `\n${chalk.blue('Lint Report')}\n` +
           `${chalk.blue('===========\n')}` +
           `${chalk.green(`Found ${totalIssues} issues in ${Object.keys(report).length} files`)}\n` + output;
  
  return output;
};

// Main function to run the lint check
const runLintCheck = (targetPath, options = {}) => {
  const report = lintDirectory(targetPath, options.extensions || ['.js', '.jsx']);
  const formattedReport = formatReport(report);
  
  console.log(formattedReport);
  
  // Optionally write to file
  if (options.outputFile) {
    fs.writeFileSync(options.outputFile, formattedReport, 'utf-8');
    console.log(`\nReport saved to ${options.outputFile}`);
  }
  
  return report;
};

// Run the check if executed directly
if (require.main === module) {
  const targetPath = process.argv[2] || process.cwd();
  runLintCheck(targetPath, {
    outputFile: 'lint-report.txt'
  });
}

module.exports = {
  lintFile,
  lintDirectory,
  runLintCheck
};
