# 🔧 EASIEST ADMIN PASSWORD FIX

## 📥 **Download MongoDB Compass (Recommended)**

### **Step 1: Download & Install**
1. Go to: https://www.mongodb.com/products/compass
2. Download **MongoDB Compass** (free desktop app)
3. Install and launch

### **Step 2: Connect to Your Database**
Use this connection string:
```
mongodb+srv://tawfig2020:Tawfig2020@cluster0.dfz2nfi.mongodb.net/refugee-network
```

### **Step 3: Update Admin Password**
1. Navigate to: **refugee-network** → **users** collection
2. Find document with email: `admin@refugeenetwork.com`
3. Click the document to edit
4. Update these fields:
   ```json
   {
     "password": "$2a$10$2FRSUSwfu7tnnjjipYXQAu5RIzetQ95atVicOUE3TzoXdBwTWsw86",
     "isEmailVerified": true,
     "role": "admin"
   }
   ```
5. Click **Update**

## 🔄 **Alternative: Delete & Insert New**

If editing is difficult:
1. **Delete** existing admin user
2. **Insert Document** with this JSON:

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

## 🧪 **Test Credentials**
After update:
- **Email**: `admin@refugeenetwork.com`
- **Password**: `123456`

## 💡 **Why Compass Works Better**
- Desktop app with superior editing interface
- No web browser interface issues
- Direct document editing
- Same database, better tools

Let me know when you've completed the password update and I'll test the login!
