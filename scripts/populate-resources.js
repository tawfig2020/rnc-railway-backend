/**
 * Populate Resources Script
 * 
 * This script creates placeholder resources for the Refugee Network Centre platform,
 * including items for AI Hub and Career Fair sections under the "Our Resources" menu.
 */

const mongoose = require('mongoose');
const config = require('../config/config.js');
const Resource = require('../models/Resource');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Resource categories that match the Resource model enum values
const resourceCategories = [
  'education', // For AI Hub resources
  'employment', // For Career Fair resources
  'community',  // For Community resources
  'other'       // For other resources
];

// Sample resources
const sampleResources = [
  // AI Hub resources
  {
    title: 'AI Translation Assistant',
    category: 'education',  // Changed from 'AI Hub' to valid enum value
    type: 'service',       // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization field
    description: 'An AI-powered tool that helps refugees translate important documents and communicate in their new community.',
    languages: ['English', 'Arabic', 'French'], // Added required languages
    content: `
# AI Translation Assistant

Our AI Translation Assistant is designed specifically for refugees who need to quickly translate documents or communicate in their new host country. Unlike generic translation tools, this assistant understands context related to immigration, healthcare, education, and employment documents.

## Features

- **Document Translation**: Upload photos of documents to get translations
- **Conversation Mode**: Real-time translation for in-person conversations
- **Specialized Vocabulary**: Accurate translations of legal and administrative terms
- **Offline Mode**: Basic translation capabilities without internet connection
- **Voice-to-Text**: Speak in your language and get written translations

## How to Access

This tool is available for free to all registered users of the Refugee Network Centre platform. Simply log in and navigate to the AI Hub section.

## Privacy and Security

We understand that many documents contain sensitive information. All uploads are encrypted and automatically deleted after 24 hours unless you choose to save them to your secure personal account.
    `,
    fileUrl: '/assets/resources/ai-translation-guide.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/ai-translation.jpg',
    featured: true
  },
  {
    title: 'AI Job Match Platform',
    category: 'employment',  // Changed from 'AI Hub' to valid enum value
    type: 'service',        // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization
    languages: ['English', 'Arabic', 'French'], // Added required languages
    description: 'AI-powered job matching system that helps refugees find employment opportunities matching their skills and experience.',
    content: `
# AI Job Match Platform

Finding employment that matches your skills can be challenging in a new country. Our AI Job Match Platform analyzes your skills, experience, and preferences to identify suitable job opportunities and training programs.

## How It Works

1. **Create Your Profile**: Enter your work experience, education, skills, and certifications
2. **Skill Recognition**: Our AI identifies transferable skills that might not be obvious
3. **Job Matching**: Receive personalized job recommendations based on your profile
4. **Training Suggestions**: Get recommendations for courses or certifications that could increase your employability
5. **Application Support**: Access templates and guidance for applications to matched positions

## Special Features for Refugees

- **Qualification Mapping**: Tool to help explain how your qualifications from your home country relate to local standards
- **Work Rights Guidance**: Clear information about work permissions based on your immigration status
- **Cultural Workplace Tips**: Insights about workplace norms in your new country
- **Language Level Filter**: Find opportunities matching your current language proficiency

## Success Stories

Since launching this platform, we've helped over 500 refugees find meaningful employment that utilizes their skills and experience. Read our case studies to learn more about how this tool has changed lives.
    `,
    fileUrl: '/assets/resources/ai-job-match-guide.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/ai-job-match.jpg',
    type: 'service', // Changed from 'tool' to a valid enum value
    featured: true
  },
  
  // Career Fair resources
  {
    title: 'Virtual Career Fair - Spring 2025',
    category: 'employment',  // Changed from 'Career Fair' to valid enum value
    type: 'service',        // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization
    languages: ['English', 'Arabic', 'French'], // Added required languages
    description: 'Join our upcoming virtual career fair connecting refugee job seekers with inclusive employers.',
    content: `
# Virtual Career Fair - Spring 2025

## Event Details

**Dates**: April 15-17, 2025  
**Time**: 10:00 AM - 4:00 PM (Local Time)  
**Platform**: Refugee Network Centre Virtual Event Space  
**Cost**: Free for all job seekers

## What to Expect

Our Virtual Career Fair brings together employers committed to diversity and inclusion with talented job seekers from refugee backgrounds. The event features:

- **Live Video Interviews**: Schedule one-on-one meetings with recruiters
- **Company Presentations**: Learn about organizational culture and opportunities
- **Resume Reviews**: Get feedback from HR professionals
- **Industry Panels**: Hear insights about different career paths
- **Skills Workshops**: Practical sessions on job search and interview skills

## Participating Companies

This season's career fair includes over 30 employers from various industries, including:

- Technology and Software Development
- Healthcare and Medical Services
- Financial Services
- Manufacturing and Production
- Education and Training
- Hospitality and Customer Service
- Social Services and Nonprofit

## Preparation Resources

To help you make the most of the career fair, we offer:

- Pre-event resume workshops
- Interview practice sessions
- Company research guides
- Tech check sessions to ensure your equipment is ready

## Registration

Registration opens March 1, 2025. Create a profile on our platform to be notified when registration begins.
    `,
    fileUrl: '/assets/resources/career-fair-guide.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/career-fair.jpg',
    type: 'service', // Changed from 'event' to valid enum value
    featured: true
  },
  {
    title: 'Employer Partnership Program',
    category: 'employment',  // Changed from 'Career Fair' to valid enum value
    type: 'service',        // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization
    languages: ['English', 'Arabic', 'French'], // Added required languages
    description: 'Information for employers interested in joining our network of refugee-friendly workplaces.',
    content: `
# Employer Partnership Program

The Refugee Network Centre's Employer Partnership Program connects forward-thinking organizations with talented professionals from refugee backgrounds. By joining our network, employers gain access to a diverse talent pool while making a meaningful social impact.

## Benefits for Employers

- **Diverse Talent Pipeline**: Access to qualified candidates with international experience and multilingual capabilities
- **Recruitment Support**: Assistance with job posting, candidate screening, and cultural integration
- **Training Resources**: Cultural competency training for your HR team and managers
- **Tax Incentives**: Information on available incentives for hiring from underrepresented groups
- **Brand Recognition**: Recognition as an inclusive employer on our platform and at events

## Partnership Levels

### Bronze Partner
- Participation in bi-annual career fairs
- Job postings on our platform
- Basic candidate matching services

### Silver Partner
- All Bronze benefits
- Featured employer status
- Custom recruitment campaigns
- Quarterly talent pool reports

### Gold Partner
- All Silver benefits
- Priority access to specialized talent
- On-site cultural integration workshops
- Co-branded content opportunities
- Dedicated account manager

## Success Stories

Our employer partners have reported numerous benefits from hiring refugee professionals:

- Increased workplace diversity and innovation
- Access to new market insights through multilingual staff
- Improved employee retention rates
- Enhanced company reputation and community engagement

## Join Our Network

To learn more about becoming an employer partner, contact our employer relations team at employers@refugeenetwork.org or complete our partnership inquiry form.
    `,
    fileUrl: '/assets/resources/employer-partnership-guide.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/employer-program.jpg',
    type: 'pdf',  // Changed from 'guide' to valid enum value
    featured: false
  },
  
  // Educational Materials
  {
    title: 'Language Learning Resource Guide',
    category: 'education',  // Changed from 'Educational Materials' to valid enum value
    type: 'pdf',           // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization
    languages: ['English', 'Arabic', 'French'], // Added required languages
    description: 'Comprehensive guide to free and affordable language learning resources for refugees.',
    content: `
# Language Learning Resource Guide

Learning the language of your host country is one of the most important steps toward successful integration. This guide compiles quality resources that are free or low-cost, with special focus on materials designed for refugees and asylum seekers.

## Online Learning Platforms

### Free Resources
- **DuoLingo**: Basic language learning with gamified approach
- **RefuSpeak**: Specifically designed for refugee integration scenarios
- **Language Exchange Network**: Connect with native speakers for practice

### Government-Funded Programs
- List of government-sponsored language courses by region
- Eligibility requirements and application processes
- Transportation and childcare support options

## In-Person Learning Opportunities

### Community Classes
- Directory of community centers offering language classes
- Library programs and conversation circles
- Faith-based organization offerings

### Formal Education Programs
- Adult education centers with refugee-focused programs
- College and university options with fee waivers for refugees
- Vocational training with integrated language components

## Self-Study Resources

### Mobile Apps
- Recommended apps with offline capabilities
- Pronunciation-focused applications
- Vocabulary builders for different professions

### Printed Materials
- Workbooks available through our resource center
- Picture dictionaries for beginners
- Field-specific vocabulary guides (medical, legal, etc.)

## Language Learning Tips

- Effective study habits for adult learners
- Overcoming language learning anxiety
- Integrating language practice into daily life
- Setting realistic goals and tracking progress

This guide is updated quarterly to ensure all information remains current.
    `,
    fileUrl: '/assets/resources/language-learning-guide.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/language-learning.jpg',
    type: 'pdf',  // Changed from 'guide' to valid enum value
    featured: false
  }
];

// Sample donation options
const donationOptions = [
  {
    title: 'Emergency Relief Fund',
    category: 'community',  // Changed from 'Community Resources' to valid enum value
    type: 'service',        // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization
    languages: ['English', 'Arabic', 'French'], // Added required languages
    description: 'Support immediate needs of newly arrived refugees including temporary housing, food, and essential supplies.',
    content: `
# Emergency Relief Fund

Your contribution to the Emergency Relief Fund provides critical support to refugees in their first days and weeks after arrival. This fund addresses immediate needs that often cannot wait for long-term assistance programs.

## What Your Donation Provides

### Immediate Shelter
- Temporary housing assistance
- Hotel vouchers for families awaiting permanent housing
- Emergency shelter supplies

### Essential Supplies
- Food and grocery assistance
- Hygiene products and personal care items
- Weather-appropriate clothing
- Baby supplies and children's necessities

### Urgent Medical Care
- Emergency medical assistance
- Prescription medications
- Mental health crisis support

### Transportation Assistance
- Public transportation passes
- Emergency transportation to medical appointments
- School transportation for children

## How Funds Are Allocated

- 85% direct assistance to refugees
- 10% program coordination and case management
- 5% administrative costs

## Success Stories

*"When we arrived, we had nothing. The Emergency Relief Fund provided us with a hotel room for our family of five while our housing application was processed, and gave us grocery cards to feed our children. This support meant everything during those uncertain first weeks."* - Fatima, arrived from Syria in 2023

## Donation Options

- One-time donation
- Monthly recurring support
- Donor-advised targeting to specific needs

All donations to the Emergency Relief Fund are tax-deductible to the extent allowed by law.
    `,
    fileUrl: '/assets/resources/emergency-fund-info.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/emergency-fund.jpg',
    type: 'service',  // Changed from 'donation' to valid enum value
    featured: true
  },
  {
    title: 'Education Scholarship Fund',
    category: 'education',  // Changed from 'Community Resources' to valid enum value
    type: 'service',        // Added required type field with valid enum value
    organization: 'Refugee Network Centre', // Added required organization
    languages: ['English', 'Arabic', 'French'], // Added required languages
    description: 'Help refugee students access education through scholarships for tuition, books, and educational supplies.',
    content: `
# Education Scholarship Fund

Education is a powerful tool for rebuilding lives. Our Education Scholarship Fund helps refugee students of all ages access quality education by removing financial barriers.

## Scholarship Programs

### Higher Education Scholarships
- University and college tuition assistance
- Vocational training program support
- Professional certification funding

### Youth Education Support
- School supplies and equipment
- Extracurricular activity fees
- Tutoring and educational support services

### Professional Development
- Recertification costs for internationally trained professionals
- Language proficiency exam fees
- Professional licensing costs

## Impact of Your Donation

- $50 provides school supplies for a semester
- $250 funds language proficiency testing
- $500 supports vocational training certification
- $1,000 contributes to a university semester
- $5,000 funds a complete professional recertification process

## Selection Process

Scholarships are awarded based on financial need, educational goals, and commitment to community service. Our selection committee includes educators, community leaders, and former scholarship recipients.

## Stories of Transformation

*"The scholarship allowed me to complete my nursing recertification. After practicing medicine for 12 years in my home country, starting over seemed impossible. Today, I work as a registered nurse and can support my family again."* - Hassan, Scholarship Recipient

## Ways to Support

- Individual donations
- Corporate matching programs
- Memorial and honorary scholarships
- Endowment contributions

Join us in building brighter futures through education.
    `,
    fileUrl: '/assets/resources/scholarship-fund-info.pdf',
    thumbnailUrl: '/assets/resources/thumbnails/scholarship-fund.jpg',
    type: 'service', // Changed from 'donation' to valid enum value
    organization: 'Refugee Network Centre', // Added required organization field
    languages: ['English', 'Arabic', 'French'], // Added required languages field
    category: 'education', // Added required category field
    featured: true
  }
];

// Create default admin user if needed
const getAdminUser = async () => {
  try {
    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@refugeenetwork.org' });
    
    if (!adminUser) {
      // Create admin user
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@refugeenetwork.org',
        password: 'placeholder123', // This would be properly hashed in a real scenario
        role: 'admin'
      });
      await adminUser.save();
      console.log('Created default admin user');
    }
    
    return adminUser;
  } catch (err) {
    console.error('Error creating/finding admin user:', err);
    process.exit(1);
  }
};

// Main function to populate resources
const populateResources = async () => {
  try {
    // Get admin user
    const adminUser = await getAdminUser();
    
    // Create resources
    const allResources = [...sampleResources, ...donationOptions];
    
    for (const resourceData of allResources) {
      // Check if resource already exists
      const existingResource = await Resource.findOne({ title: resourceData.title });
      
      if (!existingResource) {
        const resource = new Resource({
          ...resourceData,
          addedBy: adminUser._id,  // Changed from author to addedBy as required by the model
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await resource.save();
        console.log(`Created resource: ${resourceData.title}`);
      }
    }
    
    console.log('Resources created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating resources:', err);
    process.exit(1);
  }
};

// Run the population script
populateResources();
