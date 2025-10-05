# 🔧 MongoDB Atlas Document Editing Guide

## 🎯 **Current Issue**
You're in the **Filter/Query view** instead of **Document Edit view**. The interface you see is for searching, not editing documents.

## 📋 **Correct Steps to Edit Admin User**

### **Step 1: Navigate to Document View**
1. In MongoDB Atlas Collections
2. Database: `refugee-network`
3. Collection: `users`
4. **IMPORTANT**: Look for the **document list view** (not the filter view)

### **Step 2: Find the Admin User Document**
- Look for a **table/list view** showing actual documents
- Find the row with email: `admin@refugeenetwork.com`
- You should see columns like: `_id`, `name`, `email`, `password`, `role`

### **Step 3: Edit the Document**
1. Click the **pencil icon** (✏️) or **Edit** button next to the admin user row
2. This opens the **Document Editor** (JSON format)
3. Find the `password` field
4. Replace the current hash with: `$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86`
5. Find `isEmailVerified` and change to `true`
6. Click **Update** button

### **Step 4: Alternative - Use Find Documents**
If you can't see the document list:
1. Click **Find** tab (not Filter)
2. Leave search empty and click **Find**
3. This shows all documents in the collection
4. Find admin user and click edit

## 🔄 **Alternative Method: Delete and Recreate**

If editing still doesn't work:

### **Option A: Delete Current Admin**
1. Find admin user document
2. Click **Delete** (trash icon)
3. Confirm deletion

### **Option B: Insert New Admin**
1. Click **INSERT DOCUMENT**
2. Use **JSON View**
3. Paste this complete document:

```json
{
  "name": "Admin User",
  "email": "admin@refugeenetwork.com",
  "password": "$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86",
  "role": "admin",
  "location": "Malaysia",
  "isEmailVerified": true,
  "profileImage": "default-avatar.jpg",
  "languages": ["English"],
  "bio": "Platform administrator",
  "skills": ["Administration"],
  "interests": ["Management"],
  "createdAt": {"$date": "2025-01-01T00:00:00.000Z"}
}
```

4. Click **Insert**

## 🎯 **Key Points**
- You need the **document list view**, not the filter view
- Look for **Edit/Pencil icon** next to documents
- Use **JSON format** when editing
- **Save/Update** button should appear after changes

Try the document list view approach first!
