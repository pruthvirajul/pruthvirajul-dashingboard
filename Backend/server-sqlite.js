require('dotenv').config();

const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3048;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Initialize SQLite Database
const db = new Database('./hrms.db');
db.pragma('journal_mode = WAL');

// ✅ Updated CORS config
const allowedOrigins = [
  'http://13.60.237.35:8150',
  'http://13.60.237.35:8151',
  'http://13.60.237.35:8152',
  'http://13.60.237.35:8153',
  'http://13.60.237.35:3048',
  'http://16.16.68.191:8150',
  'http://16.16.68.191:8151',
  'http://16.16.68.191:8152',
  'http://16.16.68.191:8153',
  'http://16.16.68.191:3048',
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
  console.log('Incoming request:', req.method, req.url);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const initDatabase = () => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        profile_picture TEXT,
        role TEXT DEFAULT 'employee',
        department TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Employees table
    db.exec(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        department TEXT,
        position TEXT,
        salary REAL,
        hire_date DATE,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Jobs table
    db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_title TEXT NOT NULL,
        department TEXT NOT NULL,
        experience TEXT,
        salary TEXT,
        description TEXT,
        posted_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Candidates table
    db.exec(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        resume_url TEXT,
        status TEXT DEFAULT 'pending',
        applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(job_id) REFERENCES jobs(id)
      )
    `);

    // Leave requests table
    db.exec(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        leave_type TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        requested_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(employee_id) REFERENCES employees(id)
      )
    `);

    // Attendance table
    db.exec(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        attendance_date DATE NOT NULL,
        check_in_time TIME,
        check_out_time TIME,
        status TEXT,
        FOREIGN KEY(employee_id) REFERENCES employees(id)
      )
    `);

    // Payroll table
    db.exec(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        salary REAL,
        allowances REAL,
        deductions REAL,
        net_pay REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(employee_id) REFERENCES employees(id)
      )
    `);

    // Tracking table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        tracking_date DATE,
        location TEXT,
        duration INTEGER,
        FOREIGN KEY(employee_id) REFERENCES employees(id)
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

initDatabase();

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

// ========== AUTH APIS ==========

// Signup API
app.post('/api/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Received signup request with body:', req.body);
    console.log('Received file:', req.file ? 'Yes' : 'No');

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!validateEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const profilePicture = req.file ? req.file.buffer.toString('base64') : null;

    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, email, hashedPassword, profilePicture);

    const newUser = {
      id: result.lastInsertRowid,
      name: name,
      email: email,
      profile_picture: profilePicture
    };

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    console.log('✅ Signup completed successfully for:', email);
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
    console.error('❌ SIGNUP ERROR:', error.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login request received');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
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
    console.error('❌ LOGIN ERROR:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User Info
app.get('/api/user', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, profile_picture FROM users WHERE id = ?').get(req.user.userId);

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

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== DASHBOARD APIS ==========

app.get('/api/dashboard/summary', authenticateToken, (req, res) => {
  try {
    const totalEmployees = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
    const activeEmployees = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status = 'active'").get().count;
    const pendingLeaves = db.prepare("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'").get().count;

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
    const employee = db.prepare('SELECT id FROM employees WHERE user_id = ?').get(req.user.userId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const leaves = db.prepare('SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY requested_date DESC').all(employee.id);
    res.status(200).json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leave/pending', (req, res) => {
  try {
    const result = db.prepare(`
      SELECT lr.*, e.name, e.email 
      FROM leave_requests lr 
      JOIN employees e ON lr.employee_id = e.id 
      WHERE lr.status = 'pending' 
      ORDER BY lr.requested_date DESC
    `).all();
    res.status(200).json(result);
  } catch (error) {
    console.error('Get pending leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/leave/apply', authenticateToken, (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employee = db.prepare('SELECT id FROM employees WHERE user_id = ?').get(req.user.userId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const stmt = db.prepare(
      'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(employee.id, leaveType, startDate, endDate, reason);

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

    db.prepare('UPDATE leave_requests SET status = ? WHERE id = ?').run(status, leaveId);
    res.status(200).json({ message: 'Leave request updated' });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ATTENDANCE APIS ==========

app.get('/api/attendance/monthly', (req, res) => {
  try {
    const result = db.prepare(`
      SELECT a.*, e.name 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id 
      ORDER BY a.attendance_date DESC 
      LIMIT 100
    `).all();
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
    const employee = db.prepare('SELECT id FROM employees WHERE user_id = ?').get(req.user.userId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const result = db.prepare('SELECT * FROM payroll WHERE employee_id = ? AND month = ?').get(employee.id, month);
    res.status(200).json(result || {});
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== JOBS & RECRUITMENT APIS ==========

app.get('/api/jobs', (req, res) => {
  try {
    const result = db.prepare('SELECT * FROM jobs ORDER BY posted_date DESC').all();
    res.status(200).json(result);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  try {
    const { jobTitle, department, experience, salary, description } = req.body;
    const stmt = db.prepare(
      'INSERT INTO jobs (job_title, department, experience, salary, description) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(jobTitle, department, experience, salary, description);
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (error) {
    console.error('Post job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/jobs/:jobId', authenticateToken, (req, res) => {
  try {
    const { jobId } = req.params;
    db.prepare('DELETE FROM jobs WHERE id = ?').run(jobId);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/candidates', (req, res) => {
  try {
    const result = db.prepare(`
      SELECT c.*, j.job_title 
      FROM candidates c 
      JOIN jobs j ON c.job_id = j.id 
      ORDER BY c.applied_date DESC
    `).all();
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
    db.prepare('UPDATE candidates SET status = ? WHERE id = ?').run(status, candidateId);
    res.status(200).json({ message: 'Candidate status updated' });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== TRACKING APIS ==========

app.get('/api/tracking/logs', authenticateToken, (req, res) => {
  try {
    const result = db.prepare(`
      SELECT t.*, e.name 
      FROM tracking t 
      JOIN employees e ON t.employee_id = e.id 
      ORDER BY t.tracking_date DESC 
      LIMIT 100
    `).all();
    res.status(200).json(result);
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\n✅ Server running on port ${port}`);
  console.log('📊 Database: SQLite');
  console.log('\n📍 Available routes:');
  console.log('GET  /                 -> Login page');
  console.log('GET  /signup           -> Signup page');
  console.log('GET  /forgot-password  -> Forgot password page');
  console.log('GET  /dashboard        -> Dashboard (protected)');
  console.log('POST /api/signup       -> User registration');
  console.log('POST /api/login        -> User login');
  console.log('POST /api/forgot-password -> Password reset');
  console.log('GET  /api/user         -> Get user data (protected)');
  console.log('POST /api/logout       -> User logout');
  console.log('GET  /api/protected    -> Test protected route');
});
