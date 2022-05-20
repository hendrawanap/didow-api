const { getExercises, createExercise } = require('../handlers/exercises');

const BASE_PATH = '/exercises';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getExercises,
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createExercise,
  },
];

module.exports = routes;
