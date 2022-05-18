require('dotenv').config();
const hapi = require('@hapi/hapi');
const boom = require('@hapi/boom');
const routes = require('./routes/index');

const init = async () => {
  const server = hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
    routes: {
      cors: {
        origin: [process.env.ORIGIN || '*'],
      },
    },
  });

  server.app.boom = boom;

  await server.register(routes);
  await server.start();

  console.log(`Running on ${server.info.uri}`);
};

module.exports = { init };
