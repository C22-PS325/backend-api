const { startConnection } = require('./db-conn');

const getAccountDetails = async (username, role) => {
  const query = `SELECT name, phone, email, address FROM ${role} WHERE username = "${username}"`;
  const conn = await startConnection();
  const result = await conn.query(query);
  await conn.end();

  const user = {
    name: result[0][0].name,
    phone: result[0][0].phone,
    email: result[0][0].email,
    address: result[0][0].address,
  };

  return user;
};

module.exports = { getAccountDetails };
