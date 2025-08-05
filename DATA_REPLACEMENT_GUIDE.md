# RNC PLATFORM DATA REPLACEMENT GUIDE

## Complete Strategy for Replacing Mock Data with Real Content

---

## 🎯 OVERVIEW

This guide provides step-by-step instructions to replace all mock data with real data before final deployment of the RNC platform.

---

## 📋 CURRENT MOCK DATA LOCATIONS

### **1. Frontend Mock Data**
- **File**: `client/src/data/mockData.js`
- **Contains**:
  - `mockCourses` - 4 sample courses
  - `mockMarketplaceItems` - 6 sample products
  - `mockBlogs` - Sample blog posts
  - `mockForumQuestions` - Forum discussions
  - `mockCommunityProjects` - Community initiatives
  - `mockAIProjects` - AI hub projects

### **2. Backend Seeded Data**
- **File**: `seeder.js`
- **Contains**: Admin users and basic categories

### **3. Test Data**
- **Files**: Various test files with mock data for testing


---

## 🚀 PHASE-BY-PHASE REPLACEMENT STRATEGY

### **PHASE 1: ADMIN SETUP & CONTENT MANAGEMENT (Week 1)**

#### Step 1.1: Create Admin Accounts
```bash
# Run admin creation script
node create-admin.js
```

**Required Admin Roles:**
- Super Admin (Platform Owner)
- Content Manager
- Marketplace Manager
- Community Moderator

#### Step 1.2: Set Up Content Management System
**Files to Update:**
- `client/src/components/admin/ContentManagement.js` (create)
- `client/src/components/admin/CourseManagement.js` (create)
- `client/src/components/admin/BlogManagement.js` (create)

#### Step 1.3: Configure Image Storage
**Action Required:**
- Set up Cloudinary or AWS S3 for image storage
- Update image upload functionality
- Replace placeholder images with real content


---

### **PHASE 2: COURSE CONTENT REPLACEMENT (Week 2)**

#### Step 2.1: Identify Real Courses
**Pages Affected:**
- `client/src/pages/CoursesPage.js`
- `client/src/pages/CourseDetail.js`
- `client/src/components/CourseCard.js`

**Data Structure Required:**
```javascript
{
  title: "Real Course Title",
  description: "Detailed course description",
  instructor: "Real Instructor Name",
  duration: "Actual duration",
  level: "Beginner/Intermediate/Advanced",
  language: "Course language",
  category: "Real category",
  modules: [
    {
      title: "Module 1 Title",
      description: "Module description",
      duration: "Module duration",
      content: "Actual learning content"
    }
  ],
  price: 0, // or actual price
  image: "real-course-image-url"
}
```

#### Step 2.2: Content Collection Process
1. **Identify Course Providers**: Partner organizations, NGOs, educational institutions
2. **Content Validation**: Ensure courses meet refugee community needs
3. **Quality Assurance**: Review all course materials
4. **Translation**: Prepare multilingual content

#### Step 2.3: Database Migration
```bash
# Run course migration
node scripts/data-migration.js courses
```

---

### **PHASE 3: MARKETPLACE PRODUCT REPLACEMENT (Week 3)**

#### Step 3.1: Vendor Onboarding
**Pages Affected:**
- `client/src/pages/MarketplacePage.js`
- `client/src/pages/ProductDetails.js`
- `client/src/components/ProductCard.js`

**Required Actions:**
1. **Vendor Registration**: Real refugee entrepreneurs and artisans
2. **Product Verification**: Quality and authenticity checks
3. **Payment Setup**: Stripe/PayPal integration for real transactions
4. **Shipping Configuration**: Real logistics and delivery

#### Step 3.2: Product Data Structure
```javascript
{
  title: "Real Product Name",
  description: "Detailed product description",
  price: 25.99, // Real pricing
  vendor: {
    name: "Real Vendor Name",
    location: "Actual Location",
    rating: 4.8,
    verified: true
  },
  images: ["real-product-image-1.jpg", "real-product-image-2.jpg"],
  category: "Real Category",
  inStock: true,
  quantity: 10,
  shipping: {
    cost: 5.00,
    estimatedDays: "3-5 business days"
  }
}
```

#### Step 3.3: Payment Integration
**Files to Update:**
- `client/src/components/checkout/PaymentForm.js`
- `routes/orders.js`
- `routes/payments.js`

---

### **PHASE 4: BLOG & CONTENT REPLACEMENT (Week 4)**

#### Step 4.1: Real Blog Content
**Pages Affected:**
- `client/src/pages/Blog.js`
- `client/src/pages/BlogPost.js`
- `client/src/components/BlogCard.js`

**Content Sources:**
1. **Community Stories**: Real refugee success stories
2. **Educational Articles**: Integration guides, skill development
3. **News Updates**: Community events and announcements
4. **Resource Guides**: Practical information for refugees

#### Step 4.2: Content Creation Workflow
1. **Content Planning**: Editorial calendar
2. **Writer Recruitment**: Community members, volunteers
3. **Review Process**: Content moderation and approval
4. **SEO Optimization**: Keywords and meta descriptions

---

### **PHASE 5: FORUM & COMMUNITY DATA (Week 5)**

#### Step 5.1: Real Forum Content
**Pages Affected:**
- `client/src/pages/Forum.js`
- `client/src/components/ForumPost.js`
- `client/src/components/ForumCategory.js`

**Required Actions:**
1. **Seed Real Discussions**: Start with common refugee questions
2. **Expert Verification**: Verify community experts and advisors
3. **Moderation Setup**: Community guidelines and moderation tools
4. **Multilingual Support**: Support for multiple languages

---

### **PHASE 6: EVENTS & ACTIVITIES (Week 6)**

#### Step 6.1: Real Events Data
**Pages Affected:**
- `client/src/pages/EventsPage.js`
- `client/src/components/EventCard.js`

**Event Types:**
- Job fairs and career events
- Community workshops
- Cultural celebrations
- Educational seminars
- Networking meetups

---

## 🔧 TECHNICAL IMPLEMENTATION STEPS

### **Step 1: Update API Endpoints**
Replace mock data responses with database queries:

```javascript
// Before (Mock Data)
app.get('/api/courses', (req, res) => {
  res.json(mockCourses);
});

// After (Real Data)
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor category');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **Step 2: Update Frontend Data Fetching**
Remove mock data imports and use API calls:

```javascript
// Before
import { mockCourses } from '../data/mockData';

// After
const [courses, setCourses] = useState([]);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  fetchCourses();
}, []);
```

### **Step 3: Image Management**
Set up proper image storage and CDN:

```javascript
// Image upload configuration
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

---

## 📊 DATA VALIDATION CHECKLIST

### **Before Going Live:**
- [ ] All mock data removed from frontend
- [ ] Real courses with verified instructors
- [ ] Marketplace products from verified vendors
- [ ] Blog posts with real content
- [ ] Forum seeded with relevant discussions
- [ ] Events calendar with real upcoming events
- [ ] User profiles with real community members
- [ ] Payment system tested with real transactions
- [ ] Image storage and CDN configured
- [ ] Search functionality working with real data
- [ ] Analytics tracking implemented
- [ ] Backup and recovery procedures tested

---

## 🚨 CRITICAL CONSIDERATIONS

### **Legal & Compliance**
- [ ] GDPR compliance for user data
- [ ] Content licensing and permissions
- [ ] Terms of service updated
- [ ] Privacy policy reflects real data handling

### **Security**
- [ ] Real payment processing security
- [ ] User data encryption
- [ ] API rate limiting
- [ ] Content moderation tools

### **Performance**
- [ ] Database indexing for real data volume
- [ ] Image optimization and compression
- [ ] CDN configuration for global access
- [ ] Caching strategies implemented

---

## 🎯 SUCCESS METRICS

### **Post-Migration KPIs:**
- User registration and engagement rates
- Course completion rates
- Marketplace transaction volume
- Content creation and interaction
- Platform performance metrics
- User satisfaction scores

---

## 📞 SUPPORT & MAINTENANCE

### **Ongoing Tasks:**
- Regular content updates
- User support and moderation
- Performance monitoring
- Security updates
- Feature enhancements based on user feedback

---

**Next Steps:** Start with Phase 1 and work systematically through each phase. Each phase should be tested thoroughly before moving to the next.
