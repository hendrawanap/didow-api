const { getAssessments, createAssessment, getAssessment } = require('../handlers/assessments');

const BASE_PATH = '/assessments';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getAssessments,
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createAssessment,
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getAssessment,
  },
];

module.exports = routes;
