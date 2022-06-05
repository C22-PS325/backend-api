require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { startConnection } = require('./db-conn');

const validateUser = async (username, password, role) => {
  try {
    const query = `SELECT password FROM ${role} WHERE username = "${username}"`;
    const conn = await startConnection();
    const result = await conn.query(query);

    await conn.end();

    const querriedPassword = result[0][0].password;
    if (await bcrypt.compare(password, querriedPassword)) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const validateToken = (token) => {
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { validateUser, validateToken };
