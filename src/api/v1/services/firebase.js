/* eslint-disable import/no-unresolved */
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../config/service-account');

const init = async () => {
  initializeApp({
    credential: cert(serviceAccount),
  });
  const db = getFirestore();
  return {
    firestore: { db, Timestamp, FieldValue },
  };
};

module.exports = { init };
