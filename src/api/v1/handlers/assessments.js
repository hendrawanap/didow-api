const getAssessments = async (request, h) => {
  const { db } = request.server.app.firestore;
  const snapshot = await db.collection('assessments').get();
  const assessments = [];
  snapshot.forEach((doc) => {
    const {
      handwriting,
      multipleChoice,
      scrambleWords,
      score,
    } = doc.data();
    const assessmentObject = {
      id: doc.id,
      correctPercentage: {
        multipleChoice,
        scrambleWords,
        handwriting,
      },
      score,
    };
    assessments.push(assessmentObject);
  });

  const response = {
    data: assessments,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createAssessment = async (request, h) => {

};

const getAssessment = async (request, h) => {
  const { id } = request.params;
  const { db } = request.server.app.firestore;
  const { boom } = request.server.app;
  let doc;

  try {
    doc = await db.collection('assessments').doc(id).get();
    if (!doc.exists) {
      throw new Error('NOT_FOUND');
    }
  } catch (error) {
    if (error.message.includes('NOT_FOUND')) {
      return boom.notFound();
    }
    return boom.badImplementation();
  }

  const {
    handwriting,
    multipleChoice,
    scrambleWords,
    score,
  } = doc.data();

  const assessmentObject = {
    id: doc.id,
    correctPercentage: {
      multipleChoice,
      scrambleWords,
      handwriting,
    },
    score,
  };

  const response = {
    data: assessmentObject,
    message: 'success',
  };
  return h.response(response).code(200);
};

module.exports = { getAssessments, getAssessment, createAssessment };
