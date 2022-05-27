const {
  getAvatars,
  createAvatar,
  getAvatar,
  modifyAvatar,
} = require('../handlers/avatars');

const {
  getAvatarsQuery,
  createAvatarQuery,
  modifyAvatarQuery,
} = require('../validations/index').avatars;

const BASE_PATH = '/avatars';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getAvatars,
    options: {
      validate: {
        query: getAvatarsQuery,
      },
    },
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createAvatar,
    options: {
      validate: {
        query: createAvatarQuery,
      },
    },
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
    options: {
      validate: {
        query: modifyAvatarQuery,
      },
    },
  },
];

module.exports = routes;
