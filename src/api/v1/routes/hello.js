const { sayHelloWorld } = require('../handlers/hello');

const BASE_PATH = '/hello';
const routes = [
  {
    method: 'GET',
    path: BASE_PATH,
    handler: sayHelloWorld,
  },
];

module.exports = routes;
