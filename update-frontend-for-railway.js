const fs = require('fs');
const path = require('path');

console.log('🔧 Updating frontend to use Railway backend...');

// Update the API configuration
const apiJsPath = path.join(__dirname, 'client', 'src', 'services', 'api.js');

if (fs.existsSync(apiJsPath)) {
  let apiContent = fs.readFileSync(apiJsPath, 'utf8');
  
  // Update the baseURL configuration
  const updatedApiContent = apiContent.replace(
    /\/\/ Production environment - connect to deployed backend[\s\S]*?baseURL = process\.env\.REACT_APP_API_URL \|\| '\/api';/,
    `// Production environment - connect to Railway backend
  // Replace YOUR_RAILWAY_URL with your actual Railway URL
  baseURL = process.env.REACT_APP_API_URL || 'https://YOUR_RAILWAY_URL.railway.app/api';`
  );
  
  fs.writeFileSync(apiJsPath, updatedApiContent);
  console.log('✅ Updated client/src/services/api.js');
} else {
  console.log('❌ Could not find client/src/services/api.js');
}

// Create a frontend build script for Hostinger
const buildScriptContent = `#!/usr/bin/env node
/**
 * Build React frontend for Hostinger deployment
 * This script builds the React app with Railway backend URL
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building React frontend for Hostinger...');

// Set the Railway backend URL
// REPLACE THIS with your actual Railway URL after deployment
const RAILWAY_BACKEND_URL = 'https://YOUR_RAILWAY_URL.railway.app/api';

console.log('🔗 Backend URL:', RAILWAY_BACKEND_URL);

// Set environment variable for build
process.env.REACT_APP_API_URL = RAILWAY_BACKEND_URL;

// Build the React app
exec('npm run build', { cwd: path.join(__dirname, 'client') }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Build failed:', error);
    return;
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Built files are in: client/build/');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Copy contents of client/build/ to Hostinger');
  console.log('2. Test your website at https://rncmalaysia.net');
  console.log('3. Try logging in with admin@refugeenetwork.com / 123456');
  console.log('');
  console.log('🌐 Your setup:');
  console.log('- Frontend: https://rncmalaysia.net (Hostinger)');
  console.log('- Backend: ' + RAILWAY_BACKEND_URL.replace('/api', '') + ' (Railway)');
});
`;

fs.writeFileSync(path.join(__dirname, 'build-frontend-for-hostinger.js'), buildScriptContent);
console.log('✅ Created build-frontend-for-hostinger.js');

// Create instructions for updating the frontend
const frontendInstructions = `# 🔧 Frontend Update Instructions

## Step 1: Update Railway URL

After your Railway backend is deployed:

1. **Get your Railway URL** (e.g., https://your-app.railway.app)
2. **Update** the following files:

### Update build-frontend-for-hostinger.js
Replace \`YOUR_RAILWAY_URL\` with your actual Railway URL:
\`\`\`javascript
const RAILWAY_BACKEND_URL = 'https://your-actual-railway-url.railway.app/api';
\`\`\`

### Update client/src/services/api.js
Replace \`YOUR_RAILWAY_URL\` with your actual Railway URL:
\`\`\`javascript
baseURL = process.env.REACT_APP_API_URL || 'https://your-actual-railway-url.railway.app/api';
\`\`\`

## Step 2: Build Frontend

Run the build script:
\`\`\`bash
node build-frontend-for-hostinger.js
\`\`\`

## Step 3: Deploy to Hostinger

1. **Copy** all files from \`client/build/\` folder
2. **Upload** to your Hostinger public_html directory
3. **Replace** existing files

## Step 4: Test

1. **Visit** https://rncmalaysia.net
2. **Try** logging in with admin@refugeenetwork.com / 123456
3. **Check** browser dev tools for any errors

## 🎯 Final Setup

- **Frontend**: https://rncmalaysia.net (Hostinger)
- **Backend**: https://your-railway-url.railway.app (Railway)
- **Authentication**: Should work perfectly!

## 🆘 Troubleshooting

If login doesn't work:
1. Check browser console for errors
2. Verify Railway backend is running
3. Test Railway health endpoint
4. Check CORS configuration
`;

fs.writeFileSync(path.join(__dirname, 'FRONTEND-UPDATE-INSTRUCTIONS.md'), frontendInstructions);
console.log('✅ Created FRONTEND-UPDATE-INSTRUCTIONS.md');

console.log('');
console.log('🎉 Frontend update files created!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Deploy backend to Railway first');
console.log('2. Get your Railway URL');
console.log('3. Update the URLs in the created files');
console.log('4. Build and deploy frontend to Hostinger');
console.log('');
console.log('📁 Files created:');
console.log('- build-frontend-for-hostinger.js');
console.log('- FRONTEND-UPDATE-INSTRUCTIONS.md');
