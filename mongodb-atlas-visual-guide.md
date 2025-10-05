# 🎯 MongoDB Atlas Visual Interface Guide

## 📍 **Current Problem**
You're in the **Filter/Query interface** (showing query syntax) instead of the **Document Browser** where you can actually edit documents.

## 🔍 **How to Find Document Browser**

### **Look for These Interface Elements:**

1. **Tabs at the top of the collection view:**
   - Look for: `Find` | `Indexes` | `Schema` | `Aggregation`
   - Make sure you're on the **Find** tab

2. **Document Display Options:**
   - Look for toggle buttons: `LIST VIEW` vs `JSON VIEW`
   - Switch to **LIST VIEW** to see documents in a table

3. **Clear the Filter:**
   - The filter box should be **completely empty**
   - If there's any text, delete it all
   - Click **Find** or **Apply** with empty filter

### **What You Should See:**
- A **table/grid** with columns: `_id`, `name`, `email`, `password`, `role`
- **Actual document data** (not query syntax)
- **Edit buttons/icons** next to each document row

## 🔄 **Alternative: Use MongoDB Compass (Desktop App)**

If the web interface is problematic:

1. **Download MongoDB Compass** (free desktop app)
2. **Connect** using your connection string
3. **Navigate** to `refugee-network` → `users`
4. **Find** admin user document
5. **Edit** directly in the desktop interface

## 🚀 **Fastest Solution: Delete & Recreate**

Since editing is problematic:

### **Step 1: Delete Current Admin**
1. In the users collection
2. Find admin user document
3. Click **delete/trash icon**
4. Confirm deletion

### **Step 2: Insert New Admin**
1. Click **INSERT DOCUMENT**
2. Use **JSON mode**
3. Paste complete admin document:

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
  "interests": ["Management"]
}
```

4. Click **Insert**

This bypasses the editing interface entirely and creates a fresh admin user with the correct password.
