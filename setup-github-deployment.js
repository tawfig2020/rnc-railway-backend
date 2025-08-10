#!/usr/bin/env node

/**
 * GitHub Repository Setup and Deployment Script
 * Helps push updates to GitHub and set up automatic deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📚 GitHub Repository Setup & Deployment');
console.log('='.repeat(45));

// Check git status
let gitInitialized = false;
try {
  execSync('git status', { stdio: 'pipe' });
  gitInitialized = true;
  console.log('✅ Git repository initialized');
} catch (error) {
  console.log('⚠️  Git repository not initialized');
}

// Check for uncommitted changes
let hasChanges = false;
if (gitInitialized) {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    hasChanges = status.trim().length > 0;
    if (hasChanges) {
      console.log('📝 Uncommitted changes detected');
    } else {
      console.log('✅ Working directory clean');
    }
  } catch (error) {
    console.log('⚠️  Could not check git status');
  }
}

// Check for remote repository
let hasRemote = false;
if (gitInitialized) {
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf8' });
    hasRemote = remotes.trim().length > 0;
    if (hasRemote) {
      console.log('✅ Remote repository configured');
      console.log('📍 Current remotes:');
      console.log(remotes);
    } else {
      console.log('⚠️  No remote repository configured');
    }
  } catch (error) {
    console.log('⚠️  Could not check remote repositories');
  }
}

console.log('\n🔧 SETUP OPTIONS:');
console.log('='.repeat(20));

function askSetupType() {
  console.log('\nWhat would you like to do?');
  console.log('1. Initialize new Git repository and push to GitHub');
  console.log('2. Push updates to existing GitHub repository');
  console.log('3. Set up GitHub Actions for automatic deployment');
  console.log('4. Create deployment configuration files');
  console.log('5. All of the above (complete setup)');
  
  rl.question('\nEnter your choice (1-5): ', (choice) => {
    switch (choice) {
      case '1':
        setupNewRepository();
        break;
      case '2':
        pushToExistingRepository();
        break;
      case '3':
        setupGitHubActions();
        break;
      case '4':
        createDeploymentConfigs();
        break;
      case '5':
        completeSetup();
        break;
      default:
        console.log('❌ Invalid choice. Please enter 1-5.');
        askSetupType();
    }
  });
}

function setupNewRepository() {
  console.log('\n🆕 Setting up new Git repository...');
  
  if (!gitInitialized) {
    try {
      execSync('git init', { stdio: 'inherit' });
      console.log('✅ Git repository initialized');
    } catch (error) {
      console.error('❌ Failed to initialize git:', error.message);
      rl.close();
      return;
    }
  }
  
  rl.question('\n📝 Enter your GitHub repository URL (e.g., https://github.com/username/rnc-malaysia.git): ', (repoUrl) => {
    if (!repoUrl.includes('github.com')) {
      console.log('❌ Please enter a valid GitHub repository URL');
      setupNewRepository();
      return;
    }
    
    try {
      // Add all files
      execSync('git add .', { stdio: 'inherit' });
      console.log('✅ Files staged');
      
      // Commit
      execSync('git commit -m "Initial commit: RNC Malaysia platform with authentication fixes"', { stdio: 'inherit' });
      console.log('✅ Initial commit created');
      
      // Add remote
      execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
      console.log('✅ Remote repository added');
      
      // Create main branch and push
      execSync('git branch -M main', { stdio: 'inherit' });
      execSync('git push -u origin main', { stdio: 'inherit' });
      console.log('✅ Code pushed to GitHub');
      
      console.log('\n🎉 Repository setup complete!');
      askNextSteps();
      
    } catch (error) {
      console.error('❌ Error setting up repository:', error.message);
      rl.close();
    }
  });
}

function pushToExistingRepository() {
  console.log('\n📤 Pushing updates to existing repository...');
  
  if (!gitInitialized) {
    console.log('❌ Git repository not initialized. Please choose option 1 first.');
    askSetupType();
    return;
  }
  
  if (!hasRemote) {
    console.log('❌ No remote repository configured. Please choose option 1 first.');
    askSetupType();
    return;
  }
  
  try {
    // Add all changes
    execSync('git add .', { stdio: 'inherit' });
    console.log('✅ Changes staged');
    
    // Commit with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    execSync(`git commit -m "Update RNC Malaysia platform - ${timestamp}: Production deployment ready, authentication fixed, Render configuration added"`, { stdio: 'inherit' });
    console.log('✅ Changes committed');
    
    // Push to main branch
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Updates pushed to GitHub');
    
    console.log('\n🎉 Updates successfully pushed!');
    askNextSteps();
    
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('ℹ️  No changes to commit');
      askNextSteps();
    } else {
      console.error('❌ Error pushing updates:', error.message);
      rl.close();
    }
  }
}

function setupGitHubActions() {
  console.log('\n⚙️ Setting up GitHub Actions for automatic deployment...');
  
  // Create .github/workflows directory
  const workflowDir = path.join(__dirname, '.github', 'workflows');
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
    console.log('✅ GitHub Actions directory created');
  }
  
  // Create deployment workflow
  const workflowContent = `name: Deploy RNC Malaysia Frontend

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: client/package-lock.json
        
    - name: Install dependencies
      run: |
        cd client
        npm ci
        
    - name: Build frontend
      run: |
        cd client
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./client/build
        
    - name: Deploy to Netlify (Optional)
      uses: nwtgck/actions-netlify@v2.0
      if: github.ref == 'refs/heads/main'
      with:
        publish-dir: './client/build'
        production-branch: main
        github-token: \${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
`;

  const workflowPath = path.join(workflowDir, 'deploy.yml');
  fs.writeFileSync(workflowPath, workflowContent);
  console.log('✅ GitHub Actions workflow created');
  
  console.log('\n📋 GitHub Actions setup complete!');
  console.log('🔧 To enable deployment:');
  console.log('1. Push this workflow to GitHub');
  console.log('2. Enable GitHub Pages in repository settings');
  console.log('3. (Optional) Add Netlify secrets for Netlify deployment');
  
  askNextSteps();
}

function createDeploymentConfigs() {
  console.log('\n📄 Creating deployment configuration files...');
  
  // Create netlify.toml
  const netlifyConfig = `[build]
  base = "client"
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  REACT_APP_API_URL = "https://rnc-malaysia-api.onrender.com/api"

[context.deploy-preview.environment]
  REACT_APP_API_URL = "https://rnc-malaysia-api.onrender.com/api"
`;

  fs.writeFileSync(path.join(__dirname, 'netlify.toml'), netlifyConfig);
  console.log('✅ netlify.toml created');
  
  // Create vercel.json
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "client/package.json",
        "use": "@vercel/static-build",
        "config": {
          "distDir": "build"
        }
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/client/build/index.html"
      }
    ],
    "env": {
      "REACT_APP_API_URL": "https://rnc-malaysia-api.onrender.com/api"
    }
  };
  
  fs.writeFileSync(path.join(__dirname, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json created');
  
  // Create deployment README
  const deploymentReadme = `# Deployment Configuration

## Available Deployment Options

### 1. Netlify (Recommended)
- Drag & drop the \`client/build\` folder to Netlify
- Or connect GitHub repository for automatic deployment
- Configuration: \`netlify.toml\`

### 2. Vercel
- Connect GitHub repository
- Configuration: \`vercel.json\`

### 3. GitHub Pages
- Enable GitHub Pages in repository settings
- Use GitHub Actions workflow: \`.github/workflows/deploy.yml\`

### 4. Traditional Web Hosting
- Upload \`client/build\` folder contents to your web server
- Configure server to serve \`index.html\` for all routes

## Build Commands
\`\`\`bash
cd client
npm install
npm run build
\`\`\`

## Environment Variables
- \`REACT_APP_API_URL\`: Backend API URL (set in \`.env.production\`)

## Testing
After deployment, test login at: http://rncmalaysia.org/login
`;

  fs.writeFileSync(path.join(__dirname, 'DEPLOYMENT.md'), deploymentReadme);
  console.log('✅ DEPLOYMENT.md created');
  
  console.log('\n🎉 Deployment configuration files created!');
  askNextSteps();
}

function completeSetup() {
  console.log('\n🚀 Running complete setup...');
  
  // Run all setup steps
  createDeploymentConfigs();
  
  setTimeout(() => {
    setupGitHubActions();
    
    setTimeout(() => {
      if (!hasRemote) {
        setupNewRepository();
      } else {
        pushToExistingRepository();
      }
    }, 1000);
  }, 1000);
}

function askNextSteps() {
  console.log('\n🎯 NEXT STEPS:');
  console.log('='.repeat(15));
  console.log('1. Your code is now on GitHub');
  console.log('2. Choose a deployment platform:');
  console.log('   • Netlify: https://netlify.com (drag & drop build folder)');
  console.log('   • Vercel: https://vercel.com (connect GitHub repo)');
  console.log('   • GitHub Pages: Enable in repository settings');
  console.log('3. Deploy your backend to Render first');
  console.log('4. Update frontend API URL with deployed backend');
  console.log('5. Test login at http://rncmalaysia.org/login');
  
  rl.close();
}

// Start the setup process
askSetupType();
