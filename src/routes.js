const {
  patientRegisterHandler,
  patientLoginHandler,
  patientLogoutHandler,
  doctorRegisterHandler,
  doctorLoginHandler,
  doctorLogoutHandler,
  tokenRefreshHandler,
  imagePredictHandler,
  audioPredictHandler,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const response = h.response({
        status: 'success',
      });

      response.code(200);
      return response;
    },
  },
  {
    method: 'POST',
    path: '/patients/register',
    handler: patientRegisterHandler,
  },
  {
    method: 'POST',
    path: '/patients/login',
    handler: patientLoginHandler,
  },
  {
    method: 'DELETE',
    path: '/patients/logout',
    handler: patientLogoutHandler,
  },
  {
    method: 'POST',
    path: '/doctors/register',
    handler: doctorRegisterHandler,
  },
  {
    method: 'POST',
    path: '/doctors/login',
    handler: doctorLoginHandler,
  },
  {
    method: 'DELETE',
    path: '/doctors/logout',
    handler: doctorLogoutHandler,
  },
  {
    method: 'POST',
    path: '/token/refresh',
    handler: tokenRefreshHandler,
  },
  {
    method: 'POST',
    path: '/images/predict',
    config: {
      payload: {
        maxBytes: 209715200,
        output: 'stream',
        parse: true,
      },
      handler: imagePredictHandler,
    },
  },
  {
    method: 'POST',
    path: '/audio/predict',
    handler: audioPredictHandler,
  },
];

module.exports = routes;
