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

  const response = {
    data: exercises,
    message: 'success',
  };
  return h.response(response).code(200);
};

const createExercise = async (request, h) => {
};

module.exports = { getExercises, createExercise };
