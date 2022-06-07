module.exports = (Joi) => {
  const createItemPayload = Joi.object({
    assetUrl: Joi.string().required(),
    type: Joi.string().valid('top', 'body', 'bottom').insensitive().required(),
  });

  const modifyItemPayload = Joi.object({
    assetUrl: Joi.string().optional(),
    type: Joi.string().valid('top', 'body', 'bottom').insensitive().optional(),
  }).min(1);

  return { createItemPayload, modifyItemPayload };
};
