# 🔧 API Error Troubleshooting Guide

**Date:** October 12, 2025  
**Issue:** 500 Server Error when fetching products

---

## 🐛 Current Error

```
rnc-railway-backend.onrender.com/api/products?category=freelance
Status: 500 Internal Server Error
Error: Server error
```

---

## ✅ Fixes Applied

### **1. Improved Error Handling**
- ✅ Added detailed error messages to products route
- ✅ Added detailed error messages to vendors route
- ✅ Changed response format to include `success` flag
- ✅ Wrapped data in `data` property for consistency

### **2. Response Format Updated**

**Before:**
```json
{
  "products": [...],
  "pagination": {...}
}
```

**After:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

**On Error:**
```json
{
  "success": false,
  "error": "Server error",
  "message": "Actual error message here"
}
```

---

## 🔍 Root Cause Analysis

The 500 error is likely caused by one of these issues:

### **Issue 1: Empty Database**
- **Problem:** No products exist in the database
- **Solution:** Add sample products via admin panel or API

### **Issue 2: Missing Vendor References**
- **Problem:** Products reference vendors that don't exist
- **Solution:** Ensure vendors are created before products

### **Issue 3: Invalid Category**
- **Problem:** Frontend is sending `category=freelance` which might not match database categories
- **Solution:** Check valid categories in Product model

---

## 🧪 Testing Steps

### **Step 1: Check Backend Logs**
1. Go to Render dashboard
2. Click on your backend service
3. Go to "Logs" tab
4. Look for the detailed error message

### **Step 2: Test API Directly**

**Test without category filter:**
```bash
curl https://rnc-railway-backend.onrender.com/api/products
```

**Expected Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "pages": 0,
    "perPage": 12
  }
}
```

**Test with category:**
```bash
curl https://rnc-railway-backend.onrender.com/api/products?category=handicrafts
```

### **Step 3: Check Database**
1. Connect to MongoDB Atlas
2. Browse Collections
3. Check if `products` collection exists
4. Check if it has any documents

---

## 🔧 Solutions

### **Solution 1: Add Sample Products**

Create a script to add sample products:

```javascript
// In your backend, create a seed script
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: "Hand-Woven Basket",
    description: "Beautiful traditional basket",
    price: 45,
    category: "handicrafts",
    status: "approved",
    images: ["https://example.com/basket.jpg"],
    stock: 10
  }
];

// Run this once to seed data
Product.insertMany(sampleProducts);
```

### **Solution 2: Fix Category Mapping**

The frontend is sending `category=freelance` but your products might use different categories.

**Check your Product model for valid categories:**
- handicrafts
- textiles
- jewelry
- art
- food
- services

**Update frontend to use correct categories** or **update backend to accept "freelance" as a valid category**.

### **Solution 3: Update Frontend API Service**

The frontend expects the old response format. Update `marketplaceApi.js`:

```javascript
export const fetchProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    // ... existing code ...
    
    const response = await axios.get(`${API_URL}/products?${params.toString()}`);
    
    // Handle new response format
    return response.data.data || response.data.products || response.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch products');
  }
};
```

---

## 📊 Deployment Status

### **Backend Changes Pushed:**
- ✅ Improved error handling in products route
- ✅ Improved error handling in vendors route
- ✅ Consistent response format
- ✅ Detailed error messages

### **Waiting for Render Deployment:**
- ⏳ Render should auto-deploy in 2-5 minutes
- ⏳ Check logs for new error messages
- ⏳ Test API again after deployment

---

## 🎯 Next Steps

### **Immediate:**
1. **Wait for Render deployment** (2-5 minutes)
2. **Check Render logs** for detailed error message
3. **Test API** with curl or browser
4. **Report back** with the actual error message

### **If Still Failing:**
1. Share the detailed error message from logs
2. Check if products exist in database
3. Verify category names match
4. Add sample data if database is empty

---

## 💡 Quick Fixes

### **Fix 1: Remove Category Filter Temporarily**

In your frontend, temporarily remove the category filter to test:

```javascript
// In Marketplace.js
const [productsData, vendorsData] = await Promise.all([
  fetchProducts({ 
    // category: activeCategory !== 'all' ? activeCategory : undefined, // Comment this out
    search: searchQuery || undefined
  }),
  fetchVendors({ approved: true })
]);
```

### **Fix 2: Add Default Products**

If database is empty, add a few products manually:
1. Use Postman or curl to POST to `/api/products`
2. Or use MongoDB Compass to insert documents directly
3. Or create an admin seeding script

---

## 📝 Monitoring

### **Check These After Deployment:**
- [ ] Backend logs show no errors
- [ ] API returns 200 status
- [ ] Response includes `success: true`
- [ ] Data array is present (even if empty)
- [ ] Frontend loads without errors

---

## 🆘 If You Need Help

**Provide these details:**
1. Full error message from Render logs
2. Response from: `curl https://rnc-railway-backend.onrender.com/api/products`
3. Number of products in database
4. Categories being used in frontend

---

**Status:** ✅ Fixes deployed, waiting for Render to redeploy  
**ETA:** 2-5 minutes  
**Action:** Check Render logs for detailed error message
