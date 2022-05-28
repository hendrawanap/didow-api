const { getSuggestion } = require('../handlers/suggestions');
const { getSuggestionQuery } = require('../validations/index').suggestions;

const BASE_PATH = '/suggestions';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getSuggestion,
    options: {
      validate: {
        query: getSuggestionQuery,
      },
    },
  },
];

module.exports = routes;
