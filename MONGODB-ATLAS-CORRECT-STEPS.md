# 🔧 MongoDB Atlas - Correct Document Editing Steps

## 🎯 **Issue: You're in Filter View, Not Edit View**

The interface you're seeing is the **query filter**, not document editing.

## 📋 **Correct Steps to Edit Documents**

### **Method 1: Document List View**
1. In Collections → `refugee-network` → `users`
2. **Clear the filter box** (remove any query text)
3. Click **Find** button (or press Enter with empty filter)
4. You should see a **table with actual documents**
5. Find the row with `admin@refugeenetwork.com`
6. Click the **pencil icon (✏️)** at the end of that row
7. This opens the **JSON document editor**
8. Edit the `password` and `isEmailVerified` fields
9. Click **Update**

### **Method 2: Use Document View Tab**
1. Look for tabs at the top: **Find** | **Indexes** | **Schema Anti-Patterns** | **Aggregation**
2. Make sure you're on the **Find** tab
3. Leave filter empty and click **Find**
4. This shows actual documents, not the query interface

### **Method 3: Browse Documents**
1. In the users collection
2. Look for a **Browse** or **Documents** button
3. This bypasses the query interface entirely
4. Shows documents directly for editing

## 🔄 **Alternative: Delete and Recreate**

If editing still doesn't work:

### **Step 1: Delete Current Admin**
1. Find the admin user document
2. Click **delete icon (🗑️)**
3. Confirm deletion

### **Step 2: Insert New Admin**
1. Click **INSERT DOCUMENT** button
2. Choose **JSON View**
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

## 🎯 **Key Interface Elements to Look For**
- **Document list/table view** (not query interface)
- **Pencil/Edit icon** next to each document
- **Insert Document** button for new documents
- **JSON editor** that opens when editing

The key is getting to the actual document list, not the query filter interface!
