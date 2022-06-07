module.exports = (Joi) => {
  const autoModeQuery = Joi.object({
    type: Joi.string().valid('auto').insensitive().required(),
    weightPoint: Joi.number().integer().required(),
  });

  const assessmentModeQuery = Joi.object({
    type: Joi.string().valid('assessment').insensitive().required(),
  });

  const customModeQuery = Joi.object({
    type: Joi.string().valid('custom').insensitive().required(),
    qty: Joi.number().integer().required(),
    easy: Joi.boolean().optional(),
    medium: Joi.boolean().optional(),
    hard: Joi.boolean().optional(),
  }).min(3);

  const getQuestionsQuery = Joi.alternatives(autoModeQuery, assessmentModeQuery, customModeQuery);

  return { getQuestionsQuery };
};
