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

const getDefaultDate = (clientTimezoneOffset) => {
  const date = new Date();
  const HOURS_A_DAY = 24;
  const WEEK_IN_MILLIS = 604_800_000;
  date.setUTCHours(HOURS_A_DAY - clientTimezoneOffset, 0, 0, 0);
  const DEFAULT_END_DATE = date.getTime() - 1;
  const DEFAULT_START_DATE = new Date(date.getTime() - WEEK_IN_MILLIS).getTime();
  return { DEFAULT_START_DATE, DEFAULT_END_DATE };
};

const parseDateQuery = (inputDate, clientTimezoneOffset, endOfDay = false) => {
  const date = new Date(inputDate);
  const HOURS_A_DAY = 24;

  if (endOfDay) {
    date.setUTCHours(HOURS_A_DAY - clientTimezoneOffset, 0, 0, 0);
    return date.getTime() - 1;
  }

  date.setUTCHours(0 - clientTimezoneOffset, 0, 0, 0);
  return date.getTime();
};

const getExercises = async (request, h) => {
  const { 'x-timezone': clientTimezoneOffset } = request.headers;
  const { DEFAULT_START_DATE, DEFAULT_END_DATE } = getDefaultDate(clientTimezoneOffset);
  const { boom } = request.server.app;
  // TODO: Add offset & limit query
  const {
    userId,
    groupBy = 'answers',
    startDate,
    endDate,
    // offset = 0,
    // limit = 10,
  } = request.query;

  // Build DB queries
  const { db } = request.server.app.firestore;
  let ref = db.collection('exercises');

  if (userId) {
    ref = ref.where('userId', '==', userId);
  }

  ref = ref.orderBy('endTime', 'desc');

  if (startDate && endDate) {
    ref = ref.startAt(parseDateQuery(endDate, clientTimezoneOffset, true))
      .endBefore(parseDateQuery(startDate, clientTimezoneOffset));
  } else {
    ref = ref.startAt(DEFAULT_END_DATE).endBefore(DEFAULT_START_DATE);
  }

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

const transformAttemptsToWrongAnswers = (attempts) => {
  const wrongAnswers = {};

  attempts.map((attempt) => attempt.wrongAnswers).forEach((attempt, index) => {
    if (index === 0) {
      attempt.forEach((wrongAnswer) => {
        wrongAnswers[wrongAnswer.number] = {
          number: wrongAnswer.number,
          attempts: [wrongAnswer.answer],
          type: wrongAnswer.type,
          word: wrongAnswer.word,
        };
      });
    } else {
      attempt.forEach((wrongAnswer) => {
        wrongAnswers[wrongAnswer.number].attempts.push(wrongAnswer.answer);
      });
    }
  });

  return Object.values(wrongAnswers);
};

const createExercise = async (request, h) => {
  const { boom } = request.server.app;
  const {
    userId,
    endTime = Date.now(),
    avgSyllables,
    attempts,
    questionsQty,
  } = request.payload;

  const exerciseObject = {
    userId,
    avgSyllables,
    endTime,
    questionsQty,
  };

  // Add exercise object to the 'exercises' collection
  const { db, FieldValue } = request.server.app.firestore;
  let createdExercise;
  try {
    createdExercise = await db.collection('exercises').add(exerciseObject);
  } catch (error) {
    return boom.badImplementation(error.message);
  }

  // Transforms attempts to wrongAnswer objects
  const wrongAnswers = transformAttemptsToWrongAnswers(attempts);

  // Add transformed attempts to 'wrongAnswers' subcollections
  const batch = db.batch();
  wrongAnswers.forEach((wrongAnswer) => batch.set(
    db.collection('exercises')
      .doc(createdExercise.id)
      .collection('wrongAnswers')
      .doc(wrongAnswer.number.toString()),
    {
      word: wrongAnswer.word,
      attempts: wrongAnswer.attempts,
      type: wrongAnswer.type,
    },
  ));

  const weightPointIncrement = (questionsQty - wrongAnswers.length) * 2;

  batch.update(
    db.collection('users').doc(userId),
    { weightPoint: FieldValue.increment(weightPointIncrement) },
  );

  try {
    await batch.commit();
  } catch (error) {
    boom.badImplementation(error.message);
  }

  return h.response({ message: 'success', createdAt: Date.now() }).code(200);
};

module.exports = { getExercises, createExercise };
