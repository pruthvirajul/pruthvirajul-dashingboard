require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3048;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'login',
  password: process.env.DB_PASSWORD || 'admin321',
  port: parseInt(process.env.DB_PORT) || 5432,
});

// ✅ Updated CORS config
const allowedOrigins = [
  'http://13.60.237.35:8150',
  'http://13.60.237.35:8151',
  'http://13.60.237.35:8152',
  'http://13.60.237.35:8153',
  'http://13.60.237.35:3048'
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
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const initDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_picture TEXT,
        role VARCHAR(50) DEFAULT 'employee',
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        department VARCHAR(100),
        position VARCHAR(100),
        salary DECIMAL(10, 2),
        hire_date DATE,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        job_title VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        experience VARCHAR(50),
        salary_range VARCHAR(100),
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Candidates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        resume_url TEXT,
        applied_position VARCHAR(100),
        status VARCHAR(50) DEFAULT 'new',
        applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attendance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        check_in TIMESTAMP,
        check_out TIMESTAMP,
        status VARCHAR(50),
        attendance_date DATE DEFAULT CURRENT_DATE
      )
    `);

    // Leave table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        leave_type VARCHAR(50),
        from_date DATE,
        to_date DATE,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payroll table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        month INTEGER,
        year INTEGER,
        basic_salary DECIMAL(10, 2),
        allowances DECIMAL(10, 2),
        deductions DECIMAL(10, 2),
        gross_salary DECIMAL(10, 2),
        net_salary DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'pending',
        processed_date TIMESTAMP
      )
    `);

    // Tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tracking (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        login_time TIMESTAMP,
        logout_time TIMESTAMP,
        activity_log TEXT,
        tracking_date DATE DEFAULT CURRENT_DATE
      )
    `);

    console.log('Database initialized with all tables');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Initialize database on startup
initDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token ||
                req.headers['authorization']?.split(' ')[1] ||
                req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.clearCookie('token');
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    req.user = user;
    next();
  });
};

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
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
  console.log('Attempting to serve:', filePath);
  res.sendFile(filePath);
});

app.post('/api/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Received signup request with body:', req.body);
    console.log('Received file:', req.file);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!validateEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const profilePicture = req.file ? req.file.buffer.toString('base64') : null;

    const result = await pool.query(
      'INSERT INTO users (name, email, password, profile_picture) VALUES ($1, $2, $3, $4) RETURNING id, name, email, profile_picture',
      [name, email, hashedPassword, profilePicture]
    );

    const newUser = result.rows[0];

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Updated cookie settings for local dev; adjust for prod
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,           // change to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    console.log('Signup completed successfully for:', email);
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
    console.error('SIGNUP ERROR DETAILS:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file
    });
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
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

    console.log('Login successful for:', email);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture ? `data:image/jpeg;base64,${user.profile_picture}` : null
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get User Data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, profile_picture FROM users WHERE id = $1', [req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture ? `data:image/jpeg;base64,${user.profile_picture}` : null
      }
    });
  } catch (error) {
    console.error('GET USER ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout Route
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// Protected Route Test
app.get('/api/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user
  });
});

// ========== DASHBOARD APIS ==========

// Dashboard Summary
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const totalEmployees = await pool.query('SELECT COUNT(*) FROM employees WHERE status = $1', ['active']);
    const presentToday = await pool.query('SELECT COUNT(*) FROM attendance WHERE status = $1 AND attendance_date = CURRENT_DATE', ['present']);
    const onLeave = await pool.query('SELECT COUNT(*) FROM leaves WHERE status = $1 AND from_date <= CURRENT_DATE AND to_date >= CURRENT_DATE', ['approved']);
    const openJobs = await pool.query('SELECT COUNT(*) FROM jobs WHERE status = $1', ['open']);
    const pendingLeaves = await pool.query('SELECT COUNT(*) FROM leaves WHERE status = $1', ['pending']);

    res.status(200).json({
      totalEmployees: parseInt(totalEmployees.rows[0].count),
      presentToday: parseInt(presentToday.rows[0].count),
      onLeaveToday: parseInt(onLeave.rows[0].count),
      openJobPositions: parseInt(openJobs.rows[0].count),
      pendingLeaveRequests: parseInt(pendingLeaves.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== RECRUITMENT APIS ==========

// Get all jobs
app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create job
app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const { job_title, department, experience, salary_range } = req.body;
    const result = await pool.query(
      'INSERT INTO jobs (job_title, department, experience, salary_range) VALUES ($1, $2, $3, $4) RETURNING *',
      [job_title, department, experience, salary_range]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update job status
app.put('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete job
app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    res.status(200).json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all candidates
app.get('/api/candidates', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates ORDER BY applied_date DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create candidate
app.post('/api/candidates', async (req, res) => {
  try {
    const { name, email, phone, applied_position } = req.body;
    const result = await pool.query(
      'INSERT INTO candidates (name, email, phone, applied_position) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, applied_position]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update candidate status
app.put('/api/candidates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE candidates SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== PAYROLL APIS ==========

// Get payroll for month
app.get('/api/payroll/:month', authenticateToken, async (req, res) => {
  try {
    const { month } = req.params;
    const currentYear = new Date().getFullYear();
    const result = await pool.query(
      'SELECT p.*, e.name, e.email FROM payroll p JOIN employees e ON p.employee_id = e.id WHERE p.month = $1 AND p.year = $2',
      [month, currentYear]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process payroll
app.post('/api/payroll/process', authenticateToken, async (req, res) => {
  try {
    const { employee_id, month, year, basic_salary, allowances, deductions } = req.body;
    const gross_salary = basic_salary + allowances;
    const net_salary = gross_salary - deductions;

    const result = await pool.query(
      'INSERT INTO payroll (employee_id, month, year, basic_salary, allowances, deductions, gross_salary, net_salary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [employee_id, month, year, basic_salary, allowances, deductions, gross_salary, net_salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Process payroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ATTENDANCE APIS ==========

// Check in
app.post('/api/attendance/checkin', authenticateToken, async (req, res) => {
  try {
    const { employee_id } = req.body;
    const result = await pool.query(
      'INSERT INTO attendance (employee_id, check_in, status, attendance_date) VALUES ($1, CURRENT_TIMESTAMP, $2, CURRENT_DATE) RETURNING *',
      [employee_id, 'present']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check out
app.post('/api/attendance/checkout', authenticateToken, async (req, res) => {
  try {
    const { employee_id } = req.body;
    const result = await pool.query(
      'UPDATE attendance SET check_out = CURRENT_TIMESTAMP WHERE employee_id = $1 AND attendance_date = CURRENT_DATE RETURNING *',
      [employee_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monthly attendance
app.get('/api/attendance/monthly', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.name, a.* FROM attendance a JOIN employees e ON a.employee_id = e.id WHERE EXTRACT(MONTH FROM a.attendance_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM a.attendance_date) = EXTRACT(YEAR FROM CURRENT_DATE) ORDER BY a.attendance_date'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get monthly attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== LEAVE APIS ==========

// Get all leaves
app.get('/api/leave/all', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT l.*, e.name FROM leaves l JOIN employees e ON l.employee_id = e.id ORDER BY l.created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my leaves
app.get('/api/leave/my', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT l.* FROM leaves l JOIN employees e ON l.employee_id = e.id JOIN users u ON e.user_id = u.id WHERE u.id = $1 ORDER BY l.created_at DESC',
      [req.user.userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending leaves
app.get('/api/leave/pending', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT l.*, e.name FROM leaves l JOIN employees e ON l.employee_id = e.id WHERE l.status = $1 ORDER BY l.created_at DESC', ['pending']);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get pending leaves error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply leave
app.post('/api/leave/apply', authenticateToken, async (req, res) => {
  try {
    const { employee_id, leave_type, from_date, to_date, reason } = req.body;
    const result = await pool.query(
      'INSERT INTO leaves (employee_id, leave_type, from_date, to_date, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [employee_id, leave_type, from_date, to_date, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject leave
app.put('/api/leave/approve/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== EMPLOYEE APIS ==========

// Get all employees
app.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY hire_date DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single employee
app.get('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create employee
app.post('/api/employees', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, hire_date } = req.body;
    const result = await pool.query(
      'INSERT INTO employees (name, email, phone, department, position, salary, hire_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone, department, position, salary, hire_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
app.put('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, position, salary, status } = req.body;
    const result = await pool.query(
      'UPDATE employees SET name=$1, email=$2, phone=$3, department=$4, position=$5, salary=$6, status=$7 WHERE id=$8 RETURNING *',
      [name, email, phone, department, position, salary, status, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ANALYTICS APIS ==========

// Get analytics summary
app.get('/api/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const employeeGrowth = await pool.query('SELECT COUNT(*) FROM employees WHERE hire_date >= CURRENT_DATE - INTERVAL \'30 days\'');
    const attendanceRate = await pool.query('SELECT COUNT(*) FROM attendance WHERE status = $1 AND attendance_date >= CURRENT_DATE - INTERVAL \'30 days\'', ['present']);
    const leaveUsage = await pool.query('SELECT COUNT(*) FROM leaves WHERE status = $1 AND from_date >= CURRENT_DATE - INTERVAL \'30 days\'', ['approved']);
    const payrollProcessed = await pool.query('SELECT SUM(net_salary) FROM payroll WHERE status = $1 AND EXTRACT(MONTH FROM processed_date) = EXTRACT(MONTH FROM CURRENT_DATE)', ['processed']);

    res.status(200).json({
      employeeGrowth: parseInt(employeeGrowth.rows[0].count),
      attendanceRate: parseInt(attendanceRate.rows[0].count),
      leaveUsage: parseInt(leaveUsage.rows[0].count),
      payrollExpense: payrollProcessed.rows[0].sum || 0
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== TASK APIS ==========

// Get all tasks
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT t.*, e.name FROM tasks t JOIN employees e ON t.employee_id = e.id ORDER BY t.due_date');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { employee_id, title, description, due_date } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (employee_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [employee_id, title, description, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task status
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== TRACKING APIS ==========

// Get tracking logs
app.get('/api/tracking/logs', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT t.*, e.name FROM tracking t JOIN employees e ON t.employee_id = e.id ORDER BY t.tracking_date DESC LIMIT 100');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Available routes:');
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
