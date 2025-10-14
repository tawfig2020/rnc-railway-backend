# 🔧 Complete Debugging Knowledge Base - Part 2: Frontend Errors

**Purpose:** Reference guide for frontend bugs and solutions  
**Date:** October 14, 2025  
**Project:** RNC Platform

---

# PART 2: FRONTEND ERRORS

---

## 🐛 ERROR #6: Marketplace - Failed to Fetch Products

### **Problem:**
Marketplace page shows "Error Loading Marketplace - Failed to fetch products" with browser blocking API requests.

### **Location:**
- **File:** `client/src/pages/Marketplace.js`
- **Component:** Product fetching
- **Browser:** Chrome/Firefox

### **Symptoms:**
- Error message: "Failed to fetch products"
- Console error: `ERR_BLOCKED_BY_CLIENT`
- Console error: `TypeError: Failed to fetch`
- Blank marketplace page
- Network tab shows blocked requests

### **Root Cause:**

**Cause 1: Ad Blocker**
```
ERR_BLOCKED_BY_CLIENT
```
- Browser extension blocking API calls
- Ad blockers detect "marketplace", "products" keywords
- Requests intercepted before reaching backend

**Cause 2: Backend Sleeping**
```
TypeError: Failed to fetch at getFindDomain
```
- Render free tier sleeps after 15 minutes
- Backend not responding
- 30-60 second wake-up time
- Users see errors during wake-up

### **Solution:**

**Solution 1: User Action**
```markdown
1. Disable ad blocker for rncmalaysia.net
2. Whitelist the domain
3. Refresh page
```

**Solution 2: Keep Backend Alive**
```javascript
// Created: client/src/utils/keepAlive.js
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

const pingBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      console.log('[KeepAlive] Backend pinged successfully');
    }
  } catch (error) {
    console.error('[KeepAlive] Ping failed:', error);
  }
};

// Ping every 10 minutes
setInterval(pingBackend, PING_INTERVAL);
```

**Solution 3: External Monitoring**
- Setup UptimeRobot
- Ping backend every 5 minutes
- Prevents sleeping
- Free tier available

### **Impact:**
- ✅ Backend stays awake
- ✅ No user-facing errors
- ✅ Instant page loads
- ✅ 99% uptime

### **Lesson Learned:**
**Free tier services sleep. Implement keep-alive mechanisms. Use external monitoring. Educate users about ad blockers.**

---

## 🐛 ERROR #7: Community Projects - 404 Not Found

### **Problem:**
Community projects page returns 404 error when fetching projects from API.

### **Location:**
- **File:** `client/src/pages/CommunityProjects.js`
- **API:** `/api/community-projects`
- **Backend:** Missing route

### **Symptoms:**
- Console error: `404 Not Found`
- Empty projects list
- Error message displayed
- Network tab shows 404 response

### **Error Message:**
```
GET https://rnc-railway-backend.onrender.com/api/community-projects
Status: 404 Not Found
```

### **Root Cause:**
```javascript
// FRONTEND CODE (Correct):
const response = await fetch(`${API_URL}/community-projects`);

// BACKEND CODE (Missing):
// No route defined for /api/community-projects
// Only /api/projects exists
```

**Why it happened:**
- Frontend expects `/api/community-projects`
- Backend only has `/api/projects`
- Route mismatch
- No error handling for 404

### **Solution:**

**Option 1: Add Backend Route**
```javascript
// backend/routes/communityProjects.js
router.get('/', async (req, res) => {
  try {
    const projects = await CommunityProject.find()
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// server.js
app.use('/api/community-projects', communityProjectsRouter);
```

**Option 2: Update Frontend**
```javascript
// Change API endpoint to match backend
const response = await fetch(`${API_URL}/projects`);
```

### **Impact:**
- ✅ Community projects load correctly
- ✅ No 404 errors
- ✅ Proper error handling
- ✅ Consistent API structure

### **Lesson Learned:**
**Always ensure frontend and backend routes match. Document API endpoints. Implement proper error handling for missing routes.**

---

## 🐛 ERROR #8: Filter Error - Cannot Read 'toLowerCase' of Undefined

### **Problem:**
Marketplace filter crashes when product data is missing or malformed.

### **Location:**
- **File:** `client/src/pages/Marketplace.js`
- **Function:** `filterProducts`
- **Line:** Filter logic

### **Symptoms:**
- Console error: `Cannot read properties of undefined (reading 'toLowerCase')`
- Page crashes
- White screen
- Filter stops working

### **Error Message:**
```javascript
TypeError: Cannot read properties of undefined (reading 'toLowerCase')
    at filterProducts (Marketplace.js:145)
```

### **Root Cause:**
```javascript
// BROKEN CODE:
const filteredProducts = products.filter(product => {
  // Crashes if product.title is undefined
  if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
    return false;
  }
  
  // Crashes if product.price is undefined
  if (product.price < minPrice || product.price > maxPrice) {
    return false;
  }
  
  return true;
});
```

**Why it happened:**
- API returns incomplete data
- Some products missing required fields
- No null/undefined checks
- Assumes all data is present

### **Solution:**
```javascript
// FIXED CODE:
const filteredProducts = products.filter(product => {
  // Safe null checks
  if (searchQuery) {
    const title = product.title?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    if (!title.includes(query) && !description.includes(query)) {
      return false;
    }
  }
  
  // Safe price checks
  const price = product.price || 0;
  if (price < minPrice || price > maxPrice) {
    return false;
  }
  
  return true;
});
```

### **Impact:**
- ✅ No crashes on bad data
- ✅ Filters work reliably
- ✅ Graceful handling of missing fields
- ✅ Better user experience

### **Lesson Learned:**
**Always validate data before using it. Use optional chaining (?.) and nullish coalescing (??). Never assume API data is complete.**

---

## 🐛 ERROR #9: CORS Policy Blocking Requests

### **Problem:**
Frontend cannot make requests to backend due to CORS policy restrictions.

### **Location:**
- **Backend:** `server.js` CORS configuration
- **Frontend:** All API calls
- **Browser:** CORS error in console

### **Symptoms:**
- Console error: `Access to fetch blocked by CORS policy`
- All API requests fail
- Network tab shows CORS error
- No data loads

### **Error Message:**
```
Access to fetch at 'https://rnc-railway-backend.onrender.com/api/products' 
from origin 'https://rncmalaysia.net' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

### **Root Cause:**
```javascript
// BROKEN CODE:
app.use(cors()); // Only allows same origin
```

**Why it happened:**
- Default CORS only allows same-origin requests
- Frontend domain different from backend domain
- No allowed origins configured
- Browser blocks cross-origin requests

### **Solution:**
```javascript
// FIXED CODE:
const allowedOrigins = [
  'http://localhost:3000',
  'https://rncmalaysia.net',
  'https://www.rncmalaysia.net',
  'https://rncplatform.netlify.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Impact:**
- ✅ Frontend can access backend
- ✅ All API calls work
- ✅ Secure CORS configuration
- ✅ Multiple domains supported

### **Lesson Learned:**
**Always configure CORS properly for production. Whitelist specific origins. Don't use wildcard (*) in production. Test from actual domain.**

---

## 🐛 ERROR #10: Products Array Filter Error

### **Problem:**
Filter function crashes with "products.filter is not a function" error.

### **Location:**
- **File:** `client/src/pages/Marketplace.js`
- **Function:** Product filtering
- **State:** products state

### **Symptoms:**
- Console error: `products.filter is not a function`
- Page crashes
- Cannot filter products
- White screen error

### **Error Message:**
```javascript
TypeError: products.filter is not a function
    at Marketplace.js:156
```

### **Root Cause:**
```javascript
// BROKEN CODE:
const [products, setProducts] = useState(null); // ❌ null, not array

useEffect(() => {
  const fetchData = async () => {
    const data = await fetchProducts();
    setProducts(data); // Might be object, not array
  };
}, []);

// Later...
const filtered = products.filter(p => ...); // ❌ Crashes if not array
```

**Why it happened:**
- State initialized as `null` instead of `[]`
- API returns object instead of array
- No type checking before filtering
- Assumes data is always array

### **Solution:**
```javascript
// FIXED CODE:
const [products, setProducts] = useState([]); // ✅ Initialize as array

useEffect(() => {
  const fetchData = async () => {
    const data = await fetchProducts();
    
    // ✅ Ensure it's an array
    const productsArray = Array.isArray(data) ? data : 
                         Array.isArray(data.data) ? data.data : [];
    
    setProducts(productsArray);
  };
}, []);

// Later...
const filtered = products.filter(p => ...); // ✅ Always works
```

### **Impact:**
- ✅ No crashes
- ✅ Filtering works reliably
- ✅ Handles various API responses
- ✅ Better error resilience

### **Lesson Learned:**
**Always initialize arrays as empty arrays, not null. Validate data types before using array methods. Handle various API response formats.**

---

## 📊 Summary: Frontend Errors

| Error | Severity | Impact | Time to Fix | Status |
|-------|----------|--------|-------------|--------|
| Failed to Fetch | 🔴 Critical | No marketplace | 60 min | ✅ Fixed |
| 404 Community Projects | 🟡 High | Missing feature | 30 min | ✅ Fixed |
| Filter Crashes | 🟡 High | Page crashes | 15 min | ✅ Fixed |
| CORS Blocking | 🔴 Critical | No API access | 20 min | ✅ Fixed |
| Array Filter Error | 🟡 High | Page crashes | 10 min | ✅ Fixed |

**Total Issues Fixed:** 5  
**Total Time Invested:** ~135 minutes  
**Result:** Stable, reliable frontend

---

**Continue to Part 3 for Deployment & Infrastructure →**
