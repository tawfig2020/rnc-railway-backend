# 🎯 Simple Admin Fix - Delete & Recreate

## 🔧 **Fastest Solution**

Since MongoDB Atlas editing interface is problematic, use the **delete and recreate** approach:

### **Step 1: Delete Current Admin User**
1. In MongoDB Atlas Collections
2. Database: `refugee-network` → Collection: `users`
3. Find the document with email: `admin@refugeenetwork.com`
4. Click the **trash/delete icon** 🗑️
5. Confirm deletion

### **Step 2: Insert New Admin User**
1. Click **INSERT DOCUMENT** button
2. Select **JSON** format
3. Copy and paste this exact document:

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

## 🧪 **Test Login**

After insertion, test with:
- **Email**: `admin@refugeenetwork.com`
- **Password**: `123456`

## 🚀 **Next Steps**
1. Delete old admin user
2. Insert new admin user (above)
3. Deploy frontend to Netlify
4. Test admin login on live site

This bypasses the editing interface completely!
