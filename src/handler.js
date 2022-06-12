require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { startConnection } = require('./db-conn');
const { getAccountDetails } = require('./user');
const { validateUser, validateToken } = require('./validation');
const { sendAlert } = require('./mailAlert');

const patientRegisterHandler = async (request, h) => {
  const {
    username,
    name,
    password,
    phone,
    email,
    address,
  } = request.payload;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO patients (username, name, password, phone, email, address) 
    VALUES ("${username}", "${name}","${hashedPassword}", "${phone}", "${email}", "${address}")`;

    const conn = await startConnection();
    await conn.query(query);
    await conn.end();
  } catch (error) {
    const response = h.response({
      status: 'Failed',
      message: 'Something is wrong',
    });

    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'Success',
    message: 'User registered',
    data: {
      username,
    },
  });

  response.code(201);
  return response;
};

const patientLoginHandler = async (request, h) => {
  const { username, password } = request.payload;
  const userValid = await validateUser(username, password, 'patients');

  if (userValid) {
    const user = { username };
    const userData = await getAccountDetails(username, 'patients');

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    try {
      const query = `INSERT INTO refreshtoken VALUES ("${refreshToken}")`;
      const conn = await startConnection();
      await conn.query(query);
      await conn.end();
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Something is wrong',
      });

      response.code(500);
      return response;
    }

    const response = h.response({
      status: 'Success',
      message: 'User authenticated',
      data: {
        username,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        accessToken,
        refreshToken,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'Forbidden',
    message: 'You don\'t have permission',
  });

  response.code(403);
  return response;
};

const patientLogoutHandler = async (request, h) => {
  const { refreshToken } = request.payload;

  try {
    const query = `DELETE FROM refreshtoken WHERE token="${refreshToken}"`;
    const conn = await startConnection();
    await conn.query(query);
    await conn.end();

    const response = h.response({});
    response.code(204);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'Failed',
      message: 'Something is wrong',
    });

    response.code(500);
    return response;
  }
};

const doctorRegisterHandler = async (request, h) => {
  const {
    username,
    name,
    password,
    phone,
    email,
    address,
  } = request.payload;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO doctors (username, name, password, phone, email, address) 
    VALUES ("${username}", "${name}", "${hashedPassword}", "${phone}", "${email}", "${address}")`;

    const conn = await startConnection();
    await conn.query(query);
    await conn.end();
  } catch (error) {
    const response = h.response({
      status: 'Failed',
      message: 'Something is wrong',
    });

    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'Success',
    message: 'User registered',
    data: {
      username,
    },
  });

  response.code(201);
  return response;
};

const doctorLoginHandler = async (request, h) => {
  const { username, password } = request.payload;
  const userValid = await validateUser(username, password, 'doctors');

  if (userValid) {
    const user = { username };
    const userData = await getAccountDetails(username, 'doctors');

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    try {
      const query = `INSERT INTO refreshtoken VALUES ("${refreshToken}")`;
      const conn = await startConnection();
      await conn.query(query);
      await conn.end();
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Something is wrong',
      });

      response.code(500);
      return response;
    }

    const response = h.response({
      status: 'Success',
      message: 'User authenticated',
      data: {
        username,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        accessToken,
        refreshToken,
      },
    });

    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'Forbidden',
    message: 'You don\'t have permission',
  });

  response.code(403);
  return response;
};

const doctorLogoutHandler = async (request, h) => {
  const { refreshToken } = request.payload;

  try {
    const query = `DELETE FROM refreshtoken WHERE token="${refreshToken}"`;
    const conn = await startConnection();
    await conn.query(query);
    await conn.end();

    const response = h.response({});
    response.code(204);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'Failed',
      message: 'Something is wrong',
    });

    response.code(500);
    return response;
  }
};

const tokenRefreshHandler = async (request, h) => {
  const { refreshToken } = request.payload;

  if (refreshToken === undefined || refreshToken === '') {
    const response = h.response({
      status: 'Forbidden',
      message: 'No credentials',
    });
    response.code(401);
    return response;
  }

  const query = `SELECT EXISTS(SELECT token FROM refreshtoken WHERE token = "${refreshToken}") AS exist`;
  const conn = await startConnection();
  const result = await conn.query(query);
  await conn.end();

  let refreshTokenVerified = '';
  try {
    const tokenExist = result[0][0].exist === 1;
    if (!tokenExist) throw Error;

    refreshTokenVerified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    const response = h.response({
      status: 'Forbidden',
      message: 'You don\'t have permission',
    });
    response.code(403);
    return response;
  }

  const user = { username: refreshTokenVerified.username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' });

  const response = h.response({
    accessToken,
  });
  response.code(200);
  return response;
};

const alertDoctorsHandler = async (request, h) => {
  const authHeader = request.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (token === undefined) {
    const response = h.response({
      status: 'Forbidden',
      message: 'No credentials',
    });
    response.code(401);
    return response;
  }

  const tokenValid = validateToken(token);

  if (tokenValid) {
    try {
      const name = jwt.decode(token).username;
      const sentStatus = await sendAlert('a7269j2339@bangkit.academy', name);

      const response = h.response({
        sentStatus,
      });

      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Something is wrong',
      });

      response.code(500);
      return response;
    }
  }

  const response = h.response({
    status: 'Forbidden',
    message: 'You don\'t have permission',
  });
  response.code(403);
  return response;
};

module.exports = {
  patientRegisterHandler,
  patientLoginHandler,
  patientLogoutHandler,
  doctorRegisterHandler,
  doctorLoginHandler,
  doctorLogoutHandler,
  tokenRefreshHandler,
  alertDoctorsHandler,
};
