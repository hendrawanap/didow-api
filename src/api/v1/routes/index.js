/* eslint-disable no-unused-vars */
// Register child routes
const helloRoutes = require('./hello');
const wordsRoutes = require('./words');
const avatarsRoutes = require('./avatars');

const routes = [
  helloRoutes,
  wordsRoutes,
  avatarsRoutes,
];

const BASE_PATH = '/api/v1';
const bundledRoutes = (() => ({
  name: 'routes',
  version: '1.0.0',
  register: (server, options) => {
    server.route(routes.flat().map((route) => ({ ...route, path: BASE_PATH + route.path })));
  },
}))();

module.exports = bundledRoutes;
