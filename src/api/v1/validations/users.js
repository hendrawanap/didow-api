module.exports = (Joi) => {
  const createUserPayload = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().min(3).max(50).required(),
    nickname: Joi.string().min(3).max(12).optional(),
    gender: Joi.string().valid('male', 'female').insensitive().optional(),
    birthDate: Joi.string().isoDate().optional(),
    weightPoint: Joi.number().integer().required(),
  });

  const getUserQuery = Joi.object({
    weightOnly: Joi.bool().optional(),
  });

  const modifyUserPayload = Joi.object({
    username: Joi.string().min(3).max(50).optional(),
    nickname: Joi.string().min(3).max(12).optional(),
    gender: Joi.string().valid('male', 'female').insensitive().optional(),
    birthDate: Joi.string().isoDate().optional(),
  });

  return { createUserPayload, getUserQuery, modifyUserPayload };
};
