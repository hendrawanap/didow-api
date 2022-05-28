const {
  getAvatars,
  createAvatar,
  getAvatar,
  modifyAvatar,
} = require('../handlers/avatars');

const BASE_PATH = '/avatars';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getAvatars,
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createAvatar,
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getAvatar,
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyAvatar,
  },
];

module.exports = routes;
