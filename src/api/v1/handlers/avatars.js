const getAvatars = async (request, h) => {
  const { userId: uidQuery } = request.query;
  const { db } = request.server.app.firestore;

  let ref = db.collection('avatars');

  if (uidQuery) {
    ref = ref.where('userId', '==', uidQuery);
  }

  const snapshot = await ref.get();
  const avatars = [];
  snapshot.forEach((doc) => {
    const {
      topItem,
      bodyItem,
      bottomItem,
      ownedItems,
      rewardPoint,
      userId,
    } = doc.data();
    const avatarObject = {
      id: doc.id,
      userId,
      equippedItems: {
        top: topItem,
        body: bodyItem,
        bottom: bottomItem,
      },
      rewardPoint,
      ownedItems,
    };
    avatars.push(avatarObject);
  });

  const response = {
    data: avatars,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createAvatar = async (request, h) => {
  const { userId } = request.query;
  const DEFAULT_ITEMS = {
    TOP: 'defaultTop',
    BODY: 'defaultBody',
    BOTTOM: 'defaultBottom',
  };
  const DEFAULT_POINT = 0;
  const avatarObject = {
    userId,
    topItem: DEFAULT_ITEMS.TOP,
    bodyItem: DEFAULT_ITEMS.BODY,
    bottomItem: DEFAULT_ITEMS.BOTTOM,
    rewardPoint: DEFAULT_POINT,
    ownedItems: [DEFAULT_ITEMS.TOP, DEFAULT_ITEMS.BODY, DEFAULT_ITEMS.BOTTOM],
  };

  const { db } = request.server.app.firestore;
  const result = await db.collection('avatars').add(avatarObject);

  const response = {
    data: {
      id: result.id,
      createdAt: Date.now(),
    },
    message: 'success',
  };
  return h.response(response).code(201);
};

const getAvatar = async (request, h) => {
  const { id } = request.params;

  const { db } = request.server.app.firestore;
  const doc = await db.collection('avatars').doc(id).get();

  if (!doc.exists) {
    const { boom } = request.server.app;
    return boom.notFound();
  }

  const {
    topItem,
    bodyItem,
    bottomItem,
    ownedItems,
    rewardPoint,
    userId,
  } = doc.data();

  const avatarObject = {
    id: doc.id,
    userId,
    equippedItems: {
      top: topItem,
      body: bodyItem,
      bottom: bottomItem,
    },
    rewardPoint,
    ownedItems,
  };

  const response = {
    data: avatarObject,
    message: 'success',
  };
  return h.response(response).code(200);
};

const modifyAvatar = async (request, h) => {
  const { id } = request.params;
  const {
    top,
    body,
    bottom,
    buy,
  } = request.query;

  const avatarObject = {};
  if (top !== undefined) avatarObject.topItem = top;
  if (body !== undefined) avatarObject.bodyItem = body;
  if (bottom !== undefined) avatarObject.bottomItem = bottom;

  const { db, FieldValue } = request.server.app.firestore;
  const ref = db.collection('avatars').doc(id);

  // Run transaction
  try {
    await db.runTransaction(async (t) => {
      // Update equipped items
      if (Object.keys(avatarObject).length > 0) {
        await t.update(ref, avatarObject);
      }

      // Update owned items
      if (buy !== undefined) {
        const ITEM_COST = 10;

        // Check if document existed
        const doc = await t.get(ref);
        if (!doc.exists) {
          throw Error('NOT_FOUND');
        }

        // Check if already had the item
        const { ownedItems } = doc.data();
        if (ownedItems.includes(buy)) {
          throw Error('ALREADY_PURCHASED');
        }

        await t.update(ref, { ownedItems: FieldValue.arrayUnion(buy) });
        await t.update(ref, { rewardPoint: FieldValue.increment(-ITEM_COST) });
      }
    });
  } catch (error) {
    const { boom } = request.server.app;

    if (error.message.includes('NOT_FOUND')) {
      return boom.notFound();
    }

    if (error.message.includes('ALREADY_PURCHASED')) {
      return boom.badRequest('You have already purchased this item');
    }

    return boom.badImplementation();
  }

  const response = {
    data: {
      updatedAt: Date.now(),
    },
    message: 'success',
  };
  return h.response(response).code(200);
};

module.exports = {
  getAvatars,
  createAvatar,
  getAvatar,
  modifyAvatar,
};
