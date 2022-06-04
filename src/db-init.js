const mysql = require('mysql2/promise');

const initDb = async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
  });

  const query = 'CREATE DATABASE siap_pulih;';
  const query2 = 'USE siap_pulih';
  const query3 = 'CREATE TABLE patients (username varchar(100) NOT NULL, name varchar(200), password varchar(200) NOT NULL, phone varchar(20), email varchar(200), address varchar(255), PRIMARY KEY (username));';
  const query4 = 'CREATE TABLE refreshToken (token varchar(255) NOT NULL, PRIMARY KEY (token));';
  const query5 = 'CREATE TABLE doctors (username varchar(200) NOT NULL, name varchar(200), password varchar(200) NOT NULL, phone varchar(20), email varchar(200), address varchar(255), PRIMARY KEY (username));';

  await conn.query(query);
  await conn.query(query2);
  await conn.query(query3);
  await conn.query(query4);
  await conn.query(query5);
  await conn.end();
};

initDb();
