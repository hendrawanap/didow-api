const getExercisesGroupByAnswers = async (db, ref) => {
  const exercisesSnapshots = await ref.get();
  const exercises = [];
  const wrongAnswersPromises = [];

  exercisesSnapshots.forEach((doc) => {
    const exercise = { ...doc.data(), wrongAnswers: [] };
    exercises.push(exercise);

    const getWrongAnswers = db.collection('exercises').doc(doc.id).collection('wrongAnswers').get();
    wrongAnswersPromises.push(getWrongAnswers);
  });

  const wrongAnswersSnapshots = await Promise.all(wrongAnswersPromises);
  wrongAnswersSnapshots.forEach((snapshot, index) => {
    snapshot.forEach((doc) => {
      const { word, type, attempts } = doc.data();
      const wrongAnswer = {
        number: parseInt(doc.id, 10),
        word,
        type,
        attempts: attempts.map((attempt, subIndex) => ({
          answer: attempt, attemptNumber: subIndex + 1,
        })),
      };
      exercises[index].wrongAnswers.push(wrongAnswer);
    });
  });

  return exercises;
};

const transfromWrongAnswersToAttempts = (wrongAnswers) => {
  const attempts = {};

  wrongAnswers.forEach((wrongAnswer) => {
    wrongAnswer.attempts.forEach((attempt, index) => {
      if (!Object.prototype.hasOwnProperty.call(attempts, String(index + 1))) {
        attempts[index + 1] = {
          attemptNumber: index + 1,
          wrongAnswers: [],
        };
      }
      attempts[index + 1].wrongAnswers.push({
        number: wrongAnswer.number,
        word: wrongAnswer.word,
        type: wrongAnswer.type,
        answer: attempt.answer,
      });
    });
  });

  return attempts;
};

const groupExercisesByAttempts = (exercises) => {
  const transformed = exercises.map((exercise) => {
    const result = {
      userId: exercise.userId,
      endTime: exercise.endTime,
      avgSyllables: exercise.avgSyllables,
      questionsQty: exercise.questionsQty,
    };
    const attempts = transfromWrongAnswersToAttempts(exercise.wrongAnswers);
    result.attempts = Object.values(attempts);
    return result;
  });
  return transformed;
};

const getExercises = async (request, h) => {
  const { boom } = request.server.app;
  const {
    userId,
    groupBy = 'answers',
  } = request.query;

  // Build DB queries
  const { db } = request.server.app.firestore;
  let ref = db.collection('exercises');
  if (userId) {
    ref = ref.where('userId', '==', userId);
  }
  ref = ref.orderBy('endTime', 'desc');

  // Execute DB queries
  let exercises;
  try {
    exercises = await getExercisesGroupByAnswers(db, ref);
  } catch (error) {
    return boom.badImplementation();
  }

  if (groupBy === 'attempts') {
    exercises = groupExercisesByAttempts(exercises);
  }

  const response = {
    data: exercises,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createExercise = async (request, h) => {
};

module.exports = { getExercises, createExercise };
