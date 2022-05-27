const {
  registerPatient,
  loginPatient,
  logoutPatient,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/register/patient',
    handler: registerPatient,
  },
  {
    method: 'POST',
    path: '/login/patient',
    handler: loginPatient,
  },
  {
    method: 'POST',
    path: '/logout/patient',
    handler: logoutPatient,
  },
];

module.exports = routes;
