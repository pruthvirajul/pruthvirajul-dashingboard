# 🎨 DASHBOARD MENU & PAGE REFERENCE

## Complete Visual Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     DASHBOARD NAVIGATION                         │
└─────────────────────────────────────────────────────────────────┘

    ┌─── HOME (Home.html)
    │    Shows: Dashboard stats, quick access, activities
    │    APIs: /api/dashboard/summary, /api/leave/pending
    │
    ├─── HRMS (Dropdown Menu)
    │    ├─ RECRUITMENT (Recruitment.html)
    │    │  Shows: Job openings, candidates, interviews
    │    │  APIs: /api/jobs, /api/candidates
    │    │
    │    ├─ PAYROLL (Payroll.html)
    │    │  Shows: Salary, allowances, deductions
    │    │  APIs: /api/payroll/:month
    │    │
    │    ├─ ATTENDANCE (Attendance.html)
    │    │  Shows: Check-in/out, hours, rate
    │    │  APIs: /api/attendance/monthly
    │    │
    │    └─ LEAVE (Leave.html)
    │       Shows: Applications, approvals, history
    │       APIs: /api/leave/my, /api/leave/pending
    │
    ├─── EMPLOYEE (Dropdown Menu)
    │    ├─ ONBOARDING (Personalinfo_Dashboard.html)
    │    │
    │    ├─ DIRECTORY (EmployeeDirectory.html)
    │    │  Shows: Search, profiles, contact info
    │    │  APIs: /api/employees
    │    │
    │    ├─ PERFORMANCE (Performance.html)
    │    │
    │    └─ TRAINING (Training.html)
    │
    ├─── ANALYTICS (Analytics.html)
    │    Shows: Statistics, trends, charts
    │    APIs: /api/analytics/summary
    │
    ├─── TASK LIST (TaskList.html)
    │    Shows: Tasks, assignments, status
    │    APIs: /api/tasks
    │
    ├─── TRACKING (Tracking.html)
    │    Shows: Activity logs, hours, logins
    │    APIs: /api/tracking/logs
    │
    └─── SETTINGS (Settings.html)
         Shows: Company info, policies, roles
```

---

## 📄 PAGE QUICK REFERENCE

### Home.html
```
Purpose: Dashboard overview
Location: Home menu
File Path: Dashboard/Home.html

Contents:
├─ Welcome header
├─ Statistics cards
│  ├─ Total Employees
│  ├─ Present Today
│  ├─ On Leave Today
│  ├─ Open Positions
│  └─ Pending Approvals
├─ Quick Access Buttons
│  ├─ Recruitment
│  ├─ Payroll
│  ├─ Attendance
│  ├─ Leave
│  ├─ Employees
│  └─ Analytics
└─ Recent Activities List

API Calls:
- GET /api/dashboard/summary
- GET /api/leave/pending
```

### Recruitment.html
```
Purpose: Recruitment management
Location: HRMS → Recruitment
File Path: Dashboard/Recruitment.html

Tab 1: Job Openings
├─ Post New Job button
├─ Table with:
│  ├─ Job Title
│  ├─ Department
│  ├─ Experience
│  ├─ Salary Range
│  ├─ Status (Open/Closed)
│  └─ Actions (Edit/Close/Delete)
└─ Form to create jobs

Tab 2: Candidates
├─ Table with:
│  ├─ Name
│  ├─ Email
│  ├─ Phone
│  ├─ Applied Position
│  ├─ Status (New/Interview/Hired/Rejected)
│  └─ Change Status dropdown
└─ Update candidate status

Tab 3: Interviews
└─ Coming soon

API Calls:
- GET /api/jobs
- POST /api/jobs
- PUT /api/jobs/:id
- DELETE /api/jobs/:id
- GET /api/candidates
- POST /api/candidates
- PUT /api/candidates/:id
```

### Payroll.html
```
Purpose: Payroll management
Location: HRMS → Payroll
File Path: Dashboard/Payroll.html

Controls:
├─ Month selector (Jan-Dec)
└─ Search button

Table with:
├─ Employee Name
├─ Basic Salary
├─ Allowances
├─ Deductions
├─ Gross Salary
├─ Net Salary
├─ Status (Pending/Processed)
└─ Download button

API Calls:
- GET /api/payroll/:month
```

### Attendance.html
```
Purpose: Attendance tracking
Location: HRMS → Attendance
File Path: Dashboard/Attendance.html

Statistics Cards:
├─ Total Employees
├─ Present Today
├─ Absent Today
└─ Attendance Rate %

Table with:
├─ Employee Name
├─ Check-in Time
├─ Check-out Time
├─ Total Hours
└─ Status (Present/Absent/Late)

API Calls:
- GET /api/attendance/monthly
```

### Leave.html
```
Purpose: Leave management
Location: HRMS → Leave
File Path: Dashboard/Leave.html

Apply Leave Form:
├─ Leave Type (Sick/Casual/Paid/Unpaid)
├─ From Date (date picker)
├─ To Date (date picker)
├─ Reason (textarea)
└─ Submit button

Tab 1: My Leaves
├─ Leave Type
├─ From Date
├─ To Date
├─ Reason
└─ Status (Pending/Approved/Rejected)

Tab 2: Pending Approvals (Admin)
├─ Employee Name
├─ Leave Type
├─ Date Range
├─ Status
└─ Approve/Reject buttons

API Calls:
- GET /api/leave/my
- GET /api/leave/pending
- POST /api/leave/apply
- PUT /api/leave/approve/:id
```

### EmployeeDirectory.html
```
Purpose: Employee search & browse
Location: EMPLOYEE → Directory
File Path: Dashboard/EmployeeDirectory.html

Search Box:
└─ Search by name, email, department

Employee Cards (Grid):
└─ Each card shows:
   ├─ Avatar (initials)
   ├─ Name
   ├─ Position
   ├─ Email
   ├─ Phone
   ├─ Department
   ├─ Salary
   └─ Hire Date

API Calls:
- GET /api/employees
```

---

## 🔗 MENU ITEM MAPPING

| Menu Text | File | data-page | Icon |
|-----------|------|-----------|------|
| Home | Home.html | Home.html | 🏠 |
| Recruitment | Recruitment.html | Recruitment.html | 👔 |
| Payroll | Payroll.html | Payroll.html | 💰 |
| Attendance | Attendance.html | Attendance.html | ✅ |
| Leave | Leave.html | Leave.html | 🌴 |
| Onboarding | Personalinfo_Dashboard.html | Personalinfo_Dashboard.html | 👤 |
| Directory | EmployeeDirectory.html | EmployeeDirectory.html | 👥 |
| Performance | Performance.html | Performance.html | ⭐ |
| Training | Training.html | Training.html | 🎓 |
| Analytics | Analytics.html | Analytics.html | 📊 |
| Task List | TaskList.html | TaskList.html | ✔️ |
| Tracking | Tracking.html | Tracking.html | 🕐 |
| Settings | Settings.html | Settings.html | ⚙️ |

---

## 🎯 API ENDPOINT QUICK REFERENCE

### By Feature

#### Dashboard Stats
```
GET /api/dashboard/summary
Returns: {
  totalEmployees: number,
  presentToday: number,
  onLeaveToday: number,
  openJobPositions: number,
  pendingLeaveRequests: number
}
```

#### Recruitment
```
GET /api/jobs
GET /api/candidates
POST /api/jobs → {job_title, department, experience, salary_range}
POST /api/candidates → {name, email, phone, applied_position}
PUT /api/jobs/:id → {status}
PUT /api/candidates/:id → {status}
DELETE /api/jobs/:id
```

#### Payroll
```
GET /api/payroll/:month
POST /api/payroll/process → {employee_id, month, year, basic_salary, allowances, deductions}
```

#### Attendance
```
GET /api/attendance/monthly
POST /api/attendance/checkin → {employee_id}
POST /api/attendance/checkout → {employee_id}
```

#### Leave
```
GET /api/leave/all
GET /api/leave/my
GET /api/leave/pending
POST /api/leave/apply → {employee_id, leave_type, from_date, to_date, reason}
PUT /api/leave/approve/:id → {status}
```

#### Employees
```
GET /api/employees
GET /api/employees/:id
POST /api/employees → {name, email, phone, department, position, salary, hire_date}
PUT /api/employees/:id → {name, email, phone, department, position, salary, status}
```

#### Tasks
```
GET /api/tasks
POST /api/tasks → {employee_id, title, description, due_date}
PUT /api/tasks/:id → {status}
```

#### Tracking
```
GET /api/tracking/logs
```

---

## 📊 DATA FLOW DIAGRAM

```
User Signs Up
    ↓
User Account Created (users table)
    ↓
User Logs In
    ↓
JWT Token Generated & Stored in Cookie
    ↓
Dashboard Loads (Home.html)
    ↓
Dashboard calls APIs:
    ├─ /api/dashboard/summary → Statistics
    ├─ /api/leave/pending → Recent Activities
    └─ /api/user → User Profile
    ↓
User Clicks Menu Item
    ↓
Page Loads via iframe
    ↓
Page Calls Relevant APIs:
    ├─ Recruitment → /api/jobs, /api/candidates
    ├─ Payroll → /api/payroll/:month
    ├─ Attendance → /api/attendance/monthly
    ├─ Leave → /api/leave/my, /api/leave/pending
    └─ Employees → /api/employees
    ↓
Data Displayed in Tables/Cards
    ↓
User Can Create/Update/Delete Data
    ↓
POST/PUT/DELETE Requests Sent
    ↓
Database Updated
    ↓
Page Refreshes with New Data
```

---

## ✨ BUTTON ACTIONS REFERENCE

### Home Page Buttons
```
Recruitment → Recruitment.html
Payroll → Payroll.html
Attendance → Attendance.html
Leave → Leave.html
Employees → EmployeeDirectory.html
Analytics → Analytics.html
```

### Recruitment Page Buttons
```
+ Post New Job → Shows form
Edit Job → Updates job
Close Job → Changes status to 'closed'
Change Status → Updates candidate status
```

### Leave Page Buttons
```
+ Apply Leave → Shows form
Submit Request → POST /api/leave/apply
Approve → PUT /api/leave/approve/:id (status: 'approved')
Reject → PUT /api/leave/approve/:id (status: 'rejected')
```

---

## 🎯 TESTING WORKFLOW

### Test Recruitment Flow
```
1. Home → Click "Recruitment" button
2. Recruitment page loads
3. Click "+ Post New Job"
4. Fill form: Title, Department, Experience, Salary
5. Click "Post Job"
6. GET /api/jobs updates list
7. View posted job in table
8. Click "Close" to change status
9. Job status updates to "closed"
```

### Test Leave Flow
```
1. Home → Click "Leave" button
2. Leave page loads with "My Leaves" tab
3. Click "+ Apply Leave"
4. Fill form: Type, Dates, Reason
5. Click "Submit Request"
6. POST /api/leave/apply saves request
7. Refresh page to see new request
8. Switch to "Pending Approvals" (admin)
9. Click "Approve" or "Reject"
10. Status updates
```

### Test Employee Search
```
1. Home → Click "Employees" button
2. Directory page loads with list
3. Enter search term in search box
4. List filters in real-time
5. Click employee card to see full details
```

---

## 🔄 COMMON WORKFLOWS

### HR Manager Daily Tasks
```
1. Log in → See dashboard
2. Check recruitment → Review new candidates
3. Check attendance → See who's present
4. Check leave → Approve pending requests
5. Process payroll → Month-end salary processing
```

### Employee Daily Tasks
```
1. Log in
2. View dashboard
3. Check attendance → No action needed
4. Check personal leave → View history
5. Apply leave if needed
```

### Admin Tasks
```
1. Log in
2. Manage employees → Create, update, delete
3. Review recruitment → Update candidate status
4. Approve leaves → Review pending requests
5. View analytics → Check trends
```

---

## 💡 TIPS & TRICKS

### Quick Navigation
- Use sidebar menu for different sections
- Quick buttons on Home for common tasks
- Search boxes for filtering data

### Keyboard Shortcuts
- F5 → Reload page
- Ctrl+Shift+R → Hard refresh (clear cache)
- F12 → Developer tools for debugging
- Tab → Navigate form fields
- Enter → Submit forms

### Common Issues
- Blank page? → Hard refresh (Ctrl+Shift+R)
- Menu not working? → Check console (F12)
- API errors? → Check backend is running
- Login fails? → Verify credentials and cookies

---

**Use this guide to navigate and understand your HRMS Dashboard!**
