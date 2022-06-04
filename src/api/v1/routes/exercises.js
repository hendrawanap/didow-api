const { getExercises, createExercise } = require('../handlers/exercises');
const { getExercisesQuery, getExercisesHeader, createExercisePayload } = require('../validations/index').exercises;

const auth = process.env.USE_AUTH === 'true' ? 'firebase-auth-token' : null;
const BASE_PATH = '/exercises';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getExercises,
    options: {
      auth,
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
      auth,
      validate: {
        payload: createExercisePayload,
      },
    },
  },
];

module.exports = routes;
