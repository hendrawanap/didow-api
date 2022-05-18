const sayHelloWorld = async (request, h) => {
  const response = {
    message: 'Hello World',
  };
  return h.response(response).code(200);
};

module.exports = { sayHelloWorld };
