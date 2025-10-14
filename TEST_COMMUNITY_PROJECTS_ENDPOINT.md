# 🔍 Test Community Projects Endpoint

## Quick Test in Browser Console

Open the browser console (F12) and run this code to test the endpoint:

```javascript
// Test 1: Check if GET endpoint works
fetch('https://rnc-railway-backend.onrender.com/api/community-projects', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('GET Response:', data);
  alert('GET works! Status: ' + (data.success ? 'Success' : 'Failed'));
})
.catch(err => {
  console.error('GET Error:', err);
  alert('GET Failed: ' + err.message);
});
```

If GET works, then test POST:

```javascript
// Test 2: Try to create a project
fetch('https://rnc-railway-backend.onrender.com/api/community-projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('token')
  },
  body: JSON.stringify({
    title: 'Test Project',
    category: 'Education Program',
    description: 'Test description',
    location: 'Kuala Lumpur',
    status: 'Active',
    participants: 10,
    fundingGoal: 5000,
    fundingCurrent: 100,
    tags: ['Education', 'Test']
  })
})
.then(res => {
  console.log('POST Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('POST Response:', data);
  if (data.success) {
    alert('✅ POST works! Project created!');
  } else {
    alert('❌ POST failed: ' + data.error);
  }
})
.catch(err => {
  console.error('POST Error:', err);
  alert('POST Failed: ' + err.message);
});
```

## What to Look For

### If GET returns 404:
- The route isn't registered properly
- Backend needs to be redeployed

### If GET works but POST returns 404:
- The POST route might be missing
- Check if the route file has the POST handler

### If POST returns 401:
- Authentication issue
- Token might be expired

### If POST returns 400:
- Validation error
- Missing required fields

### If POST returns 500:
- Server error
- Check Render logs
