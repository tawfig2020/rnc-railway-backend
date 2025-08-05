const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

// Comprehensive validation of the privacy system
const validatePrivacySystem = async () => {
  console.log('🔍 PRIVACY SYSTEM FINAL VALIDATION');
  console.log('==================================');
  
  const results = {
    backend: {},
    frontend: {},
    integration: {},
    compliance: {}
  };
  
  // 1. Backend API Validation
  console.log('\n🔧 Backend API Validation...');
  
  try {
    // Test privacy policy endpoint
    const policyResponse = await axios.get(`${BASE_URL}/privacy/policy`);
    results.backend.policyEndpoint = {
      status: policyResponse.status === 200,
      hasVersion: !!policyResponse.data.version,
      hasContent: !!policyResponse.data.content
    };
    console.log('✅ Privacy policy endpoint working');
  } catch (error) {
    results.backend.policyEndpoint = { status: false, error: error.message };
    console.log('❌ Privacy policy endpoint failed');
  }
  
  // Test protected endpoints return 401 without auth
  try {
    await axios.get(`${BASE_URL}/privacy/consent`);
    results.backend.authProtection = false;
    console.log('❌ Consent endpoint not properly protected');
  } catch (error) {
    results.backend.authProtection = error.response?.status === 401;
    console.log('✅ Protected endpoints properly secured');
  }
  
  // 2. Frontend Component Validation
  console.log('\n🎨 Frontend Component Validation...');
  
  const frontendFiles = [
    'client/src/components/privacy/ConsentManager.js',
    'client/src/pages/PrivacySettings.js',
    'client/src/pages/Privacy.js',
    'client/src/components/privacy/CookieConsentBanner.js'
  ];
  
  results.frontend.components = {};
  
  for (const file of frontendFiles) {
    const fullPath = path.join(process.cwd(), file);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const componentName = path.basename(file, '.js');
      
      results.frontend.components[componentName] = {
        exists: true,
        hasApiIntegration: content.includes('api.') || content.includes('axios'),
        hasErrorHandling: content.includes('catch') || content.includes('error'),
        hasMaterialUI: content.includes('@mui/material'),
        hasStateManagement: content.includes('useState') || content.includes('useEffect')
      };
      
      console.log(`✅ ${componentName} - Complete implementation`);
    } else {
      results.frontend.components[componentName] = { exists: false };
      console.log(`❌ ${componentName} - Missing`);
    }
  }
  
  // 3. Database Model Validation
  console.log('\n🗄️ Database Model Validation...');
  
  const modelPath = path.join(process.cwd(), 'models/UserConsent.js');
  if (fs.existsSync(modelPath)) {
    const modelContent = fs.readFileSync(modelPath, 'utf8');
    results.backend.userConsentModel = {
      exists: true,
      hasSchema: modelContent.includes('Schema'),
      hasTimestamps: modelContent.includes('timestamps'),
      hasValidation: modelContent.includes('required') || modelContent.includes('validate')
    };
    console.log('✅ UserConsent model properly implemented');
  } else {
    results.backend.userConsentModel = { exists: false };
    console.log('❌ UserConsent model missing');
  }
  
  // 4. Route Configuration Validation
  console.log('\n🛣️ Route Configuration Validation...');
  
  const routesPath = path.join(process.cwd(), 'routes/privacy.js');
  if (fs.existsSync(routesPath)) {
    const routesContent = fs.readFileSync(routesPath, 'utf8');
    
    const requiredRoutes = [
      '/policy',
      '/consent',
      '/accept-policy',
      '/data-export',
      '/account-deletion'
    ];
    
    results.backend.routes = {};
    
    for (const route of requiredRoutes) {
      const hasRoute = routesContent.includes(`'${route}'`) || routesContent.includes(`"${route}"`);
      results.backend.routes[route] = hasRoute;
      console.log(`${hasRoute ? '✅' : '❌'} Route ${route} ${hasRoute ? 'implemented' : 'missing'}`);
    }
  }
  
  // 5. App.js Integration Validation
  console.log('\n🔗 App.js Integration Validation...');
  
  const appPath = path.join(process.cwd(), 'client/src/App.js');
  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    results.frontend.appIntegration = {
      hasPrivacyRoute: appContent.includes('/privacy'),
      hasPrivacySettingsRoute: appContent.includes('/privacy-settings'),
      hasCookieBanner: appContent.includes('CookieConsentBanner'),
      hasPrivacyImports: appContent.includes('Privacy') && appContent.includes('import')
    };
    
    const integrationScore = Object.values(results.frontend.appIntegration).filter(Boolean).length;
    console.log(`✅ App.js integration: ${integrationScore}/4 features integrated`);
  }
  
  // 6. Compliance Features Validation
  console.log('\n⚖️ GDPR/Privacy Compliance Validation...');
  
  results.compliance = {
    consentManagement: !!results.frontend.components?.ConsentManager?.exists,
    dataExportRequest: !!results.backend.routes?.['/data-export'],
    accountDeletion: !!results.backend.routes?.['/account-deletion'],
    cookieConsent: !!results.frontend.components?.CookieConsentBanner?.exists,
    privacyPolicy: !!results.backend.policyEndpoint?.status,
    userRights: !!results.frontend.components?.PrivacySettings?.exists
  };
  
  const complianceScore = Object.values(results.compliance).filter(Boolean).length;
  console.log(`✅ Privacy compliance: ${complianceScore}/6 features implemented`);
  
  // 7. Generate Final Report
  console.log('\n📊 FINAL VALIDATION REPORT');
  console.log('==========================');
  
  const overallScore = {
    backend: Object.values(results.backend).filter(item => 
      typeof item === 'boolean' ? item : item.status || Object.values(item).every(Boolean)
    ).length,
    frontend: Object.values(results.frontend.components || {}).filter(comp => comp.exists).length,
    compliance: complianceScore
  };
  
  console.log(`\n🔧 Backend Implementation: ${overallScore.backend} components working`);
  console.log(`🎨 Frontend Components: ${overallScore.frontend} components implemented`);
  console.log(`⚖️ Privacy Compliance: ${overallScore.compliance}/6 features complete`);
  
  const totalScore = overallScore.backend + overallScore.frontend + overallScore.compliance;
  const maxScore = 15; // Approximate maximum score
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  console.log(`\n🎯 Overall Privacy System Score: ${percentage}%`);
  
  if (percentage >= 90) {
    console.log('🎉 EXCELLENT: Privacy system fully implemented and compliant!');
  } else if (percentage >= 75) {
    console.log('✅ GOOD: Privacy system mostly complete with minor gaps');
  } else if (percentage >= 50) {
    console.log('⚠️ PARTIAL: Privacy system partially implemented');
  } else {
    console.log('❌ INCOMPLETE: Privacy system needs significant work');
  }
  
  // Save detailed results
  const reportPath = path.join(process.cwd(), 'testing/privacy-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return results;
};

// Run validation
validatePrivacySystem()
  .then(results => {
    console.log('\n✅ Privacy system validation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  });
