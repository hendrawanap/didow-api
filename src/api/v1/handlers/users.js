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
    nickname: nickname || username.split(' ')[0],
    weightPoint,
  };

  if (gender !== undefined) userObject.gender = gender;
  if (birthDate !== undefined) [userObject.birthDate] = birthDate.split('T');

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
  const { id } = request.params;
  const { weightOnly } = request.query;
  const { db } = request.server.app.firestore;

  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) {
    const { boom } = request.server.app;
    return boom.notFound();
  }

  let userObject;
  if (weightOnly) {
    userObject = { id: doc.id, weightPoint: doc.get('weightPoint') };
  } else {
    userObject = { id: doc.id, ...doc.data() };
  }

  const response = {
    data: userObject,
    message: 'success',
  };
  return h.response(response).code(200);
};

const modifyUser = async (request, h) => {
  const { id } = request.params;
  const {
    username,
    nickname,
    gender,
    birthDate,
  } = request.payload;

  const userObject = {};
  if (username !== undefined) userObject.username = username;
  if (nickname !== undefined) userObject.nickname = nickname;
  if (gender !== undefined) userObject.gender = gender;
  if (birthDate !== undefined) [userObject.birthDate] = birthDate.split('T');

  const { db } = request.server.app.firestore;
  let result;
  try {
    result = await db.collection('users').doc(id).update(userObject);
  } catch (error) {
    const { boom } = request.server.app;
    if (error.message.includes('NOT_FOUND')) {
      return boom.notFound();
    }
    return boom.badImplementation();
  }

  const response = {
    data: {
      id,
      updatedAt: result.writeTime.toDate().getTime(),
    },
    message: 'success',
  };
  return h.response(response).code(200);
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  modifyUser,
};
