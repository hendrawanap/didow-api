const getWords = async (request, h) => {
  const { db } = request.server.app.firestore;

  const snapshot = await db.collection('words').get();
  const words = [];
  snapshot.forEach((doc) => {
    const { word, syllables, hintImg } = doc.data();
    const wordObject = {
      id: doc.id,
      word,
      syllables,
      hintImg,
    };
    words.push(wordObject);
  });

  const response = {
    data: words,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createWord = async (request, h) => {
  const { word, syllables, hintImg } = request.payload;
  const wordObject = {
    word,
    syllables,
    hintImg,
  };

  const { db } = request.server.app.firestore;
  const result = await db.collection('words').add(wordObject);

  const response = {
    message: 'success',
    data: {
      id: result.id,
      createdAt: Date.now(),
    },
  };
  return h.response(response).code(201);
};

const getWord = async (request, h) => {
  const { id } = request.params;

  const { db } = request.server.app.firestore;
  const doc = await db.collection('words').doc(id).get();

  if (!doc.exists) {
    const { boom } = request.server.app;
    return boom.notFound();
  }

  const wordObject = { id: doc.id, ...doc.data() };

  const response = {
    data: wordObject,
    message: 'success',
  };
  return h.response(response).code(200);
};

const modifyWord = async (request, h) => {
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
  const { word, syllables, hintImg } = request.payload;
  const wordObject = {};
  if (word !== undefined) wordObject.word = word;
  if (syllables !== undefined) wordObject.syllables = syllables;
  if (hintImg !== undefined) wordObject.hintImg = hintImg;

  const { db } = request.server.app.firestore;
  try {
    await db.collection('words').doc(id).update(wordObject);
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

const deleteWord = async (request, h) => {
  const { id } = request.params;

  const { db } = request.server.app.firestore;
  const { boom } = request.server.app;
  try {
    await db.collection('words').doc(id).delete({ exists: true });
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
  getWords,
  createWord,
  getWord,
  modifyWord,
  deleteWord,
};
