const { getSuggestion } = require('../handlers/suggestions');

const BASE_PATH = '/suggestions';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getSuggestion,
  },
];

module.exports = routes;
