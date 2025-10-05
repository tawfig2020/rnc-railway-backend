const fs = require('fs');
const path = require('path');

console.log('🚀 Creating minimal Hostinger deployment package...');

// Create minimal deployment directory
const minimalDir = path.join(__dirname, 'hostinger-minimal');
if (!fs.existsSync(minimalDir)) {
  fs.mkdirSync(minimalDir, { recursive: true });
}

// Copy only essential backend files (no node_modules)
const essentialFiles = [
  'server.js',
  'package.json',
  '.env'
];

const essentialFolders = [
  'config',
  'middleware', 
  'models',
  'routes',
  'utils',
  'data'
];

// Copy essential files
essentialFiles.forEach(file => {
  const srcPath = path.join(__dirname, 'hostinger-deploy', file);
  const destPath = path.join(minimalDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied: ${file}`);
  }
});

// Copy essential folders
function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

essentialFolders.forEach(folder => {
  const srcPath = path.join(__dirname, 'hostinger-deploy', folder);
  const destPath = path.join(minimalDir, folder);
  
  if (fs.existsSync(srcPath)) {
    copyFolderSync(srcPath, destPath);
    console.log(`✅ Copied folder: ${folder}`);
  }
});

// Copy only the built React files (not the entire public folder)
const publicSrcPath = path.join(__dirname, 'hostinger-deploy', 'public');
const publicDestPath = path.join(minimalDir, 'public');

if (fs.existsSync(publicSrcPath)) {
  copyFolderSync(publicSrcPath, publicDestPath);
  console.log(`✅ Copied folder: public`);
}

// Copy documentation
const docFiles = [
  'HOSTINGER-DEPLOYMENT-GUIDE.md',
  'DEPLOYMENT-SUMMARY.md', 
  'FINAL-DEPLOYMENT-CHECKLIST.md'
];

docFiles.forEach(file => {
  const srcPath = path.join(__dirname, 'hostinger-deploy', file);
  const destPath = path.join(minimalDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied: ${file}`);
  }
});

// Count files in minimal package
function countFiles(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      count += countFiles(filePath);
    } else {
      count++;
    }
  });
  
  return count;
}

const fileCount = countFiles(minimalDir);

console.log('');
console.log('🎉 Minimal deployment package created!');
console.log(`📁 Location: ./hostinger-minimal/`);
console.log(`📊 Total files: ${fileCount} (much smaller!)`);
console.log('');
console.log('📋 Package contents:');
console.log('- server.js (main application)');
console.log('- package.json (dependencies list)');
console.log('- .env (environment variables)');
console.log('- config/ (configuration)');
console.log('- middleware/ (authentication)');
console.log('- models/ (database models)');
console.log('- routes/ (API endpoints)');
console.log('- utils/ (utilities)');
console.log('- data/ (seed data)');
console.log('- public/ (React build files)');
console.log('- Documentation files');
console.log('');
console.log('⚠️  NOTE: node_modules will be installed on server with "npm install"');
console.log('🚀 This package is ready for Hostinger upload!');
