# Dashboard Button Functions - Complete Guide

## Dashboard Buttons and Their Functions

### Main Navigation

#### 1. **HOME Button**
- **Loads**: Home.html
- **Shows**: Dashboard summary with:
  - Welcome message
  - Total employees count
  - Active positions
  - Pending leaves
  - Key metrics and statistics
  - Recent activities

#### 2. **HRMS Dropdown**
Expand to access HR Management System modules:

##### 2a. Recruitment
- **Loads**: Recruitment.html
- **Shows**: Job postings and candidate management
  - Open job positions
  - List of candidates
  - Add new job position form
  - Candidate evaluation
  - Hiring status tracking

##### 2b. Payroll
- **Loads**: Payroll.html
- **Shows**: Salary and payment information
  - Salary slips
  - Monthly payroll summary
  - Employee compensation details
  - Tax information
  - Payment history

##### 2c. Attendance
- **Loads**: Attendance.html
- **Shows**: Employee attendance records
  - Daily attendance log
  - Monthly attendance summary
  - Attendance percentage
  - Late arrivals
  - Absences and leaves

##### 2d. Leave
- **Loads**: Leave.html
- **Shows**: Leave management system
  - Apply for leave
  - View pending leave requests
  - Approve/Reject requests
  - Leave balance information
  - Leave history

#### 3. **EMPLOYEE Dropdown**
Expand to access employee management modules:

##### 3a. Onboarding
- **Loads**: Personalinfo_Dashboard.html
- **Shows**: Employee onboarding process
  - Welcome instructions
  - Personal information form
  - Required documents checklist
  - Training assignments
  - Equipment allocation
  - Onboarding tasks progress

##### 3b. Directory
- **Loads**: EmployeeDirectory.html
- **Shows**: Complete employee directory
  - List of all employees
  - Contact information
  - Department assignment
  - Reporting manager
  - Employee search
  - Profile details

##### 3c. Performance
- **Loads**: Performance.html
- **Shows**: Employee performance management
  - Performance reviews
  - Goals and KPIs
  - Rating and evaluation
  - Feedback history
  - Development plans

##### 3d. Training
- **Loads**: Training.html
- **Shows**: Employee training programs
  - Available training courses
  - Completed trainings
  - Training enrollment
  - Certification tracking
  - Training calendar

#### 4. **ANALYTICS Button**
- **Loads**: Analytics.html
- **Shows**: Business analytics and insights
  - Charts and graphs
  - Employee metrics
  - Department statistics
  - Hiring trends
  - Turnover analysis
  - Performance analytics

#### 5. **TASK LIST Button**
- **Loads**: TaskList.html
- **Shows**: Task management
  - Create new tasks
  - Assign tasks to employees
  - Track task progress
  - Task deadlines
  - Task status updates
  - Task history

#### 6. **TRACKING Button**
- **Loads**: Tracking.html
- **Shows**: Employee activity tracking
  - Work hour tracking
  - Project time allocation
  - Activity monitoring
  - Productivity metrics
  - Time logs

#### 7. **SETTINGS Button**
- **Loads**: Settings.html
- **Shows**: Dashboard and account settings
  - Profile settings
  - Company settings
  - System preferences
  - Notification settings
  - Security settings
  - Password management

#### 8. **LOGOUT Button**
- **Function**: Logs out the current user
- **Action**: Clears authentication token and redirects to login page
- **Endpoint**: POST /api/logout

---

## How to Use

1. **Click any menu button** to load the corresponding page content
2. **Dropdown buttons** (HRMS, EMPLOYEE) expand to show sub-options
3. **Sub-menu items** load their respective pages when clicked
4. **Content loads** inside the main iframe area on the right side
5. **Forms** in each page can be filled and submitted to the backend API
6. **Data** is fetched from the backend and displayed in real-time

---

## Technical Implementation

- **Framework**: Express.js Backend + Vanilla HTML5/CSS3 Frontend
- **Data Storage**: PostgreSQL Database
- **API Port**: 3048
- **Frontend Ports**: 8150 (Dashboard), 8152 (Login), 8153 (Signup)
- **Server IP**: 16.16.68.191
- **Authentication**: JWT tokens with HTTP-only cookies

---

## Page Load Behavior

Each button triggers the following sequence:

1. Click event is captured by event listener
2. Button's `data-page="filename.html"` attribute is read
3. File path is loaded into the iframe
4. Page HTML, CSS, and JavaScript initialize
5. JavaScript fetches data from backend API
6. Data populates the page
7. User can interact with forms and buttons

---

## Common Issues and Solutions

### Issue: Button doesn't respond to clicks
**Solution**: Check browser console (F12) for JavaScript errors. Ensure iframe is loaded.

### Issue: Page loads but no data shown
**Solution**: Check Network tab in browser DevTools. Verify API endpoint returns data.

### Issue: "CORS error" in browser console
**Solution**: Backend CORS configuration has been updated to allow 16.16.68.191

### Issue: Form submission fails
**Solution**: Ensure backend server is running and database is accessible.

---

## Backend API Endpoints

All pages use these API endpoints (updated to 16.16.68.191:3048):

- `/api/dashboard/summary` - Home page data
- `/api/jobs` - Recruitment job listings
- `/api/candidates` - Recruitment candidates
- `/api/payroll/:month` - Payroll information
- `/api/attendance/monthly` - Attendance records
- `/api/leave/*` - Leave management
- `/api/employees` - Employee directory
- `/api/logout` - Logout functionality

---

**Last Updated**: January 22, 2026
**Status**: All buttons configured and working
