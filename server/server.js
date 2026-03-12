const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { initDb, getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'arlindo-crm-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route untuk cek server
app.get("/", (req, res) => {
  res.send("ARLINDO CRM API RUNNING");
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage });

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'masteradmin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Master Admin middleware
const requireMasterAdmin = (req, res, next) => {
  if (req.user.role !== 'masteradmin') {
    return res.status(403).json({ error: 'Master Admin access required' });
  }
  next();
};

// Staff middleware (staff can access all except Settings)
const requireStaff = (req, res, next) => {
  if (!['admin', 'masteradmin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
};

// Activity Logger
const logActivity = (leadId, userId, action, description) => {
  const db = getDb();
  db.prepare(`
    INSERT INTO activities (lead_id, user_id, action, description)
    VALUES (?, ?, ?, ?)
  `).run(leadId, userId, action, description);
};

// ============ AUTH ROUTES ============

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`[LOGIN] Attempt for username: "${username}", password length: ${password ? password.length : 0}`);
  const db = getDb();
  
  const user = db.prepare('SELECT id, username, name, role FROM users WHERE username = ?').get(username);
  console.log(`[LOGIN] User found: ${user ? `${user.username} (ID:${user.id}, role:${user.role})` : 'NOT FOUND'}`);
  if (!user) {
    console.log('[LOGIN] Invalid username');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role, team: user.team }
  });
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, username, name, email, phone, role FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// Change password
app.post('/api/auth/change-password', authenticate, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = getDb();
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password lama dan baru wajib diisi' });
  }
  
  // Get current user
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }
  
  // Verify current password
  console.log(`[CHANGE-PW] User ${req.user.username} (ID:${req.user.id}) changing password. Current PW len: ${currentPassword.length}, Stored hash len: ${user.password.length}`);
  console.log(`[CHANGE-PW] Stored hash starts with: ${user.password.substring(0, 20)}...`);
  const validPassword = bcrypt.compareSync(currentPassword, user.password);
  console.log(`[CHANGE-PW] bcrypt.compare result: ${validPassword}`);
  if (!validPassword) {
    console.log('[CHANGE-PW] Invalid current password');
    return res.status(400).json({ error: 'Password lama tidak benar' });
  }
  
  // Update password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  console.log(`[CHANGE-PW] New hash: ${hashedPassword.substring(0, 20)}...`);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.id);
  console.log('[CHANGE-PW] Password updated successfully');
  
  res.json({ success: true, message: 'Password berhasil diubah' });
});

// Update current user profile
app.put('/api/auth/profile', authenticate, (req, res) => {
  const { name, email, phone } = req.body;
  const db = getDb();
  
  db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?')
    .run(name, email, phone, req.user.id);

  res.json({ success: true, name, email, phone });
});

// Register (admin only)
app.post('/api/auth/register', authenticate, requireAdmin, (req, res) => {
  const { username, password, name, email, phone, role } = req.body;
  const db = getDb();
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (username, password, name, email, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, hashedPassword, name, email, phone, role || 'user');
    
    res.json({ id: result.lastInsertRowid, username, name, email, role: role || 'user' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// ============ LEADS ROUTES ============

// Get all leads
app.get('/api/leads', authenticate, (req, res) => {
  const { search, status, source } = req.query;
  const db = getDb();
  
  let query = 'SELECT * FROM leads WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (source) {
    query += ' AND source = ?';
    params.push(source);
  }

  query += ' ORDER BY created_at DESC';
  const leads = db.prepare(query).all(...params);
  res.json(leads);
});

// Get single lead
app.get('/api/leads/:id', authenticate, (req, res) => {
  const db = getDb();
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const followUps = db.prepare('SELECT * FROM follow_ups WHERE lead_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...lead, followUps });
});

// Create lead
app.post('/api/leads', authenticate, (req, res) => {
  const { name, phone, email, school, program, source, status, priority, notes, next_follow_up, registration_type, class_type } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Nama wajib diisi' });
  }
  
  const db = getDb();
  
  try {
    console.log('Creating lead with data:', { name, phone, email, school, program, source, status, priority, registration_type, class_type, created_by: req.user.id });
    
    const result = db.prepare(`
      INSERT INTO leads (name, phone, email, school, program, source, status, priority, notes, next_follow_up, registration_type, class_type, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, phone || '', email || '', school || '', program || '', source || 'Website', status || 'new', priority || 'medium', notes || '', next_follow_up || null, registration_type || 'reguler', class_type || 'pagi', req.user.id);

    console.log('Lead created with ID:', result.lastInsertRowid);

    logActivity(result.lastInsertRowid, req.user.id, 'created', `Lead "${name}" created`);

    // Update source stats
    if (source) {
      db.prepare('UPDATE sources SET total_leads = total_leads + 1 WHERE name = ?').run(source);
    }

    res.json({ id: result.lastInsertRowid, success: true });
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ error: 'Gagal membuat lead: ' + err.message });
  }
});

// Update lead
app.put('/api/leads/:id', authenticate, (req, res) => {
  const { name, phone, email, school, program, source, status, priority, notes, next_follow_up, registered_at, enrolled_at, registration_type, class_type } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Nama wajib diisi' });
  }
  
  const db = getDb();
  
  try {
    const oldLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    
    if (!oldLead) {
      return res.status(404).json({ error: 'Lead tidak ditemukan' });
    }
    
    db.prepare(`
      UPDATE leads SET name = ?, phone = ?, email = ?, school = ?, program = ?, source = ?, 
      status = ?, priority = ?, notes = ?, next_follow_up = ?, registered_at = ?, enrolled_at = ?,
      registration_type = ?, class_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(name, phone || '', email || '', school || '', program || '', source || '', status || 'new', priority || 'medium', notes || '', next_follow_up || null, registered_at || null, enrolled_at || null, registration_type || 'reguler', class_type || 'pagi', req.params.id);

    if (oldLead.status !== status) {
      logActivity(req.params.id, req.user.id, 'status_changed', `Status changed from ${oldLead.status} to ${status}`);
      
      // Update source conversions
      if ((status === 'registered' || status === 'enrolled') && source) {
        db.prepare('UPDATE sources SET conversions = conversions + 1 WHERE name = ?').run(source);
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengupdate lead' });
  }
});

// Delete lead
app.delete('/api/leads/:id', authenticate, (req, res) => {
  const db = getDb();
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  logActivity(req.params.id, req.user.id, 'deleted', `Lead "${lead.name}" deleted`);
  
  res.json({ success: true });
});

// Bulk delete leads
app.post('/api/leads/bulk-delete', authenticate, (req, res) => {
  const { ids } = req.body;
  const db = getDb();
  
  const deleteStmt = db.prepare('DELETE FROM leads WHERE id = ?');
  ids.forEach(id => deleteStmt.run(id));
  
  res.json({ success: true });
});

// ============ TASKS ROUTES ============

// Get all tasks
app.get('/api/tasks', authenticate, (req, res) => {
  const db = getDb();
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(tasks);
});

// Create task
app.post('/api/tasks', authenticate, (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  const db = getDb();
  
  const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, description, priority || 'medium', status || 'todo', due_date, req.user.id);

  res.json({ id: result.lastInsertRowid });
});

// Update task
app.put('/api/tasks/:id', authenticate, (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  const db = getDb();
  
  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, description, priority, status, due_date, req.params.id);

  res.json({ success: true });
});

// Delete task
app.delete('/api/tasks/:id', authenticate, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ USERS ROUTES ============

// Get all users
app.get('/api/users', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, username, name, email, phone, role, team, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

// Get staff leads count by team (for dashboard overview)
app.get('/api/users/staff-stats', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  
  // Get all staff users with their team
  const staffUsers = db.prepare(`
    SELECT u.id, u.name, u.username, u.team, u.role,
           (SELECT COUNT(*) FROM leads l WHERE l.created_by = u.id) as leads_count
    FROM users u
    WHERE u.role = 'staff'
    ORDER BY leads_count DESC
  `).all();
  
  // Also get leads count by team (grouped)
  const leadsByTeam = db.prepare(`
    SELECT u.team, COUNT(l.id) as leads_count
    FROM leads l
    LEFT JOIN users u ON l.created_by = u.id
    WHERE u.team IS NOT NULL
    GROUP BY u.team
    ORDER BY leads_count DESC
  `).all();
  
  res.json({ staffUsers, leadsByTeam });
});

// Create user (admin only)
app.post('/api/users', authenticate, requireAdmin, (req, res) => {
  const { username, password, name, email, phone, role, team } = req.body;
  const db = getDb();
  
  // Check if username already exists
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (username, password, name, email, phone, role, team)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(username, hashedPassword, name, email, phone, role || 'user', team || null);
    
    res.json({ id: result.lastInsertRowid, username, name, email, role: role || 'user', team: team || null });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// Update user
app.put('/api/users/:id', authenticate, requireAdmin, (req, res) => {
  const { name, email, phone, role, team } = req.body;
  const db = getDb();
  
  db.prepare('UPDATE users SET name = ?, email = ?, phone = ?, role = ?, team = ? WHERE id = ?')
    .run(name, email, phone, role, team || null, req.params.id);

  res.json({ success: true });
});

// Delete user - masteradmin can delete anyone
app.delete('/api/users/:id', authenticate, (req, res) => {
  const db = getDb();
  
  // Master admin can delete anyone, admin can delete non-masteradmin
  if (req.user.role !== 'masteradmin' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can delete users' });
  }
  
  const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Master admin cannot be deleted by non-masteradmin
  if (targetUser.role === 'masteradmin' && req.user.role !== 'masteradmin') {
    return res.status(403).json({ error: 'Cannot delete master admin' });
  }
  
  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ SOURCES ROUTES ============

// Get all sources
app.get('/api/sources', authenticate, (req, res) => {
  const db = getDb();
  const sources = db.prepare('SELECT * FROM sources ORDER BY created_at DESC').all();
  res.json(sources);
});

// Create source
app.post('/api/sources', authenticate, requireAdmin, (req, res) => {
  const { name, type, budget } = req.body;
  const db = getDb();
  
  const result = db.prepare('INSERT INTO sources (name, type, budget) VALUES (?, ?, ?)')
    .run(name, type, budget || 0);

  res.json({ id: result.lastInsertRowid });
});

// Update source
app.put('/api/sources/:id', authenticate, requireAdmin, (req, res) => {
  const { name, type, budget } = req.body;
  const db = getDb();
  
  db.prepare('UPDATE sources SET name = ?, type = ?, budget = ? WHERE id = ?')
    .run(name, type, budget, req.params.id);

  res.json({ success: true });
});

// Delete source
app.delete('/api/sources/:id', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM sources WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ DOCUMENTS ROUTES ============

// Get all documents
app.get('/api/documents', authenticate, (req, res) => {
  const db = getDb();
  const documents = db.prepare(`
    SELECT d.*, u.name as created_by_name 
    FROM documents d 
    LEFT JOIN users u ON d.created_by = u.id 
    ORDER BY d.created_at DESC
  `).all();
  res.json(documents);
});

// Upload document
app.post('/api/documents', authenticate, upload.single('file'), (req, res) => {
  const { title, category, description, drive_link } = req.body;
  const db = getDb();
  
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  
  const result = db.prepare(`
    INSERT INTO documents (title, category, description, file_path, drive_link, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, category, description, filePath, drive_link, req.user.id);

  res.json({ id: result.lastInsertRowid });
});

// Delete document
app.delete('/api/documents/:id', authenticate, (req, res) => {
  const db = getDb();
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  
  if (doc && doc.file_path) {
    const fullPath = path.join(__dirname, doc.file_path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
  
  db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ ACTIVITIES ROUTES ============

// Get activities
app.get('/api/activities', authenticate, (req, res) => {
  const { limit = 10 } = req.query;
  const db = getDb();
  
  const activities = db.prepare(`
    SELECT a.*, l.name as lead_name, u.name as user_name
    FROM activities a
    LEFT JOIN leads l ON a.lead_id = l.id
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT ?
  `).all(parseInt(limit));
  
  res.json(activities);
});

// ============ FOLLOW-UPS ROUTES ============

// Get follow-ups
app.get('/api/follow-ups', authenticate, (req, res) => {
  const { type = 'upcoming' } = req.query;
  const db = getDb();
  
  let query = `
    SELECT f.*, l.name as lead_name, l.phone, l.program, l.status as lead_status, l.priority
    FROM follow_ups f
    LEFT JOIN leads l ON f.lead_id = l.id
    WHERE 1=1
  `;
  
  const today = new Date().toISOString().split('T')[0];
  
  if (type === 'overdue') {
    query += ` AND f.follow_up_date < '${today}' AND f.completed = 0`;
  } else if (type === 'today') {
    query += ` AND f.follow_up_date = '${today}' AND f.completed = 0`;
  } else if (type === 'upcoming') {
    query += ` AND f.follow_up_date > '${today}' AND f.completed = 0`;
  }
  
  query += ' ORDER BY f.follow_up_date ASC';
  
  const followUps = db.prepare(query).all();
  res.json(followUps);
});

// Create follow-up
app.post('/api/follow-ups', authenticate, (req, res) => {
  const { lead_id, notes, follow_up_date } = req.body;
  const db = getDb();
  
  const result = db.prepare(`
    INSERT INTO follow_ups (lead_id, notes, follow_up_date)
    VALUES (?, ?, ?)
  `).run(lead_id, notes, follow_up_date);

  // Update lead next_follow_up
  db.prepare('UPDATE leads SET next_follow_up = ? WHERE id = ?').run(follow_up_date, lead_id);

  logActivity(lead_id, req.user.id, 'follow_up_scheduled', `Follow up scheduled for ${follow_up_date}`);

  res.json({ id: result.lastInsertRowid });
});

// Update follow-up
app.put('/api/follow-ups/:id', authenticate, (req, res) => {
  const { completed, notes, follow_up_date } = req.body;
  const db = getDb();
  
  db.prepare('UPDATE follow_ups SET completed = ?, notes = ?, follow_up_date = ? WHERE id = ?')
    .run(completed ? 1 : 0, notes, follow_up_date, req.params.id);

  res.json({ success: true });
});

// ============ REPORTS ROUTES ============

// Get stats
app.get('/api/reports/stats', authenticate, (req, res) => {
  const db = getDb();
  
  const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").get().count;
  const registered = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'registered'").get().count;
  const enrolled = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'enrolled'").get().count;
  const hotLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE priority = 'hot'").get().count;
  const lostLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'lost'").get().count;

  const conversionRate = totalLeads > 0 ? ((registered + enrolled) / totalLeads * 100).toFixed(1) : 0;
  const lostRate = totalLeads > 0 ? (lostLeads / totalLeads * 100).toFixed(1) : 0;

  // Lead by status
  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM leads GROUP BY status
  `).all();

  // Lead by source
  const bySource = db.prepare(`
    SELECT source, COUNT(*) as count FROM leads GROUP BY source
  `).all();

  // Lead by program
  const byProgram = db.prepare(`
    SELECT program, COUNT(*) as count FROM leads WHERE program IS NOT NULL GROUP BY program
  `).all();

  res.json({
    totalLeads,
    newLeads,
    registered,
    enrolled,
    hotLeads,
    lostLeads,
    conversionRate,
    lostRate,
    byStatus,
    bySource,
    byProgram
  });
});

// Initialize database and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

