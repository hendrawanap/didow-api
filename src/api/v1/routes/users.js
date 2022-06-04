const {
  getUsers,
  createUser,
  getUser,
  modifyUser,
} = require('../handlers/users');
const { createUserPayload, getUserQuery, modifyUserPayload } = require('../validations/index').users;

const auth = process.env.USE_AUTH === 'true' ? 'firebase-auth-token' : null;
const BASE_PATH = '/users';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getUsers,
    options: {
      auth,
    },
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createUser,
    options: {
      auth,
      validate: {
        payload: createUserPayload,
      },
    },
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getUser,
    options: {
      auth,
      validate: {
        query: getUserQuery,
      },
    },
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyUser,
    options: {
      auth,
      validate: {
        payload: modifyUserPayload,
      },
    },
  },
];

module.exports = routes;
