const { getSuggestion } = require('../handlers/suggestions');
const { getSuggestionQuery } = require('../validations/index').suggestions;

const auth = process.env.USE_AUTH === 'true' ? 'firebase-auth-token' : null;
const BASE_PATH = '/suggestions';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getSuggestion,
    options: {
      auth,
      validate: {
        query: getSuggestionQuery,
      },
    },
  },
];

module.exports = routes;
