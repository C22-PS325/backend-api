const mysql = require('mysql2/promise');

async function startConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'siap_pulih',
  });

  return connection;
}

module.exports = { startConnection };
