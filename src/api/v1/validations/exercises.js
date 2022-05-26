module.exports = (Joi) => {
  const getExercisesQuery = Joi.alternatives(
    Joi.object({
      userId: Joi.string().optional(),
      groupBy: Joi.string().valid('answers', 'attempts').insensitive().optional(),
      startDate: Joi.string().isoDate().required(),
      endDate: Joi.string().isoDate().required(),
    }),
    Joi.object({
      userId: Joi.string().optional(),
      groupBy: Joi.string().valid('answers', 'attempts').insensitive().optional(),
    }),
  );

  const getExercisesHeader = Joi.object({
    'x-timezone': Joi.number().required(),
  });

  const createExercisePayload = Joi.object({
    userId: Joi.string().required(),
    endTime: Joi.number().integer().required(),
    avgSyllables: Joi.number().integer().required(),
    questionsQty: Joi.number().integer().required(),
    attempts: Joi.array().items(
      Joi.object({
        attemptNumber: Joi.number().integer().required(),
        wrongAnswers: Joi.array().items(
          Joi.object({
            number: Joi.number().integer().required(),
            word: Joi.string().required(),
            answer: Joi.string().required(),
            type: Joi.string().valid('multipleChoice', 'scrambleWords', 'handwriting').required(),
          }).required(),
        ).required(),
      }).required(),
    ).required(),
  });

  return { getExercisesQuery, getExercisesHeader, createExercisePayload };
};
