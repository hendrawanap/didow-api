/* eslint-disable import/no-unresolved */
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('../config/service-account');

const init = async () => {
  initializeApp({
    credential: cert(serviceAccount),
  });
  const db = getFirestore();
  const auth = getAuth();
  return {
    firestore: { db, Timestamp, FieldValue },
    auth: {
      verifyToken: async (token) => {
        const { uid } = await auth.verifyIdToken(token);
        return uid;
      },
    },
    storage: {
      bucket: getStorage().bucket(process.env.BUCKET_NAME),
    },
  };
};

module.exports = { init };
