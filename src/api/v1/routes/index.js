/* eslint-disable no-unused-vars */
// Register child routes
const helloRoutes = require('./hello');
const wordsRoutes = require('./words');
const questionsRoutes = require('./questions');
const itemsRoutes = require('./items');
const suggestionsRoutes = require('./suggestions');
const avatarsRoutes = require('./avatars');
const usersRoutes = require('./users');
const assessmentsRoutes = require('./assessments');
const exercisesRoutes = require('./exercises');
const handwritingsRoutes = require('./handwritings');

const routes = [
  helloRoutes,
  wordsRoutes,
  questionsRoutes,
  itemsRoutes,
  suggestionsRoutes,
  avatarsRoutes,
  usersRoutes,
  assessmentsRoutes,
  exercisesRoutes,
  handwritingsRoutes,
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
