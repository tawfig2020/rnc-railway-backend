#!/usr/bin/env node
/**
 * Fix mongoose.model() references in all files
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing mongoose.model() references...');

const railwayDir = path.join(__dirname, 'railway-backend-only');

// Model mappings
const modelMappings = {
  'User': '../models/User',
  'BlogPost': '../models/BlogPost',
  'Course': '../models/Course',
  'Event': '../models/Event',
  'Resource': '../models/Resource',
  'Profile': '../models/Profile',
  'Support': '../models/Support',
  'Campaign': '../models/Campaign',
  'Donation': '../models/Donation',
  'Order': '../models/Order',
  'Product': '../models/Product',
  'Vendor': '../models/Vendor',
  'RefreshToken': '../models/RefreshToken',
  'Service': '../models/Service'
};

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Find all mongoose.model() calls
  const modelRegex = /const\s+(\w+)\s+=\s+mongoose\.model\(['"](\w+)['"]\);?/g;
  let match;
  const modelsFound = [];
  
  while ((match = modelRegex.exec(content)) !== null) {
    const [fullMatch, varName, modelName] = match;
    modelsFound.push({ fullMatch, varName, modelName });
  }
  
  if (modelsFound.length > 0) {
    // Remove mongoose.model() lines
    modelsFound.forEach(({ fullMatch }) => {
      content = content.replace(fullMatch, '');
    });
    
    // Add require statements at the top after other requires
    const requireStatements = modelsFound.map(({ varName, modelName }) => {
      const modelPath = modelMappings[modelName] || `../models/${modelName}`;
      return `const ${varName} = require('${modelPath}');`;
    }).join('\n');
    
    // Find the last require statement and add our requires after it
    const lastRequireMatch = content.match(/const\s+\w+\s+=\s+require\([^)]+\);?\s*\n/g);
    if (lastRequireMatch) {
      const lastRequire = lastRequireMatch[lastRequireMatch.length - 1];
      const insertIndex = content.lastIndexOf(lastRequire) + lastRequire.length;
      content = content.slice(0, insertIndex) + '\n' + requireStatements + '\n' + content.slice(insertIndex);
    } else {
      // If no requires found, add at the beginning
      content = requireStatements + '\n\n' + content;
    }
    
    fs.writeFileSync(filePath, content);
    modified = true;
    console.log(`✅ Fixed: ${path.relative(railwayDir, filePath)} (${modelsFound.length} models)`);
  }
  
  return modified;
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalFixed += processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      if (fixFile(filePath)) {
        totalFixed++;
      }
    }
  });
  
  return totalFixed;
}

// Process routes and middleware directories
const routesDir = path.join(railwayDir, 'routes');
const middlewareDir = path.join(railwayDir, 'middleware');

let totalFixed = 0;

if (fs.existsSync(routesDir)) {
  console.log('📁 Processing routes directory...');
  totalFixed += processDirectory(routesDir);
}

if (fs.existsSync(middlewareDir)) {
  console.log('📁 Processing middleware directory...');
  totalFixed += processDirectory(middlewareDir);
}

console.log('');
console.log(`🎉 Fixed ${totalFixed} files with mongoose.model() issues`);
console.log('');
console.log('📋 Next steps:');
console.log('1. Commit and push changes to GitHub');
console.log('2. Redeploy on Render');
console.log('3. Test the backend endpoints');
