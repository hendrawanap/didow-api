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

};

const modifyAvatar = async (request, h) => {

};

module.exports = {
  getAvatars,
  createAvatar,
  getAvatar,
  modifyAvatar,
};
