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

const auth = process.env.USE_AUTH === 'true' ? 'firebase-auth-token' : null;
const BASE_PATH = '/avatars';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getAvatars,
    options: {
      auth,
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
      auth,
      validate: {
        query: createAvatarQuery,
      },
    },
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getAvatar,
    options: {
      auth,
    },
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyAvatar,
    options: {
      auth,
      validate: {
        query: modifyAvatarQuery,
      },
    },
  },
];

module.exports = routes;
