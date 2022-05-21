const getUsers = async (request, h) => {
  const { db } = request.server.app.firestore;
  const snapshot = await db.collection('users').get();
  const users = [];
  snapshot.forEach((doc) => {
    const userObject = { id: doc.id, ...doc.data() };
    users.push(userObject);
  });

  const response = {
    data: users,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createUser = async (request, h) => {

};

const getUser = async (request, h) => {

};

const modifyUser = async (request, h) => {

};

module.exports = {
  getUsers,
  createUser,
  getUser,
  modifyUser,
};
