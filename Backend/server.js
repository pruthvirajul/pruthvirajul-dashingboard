require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3048;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Data storage paths
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const LEAVES_FILE = path.join(DATA_DIR, 'leaves.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');
const PAYROLL_FILE = path.join(DATA_DIR, 'payroll.json');
const TRACKING_FILE = path.join(DATA_DIR, 'tracking.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize JSON files
const initJsonFiles = () => {
  const files = [USERS_FILE, EMPLOYEES_FILE, JOBS_FILE, CANDIDATES_FILE, LEAVES_FILE, ATTENDANCE_FILE, PAYROLL_FILE, TRACKING_FILE];
  files.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify([], null, 2));
    }
  });
  console.log('✅ JSON files initialized');
};

// Read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

initJsonFiles();

// ✅ Updated CORS config
const allowedOrigins = [
  'http://13.60.237.35:8150',
  'http://13.60.237.35:8151',
  'http://13.60.237.35:8152',
  'http://13.60.237.35:8153',
  'http://13.60.237.35:3048',
  'http://16.171.115.74:8150',
  'http://16.171.115.74:8151',
  'http://16.171.115.74:8152',
  'http://16.171.115.74:8153',
  'http://16.171.115.74:3048',
  'localhost:3000',
  'localhost:3048'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['set-cookie']
}));

app.use((req, res, next) => {
  console.log('📍', req.method, req.url);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};



// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Login/index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../Sign/index.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../Forgot_password/index.html'));
});

app.get('/dashboard', authenticateToken, (req, res) => {
  const filePath = path.join(__dirname, '../Dashboard/index.html');
  res.sendFile(filePath);
});

// ========== AUTH APIS ==========

// Signup API
app.post('/api/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('📝 Signup request received');
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const users = readJsonFile(USERS_FILE);
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicture = req.file ? req.file.buffer.toString('base64') : null;

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      profile_picture: profilePicture,
      role: 'employee',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    writeJsonFile(USERS_FILE, users);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    console.log('✅ Signup successful for:', email);
    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profile_picture ? `data:image/jpeg;base64,${newUser.profile_picture}` : null
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 Login request received');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = readJsonFile(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    console.log('✅ Login successful for:', email);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User Info
app.get('/api/user', authenticateToken, (req, res) => {
  try {
    const users = readJsonFile(USERS_FILE);
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture ? `data:image/jpeg;base64,${user.profile_picture}` : null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout API
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Forgot Password API
app.post('/api/forgot-password', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const users = readJsonFile(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});


// ========== DASHBOARD APIS ==========

app.get('/api/dashboard/summary', authenticateToken, (req, res) => {
  try {
    const employees = readJsonFile(EMPLOYEES_FILE);
    const leaves = readJsonFile(LEAVES_FILE);

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      pendingLeaves
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== LEAVE APIS ==========

app.get('/api/leave/my', authenticateToken, (req, res) => {
  try {
    const employees = readJsonFile(EMPLOYEES_FILE);
    const leaves = readJsonFile(LEAVES_FILE);

    const employee = employees.find(e => e.user_id === req.user.userId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const myLeaves = leaves.filter(l => l.employee_id === employee.id);
    res.status(200).json(myLeaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leave/pending', (req, res) => {
  try {
    const employees = readJsonFile(EMPLOYEES_FILE);
    const leaves = readJsonFile(LEAVES_FILE);

    const pendingLeaves = leaves
      .filter(l => l.status === 'pending')
      .map(l => {
        const emp = employees.find(e => e.id === l.employee_id);
        return { ...l, employee_name: emp?.name, employee_email: emp?.email };
      });

    res.status(200).json(pendingLeaves);
  } catch (error) {
    console.error('Get pending leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/leave/apply', authenticateToken, (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employees = readJsonFile(EMPLOYEES_FILE);
    const leaves = readJsonFile(LEAVES_FILE);

    const employee = employees.find(e => e.user_id === req.user.userId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newLeave = {
      id: Date.now(),
      employee_id: employee.id,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
      status: 'pending',
      requested_date: new Date().toISOString()
    };

    leaves.push(newLeave);
    writeJsonFile(LEAVES_FILE, leaves);

    res.status(201).json({ message: 'Leave request submitted' });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/leave/approve/:leaveId', authenticateToken, (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;
    const leaves = readJsonFile(LEAVES_FILE);

    const leave = leaves.find(l => l.id === parseInt(leaveId));
    if (leave) {
      leave.status = status;
      writeJsonFile(LEAVES_FILE, leaves);
    }

    res.status(200).json({ message: 'Leave request updated' });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ATTENDANCE APIS ==========

app.get('/api/attendance/monthly', (req, res) => {
  try {
    const employees = readJsonFile(EMPLOYEES_FILE);
    const attendance = readJsonFile(ATTENDANCE_FILE);

    const result = attendance.map(a => {
      const emp = employees.find(e => e.id === a.employee_id);
      return { ...a, employee_name: emp?.name };
    }).slice(-100);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== PAYROLL APIS ==========

app.get('/api/payroll/:month', authenticateToken, (req, res) => {
  try {
    const { month } = req.params;
    const employees = readJsonFile(EMPLOYEES_FILE);
    const payroll = readJsonFile(PAYROLL_FILE);

    const employee = employees.find(e => e.user_id === req.user.userId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const pay = payroll.find(p => p.employee_id === employee.id && p.month === month);
    res.status(200).json(pay || {});
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== JOBS & RECRUITMENT APIS ==========

app.get('/api/jobs', (req, res) => {
  try {
    const jobs = readJsonFile(JOBS_FILE);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  try {
    const { jobTitle, department, experience, salary, description } = req.body;
    const jobs = readJsonFile(JOBS_FILE);

    const newJob = {
      id: Date.now(),
      job_title: jobTitle,
      department: department,
      experience: experience,
      salary: salary,
      description: description,
      posted_date: new Date().toISOString()
    };

    jobs.push(newJob);
    writeJsonFile(JOBS_FILE, jobs);

    res.status(201).json({ message: 'Job posted successfully' });
  } catch (error) {
    console.error('Post job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/jobs/:jobId', authenticateToken, (req, res) => {
  try {
    const { jobId } = req.params;
    const jobs = readJsonFile(JOBS_FILE);
    const filtered = jobs.filter(j => j.id !== parseInt(jobId));
    writeJsonFile(JOBS_FILE, filtered);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/candidates', (req, res) => {
  try {
    const jobs = readJsonFile(JOBS_FILE);
    const candidates = readJsonFile(CANDIDATES_FILE);

    const result = candidates.map(c => {
      const job = jobs.find(j => j.id === c.job_id);
      return { ...c, job_title: job?.job_title };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/candidates/:candidateId', authenticateToken, (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;
    const candidates = readJsonFile(CANDIDATES_FILE);

    const candidate = candidates.find(c => c.id === parseInt(candidateId));
    if (candidate) {
      candidate.status = status;
      writeJsonFile(CANDIDATES_FILE, candidates);
    }

    res.status(200).json({ message: 'Candidate status updated' });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== TRACKING APIS ==========

app.get('/api/tracking/logs', authenticateToken, (req, res) => {
  try {
    const employees = readJsonFile(EMPLOYEES_FILE);
    const tracking = readJsonFile(TRACKING_FILE);

    const result = tracking
      .map(t => {
        const emp = employees.find(e => e.id === t.employee_id);
        return { ...t, employee_name: emp?.name };
      })
      .slice(-100);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ HRMS Backend Server Started!                          ║
║  🚀 Running on port ${port}                              ║
║  📊 Database: JSON Files (No installation needed!)        ║
║  💾 Data location: ${path.relative(process.cwd(), DATA_DIR)}                          ║
║  🔗 Access: http://16.171.115.74:${port}                 ║
╚════════════════════════════════════════════════════════════╝

📍 Available APIs:
  ✓ POST   /api/signup              - User registration
  ✓ POST   /api/login               - User login
  ✓ GET    /api/user                - Get user info (protected)
  ✓ POST   /api/logout              - Logout
  ✓ POST   /api/forgot-password     - Password reset
  ✓ GET    /api/dashboard/summary   - Dashboard data
  ✓ POST   /api/leave/apply         - Apply for leave
  ✓ GET    /api/leave/my            - My leaves
  ✓ GET    /api/leave/pending       - Pending leaves
  ✓ GET    /api/attendance/monthly  - Monthly attendance
  ✓ GET    /api/payroll/:month      - Payroll info
  ✓ GET    /api/jobs                - List jobs
  ✓ POST   /api/jobs                - Post new job
  ✓ GET    /api/candidates          - List candidates
  ✓ GET    /api/tracking/logs       - Tracking logs
  `);
});
