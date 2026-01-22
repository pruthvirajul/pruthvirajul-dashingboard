# 🚀 DEPLOYMENT & LAUNCH CHECKLIST

## PRE-LAUNCH VERIFICATION

### ✅ Backend Verification
- [ ] Backend server.js has all 40+ API endpoints
- [ ] PostgreSQL connection string is correct
- [ ] CORS is configured for all frontend ports
- [ ] JWT_SECRET is set (secure key in production)
- [ ] Database tables are auto-created
- [ ] All routes are tested
- [ ] Error handling is in place

### ✅ Frontend Verification
- [ ] Dashboard/index.html has correct menu items
- [ ] All menu items have `class="menu-link"` and `data-page` attributes
- [ ] iframe is named `name="iframe-content"`
- [ ] JavaScript event handler is in DOMContentLoaded
- [ ] All page files exist in Dashboard folder
- [ ] Page links are correct (match file names)
- [ ] Styles load properly
- [ ] Icons display correctly

### ✅ Database Verification
- [ ] PostgreSQL is running on port 5432
- [ ] Database "login" exists
- [ ] User "postgres" has password "admin321"
- [ ] 9 tables are created
- [ ] All columns are correct
- [ ] Relationships are set up
- [ ] Indexes are in place

### ✅ Security Verification
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens have expiration
- [ ] Cookies are HTTP-only
- [ ] CORS is restrictive (specific origins only)
- [ ] Input validation is in place
- [ ] SQL injection prevention is implemented
- [ ] XSS protection headers are set

---

## LAUNCH STEPS

### Step 1: Start Services

#### Using Docker (Recommended)
```bash
docker compose up -d

# Verify containers are running
docker ps

# Check logs
docker logs backend-container-name
docker logs postgres-container-name
```

#### Manual Start
```bash
# Terminal 1: Backend
cd Backend
npm install
npm start
# Should see: "Server running on port 3048"

# Terminal 2: Wait for backend to start
# Then use browser to access services
```

### Step 2: Verify Services are Running

#### Check Backend
```bash
curl http://16.16.68.191:3048/
# Should respond (or redirect)

curl http://16.16.68.191:3048/api/protected
# Should show 401 Unauthorized (expected without token)
```

#### Check Database Connection
```bash
# From server logs, should show:
# "Database initialized with all tables"
```

#### Test Frontend
```bash
# Open browser to:
http://16.16.68.191:8150/
# Should load dashboard
```

### Step 3: Create Test Account

1. Navigate to: http://16.16.68.191:8153/
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Sign Up"
4. Verify: Message says "Signup successful"
5. Verify: Redirected to login page

### Step 4: Test Login

1. Navigate to: http://16.16.68.191:8152/
2. Fill form:
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Login"
4. Verify: Redirected to dashboard
5. Verify: Sees user profile in header

### Step 5: Test Dashboard Functions

#### Test Home Page
- [ ] Statistics load (check API calls in console)
- [ ] Numbers display (can be 0 if no data)
- [ ] Quick access buttons appear
- [ ] Recent activities show (or "No recent activities")

#### Test Menu Navigation
- [ ] Click "Recruitment" → Page loads
- [ ] Click "Payroll" → Page loads
- [ ] Click "Attendance" → Page loads
- [ ] Click "Leave" → Page loads
- [ ] Each page has correct content

#### Test Recruitment Page
- [ ] Jobs table loads (may be empty)
- [ ] Can click "+ Post New Job"
- [ ] Form appears with fields
- [ ] Can fill and submit form
- [ ] New job appears in table

#### Test Leave Page
- [ ] "My Leaves" tab loads (may be empty)
- [ ] Can click "+ Apply Leave"
- [ ] Form appears with fields
- [ ] Can select leave type, dates
- [ ] Can submit leave request

#### Test Attendance Page
- [ ] Statistics cards display
- [ ] Attendance table loads (may be empty)
- [ ] All columns show correctly

#### Test Payroll Page
- [ ] Month selector works
- [ ] Can change months
- [ ] Payroll table loads (may be empty)

### Step 6: Test User Features

#### Test Logout
1. Click "Logout" in header
2. Should redirect to login page
3. Cookie should be cleared

#### Test Session
1. After logout, go to dashboard directly
2. Should redirect to login page
3. Verify: Session protection works

#### Test Profile
1. Login again
2. Check profile name in header
3. Verify: User profile image shows (or placeholder)

---

## FINAL CHECKLIST

### System Checklist
- [ ] Backend running on port 3048
- [ ] PostgreSQL running on port 5432
- [ ] Frontend accessible on port 8150
- [ ] Login accessible on port 8152
- [ ] Signup accessible on port 8153
- [ ] No errors in server console
- [ ] No errors in browser console

### Functionality Checklist
- [ ] User can sign up
- [ ] User can login
- [ ] User can see dashboard
- [ ] User can navigate menu
- [ ] Pages load via iframe
- [ ] Forms can be submitted
- [ ] Data persists in database
- [ ] User can logout
- [ ] Session protection works

### Data Checklist
- [ ] Passwords are hashed in database
- [ ] JWT tokens are created
- [ ] Cookies are stored
- [ ] Database queries work
- [ ] API responses are correct
- [ ] Error handling works

### Security Checklist
- [ ] CORS is configured
- [ ] JWT validation works
- [ ] Cookie security is set
- [ ] Password hashing works
- [ ] Protected routes redirect to login
- [ ] Input validation works

---

## PRODUCTION DEPLOYMENT

### Before Going Live

#### Environment Variables
```bash
# Set in .env file or environment
PORT=3048
DB_HOST=your-db-host
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=login
JWT_SECRET=your-super-secret-key-here
NODE_ENV=production
```

#### Security Hardening
```javascript
// In server.js, set:
secure: true  // For HTTPS
sameSite: 'strict'  // Stricter cookie policy
httpOnly: true  // Always set
```

#### CORS Configuration
```javascript
// Update allowed origins to production domain
const allowedOrigins = [
    'https://yourdomain.com',
    'https://dashboard.yourdomain.com'
];
```

#### Database Backups
```bash
# Set up regular backups
pg_dump -h localhost -U postgres login > backup.sql

# Schedule daily backups
# Use cloud storage for backup files
```

#### Monitoring Setup
- [ ] Set up error logging (Winston, Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Set up database monitoring
- [ ] Set up uptime monitoring
- [ ] Set up alert notifications

#### SSL/HTTPS
- [ ] Obtain SSL certificate
- [ ] Configure Express for HTTPS
- [ ] Update all URLs to https://
- [ ] Redirect HTTP to HTTPS

---

## TROUBLESHOOTING LAUNCH ISSUES

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
docker ps | grep postgres
# OR
psql -U postgres -h 16.16.68.191

# Check connection string in server.js
# Verify credentials are correct
```

### Issue: "CORS errors in browser"
```bash
# Check allowed origins in server.js
# Should include your frontend URL
# Clear browser cache (Ctrl+Shift+R)
```

### Issue: "API returns 404"
```bash
# Verify backend is running
npm start
# Verify route exists in server.js
# Check URL is correct (no typos)
```

### Issue: "Blank dashboard page"
```bash
# Check browser console (F12 → Console)
# Look for JavaScript errors
# Hard refresh page (Ctrl+Shift+R)
# Check iframe name is "iframe-content"
```

### Issue: "Cannot login"
```bash
# Verify user exists in database
# Check password is correct
# Clear all cookies
# Try signup again and login
```

---

## POST-LAUNCH MONITORING

### Daily Checks
- [ ] Backend server is running
- [ ] Database is responsive
- [ ] Users can login
- [ ] No errors in logs
- [ ] Application is accessible

### Weekly Tasks
- [ ] Review error logs
- [ ] Check database size
- [ ] Verify backups completed
- [ ] Check system resources
- [ ] Review user activity

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Optimize database
- [ ] Archive old logs
- [ ] Test disaster recovery

---

## SUCCESS METRICS

### Technical Metrics
- ✅ 99.9% uptime
- ✅ < 2s page load time
- ✅ < 100ms API response time
- ✅ 0 security breaches
- ✅ Zero unhandled errors

### User Metrics
- ✅ Users can complete all workflows
- ✅ No login failures
- ✅ Data persists correctly
- ✅ All pages load properly
- ✅ Forms submit successfully

---

## ROLLBACK PLAN

### If Something Goes Wrong

1. **Immediate Actions**
   - Stop backend: Ctrl+C
   - Check error logs
   - Restore database backup
   - Restart backend
   - Verify system works

2. **Database Rollback**
   ```bash
   psql -U postgres -d login < backup.sql
   ```

3. **Code Rollback**
   ```bash
   git revert <commit-hash>
   npm start
   ```

---

## SUPPORT CONTACTS

### Internal
- Backend Developer: [Name]
- Frontend Developer: [Name]
- Database Admin: [Name]
- DevOps: [Name]

### External
- Hosting Provider: [Info]
- Database Provider: [Info]
- SSL Certificate: [Provider]

---

## GO-LIVE SIGN OFF

### Approvals Needed
- [ ] Backend Developer Sign-off
- [ ] Frontend Developer Sign-off
- [ ] QA Sign-off
- [ ] Security Team Sign-off
- [ ] Project Manager Sign-off

### Sign-off Form
```
Project: HRMS Dashboard
Version: 1.0.0
Date: ___________
Approved by: ___________
Notes: ___________
```

---

## LAUNCH DAY TIMELINE

### T-60 Minutes
- [ ] All systems verified
- [ ] Backups confirmed
- [ ] Team assembled
- [ ] Communication ready

### T-30 Minutes
- [ ] Final system check
- [ ] Monitoring activated
- [ ] Support team on standby

### T-0 (Go Live)
- [ ] Backend starts
- [ ] Database connects
- [ ] Frontend loads
- [ ] Test login works

### T+30 Minutes
- [ ] Monitor user activity
- [ ] Watch error logs
- [ ] Check performance

### T+2 Hours
- [ ] Confirm stability
- [ ] Handle any issues
- [ ] Document problems

### End of Day
- [ ] Review success metrics
- [ ] Document lessons learned
- [ ] Plan follow-up tasks

---

## CONGRATULATIONS! 🎉

Your HRMS Dashboard is:
- ✅ Tested
- ✅ Verified
- ✅ Ready
- ✅ Deployed
- ✅ Live

**Now start managing your HR operations with confidence!**

---

**Date Launched**: ___________
**Launched By**: ___________
**Status**: ✅ LIVE
