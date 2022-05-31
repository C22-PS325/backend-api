const { startConnection } = require('./db-conn');

const registerPatientHandler = async (request, h) => {
  const { username, password } = request.payload;
  const query = `INSERT INTO patient (username, password) VALUES ("${username}", "${password}")`;

  const conn = await startConnection();
  await conn.query(query);
  await conn.end();

  const response = h.response({
    status: 'success',
    message: 'user registered',
    data: {
      username,
    },
  });

  response.code(200);
  return response;
};

const loginPatientHandler = async (request, h) => {
  const { username, password } = request.payload;

  const conn = await startConnection();
  const result = await conn.query('SELECT password FROM patient WHERE username = ?', [username]);
  conn.end();

  const querriedPassword = result[0][0].password;
  if (password === querriedPassword) {
    const token = '123456';

    const conn2 = await startConnection();
    await conn2.query('UPDATE patient SET token = ? WHERE username = ?', [token, username]);
    conn2.end();

    const response = h.response({
      status: 'success',
      message: 'user logged in',
      data: {
        username,
        token,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'failed',
  });
  response.code(500);
  return response;
};

const logoutPatientHandler = async (request, h) => {
  const { username, token } = request.payload;

  const conn = await startConnection();
  const result = await conn.query('SELECT token FROM patient WHERE username = ?', [username]);
  await conn.end();

  const querriedToken = result[0][0].token;
  if (token === querriedToken) {
    const conn2 = await startConnection();
    await conn2.query('UPDATE patient SET token = "" WHERE username = ?', [username]);
    conn2.end();

    const response = h.response({
      status: 'success',
      message: 'user logged out',
      data: {
        username,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'failed',
  });

  response.code(500);
  return response;
};

const registerDoctorHandler = async (request, h) => {
  const { username, password } = request.payload;
  const query = `INSERT INTO doctor (username, password) VALUES ("${username}", "${password}")`;

  const conn = await startConnection();
  await conn.query(query);
  await conn.end();

  const response = h.response({
    status: 'success',
    message: 'user registered',
    data: {
      username,
    },
  });

  response.code(200);
  return response;
};

const loginDoctorHandler = async (request, h) => {
  const { username, password } = request.payload;

  const conn = await startConnection();
  const result = await conn.query('SELECT password FROM doctor WHERE username = ?', [username]);
  conn.end();

  const querriedPassword = result[0][0].password;
  if (password === querriedPassword) {
    const token = '123456';

    const conn2 = await startConnection();
    await conn2.query('UPDATE doctor SET token = ? WHERE username = ?', [token, username]);
    conn2.end();

    const response = h.response({
      status: 'success',
      message: 'user logged in',
      data: {
        username,
        token,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'failed',
  });
  response.code(500);
  return response;
};

const logoutDoctorHandler = async (request, h) => {
  const { username, token } = request.payload;

  const conn = await startConnection();
  const result = await conn.query('SELECT token FROM doctor WHERE username = ?', [username]);
  await conn.end();

  const querriedToken = result[0][0].token;
  if (token === querriedToken) {
    const conn2 = await startConnection();
    await conn2.query('UPDATE doctor SET token = "" WHERE username = ?', [username]);
    conn2.end();

    const response = h.response({
      status: 'success',
      message: 'user logged out',
      data: {
        username,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'failed',
  });

  response.code(500);
  return response;
};

module.exports = {
  registerPatientHandler,
  loginPatientHandler,
  logoutPatientHandler,
  registerDoctorHandler,
  loginDoctorHandler,
  logoutDoctorHandler,
};
