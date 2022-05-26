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
