const {
  getUsers,
  createUser,
  getUser,
  modifyUser,
} = require('../handlers/users');

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
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getUser,
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyUser,
  },
];

module.exports = routes;
