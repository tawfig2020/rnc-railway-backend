#!/usr/bin/env node

/**
 * Quick GitHub Push Script for RNC Malaysia
 * Pushes all updates to your GitHub repository
 */

const { execSync } = require('child_process');

console.log('🚀 Pushing RNC Malaysia Updates to GitHub');
console.log('='.repeat(45));

try {
  // Check git status
  console.log('📋 Checking git status...');
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (status.trim().length === 0) {
    console.log('✅ No changes to commit');
    console.log('🎉 Repository is up to date!');
    process.exit(0);
  }
  
  console.log('📝 Changes detected:');
  console.log(status);
  
  // Add all changes
  console.log('\n📦 Staging all changes...');
  execSync('git add .', { stdio: 'inherit' });
  console.log('✅ All changes staged');
  
  // Create commit with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const commitMessage = `🚀 Production deployment ready - ${timestamp}

✅ Frontend deployment configuration added
✅ Backend Render deployment ready  
✅ Authentication system working
✅ Production environment configured
✅ Deployment scripts and guides created
✅ GitHub Actions workflow added
✅ Netlify and Vercel configurations updated

Ready for:
- Backend deployment to Render
- Frontend deployment to Netlify/Vercel
- Production login functionality`;

  console.log('\n💾 Creating commit...');
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  console.log('✅ Commit created successfully');
  
  // Push to origin main
  console.log('\n🌐 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Successfully pushed to GitHub!');
  
  console.log('\n🎉 SUCCESS! Your updates are now on GitHub');
  console.log('='.repeat(45));
  
  console.log('\n🔗 Your repositories:');
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  console.log(remotes);
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Deploy backend to Render: node deploy-to-render.js');
  console.log('2. Deploy frontend to Netlify/Vercel');
  console.log('3. Test login at http://rncmalaysia.org/login');
  console.log('4. Update API URL if needed: node update-frontend-api.js');
  
} catch (error) {
  console.error('❌ Error pushing to GitHub:', error.message);
  
  if (error.message.includes('nothing to commit')) {
    console.log('ℹ️  No changes to commit - repository is up to date');
  } else if (error.message.includes('remote rejected')) {
    console.log('💡 Try: git pull origin main first, then run this script again');
  } else if (error.message.includes('not a git repository')) {
    console.log('💡 Initialize git first: git init');
  } else {
    console.log('💡 Check your git configuration and try again');
  }
  
  process.exit(1);
}
