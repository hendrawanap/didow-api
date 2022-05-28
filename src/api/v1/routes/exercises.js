const { getExercises, createExercise } = require('../handlers/exercises');
const { getExercisesQuery, getExercisesHeader, createExercisePayload } = require('../validations/index').exercises;

const BASE_PATH = '/exercises';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getExercises,
    options: {
      validate: {
        query: getExercisesQuery,
        headers: getExercisesHeader,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createExercise,
    options: {
      validate: {
        payload: createExercisePayload,
      },
    },
  },
];

module.exports = routes;
