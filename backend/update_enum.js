const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'physiotherapy_db'});
db.query("ALTER TABLE treatment_plan MODIFY COLUMN status ENUM('active','completed','cancelled','Started','started') DEFAULT 'Started'", (err, results) => {
  console.log(err || results);
  db.end();
});
