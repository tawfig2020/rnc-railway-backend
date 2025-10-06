# Terminology Standardization: "Refugee" → "Member"

## Problem Analysis

### Current Issues:
1. **Inconsistent Terminology**: "Refugee" used in some places, but should be "Member"
2. **Database Schema**: User model has `role: 'refugee'` as enum value and default
3. **Frontend**: Login page shows "Refugee" as role option
4. **Admin Panel**: Shows different roles but terminology not aligned

### Images Analysis:

**Image 1 (Login Page):**
- Shows role dropdown with "Refugee" option ❌
- Should show "Member" instead ✅

**Image 2 (Admin Panel):**
- Shows roles: Administrator, Staff, Intern, User, Volunteer
- No "Refugee" visible, but backend still uses it
- Need consistent terminology across all interfaces

## Terminology Clarification

### **Proposed Role Structure:**

| Old Term | New Term | Description | Access Level |
|----------|----------|-------------|--------------|
| `refugee` | `member` | Regular community member (default) | Basic |
| `volunteer` | `volunteer` | Volunteer helping the community | Basic+ |
| `intern` | `intern` | Intern working with RNC | Basic+ |
| `staff` | `staff` | RNC staff member | Elevated |
| `admin` | `admin` | System administrator | Full |
| `partner` | `partner` | Partner organization | Special |
| `vendor` | `vendor` | Marketplace vendor | Special |

### **User vs Member Clarification:**

**"User"** = Generic term for anyone with an account  
**"Member"** = Specific role for community members (previously "refugee")

**Relationship:**
- All Members are Users
- All Volunteers are Users
- All Staff are Users
- But not all Users are Members (they could be Staff, Volunteers, etc.)

**In the system:**
- **Database field**: `role: 'member'` (replaces 'refugee')
- **Display name**: "Member" or "Community Member"
- **Registration**: New users register as "Member" by default
- **Admin Panel**: Shows "Member" in user list

## Required Changes

### 1. Database Schema (MongoDB)

#### User Model (`models/User.js`)
**Current:**
```javascript
role: {
  type: String,
  enum: ['refugee', 'volunteer', 'staff', 'admin'],
  default: 'refugee'
}
```

**New:**
```javascript
role: {
  type: String,
  enum: ['member', 'volunteer', 'intern', 'staff', 'admin', 'partner', 'vendor'],
  default: 'member'
}
```

#### Data Migration Required:
```javascript
// Update all existing users with role 'refugee' to 'member'
db.users.updateMany(
  { role: 'refugee' },
  { $set: { role: 'member' } }
)
```

### 2. Frontend Changes

#### Login Page (`client/src/pages/Login.js`)
**Current:**
```javascript
const roleOptions = [
  { value: 'refugee', label: 'Refugee' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
  { value: 'partner', label: 'Partner' },
  { value: 'vendor', label: 'Vendor' }
];

const [formData, setFormData] = useState({
  email: '',
  password: '',
  role: 'refugee'
});
```

**New:**
```javascript
const roleOptions = [
  { value: 'member', label: 'Member' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'intern', label: 'Intern' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
  { value: 'partner', label: 'Partner' },
  { value: 'vendor', label: 'Vendor' }
];

const [formData, setFormData] = useState({
  email: '',
  password: '',
  role: 'member'
});
```

#### Register Page (`client/src/pages/Register.js`)
- Update role options
- Change default role to 'member'
- Update display labels

#### Admin Panel (`client/src/components/admin/users/UserManagement.js`)
- Update role filter options
- Update role display labels
- Update role badges/chips

### 3. Backend Changes

#### Authentication Routes (`routes/auth.js`)
- Update role validation
- Update default role assignment

#### Middleware (`middleware/auth.js`, `middleware/roleAuth.js`)
- Update role checks
- Update authorization logic

#### All Route Files
- Search and replace 'refugee' with 'member'
- Update role-based access control

### 4. Content Updates

#### All Pages and Components
Files to update (261 matches found):
- Home page
- About page
- Services pages
- Marketplace
- Events
- Forum
- All admin components
- Footer
- Headers
- Documentation

**Search and Replace Strategy:**
1. **Case-sensitive**: "refugee" → "member"
2. **Case-sensitive**: "Refugee" → "Member"
3. **Case-sensitive**: "REFUGEE" → "MEMBER"
4. **Verify**: Check context to ensure it's referring to the role, not general refugee terminology

## Implementation Plan

### Phase 1: Database Migration (Critical)
1. ✅ Backup database
2. ✅ Update User model schema
3. ✅ Run migration script to update existing data
4. ✅ Verify data integrity

### Phase 2: Backend Updates
1. ✅ Update all route files
2. ✅ Update middleware
3. ✅ Update authentication logic
4. ✅ Update authorization checks
5. ✅ Test all API endpoints

### Phase 3: Frontend Updates
1. ✅ Update Login page
2. ✅ Update Register page
3. ✅ Update Admin Panel
4. ✅ Update all components
5. ✅ Update all pages
6. ✅ Test all user flows

### Phase 4: Content Updates
1. ✅ Update static content
2. ✅ Update help documentation
3. ✅ Update error messages
4. ✅ Update email templates

### Phase 5: Testing
1. ✅ Test user registration (should default to 'member')
2. ✅ Test user login (should accept 'member' role)
3. ✅ Test admin panel (should display 'Member')
4. ✅ Test role-based access control
5. ✅ Test existing users (migrated from 'refugee')

### Phase 6: Deployment
1. ✅ Deploy database migration
2. ✅ Deploy backend changes
3. ✅ Deploy frontend changes
4. ✅ Monitor for errors
5. ✅ Verify production

## Migration Script

```javascript
// File: scripts/migrate-refugee-to-member.js
const mongoose = require('mongoose');
const config = require('../config/config');

async function migrateRefugeeToMember() {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    // Update User model
    const result = await mongoose.connection.db.collection('users').updateMany(
      { role: 'refugee' },
      { $set: { role: 'member' } }
    );

    console.log(`Migration complete: ${result.modifiedCount} users updated`);

    // Verify
    const refugeeCount = await mongoose.connection.db.collection('users').countDocuments({ role: 'refugee' });
    const memberCount = await mongoose.connection.db.collection('users').countDocuments({ role: 'member' });

    console.log(`Verification:`);
    console.log(`- Users with role 'refugee': ${refugeeCount} (should be 0)`);
    console.log(`- Users with role 'member': ${memberCount}`);

    if (refugeeCount === 0) {
      console.log('✅ Migration successful!');
    } else {
      console.log('⚠️ Warning: Some users still have role "refugee"');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateRefugeeToMember();
```

## Rollback Plan

If issues occur:

```javascript
// Rollback script
const mongoose = require('mongoose');
const config = require('../config/config');

async function rollbackMemberToRefugee() {
  try {
    await mongoose.connect(config.mongoURI);
    
    const result = await mongoose.connection.db.collection('users').updateMany(
      { role: 'member' },
      { $set: { role: 'refugee' } }
    );

    console.log(`Rollback complete: ${result.modifiedCount} users reverted`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Rollback failed:', error);
  }
}
```

## Testing Checklist

- [ ] User can register as "Member" (not "Refugee")
- [ ] Login page shows "Member" option (not "Refugee")
- [ ] Admin panel displays "Member" for users
- [ ] Existing users with old "refugee" role are migrated
- [ ] Role-based access control works correctly
- [ ] No references to "refugee" in UI
- [ ] Database schema updated
- [ ] All API endpoints work
- [ ] Email templates updated
- [ ] Help documentation updated

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Full database backup before migration |
| Broken authentication | High | Test thoroughly in staging first |
| Inconsistent role checks | Medium | Comprehensive code search and replace |
| User confusion | Low | Clear communication about terminology change |
| Third-party integrations | Medium | Review all external API calls |

## Communication Plan

### Internal Team:
- Notify all developers of terminology change
- Update coding standards documentation
- Update API documentation

### Users:
- No notification needed (transparent change)
- Update help documentation
- Update FAQs

### Partners:
- Notify if they use API with role parameter
- Provide migration guide for integrations

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Planning & Analysis | 1 day | ✅ Complete |
| Database Migration Script | 2 hours | Pending |
| Backend Updates | 4 hours | Pending |
| Frontend Updates | 4 hours | Pending |
| Testing | 4 hours | Pending |
| Deployment | 2 hours | Pending |
| Monitoring | 1 day | Pending |

**Total Estimated Time:** 2-3 days

## Success Criteria

✅ No instances of "refugee" role in codebase  
✅ All users have valid roles from new enum  
✅ Login and registration work correctly  
✅ Admin panel displays correct terminology  
✅ No broken functionality  
✅ All tests pass  
✅ Production deployment successful  

---

**Status:** Ready for Implementation  
**Priority:** High  
**Assigned To:** Development Team  
**Review Required:** Yes
