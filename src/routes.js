const {
  registerPatientHandler,
  loginPatientHandler,
  logoutPatientHandler,
  registerDoctorHandler,
  loginDoctorHandler,
  logoutDoctorHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/register/patient',
    handler: registerPatientHandler,
  },
  {
    method: 'POST',
    path: '/login/patient',
    handler: loginPatientHandler,
  },
  {
    method: 'POST',
    path: '/logout/patient',
    handler: logoutPatientHandler,
  },
  {
    method: 'POST',
    path: '/register/doctor',
    handler: registerDoctorHandler,
  },
  {
    method: 'POST',
    path: '/login/doctor',
    handler: loginDoctorHandler,
  },
  {
    method: 'POST',
    path: '/logout/doctor',
    handler: logoutDoctorHandler,
  },
];

module.exports = routes;
