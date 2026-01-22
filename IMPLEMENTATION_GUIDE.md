# HRMS Dashboard - Complete Implementation Guide

## 🎯 Project Status: IN PROGRESS

### ✅ COMPLETED ITEMS

#### 1. **Backend API Server** (server.js)
- ✅ Express.js server configured on port 3048
- ✅ PostgreSQL database with all required tables created
- ✅ CORS configured for all frontend ports
- ✅ JWT authentication implemented
- ✅ User signup, login, logout endpoints
- ✅ All HRMS API endpoints implemented

#### 2. **Frontend Dashboard Structure** (Dashboard/index.html)
- ✅ Fixed JavaScript event handlers
- ✅ Proper menu navigation system
- ✅ Iframe-based content loading
- ✅ User profile integration
- ✅ Responsive sidebar menu
- ✅ All navigation links working

#### 3. **Created Pages with API Integration**

| Page | Status | Features |
|------|--------|----------|
| **Home.html** | ✅ | Dashboard stats, quick access buttons, recent activities |
| **Recruitment.html** | ✅ | Job openings, candidates, interview management |
| **Payroll.html** | ✅ | Payroll processing, salary breakdown, monthly payslips |
| **Attendance.html** | ✅ | Daily attendance, attendance rate, check-in/out tracking |
| **Leave.html** | ✅ | Apply leave, pending approvals, leave history |
| **EmployeeDirectory.html** | ⏳ | Search employees, view profiles, employee cards |
| **Analytics.html** | ⏳ | Charts and graphs, employee growth, trends |
| **TaskList.html** | ⏳ | Create tasks, assign tasks, track status |
| **Tracking.html** | ⏳ | Activity logs, login/logout times, working hours |
| **Settings.html** | ⏳ | Company profile, policies, roles & permissions |

---

## 🔌 API Endpoints Implemented

### Dashboard
```
GET  /api/dashboard/summary     - Get overall statistics
```

### Recruitment
```
GET  /api/jobs                  - Get all job openings
POST /api/jobs                  - Create new job
PUT  /api/jobs/:id              - Update job status
GET  /api/candidates            - Get all candidates
POST /api/candidates            - Submit application
PUT  /api/candidates/:id        - Update candidate status
```

### Payroll
```
GET  /api/payroll/:month        - Get monthly payroll
POST /api/payroll/process       - Process payroll
```

### Attendance
```
POST /api/attendance/checkin    - Check in
POST /api/attendance/checkout   - Check out
GET  /api/attendance/monthly    - Get monthly attendance
```

### Leave
```
GET  /api/leave/all             - Get all leaves
GET  /api/leave/my              - Get my leaves
GET  /api/leave/pending         - Get pending requests
POST /api/leave/apply           - Apply for leave
PUT  /api/leave/approve/:id     - Approve/reject leave
```

### Employees
```
GET  /api/employees             - Get all employees
GET  /api/employees/:id         - Get employee details
POST /api/employees             - Create employee
PUT  /api/employees/:id         - Update employee
```

### Analytics
```
GET  /api/analytics/summary     - Get analytics data
```

### Tasks
```
GET  /api/tasks                 - Get all tasks
POST /api/tasks                 - Create task
PUT  /api/tasks/:id             - Update task status
```

### Tracking
```
GET  /api/tracking/logs         - Get activity logs
```

---

## 📋 Database Tables

All tables automatically created on server startup:

1. **users** - User authentication
2. **employees** - Employee information
3. **jobs** - Job openings
4. **candidates** - Job applicants
5. **attendance** - Daily attendance records
6. **leaves** - Leave requests
7. **payroll** - Salary and payroll records
8. **tasks** - Task management
9. **tracking** - Activity logs

---

## 🚀 How to Deploy & Test

### Step 1: Start Backend Server
```bash
cd Backend
npm install
npm start
# OR
node server.js
```
Server will be running on: `http://16.16.68.191:3048`

### Step 2: Docker Compose (If using Docker)
```bash
docker compose up -d
```

### Step 3: Access Dashboard
```
http://16.16.68.191:8150/
```

### Step 4: Test Workflow

1. **Sign Up**: Go to signup page, create account
2. **Login**: Log in with credentials
3. **Dashboard**: View home page with statistics
4. **Navigation**: Click sidebar menu items to navigate
5. **Create Data**: Use forms to create jobs, apply leaves, etc.
6. **View Data**: Tables auto-load from API

---

## 🎨 Current Page Details

### Home.html
**Purpose**: Dashboard overview
**Features**:
- Total employees count
- Present today count
- On leave today count
- Open positions
- Pending approvals
- Recent activities
- Quick access buttons to all modules

**API Calls**:
- `GET /api/dashboard/summary` - Load statistics
- `GET /api/leave/pending` - Load recent activities

### Recruitment.html
**Purpose**: Manage job openings and candidates
**Features**:
- Tab 1: Job Openings (Create, Edit, Close jobs)
- Tab 2: Candidates (View applications, update status)
- Tab 3: Interviews (Coming soon)

**API Calls**:
- `GET /api/jobs` - Load job openings
- `GET /api/candidates` - Load candidates
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job status
- `PUT /api/candidates/:id` - Update candidate status

### Payroll.html
**Purpose**: Manage employee salaries
**Features**:
- Month selector
- Salary breakdown (Basic, Allowances, Deductions, Gross, Net)
- Process status
- Download payslips

**API Calls**:
- `GET /api/payroll/:month` - Load payroll data

### Attendance.html
**Purpose**: Track attendance
**Features**:
- Attendance statistics cards
- Monthly attendance table
- Check-in/out times
- Attendance status
- Attendance rate calculation

**API Calls**:
- `GET /api/attendance/monthly` - Load attendance data

### Leave.html
**Purpose**: Manage leave requests
**Features**:
- Tab 1: My Leaves (View personal leave requests)
- Tab 2: Pending Approvals (Admin view)
- Apply new leave form
- Approve/reject leaves

**API Calls**:
- `GET /api/leave/my` - Load personal leaves
- `GET /api/leave/pending` - Load pending requests
- `POST /api/leave/apply` - Submit leave request
- `PUT /api/leave/approve/:id` - Approve/reject

---

## 🔑 Key Technical Details

### Frontend Stack
- HTML5 / CSS3 / JavaScript (Vanilla)
- Responsive Design
- Iframe-based content loading
- Fetch API for HTTP requests
- JWT token storage in cookies

### Backend Stack
- Node.js / Express.js
- PostgreSQL database
- JWT authentication
- CORS middleware
- Multer for file uploads

### Database Connection
```
Host: 16.16.68.191 (or db container)
Port: 5432
Database: login
User: postgres
Password: admin321
```

### Authentication Flow
1. User signs up → Password hashed → JWT created → Stored in cookie
2. User logs in → Password verified → JWT created → Stored in cookie
3. Protected routes → JWT verified from cookie/header
4. User logs out → Cookie cleared → Redirected to login

---

## 📝 Common Tasks

### Adding New Employee
```javascript
const response = await fetch('http://16.16.68.191:3048/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@company.com',
        phone: '123-456-7890',
        department: 'IT',
        position: 'Developer',
        salary: 50000,
        hire_date: '2024-01-01'
    })
});
```

### Posting Job Opening
```javascript
await fetch('http://16.16.68.191:3048/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        job_title: 'Senior Developer',
        department: 'IT',
        experience: '3-5 years',
        salary_range: '$80K - $120K'
    })
});
```

### Processing Payroll
```javascript
await fetch('http://16.16.68.191:3048/api/payroll/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        employee_id: 1,
        month: 1,
        year: 2026,
        basic_salary: 50000,
        allowances: 5000,
        deductions: 2500
    })
});
```

---

## ⚡ Remaining Tasks

### Pages Still Need Full Implementation
- [ ] EmployeeDirectory.html - Update with API integration
- [ ] Analytics.html - Add charts and data
- [ ] TaskList.html - Implement task management
- [ ] Tracking.html - Add activity log viewing
- [ ] Settings.html - Add company settings
- [ ] Performance.html - Add performance ratings
- [ ] Training.html - Add training programs
- [ ] Personalinfo_Dashboard.html - Add personal info viewer

### Testing Needed
- [ ] Browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] API endpoint testing
- [ ] Authentication flow testing
- [ ] Error handling testing
- [ ] Performance testing with large datasets

---

## 🐛 Troubleshooting

### Menu Buttons Not Working
1. Check browser console for JavaScript errors (F12)
2. Verify iframe is properly named: `<iframe name="iframe-content">`
3. Ensure menu items have: `class="menu-link" data-page="FileName.html"`
4. Reload page (Ctrl+Shift+R to clear cache)

### API Calls Returning Errors
1. Verify backend server is running: `npm start`
2. Check if IP is correct: `16.16.68.191`
3. Verify database is connected
4. Check network tab in DevTools for actual errors
5. Review backend console for error messages

### Login/Logout Issues
1. Cookies might be blocked - check browser settings
2. Clear all cookies for the domain
3. Check JWT secret matches in server.js
4. Verify credentials in Login page match user in database

---

## 📞 Support Commands

### Restart Backend
```bash
cd Backend
npm start
```

### View Server Logs
```bash
# In the Docker container or terminal
docker logs <container-name>
# or check server output directly
```

### Database Check
```sql
-- Connect to PostgreSQL
psql -h 16.16.68.191 -U postgres -d login

-- View all tables
\dt

-- Check users
SELECT * FROM users;

-- Check employees
SELECT * FROM employees;
```

---

## 🎓 Next Steps

1. **Test Current Implementation**
   - Access dashboard
   - Click all menu items
   - Verify pages load

2. **Complete Remaining Pages**
   - Update templates with API integration
   - Add proper styling
   - Implement missing features

3. **Add Missing Endpoints**
   - Performance ratings
   - Training programs
   - Advance features

4. **Deploy to Production**
   - Set secure JWT secret
   - Enable HTTPS
   - Configure environment variables
   - Set up database backups

---

**Last Updated**: January 22, 2026
**Version**: 1.0.0
**Status**: In Development ✅
