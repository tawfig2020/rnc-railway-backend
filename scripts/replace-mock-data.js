#!/usr/bin/env node

/**
 * Mock Data Replacement Script
 * This script helps identify and replace all mock data with real data
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class MockDataReplacer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.mockDataFiles = [];
    this.replacementLog = [];
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    this.replacementLog.push(`${new Date().toISOString()}: ${message}`);
  }

  // Find all files containing mock data
  findMockDataFiles() {
    this.log('Scanning for mock data files...');
    
    const searchPatterns = [
      'mockData',
      'mock',
      'placeholder',
      'sample',
      'dummy',
      'test-data'
    ];

    const searchDirectories = [
      path.join(this.projectRoot, 'client/src'),
      path.join(this.projectRoot, 'data'),
      path.join(this.projectRoot, 'scripts')
    ];

    searchDirectories.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.scanDirectory(dir, searchPatterns);
      }
    });

    this.log(`Found ${this.mockDataFiles.length} files with potential mock data`);
    return this.mockDataFiles;
  }

  scanDirectory(directory, patterns) {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory() && !file.name.includes('node_modules')) {
        this.scanDirectory(fullPath, patterns);
      } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.jsx'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check if file contains mock data patterns
          const containsMockData = patterns.some(pattern => 
            content.toLowerCase().includes(pattern.toLowerCase())
          );
          
          if (containsMockData) {
            this.mockDataFiles.push({
              path: fullPath,
              relativePath: path.relative(this.projectRoot, fullPath),
              patterns: patterns.filter(pattern => 
                content.toLowerCase().includes(pattern.toLowerCase())
              )
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    });
  }

  // Analyze mock data usage
  analyzeMockDataUsage() {
    this.log('Analyzing mock data usage...');
    
    const analysis = {
      courses: { files: [], count: 0 },
      products: { files: [], count: 0 },
      blogs: { files: [], count: 0 },
      forum: { files: [], count: 0 },
      events: { files: [], count: 0 },
      users: { files: [], count: 0 }
    };

    this.mockDataFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file.path, 'utf8');
        
        // Check for specific mock data types
        Object.keys(analysis).forEach(dataType => {
          const patterns = [
            `mock${dataType}`,
            `${dataType}Mock`,
            `sample${dataType}`,
            `dummy${dataType}`
          ];
          
          patterns.forEach(pattern => {
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
              analysis[dataType].files.push(file.relativePath);
              analysis[dataType].count++;
            }
          });
        });
      } catch (error) {
        this.log(`Error reading file ${file.path}: ${error.message}`);
      }
    });

    return analysis;
  }

  // Generate replacement checklist
  generateReplacementChecklist() {
    const analysis = this.analyzeMockDataUsage();
    
    const checklist = {
      immediate: [],
      phase1: [],
      phase2: [],
      phase3: []
    };

    // Categorize replacements by priority
    if (analysis.courses.count > 0) {
      checklist.phase1.push({
        task: 'Replace Course Mock Data',
        files: analysis.courses.files,
        priority: 'HIGH',
        description: 'Replace with real educational content and verified instructors'
      });
    }

    if (analysis.products.count > 0) {
      checklist.phase2.push({
        task: 'Replace Marketplace Mock Data',
        files: analysis.products.files,
        priority: 'HIGH',
        description: 'Replace with real vendor products and verified sellers'
      });
    }

    if (analysis.blogs.count > 0) {
      checklist.phase1.push({
        task: 'Replace Blog Mock Data',
        files: analysis.blogs.files,
        priority: 'MEDIUM',
        description: 'Replace with real community stories and educational content'
      });
    }

    if (analysis.forum.count > 0) {
      checklist.phase3.push({
        task: 'Replace Forum Mock Data',
        files: analysis.forum.files,
        priority: 'MEDIUM',
        description: 'Seed with real community discussions and expert answers'
      });
    }

    if (analysis.events.count > 0) {
      checklist.phase3.push({
        task: 'Replace Events Mock Data',
        files: analysis.events.files,
        priority: 'LOW',
        description: 'Add real community events and workshops'
      });
    }

    return checklist;
  }

  // Create backup of current mock data
  createBackup() {
    this.log('Creating backup of current mock data...');
    
    const backupDir = path.join(this.projectRoot, 'backups/mock-data');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    this.mockDataFiles.forEach(file => {
      try {
        const backupPath = path.join(backupDir, path.basename(file.path));
        fs.copyFileSync(file.path, backupPath);
        this.log(`Backed up: ${file.relativePath}`);
      } catch (error) {
        this.log(`Error backing up ${file.path}: ${error.message}`);
      }
    });
  }

  // Generate comprehensive report
  generateReport() {
    const analysis = this.analyzeMockDataUsage();
    const checklist = this.generateReplacementChecklist();
    
    const report = `
# MOCK DATA REPLACEMENT REPORT
Generated: ${new Date().toISOString()}

## SUMMARY
- Total files with mock data: ${this.mockDataFiles.length}
- Course-related files: ${analysis.courses.count}
- Product-related files: ${analysis.products.count}
- Blog-related files: ${analysis.blogs.count}
- Forum-related files: ${analysis.forum.count}
- Event-related files: ${analysis.events.count}

## FILES REQUIRING ATTENTION

### Course Data Files:
${analysis.courses.files.map(file => `- ${file}`).join('\n')}

### Product Data Files:
${analysis.products.files.map(file => `- ${file}`).join('\n')}

### Blog Data Files:
${analysis.blogs.files.map(file => `- ${file}`).join('\n')}

### Forum Data Files:
${analysis.forum.files.map(file => `- ${file}`).join('\n')}

### Event Data Files:
${analysis.events.files.map(file => `- ${file}`).join('\n')}

## REPLACEMENT CHECKLIST

### PHASE 1 (Immediate - Week 1-2):
${checklist.phase1.map(item => `
- [ ] ${item.task}
  Priority: ${item.priority}
  Description: ${item.description}
  Files: ${item.files.join(', ')}
`).join('')}

### PHASE 2 (Week 3-4):
${checklist.phase2.map(item => `
- [ ] ${item.task}
  Priority: ${item.priority}
  Description: ${item.description}
  Files: ${item.files.join(', ')}
`).join('')}

### PHASE 3 (Week 5-6):
${checklist.phase3.map(item => `
- [ ] ${item.task}
  Priority: ${item.priority}
  Description: ${item.description}
  Files: ${item.files.join(', ')}
`).join('')}

## NEXT STEPS

1. **Immediate Actions:**
   - Review this report with your team
   - Assign responsibilities for each phase
   - Set up content collection processes
   - Establish quality assurance procedures

2. **Content Collection:**
   - Partner with refugee organizations for real stories
   - Connect with verified educators for course content
   - Onboard real vendors for marketplace products
   - Gather authentic community discussions

3. **Technical Implementation:**
   - Set up admin dashboard for content management
   - Configure image storage and CDN
   - Implement content approval workflows
   - Test all functionality with real data

4. **Quality Assurance:**
   - Verify all content is culturally appropriate
   - Ensure translations are accurate
   - Test user experience with real data
   - Validate all integrations work properly

## IMPORTANT NOTES

- Always backup current data before making changes
- Test thoroughly in staging environment first
- Coordinate with legal team for content permissions
- Ensure GDPR compliance for all real user data
- Plan for gradual rollout to minimize disruption

---
Report generated by Mock Data Replacement Script
`;

    const reportPath = path.join(this.projectRoot, 'MOCK_DATA_REPLACEMENT_REPORT.md');
    fs.writeFileSync(reportPath, report);
    this.log(`Report saved to: ${reportPath}`);
    
    return reportPath;
  }

  // Interactive replacement wizard
  async runInteractiveWizard() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    console.log('\n🚀 MOCK DATA REPLACEMENT WIZARD\n');
    console.log('This wizard will help you replace mock data with real data.\n');

    const shouldProceed = await question('Do you want to proceed with the analysis? (y/n): ');
    
    if (shouldProceed.toLowerCase() !== 'y') {
      console.log('Operation cancelled.');
      rl.close();
      return;
    }

    // Run analysis
    this.findMockDataFiles();
    const analysis = this.analyzeMockDataUsage();
    
    console.log('\n📊 ANALYSIS RESULTS:');
    console.log(`- Found ${this.mockDataFiles.length} files with mock data`);
    console.log(`- Course files: ${analysis.courses.count}`);
    console.log(`- Product files: ${analysis.products.count}`);
    console.log(`- Blog files: ${analysis.blogs.count}`);
    console.log(`- Forum files: ${analysis.forum.count}`);
    console.log(`- Event files: ${analysis.events.count}`);

    const shouldBackup = await question('\nDo you want to create a backup? (y/n): ');
    if (shouldBackup.toLowerCase() === 'y') {
      this.createBackup();
      console.log('✅ Backup created successfully!');
    }

    const shouldGenerateReport = await question('\nDo you want to generate a detailed report? (y/n): ');
    if (shouldGenerateReport.toLowerCase() === 'y') {
      const reportPath = this.generateReport();
      console.log(`✅ Report generated: ${reportPath}`);
    }

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Review the generated report');
    console.log('2. Follow the phase-by-phase replacement plan');
    console.log('3. Test thoroughly before going live');
    console.log('4. Coordinate with your content team');

    rl.close();
  }

  // Run full analysis
  runFullAnalysis() {
    this.log('Starting full mock data analysis...');
    
    this.findMockDataFiles();
    this.createBackup();
    const reportPath = this.generateReport();
    
    this.log('Analysis completed successfully!');
    console.log(`\n📋 Report generated: ${reportPath}`);
    console.log('\n🚀 Next steps:');
    console.log('1. Review the detailed report');
    console.log('2. Follow the implementation phases');
    console.log('3. Coordinate with your team');
    
    return reportPath;
  }
}

// Command line interface
if (require.main === module) {
  const replacer = new MockDataReplacer();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--interactive') || args.includes('-i')) {
    replacer.runInteractiveWizard().catch(console.error);
  } else {
    replacer.runFullAnalysis();
  }
}

module.exports = MockDataReplacer;
