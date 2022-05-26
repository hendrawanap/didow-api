const {
  getItems,
  createItem,
  getItem,
  modifyItem,
  deleteItem,
} = require('../handlers/items');

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
  },
  {
    method: 'DELETE',
    path: `${BASE_PATH}/{id}`,
    handler: deleteItem,
  },
];

module.exports = routes;
