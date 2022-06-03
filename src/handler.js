require('dotenv').config();

const jwt = require('jsonwebtoken');
const { startConnection } = require('./db-conn');
const { validateUser, validateToken } = require('./validation');

const patientRegisterHandler = async (request, h) => {
  const {
    username,
    password,
    phone,
    email,
    address,
  } = request.payload;

  const query = `INSERT INTO patients (username, password, phone, email, address) 
  VALUES ("${username}", "${password}", "${phone}", "${email}", "${address}")`;

  try {
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
  const userValid = validateUser(username, password, 'patients');

  if (userValid) {
    const user = { username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
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
  const refreshToken = request.payload.token;

  try {
    const query = `DELETE FROM refreshtoken WHERE token="${refreshToken}"`;
    const conn = await startConnection();
    await conn.query(query);
    await conn.end();

    const response = h.response({
      status: 'Success',
      message: 'User logged out',
    });

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
    password,
    phone,
    email,
    address,
  } = request.payload;

  const query = `INSERT INTO doctors (username, password, phone, email, address) 
  VALUES ("${username}", "${password}", "${phone}", "${email}", "${address}")`;

  try {
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
  const userValid = validateUser(username, password, 'doctors');

  if (userValid) {
    const user = { username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
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
  const refreshToken = request.payload.token;

  try {
    const query = `DELETE FROM refreshtoken WHERE token="${refreshToken}"`;
    const conn = await startConnection();
    await conn.query(query);
    await conn.end();

    const response = h.response({
      status: 'Success',
      message: 'User logged out',
    });

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
  const refreshToken = request.payload.token;

  if (refreshToken === null) {
    const response = h.response({});

    response.code(401);
    return response;
  }

  try {
    const query = `SELECT EXISTS(SELECT * FROM refreshtoken WHERE token="${refreshToken}")`;
    const conn = await startConnection();
    const result = await conn.query(query);
    await conn.end();

    if (result[0][0].refreshToken === 1) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          const response = h.response({
            status: 'Forbidden',
            message: 'You don\'t have permission',
          });

          response.code(403);
          return response;
        }

        const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);

        const response = h.response({
          status: 'Success',
          message: 'User authenticated',
          data: {
            accessToken,
          },
        });

        response.code(200);
        return response;
      });
    }

    const response = h.response({
      status: 'Forbidden',
      message: 'You don\'t have permission',
    });

    response.code(403);
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

const imagePredictHandler = (request, h) => {
  const authHeader = request.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    const response = h.response({
      status: 'Unauthorized',
      message: 'No credentials',
    });

    response.code(401);
    return response;
  }

  if (validateToken(token)) {
    const response = h.response({});

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

const audioPredictHandler = (request, h) => {
  const response = h.response({});

  response.code(200);
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
  imagePredictHandler,
  audioPredictHandler,
};
