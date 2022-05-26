const {
  getUsers,
  createUser,
  getUser,
  modifyUser,
} = require('../handlers/users');
const { createUserPayload, getUserQuery, modifyUserPayload } = require('../validations/index').users;

const BASE_PATH = '/users';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getUsers,
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createUser,
    options: {
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
      validate: {
        payload: modifyUserPayload,
      },
    },
  },
];

module.exports = routes;
