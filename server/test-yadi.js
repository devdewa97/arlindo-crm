const bcrypt = require('bcryptjs');
const { getDb } = require('./database');

async function testYadi() {
  const db = getDb();
  const user = db.prepare('SELECT id, username, password FROM users WHERE username = ?').get('Yadi');
  console.log('Yadi user:', user ? `ID:${user.id}, hash len:${user.password.length}` : 'NOT FOUND');
  
  if (user) {
    console.log('Test default PW (assume Yadi123):', bcrypt.compareSync('Yadi123', user.password));
    console.log('Test wrong PW:', bcrypt.compareSync('wrong', user.password));
  }
}

testYadi();

