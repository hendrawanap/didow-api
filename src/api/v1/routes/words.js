const {
  getWords,
  createWord,
  getWord,
  modifyWord,
  deleteWord,
} = require('../handlers/words');

const BASE_PATH = '/words';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: getWords,
  },
  {
    method: 'POST',
    path: BASE_PATH,
    handler: createWord,
  },
  {
    method: 'GET',
    path: `${BASE_PATH}/{id}`,
    handler: getWord,
  },
  {
    method: 'PUT',
    path: `${BASE_PATH}/{id}`,
    handler: modifyWord,
  },
  {
    method: 'DELETE',
    path: `${BASE_PATH}/{id}`,
    handler: deleteWord,
  },
];

module.exports = routes;
