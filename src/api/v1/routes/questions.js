const { getQuestionsAss, getQuestionsAuto, getQuestionsCustom } = require('../handlers/questions');

const BASE_PATH = '/questions';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: (request, h) => {
      const { type } = request.query;
      if (type === 'auto') {
        return getQuestionsAuto(request, h);
      }
      if (type === 'custom') {
        return getQuestionsCustom(request, h);
      }
      return getQuestionsAss(request, h);
    },
  },
];

module.exports = routes;
