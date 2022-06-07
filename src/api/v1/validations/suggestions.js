module.exports = (Joi) => {
  const getSuggestionQuery = Joi.object({
    userId: Joi.string().required(),
  });

  return { getSuggestionQuery };
};
