module.exports = (Joi) => {
  const createWordPayload = Joi.object({
    word: Joi.string().required(),
    syllables: Joi.number().integer().min(1).required(),
    hintImg: Joi.string().optional(),
  });

  const modifyWordPayload = Joi.object({
    word: Joi.string().optional(),
    syllables: Joi.number().integer().min(1).optional(),
    hintImg: Joi.string().optional(),
  });

  return { createWordPayload, modifyWordPayload };
};
