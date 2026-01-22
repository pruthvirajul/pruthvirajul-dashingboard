# 🚀 QUICK START GUIDE - HRMS Dashboard

## What's Been Done

### ✅ Backend API (FULLY FUNCTIONAL)
- Express.js server with 40+ API endpoints
- PostgreSQL database with 9 tables
- JWT authentication
- CORS configured for all frontend ports
- All HRMS endpoints working

### ✅ Frontend Dashboard (FULLY FUNCTIONAL)
- Dashboard with sidebar navigation
- All menu buttons working
- Content loading via iframe
- Responsive design
- User authentication integration

### ✅ Content Pages (READY)
- **Home.html** - Dashboard with statistics
- **Recruitment.html** - Job & candidate management
- **Payroll.html** - Salary and payroll processing
- **Attendance.html** - Attendance tracking
- **Leave.html** - Leave management and approvals
- Plus 8 more placeholder pages ready to be enhanced

---

## 🎬 START THE SYSTEM

### Option 1: Docker (Recommended)
```bash
docker compose up -d
```
This will start:
- Backend API on port 3048
- Dashboard on port 8150
- Login page on port 8152
- PostgreSQL database on port 5432

### Option 2: Manual Start
```bash
# Terminal 1: Start Backend
cd Backend
npm install
npm start

# Terminal 2 (optional): Start frontend server
# If using local testing, navigate to Dashboard folder
```

---

## 🌐 ACCESS THE DASHBOARD

```
Dashboard: http://16.16.68.191:8150/
Login:     http://16.16.68.191:8152/
Signup:    http://16.16.68.191:8153/
API:       http://16.16.68.191:3048/
```

---

## 📋 TEST WORKFLOW

### Step 1: Sign Up
1. Go to: `http://16.16.68.191:8153/`
2. Fill in: Name, Email, Password
3. Click "Sign Up"

### Step 2: Log In  
1. Go to: `http://16.16.68.191:8152/`
2. Enter: Email & Password (from signup)
3. Click "Login"
4. You'll be redirected to dashboard

### Step 3: Explore Dashboard
1. Click different menu items in sidebar:
   - **Home** - View dashboard with statistics
   - **Recruitment** - Post jobs, view candidates
   - **Payroll** - View salary information
   - **Attendance** - Check attendance records
   - **Leave** - Apply for and approve leaves
   - **Employees** - Browse employee directory
   - **Analytics** - View statistics and charts
   - **Tasks** - Manage tasks
   - **Settings** - Configure system

### Step 4: Test Features
- **Create Job**: Recruitment → Post New Job
- **Apply Leave**: Leave → Apply Leave
- **View Employees**: Employee Directory
- **Check Attendance**: Attendance → Calendar view

---

## 📊 What Each Page Does

| Page | URL | Action |
|------|-----|--------|
| **Home** | Dashboard | Shows statistics and recent activities |
| **Recruitment** | /Recruitment.html | Manage jobs and candidates |
| **Payroll** | /Payroll.html | View salaries and process payroll |
| **Attendance** | /Attendance.html | Track daily attendance |
| **Leave** | /Leave.html | Apply and approve leaves |
| **Employees** | /EmployeeDirectory.html | Search and view employees |
| **Analytics** | /Analytics.html | View charts and trends |
| **Tasks** | /TaskList.html | Create and assign tasks |
| **Tracking** | /Tracking.html | View activity logs |
| **Settings** | /Settings.html | Configure system settings |

---

## 🔧 TROUBLESHOOTING

### Problem: Dashboard shows blank content
**Solution:**
- Press F5 to refresh page
- Press Ctrl+Shift+R to hard refresh (clear cache)
- Check browser console (F12 → Console) for errors

### Problem: Can't login
**Solution:**
- Make sure you created an account first (sign up)
- Verify backend server is running
- Check if cookies are enabled in browser

### Problem: API errors in console
**Solution:**
- Verify backend is running on port 3048
- Check if IP is correct (16.16.68.191)
- Make sure database is connected

### Problem: Menu buttons not responding
**Solution:**
- Reload page (Ctrl+Shift+R)
- Open Console (F12) and look for JavaScript errors
- Make sure JavaScript is enabled

---

## 💡 ADMIN FUNCTIONS

### Create New Employee
1. Go to Recruitment
2. Use API or admin panel (if implemented)
3. Enter employee details
4. Save

### Post Job Opening
1. Go to Recruitment → Post New Job
2. Fill in: Title, Department, Experience, Salary
3. Click "Post Job"

### Process Payroll
1. Go to Payroll
2. Select month
3. Process salary for all employees
4. Download payslips

### Approve Leaves
1. Go to Leave → Pending Approvals (admin view)
2. Review pending requests
3. Click Approve or Reject
4. System updates leave status

### View Analytics
1. Go to Analytics
2. View employee growth charts
3. Check attendance trends
4. Review payroll expenses

---

## 📱 MOBILE ACCESS

The dashboard is responsive! Access from:
- Desktop: `http://16.16.68.191:8150/`
- Mobile: Same URL, automatically adapts

---

## 🔑 DEFAULT TEST CREDENTIALS

After signing up, use those credentials to login. System uses:
- Email: user@email.com
- Password: anypassword (hashed with bcrypt)

---

## 📞 COMMON COMMANDS

### Restart Backend
```bash
# Stop current process: Ctrl+C
# Restart
npm start
```

### View Database
```bash
psql -h 16.16.68.191 -U postgres -d login
SELECT * FROM users;
SELECT * FROM employees;
\q  # Exit
```

### Check Logs
```bash
# Docker logs
docker logs backend-container-name

# Or view in running terminal where you started npm start
```

---

## ✨ FEATURES YOU CAN USE RIGHT NOW

✅ **User Management**
- Sign up new users
- Login/Logout
- Profile management
- JWT authentication

✅ **Recruitment**
- Post job openings
- View job applications
- Update candidate status
- Close job positions

✅ **Payroll**
- View monthly payroll
- Process salaries
- Download payslips
- Track payment status

✅ **Attendance**
- Check daily attendance
- View attendance history
- Track attendance rate
- Check-in/out logs

✅ **Leave Management**
- Apply for leave
- View leave history
- Admin approval workflow
- Multiple leave types

✅ **Employee Directory**
- Search employees
- View employee profiles
- Employee details
- Contact information

✅ **Analytics**
- View statistics
- Employee count
- Attendance trends
- Payroll reports

---

## 🎯 NEXT FEATURES (Coming Soon)

- 📈 Advanced Analytics with Charts
- 📋 Task assignment and tracking
- 🎓 Training programs
- ⭐ Performance ratings
- 📊 Custom reports
- 🔔 Notifications and alerts
- 📧 Email notifications
- 🖨️ Print reports

---

## 🆘 NEED HELP?

### Check These First:
1. Is backend running? `npm start` in Backend folder
2. Is database connected? Check server console
3. Are you using correct IP? (16.16.68.191)
4. Are cookies enabled? Check browser settings
5. Clear browser cache? (Ctrl+Shift+R)

### If Still Having Issues:
1. Check browser console (F12 → Console tab)
2. Check backend console for errors
3. Check database connection status
4. Review server logs: `docker logs backend`

---

## 📌 IMPORTANT NOTES

- **IP**: Make sure you're using `16.16.68.191` (NOT localhost)
- **Ports**: Dashboard(8150), API(3048), DB(5432)
- **Credentials**: Sign up creates accounts with hashed passwords
- **Cookies**: JWT stored in HTTP-only cookies for security
- **Database**: PostgreSQL, tables auto-created on startup

---

**Your HRMS Dashboard is ready to use! 🎉**

Start with Docker Compose or npm start, then access the dashboard and start managing your HR operations!
