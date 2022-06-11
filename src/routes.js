const {
  patientRegisterHandler,
  patientLoginHandler,
  patientLogoutHandler,
  doctorRegisterHandler,
  doctorLoginHandler,
  doctorLogoutHandler,
  tokenRefreshHandler,
  alertDoctorsHandler,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/api',
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
    path: '/api/patients/register',
    handler: patientRegisterHandler,
  },
  {
    method: 'POST',
    path: '/api/patients/login',
    handler: patientLoginHandler,
  },
  {
    method: 'DELETE',
    path: '/api/patients/logout',
    handler: patientLogoutHandler,
  },
  {
    method: 'POST',
    path: '/api/doctors/register',
    handler: doctorRegisterHandler,
  },
  {
    method: 'POST',
    path: '/api/doctors/login',
    handler: doctorLoginHandler,
  },
  {
    method: 'DELETE',
    path: '/api/doctors/logout',
    handler: doctorLogoutHandler,
  },
  {
    method: 'POST',
    path: '/api/token/refresh',
    handler: tokenRefreshHandler,
  },
  {
    method: 'POST',
    path: '/api/doctors/alert',
    handler: alertDoctorsHandler,
  },
];

module.exports = routes;
