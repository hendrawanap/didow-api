const getItems = async (request, h) => {
  const { db } = request.server.app.firestore;

  const snapshot = await db.collection('items').get();
  const items = [];
  snapshot.forEach((doc) => {
    const { assetUrl, type } = doc.data();
    const itemObject = {
      id: doc.id,
      assetUrl,
      type,
    };
    items.push(itemObject);
  });

  const response = {
    data: items,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createItem = async (request, h) => {
  const { assetUrl, type } = request.payload;
  const itemObject = {
    assetUrl,
    type,
  };

  const { db } = request.server.app.firestore;
  const result = await db.collection('items').add(itemObject);

  const response = {
    message: 'success',
    data: {
      id: result.id,
      createdAt: Date.now(),
    },
  };
  return h.response(response).code(201);
};

const getItem = async (request, h) => {
  const { id } = request.params;

  const { db } = request.server.app.firestore;
  const doc = await db.collection('items').doc(id).get();
  const { assetUrl, type } = doc.data();

  const itemObject = {
    id: doc.id,
    assetUrl,
    type,
  };

  const response = {
    data: itemObject,
    message: 'success',
  };
  return h.response(response).code(200);
};

const modifyItem = async (request, h) => {
  const { boom } = request.server.app;
  let payloadIsEmpty = false;
  if (request.payload === null) {
    payloadIsEmpty = true;
  } else if (Object.keys(request.payload).length === 0) {
    payloadIsEmpty = true;
  }

  if (payloadIsEmpty) {
    return boom.badRequest();
  }

  const { id } = request.params;
  const { assetUrl, type } = request.payload;
  const itemObject = {};
  if (assetUrl !== undefined) itemObject.assetUrl = assetUrl;
  if (type !== undefined) type.syllables = type;

  const { db } = request.server.app.firestore;
  try {
    await db.collection('items').doc(id).update(itemObject);
  } catch (error) {
    if (error.message.includes('NOT_FOUND')) {
      return boom.notFound();
    }
    return boom.badImplementation();
  }

  const response = {
    data: {
      id,
      updatedAt: Date.now(),
    },
    message: 'success',
  };
  return h.response(response).code(200);
};

const deleteItem = async (request, h) => {
  const { id } = request.params;

  const { db } = request.server.app.firestore;
  const { boom } = request.server.app;
  try {
    await db.collection('items').doc(id).delete({ exists: true });
  } catch (error) {
    if (error.message.includes('NOT_FOUND')) {
      return boom.notFound();
    }
    return boom.badImplementation();
  }

  const response = {
    data: {
      id,
      deletedAt: Date.now(),
    },
    message: 'success',
  };
  return h.response(response).code(200);
};

module.exports = {
  getItems,
  createItem,
  getItem,
  modifyItem,
  deleteItem,
};
