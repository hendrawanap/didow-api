module.exports = (Joi) => {
  const getAvatarsQuery = Joi.object({
    userId: Joi.string().optional(),
  });

  const createAvatarQuery = Joi.object({
    userId: Joi.string().required(),
  });

  const modifyAvatarQuery = Joi.object({
    top: Joi.string().optional(),
    body: Joi.string().optional(),
    bottom: Joi.string().optional(),
    buy: Joi.string().optional(),
  });

  return {
    getAvatarsQuery,
    createAvatarQuery,
    modifyAvatarQuery,
  };
};
