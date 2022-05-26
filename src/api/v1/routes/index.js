/* eslint-disable no-unused-vars */
// Register child routes
const helloRoutes = require('./hello');
const wordsRoutes = require('./words');
const suggestionsRoutes = require('./suggestions');
const avatarsRoutes = require('./avatars');
const usersRoutes = require('./users');
const assessmentsRoutes = require('./assessments');
const exercisesRoutes = require('./exercises');

const routes = [
  helloRoutes,
  wordsRoutes,
  suggestionsRoutes,
  avatarsRoutes,
  usersRoutes,
  assessmentsRoutes,
  exercisesRoutes,
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
