const {
  getItems,
  createItem,
  getItem,
  modifyItem,
  deleteItem,
} = require('../handlers/items');

const { createItemPayload, modifyItemPayload } = require('../validations/index').items;

const auth = process.env.USE_AUTH === 'true' ? 'firebase-auth-token' : null;
const BASE_PATH = '/items';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getItems,
    options: {
      auth,
    },
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createItem,
    options: {
      auth,
      validate: {
        payload: createItemPayload,
      },
    },
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getItem,
    options: {
      auth,
    },
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyItem,
    options: {
      auth,
      validate: {
        payload: modifyItemPayload,
      },
    },
  },
  {
    method: 'DELETE',
    path: `${BASE_PATH}/{id}`,
    handler: deleteItem,
    options: {
      auth,
    },
  },
];

module.exports = routes;
