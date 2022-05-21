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
  const {
    id,
    username,
    nickname,
    gender,
    birthDate,
    weightPoint,
  } = request.payload;

  const userObject = {
    username,
    nickname,
    gender,
    birthDate,
    weightPoint,
  };

  const { db } = request.server.app.firestore;
  let result;
  try {
    result = await db.collection('users').doc(id).create(userObject);
  } catch (error) {
    const { boom } = request.server.app;
    if (error.message.includes('ALREADY_EXISTS')) {
      return boom.conflict(`User id ${id} already exists`);
    }
    return boom.badImplementation();
  }

  const response = {
    message: 'success',
    data: {
      id,
      createdAt: result.writeTime.toDate().getTime(),
    },
  };
  return h.response(response).code(201);
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
