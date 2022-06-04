require('dotenv').config();

const jwt = require('jsonwebtoken');
const fs = require('fs');
const { startConnection } = require('./db-conn');
const { validateUser, validateToken } = require('./validation');
//  const { getPredictions } = require('./image-predicts');

const patientRegisterHandler = async (request, h) => {
  const {
    username,
    name,
    password,
    phone,
    email,
    address,
  } = request.payload;

  const query = `INSERT INTO patients (username, name, password, phone, email, address) 
  VALUES ("${username}", "${name}","${password}", "${phone}", "${email}", "${address}")`;

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
  const userValid = await validateUser(username, password, 'patients');

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

  const query = `INSERT INTO doctors (username, name, password, phone, email, address) 
  VALUES ("${username}", "${name}", "${password}", "${phone}", "${email}", "${address}")`;

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
  const userValid = await validateUser(username, password, 'doctors');

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
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

  const response = h.response({
    accessToken,
  });
  response.code(200);
  return response;
};

const imagePredictHandler = async (request, h) => {
  //  Authorization Bearer TOKEN
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
    const fileName = 'lol';
    const fileDir = `images\\${fileName}`;
    request.payload.image.pipe(fs.createWriteStream(fileDir));

    //  const imageBuffer = fs.readFileSync(fileDir);

    //  const prediction = getPredictions(imageBuffer);

    const response = h.response({
      // prediction,
      status: 'Uploaded',
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
