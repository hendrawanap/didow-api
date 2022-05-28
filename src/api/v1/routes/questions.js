const { getQuestionsAss, getQuestionsAuto, getQuestionsCustom } = require('../handlers/questions');

const BASE_PATH = '/questions';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: (request, h) => {
      const { type } = request.query;
      if (type.toLowerCase() === 'auto') {
        return getQuestionsAuto(request, h);
      }
      if (type.toLowerCase() === 'custom') {
        return getQuestionsCustom(request, h);
      }
      if (type.toLowerCase() === 'assessment') {
        return getQuestionsAss(request, h);
      }
      return request.server.app.boom.badRequest();
    },
  },
];

module.exports = routes;
