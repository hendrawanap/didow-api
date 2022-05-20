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

const analyzeAnswers = (answers) => {
  // Constants values
  const LEVEL_POINT = {
    EASY: 10,
    MEDIUM: 20,
    HARD: 30,
  };
  const TYPE_MULTIPLIER = {
    multipleChoice: 1,
    scrambleWords: 2,
    handwriting: 3,
  };

  // Container variables
  let userWeightPoints = 0;
  let totalAnswers = 0;
  const correctQty = {
    multipleChoice: 0,
    scrambleWords: 0,
    handwriting: 0,
  };

  // Calculate corrects & weight points
  answers.forEach(({ type, isCorrect, syllables }) => {
    totalAnswers += 1;
    if (isCorrect) {
      correctQty[type] += 1;
      let point = 0;
      if (syllables < 4) point += LEVEL_POINT.EASY;
      else if (syllables === 4) point += LEVEL_POINT.MEDIUM;
      else point += LEVEL_POINT.HARD;
      userWeightPoints += point * TYPE_MULTIPLIER[type];
    }
  });
  const result = {
    handwriting: parseFloat((correctQty.handwriting / totalAnswers).toFixed(2)),
    multipleChoice: parseFloat((correctQty.multipleChoice / totalAnswers).toFixed(2)),
    scrambleWords: parseFloat((correctQty.scrambleWords / totalAnswers).toFixed(2)),
    score: userWeightPoints,
  };
  return result;
};

const createAssessment = async (request, h) => {
  const { answers } = request.payload;
  const assessmentObject = analyzeAnswers(answers);

  const { db } = request.server.app.firestore;
  const result = await db.collection('assessments').add(assessmentObject);

  const response = {
    message: 'success',
    data: {
      id: result.id,
      createdAt: Date.now(),
    },
  };
  return h.response(response).code(201);
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
