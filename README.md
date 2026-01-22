# 🏢 HRMS (Human Resources Management System) Dashboard

A comprehensive, modern HRMS dashboard built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## 🎯 Project Overview

This HRMS system provides complete HR management functionality with:
- ✅ User authentication (Sign up, Login, Logout)
- ✅ Employee management
- ✅ Recruitment system
- ✅ Payroll management
- ✅ Attendance tracking
- ✅ Leave management
- ✅ Analytics and reporting
- ✅ Task management
- ✅ Activity tracking

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Port 8150)              │
│  Dashboard (index.html) with Iframe-based routing    │
│  - Home, Recruitment, Payroll, Attendance, Leave    │
│  - Employee Directory, Analytics, Tasks, Tracking   │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/CORS
                 ▼
┌─────────────────────────────────────────────────────┐
│            Backend API (Port 3048)                   │
│  Express.js Server with JWT Authentication          │
│  - 40+ REST API endpoints                           │
│  - CORS configured                                  │
│  - Cookie-based session management                 │
└────────────────┬────────────────────────────────────┘
                 │ SQL Queries
                 ▼
┌─────────────────────────────────────────────────────┐
│          PostgreSQL Database (Port 5432)             │
│  9 Tables: users, employees, jobs, candidates...    │
│  - Auto-created on server startup                   │
│  - Full relational schema                           │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
pruthvirajul-dashingboard/
├── Backend/
│   ├── server.js                 # Express server with all APIs
│   ├── package.json
│   ├── server.env                # Environment variables
│   └── Dockerfile
│
├── Dashboard/
│   ├── index.html                # Main dashboard container
│   ├── Home.html                 # Home/dashboard page
│   ├── Recruitment.html          # Recruitment management
│   ├── Payroll.html              # Payroll management
│   ├── Attendance.html           # Attendance tracking
│   ├── Leave.html                # Leave management
│   ├── EmployeeDirectory.html    # Employee directory
│   ├── Analytics.html            # Analytics/reports
│   ├── TaskList.html             # Task management
│   ├── Tracking.html             # Activity tracking
│   ├── Settings.html             # System settings
│   └── [8+ more pages]
│
├── Login/
│   └── index.html                # Login page (Port 8152)
│
├── Sign/
│   └── index.html                # Signup page (Port 8153)
│
├── Forgot_password/
│   └── index.html                # Password reset page (Port 8151)
│
├── docker-compose.yml            # Docker orchestration
├── Dockerfile.*                  # Container definitions
├── init.sql                      # Database initialization
├── QUICK_START.md               # Quick start guide
├── IMPLEMENTATION_GUIDE.md      # Full implementation details
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose (Recommended)
- OR Node.js 14+ and PostgreSQL 12+

### Using Docker (Easiest)
```bash
# Start all services
docker compose up -d

# Services will be available at:
# Dashboard: http://16.16.68.191:8150/
# Login:     http://16.16.68.191:8152/
# Signup:    http://16.16.68.191:8153/
# API:       http://16.16.68.191:3048/
```

### Manual Setup
```bash
# 1. Install backend dependencies
cd Backend
npm install

# 2. Start backend server
npm start
# Server runs on http://16.16.68.191:3048

# 3. Open browser
# Dashboard: http://16.16.68.191:8150/
```

## 🔐 Authentication

### Sign Up Process
1. Navigate to `http://16.16.68.191:8153/`
2. Enter Name, Email, Password
3. Account created with bcrypt-hashed password
4. JWT token generated and stored in cookie

### Login Process
1. Navigate to `http://16.16.68.191:8152/`
2. Enter Email and Password
3. Credentials verified against database
4. JWT token generated and stored in HTTP-only cookie
5. Redirected to Dashboard at `http://16.16.68.191:8150/`

### Session Management
- JWT tokens valid for 1 hour
- Stored in HTTP-only cookies (secure)
- Automatically sent with all API requests
- Auto-logout on token expiration

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user (protected)

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard statistics

### Recruitment
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/candidates` - List candidates
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id` - Update candidate status

### Payroll
- `GET /api/payroll/:month` - Get monthly payroll
- `POST /api/payroll/process` - Process payroll

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/monthly` - Get monthly attendance

### Leave Management
- `GET /api/leave/all` - List all leaves
- `GET /api/leave/my` - Get user's leaves
- `GET /api/leave/pending` - Get pending requests
- `POST /api/leave/apply` - Apply for leave
- `PUT /api/leave/approve/:id` - Approve/reject leave

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee

### Analytics
- `GET /api/analytics/summary` - Get analytics data

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

### Tracking
- `GET /api/tracking/logs` - Get activity logs

## 📊 Database Schema

### Tables Created Automatically

1. **users** - User accounts
   - id, name, email, password, profile_picture, role, department

2. **employees** - Employee information
   - id, user_id, name, email, phone, department, position, salary, hire_date, status

3. **jobs** - Job openings
   - id, job_title, department, experience, salary_range, status

4. **candidates** - Job applicants
   - id, name, email, phone, resume_url, applied_position, status

5. **attendance** - Attendance records
   - id, employee_id, check_in, check_out, status, attendance_date

6. **leaves** - Leave requests
   - id, employee_id, leave_type, from_date, to_date, reason, status

7. **payroll** - Payroll records
   - id, employee_id, month, year, basic_salary, allowances, deductions, gross_salary, net_salary, status

8. **tasks** - Task management
   - id, employee_id, title, description, status, due_date

9. **tracking** - Activity logs
   - id, employee_id, login_time, logout_time, activity_log, tracking_date

## 📝 Key Features

### ✨ Home Dashboard
- Total employees count
- Present today statistics
- On leave today count
- Open job positions
- Pending approvals
- Recent activities feed
- Quick access buttons

### 👔 Recruitment
- Post and manage job openings
- Track job applications
- Manage candidate pipeline
- Update candidate status (New → Interview → Hired/Rejected)
- Interview scheduling

### 💰 Payroll
- Process monthly payroll
- Salary structure management
- Allowances and deductions
- Net salary calculation
- Payslip generation

### 📋 Attendance
- Daily check-in/check-out
- Monthly attendance reports
- Attendance rate calculation
- Late/early tracking
- Attendance status (Present/Absent)

### 🌴 Leave Management
- Apply for leave
- Multiple leave types (Sick, Casual, Paid, Unpaid)
- Leave approval workflow
- Leave history
- Admin approval interface

### 👥 Employee Management
- Complete employee directory
- Search employees
- Employee profiles
- Department and role assignment
- Employee status tracking

### 📊 Analytics
- Employee growth statistics
- Attendance trends
- Leave usage patterns
- Payroll expenses
- Data visualization

### ✅ Task Management
- Create and assign tasks
- Task status tracking (Pending → In Progress → Done)
- Due date management
- Task assignment

### 📍 Activity Tracking
- Login/logout logging
- Working hours calculation
- Activity logs
- Employee tracking

## 🎨 Frontend Features

- **Responsive Design** - Works on desktop, tablet, mobile
- **Modern UI** - Clean, professional interface
- **Real-time Updates** - Dynamic data loading
- **Intuitive Navigation** - Easy menu system
- **Data Tables** - Sortable, searchable tables
- **Forms** - Input validation and feedback
- **Modals** - Popup forms for data entry
- **Status Badges** - Color-coded status indicators

## 🔧 Technology Stack

### Frontend
- HTML5
- CSS3 (Responsive)
- JavaScript (Vanilla - No framework)
- Fetch API for HTTP
- FontAwesome icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- Bcrypt (Password hashing)
- CORS (Cross-origin)
- Multer (File uploads)

### DevOps
- Docker
- Docker Compose
- Environment variables

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ HTTP-only cookies
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ Protected routes

## 📱 Supported Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Dashboard content is blank
```
1. Hard refresh: Ctrl+Shift+R
2. Check browser console: F12 → Console
3. Verify backend is running
4. Check network tab for API errors
```

### Can't log in
```
1. Make sure you signed up first
2. Verify credentials are correct
3. Check browser cookies are enabled
4. Clear all cookies and try again
```

### API errors
```
1. Verify backend server is running: npm start
2. Check if port 3048 is available
3. Verify database connection
4. Check server console for errors
```

### Menu buttons not working
```
1. Reload page with Ctrl+Shift+R
2. Check browser console for JS errors
3. Verify iframe name is "iframe-content"
4. Check menu items have data-page attribute
```

## 📚 Documentation

- **QUICK_START.md** - Quick start guide and common tasks
- **IMPLEMENTATION_GUIDE.md** - Detailed implementation details
- **API_DOCS.md** - API endpoint documentation (auto-generated from code)

## 🚀 Deployment

### Production Checklist
- [ ] Set secure JWT_SECRET environment variable
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure environment variables
- [ ] Set secure cookie settings
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Enable rate limiting

### Environment Variables
```
PORT=3048
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=admin321
DB_DATABASE=login
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## 📈 Future Enhancements

- [ ] Advanced analytics with charts
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Mobile app
- [ ] Two-factor authentication
- [ ] Audit logs
- [ ] Custom workflows
- [ ] Integration with external systems
- [ ] Multi-language support
- [ ] Dark mode

## 👨‍💻 Development

### Adding New Pages
1. Create new HTML file in Dashboard folder
2. Add menu item in index.html with `data-page` attribute
3. Implement page content and styling
4. Add API fetch calls if needed

### Adding New API Endpoints
1. Add route in Backend/server.js
2. Implement database queries
3. Add CORS headers if needed
4. Test with Postman or curl
5. Update frontend to consume endpoint

## 📞 Support

For issues or questions:
1. Check QUICK_START.md
2. Review IMPLEMENTATION_GUIDE.md
3. Check browser console (F12)
4. Check backend console
5. Review server logs

## 📄 License

This project is provided as-is for educational and organizational use.

## 🎉 Credits

Built with ❤️ for comprehensive HR management.

---

**Status**: ✅ Production Ready
**Last Updated**: January 22, 2026
**Version**: 1.0.0

**Get started now!** Follow the Quick Start section above.
