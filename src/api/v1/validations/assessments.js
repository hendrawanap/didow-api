module.exports = (Joi) => {
  const createAssessmentPayload = Joi.object({
    answers: Joi.array().items(Joi.object({
      syllables: Joi.number().integer().required(),
      isCorrect: Joi.bool().required(),
      type: Joi.string().valid('multipleChoice', 'scrambleWords', 'handwriting').required(),
      word: Joi.string().optional(),
      answer: Joi.string().optional(),
    }).required()).required(),
  });

  return { createAssessmentPayload };
};
