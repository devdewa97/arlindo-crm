const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'crm.db');
let db = null;

// Initialize database
const initDb = async () => {
  const SQL = await initSqlJs();
  
  // Try to load existing database
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT DEFAULT 'user',
      team TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add team column if it doesn't exist (for existing databases)
  try {
    db.run(`ALTER TABLE users ADD COLUMN team TEXT DEFAULT NULL`);
  } catch (e) {
    // Column already exists, ignore
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      school TEXT,
      program TEXT,
      source TEXT,
      status TEXT DEFAULT 'new',
      priority TEXT DEFAULT 'medium',
      notes TEXT,
      next_follow_up DATETIME,
      registered_at DATETIME,
      enrolled_at DATETIME,
      registration_type TEXT DEFAULT 'reguler',
      class_type TEXT DEFAULT 'pagi',
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'todo',
      due_date DATETIME,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      budget REAL DEFAULT 0,
      total_leads INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      file_path TEXT,
      drive_link TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      user_id INTEGER,
      action TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS follow_ups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      notes TEXT,
      follow_up_date DATETIME,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);

  // Initialize default admin if not exists
  const adminExists = db.exec("SELECT id FROM users WHERE username = 'Dewa'");
  
  if (adminExists.length === 0 || adminExists[0].values.length === 0) {
    const hashedPassword = bcrypt.hashSync('Dewa123', 10);
    db.run(`
      INSERT INTO users (username, password, name, email, role, team)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['Dewa', hashedPassword, 'Admin Dewa', 'dewa@arlindo.ac.id', 'masteradmin', 'Admin']);
    console.log('✅ Default masteradmin created: Dewa / Dewa123');
  } else {
    // Update existing Dewa to masteradmin if not already
    db.run(`UPDATE users SET role = 'masteradmin', team = 'Admin' WHERE username = 'Dewa'`);
    console.log('✅ Dewa user updated to masteradmin');
  }

  // Initialize default sources
  const sourceExists = db.exec('SELECT id FROM sources LIMIT 1');
  
  if (sourceExists.length === 0 || sourceExists[0].values.length === 0) {
    const sources = [
      { name: 'Instagram', type: 'Social Media', budget: 500000 },
      { name: 'Facebook', type: 'Social Media', budget: 300000 },
      { name: 'Expo Pendidikan', type: 'Event', budget: 1000000 },
      { name: 'Google Ads', type: 'Digital Ads', budget: 800000 },
      { name: 'School Visit', type: 'Offline', budget: 400000 },
      { name: 'Referral', type: 'Referral', budget: 0 }
    ];
    
    sources.forEach(s => {
      db.run('INSERT INTO sources (name, type, budget) VALUES (?, ?, ?)', [s.name, s.type, s.budget]);
    });
    console.log('✅ Default sources created');
  }

  // Initialize sample leads for demo
  const leadExists = db.exec('SELECT id FROM leads LIMIT 1');
  
  if (leadExists.length === 0 || leadExists[0].values.length === 0) {
    const adminResult = db.exec("SELECT id FROM users WHERE username = 'Dewa'");
    if (adminResult.length > 0 && adminResult[0].values.length > 0) {
      const adminId = adminResult[0].values[0][0];
      const leads = [
        { name: 'Ahmad Fauzi', phone: '6281234567890', email: 'ahmadfauzi@mail.com', school: 'SMA Negeri 1', program: 'Teknik Informatika', source: 'Instagram', status: 'new', priority: 'high', next_follow_up: '2026-01-25' },
        { name: 'Siti Nurhaliza', phone: '6282345678901', email: 'sitinurhaliza@mail.com', school: 'SMA Negeri 2', program: 'Manajemen Bisnis', source: 'Facebook', status: 'contacted', priority: 'medium', next_follow_up: '2026-01-24' },
        { name: 'Budi Santoso', phone: '6283456789012', email: 'budisantoso@mail.com', school: 'SMA Kristen', program: 'Akuntansi', source: 'Expo Pendidikan', status: 'interested', priority: 'hot', next_follow_up: '2026-01-23' },
        { name: 'Dewi Lestari', phone: '6284567890123', email: 'dewilestari@mail.com', school: 'SMA Negeri 3', program: 'Teknik Informatika', source: 'Google Ads', status: 'registered', priority: 'high', next_follow_up: '2026-01-22' },
        { name: 'Rudi Hermawan', phone: '6285678901234', email: 'rudihermawan@mail.com', school: 'SMA Negeri 4', program: 'Manajemen Bisnis', source: 'School Visit', status: 'follow_up', priority: 'medium', next_follow_up: '2026-01-26' },
        { name: 'Nurul Hidayah', phone: '6286789012345', email: 'nurulhidayah@mail.com', school: 'SMA Negeri 5', program: 'Akuntansi', source: 'Instagram', status: 'enrolled', priority: 'hot', next_follow_up: '2026-01-20' },
        { name: 'Joko Pramono', phone: '6287890123456', email: 'jokopramono@mail.com', school: 'SMA Negeri 6', program: 'Teknik Informatika', source: 'Referral', status: 'lost', priority: 'low', next_follow_up: null },
        { name: 'Lisa Permata', phone: '6288901234567', email: 'lisapermata@mail.com', school: 'SMA Negeri 7', program: 'Manajemen Bisnis', source: 'Facebook', status: 'new', priority: 'medium', next_follow_up: '2026-01-28' }
      ];
      
      leads.forEach(l => {
        db.run(`
          INSERT INTO leads (name, phone, email, school, program, source, status, priority, next_follow_up, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [l.name, l.phone, l.email, l.school, l.program, l.source, l.status, l.priority, l.next_follow_up, adminId]);
      });
      console.log('✅ Sample leads created');
    }
  }

  // Save database
  saveDb();
  
  return db;
};

// Save database to file
const saveDb = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Helper functions to match better-sqlite3 API
const dbWrapper = {
  prepare: (sql) => ({
    run: (...params) => {
      db.run(sql, params);
      saveDb();
      return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        const result = {};
        columns.forEach((col, i) => result[col] = values[i]);
        stmt.free();
        return result;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        const row = {};
        columns.forEach((col, i) => row[col] = values[i]);
        results.push(row);
      }
      stmt.free();
      return results;
    }
  }),
  exec: (sql) => {
    db.run(sql);
    saveDb();
  }
};

module.exports = { initDb, getDb: () => dbWrapper };

