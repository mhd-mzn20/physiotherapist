const mysql = require('mysql2');
const bcrypt = require('bcrypt');

async function updatePassword() {
  // 1️⃣ Your plain password
  const plainPassword = 'diab';

  // 2️⃣ Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed password:', hashedPassword);

  // 3️⃣ Connect to MySQL
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'physiotherapy_db',
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  // 4️⃣ Update password for idUser = 3
  const sql = 'UPDATE users SET password = ? WHERE idUser = ?';
  db.query(sql, [hashedPassword, 3], (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
    } else {
      console.log(`Password updated for idUser = 3`);
    }
    db.end();
  });
}

updatePassword();
