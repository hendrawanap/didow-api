const { analyzeHandwriting } = require('../handlers/handwritings');

const BASE_PATH = '/handwritings';
const routes = [
  {
    method: 'POST',
    path: BASE_PATH,
    handler: analyzeHandwriting,
    options: {
      payload: {
        output: 'stream',
        multipart: true,
        maxBytes: 20_000_000,
      },
    },
  },
];

module.exports = routes;
