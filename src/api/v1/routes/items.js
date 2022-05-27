const {
  getItems,
  createItem,
  getItem,
  modifyItem,
  deleteItem,
} = require('../handlers/items');

const { createItemPayload, modifyItemPayload } = require('../validations/index').items;

const BASE_PATH = '/items';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getItems,
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createItem,
    options: {
      validate: {
        payload: createItemPayload,
      },
    },
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getItem,
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyItem,
    options: {
      validate: {
        payload: modifyItemPayload,
      },
    },
  },
  {
    method: 'DELETE',
    path: `${BASE_PATH}/{id}`,
    handler: deleteItem,
  },
];

module.exports = routes;
