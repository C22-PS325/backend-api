const connection = require('./db-conn');

const registerPatient = (request, h) => {
  const { username, password } = request.payload;

  try {
    connection.query('INSERT INTO user_account (username, password, role) VALUES (%s, %s, patient)' % (username, password));
    connection.end();

    const response = h.response({
      status: 'success',
      message: 'user registered',
      data: {
        username,
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'failed',
      message: 'user can not be registered',
      data: {
        username,
      },
    });

    response.code(409);
    return response;
  }
};

const loginPatient = (request, h) => {
  const { username, password } = request.payload;

  const response = h.response({
    status: 'success',
    message: 'user logged in',
    data: {
      username, token: 'aasdg31JKGF&*^&^&J',
    },
  });

  response.code(200);
  return response;
};

const logoutPatient = (request, h) => {
  const token = request.payload;

  const response = h.response({
    status: 'success',
    message: 'user logged out',
  });

  response.code(200);
  return response;
};

module.exports = {
  registerPatient,
  loginPatient,
  logoutPatient,
};
