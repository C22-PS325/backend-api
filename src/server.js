const Hapi = require('@hapi/hapi');
const routes = require('./routes');

require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST,
  });

  server.route(routes);
  await server.start();
};

init();
