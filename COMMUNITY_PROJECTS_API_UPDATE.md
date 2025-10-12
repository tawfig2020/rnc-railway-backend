# Community Projects API Endpoint Update

## ✅ Changes Made

Updated all API endpoints in `CommunityProjectsManagement.js` from `/campaigns` to `/api/community-projects`

### File Modified:
`client/src/components/admin/sections/CommunityProjectsManagement.js`

---

## 📝 Endpoint Changes

### 1. **Fetch Projects (GET)**
**Before:**
```javascript
const response = await api.get('/campaigns');
```

**After:**
```javascript
const response = await api.get('/api/community-projects');
```

---

### 2. **Create New Project (POST)**
**Before:**
```javascript
const response = await api.post('/campaigns', projectData);
```

**After:**
```javascript
const response = await api.post('/api/community-projects', projectData);
```

---

### 3. **Update Project (PUT)**
**Before:**
```javascript
const response = await api.put(`/campaigns/${selectedProject._id}`, projectData);
```

**After:**
```javascript
const response = await api.put(`/api/community-projects/${selectedProject._id}`, projectData);
```

---

### 4. **Delete Project (DELETE)**
**Before:**
```javascript
await api.delete(`/campaigns/${projectToDelete._id}`);
```

**After:**
```javascript
await api.delete(`/api/community-projects/${projectToDelete._id}`);
```

---

### 5. **Bulk Approve (PUT)**
**Before:**
```javascript
const promises = selectedProjects.map(id => 
  api.put(`/campaigns/${id}`, { status: 'active' })
);
```

**After:**
```javascript
const promises = selectedProjects.map(id => 
  api.put(`/api/community-projects/${id}`, { status: 'active' })
);
```

---

### 6. **Bulk Reject (PUT)**
**Before:**
```javascript
const promises = selectedProjects.map(id => 
  api.put(`/campaigns/${id}`, { status: 'cancelled' })
);
```

**After:**
```javascript
const promises = selectedProjects.map(id => 
  api.put(`/api/community-projects/${id}`, { status: 'cancelled' })
);
```

---

### 7. **Bulk Delete (DELETE)**
**Before:**
```javascript
const promises = selectedProjects.map(id => 
  api.delete(`/campaigns/${id}`)
);
```

**After:**
```javascript
const promises = selectedProjects.map(id => 
  api.delete(`/api/community-projects/${id}`)
);
```

---

## 📊 Summary

**Total Endpoints Updated:** 7

1. ✅ GET `/api/community-projects` - Fetch all projects
2. ✅ POST `/api/community-projects` - Create new project
3. ✅ PUT `/api/community-projects/:id` - Update project
4. ✅ DELETE `/api/community-projects/:id` - Delete project
5. ✅ PUT `/api/community-projects/:id` - Bulk approve
6. ✅ PUT `/api/community-projects/:id` - Bulk reject
7. ✅ DELETE `/api/community-projects/:id` - Bulk delete

---

## 🔧 Functions Updated

1. `fetchProjects()` - Line 83
2. `handleSubmit()` - Lines 211, 225
3. `handleDeleteProject()` - Line 264
4. `handleBulkApprove()` - Line 352
5. `handleBulkReject()` - Line 378
6. `handleBulkDelete()` - Line 408

---

## ✅ Status

**All API endpoints successfully updated to use `/api/community-projects`**

The "Add New Project" form now submits to:
```javascript
axios.post('/api/community-projects', projectData)
```

---

**Updated by:** Cascade AI  
**Date:** October 12, 2025 at 9:55 PM  
**File:** CommunityProjectsManagement.js
