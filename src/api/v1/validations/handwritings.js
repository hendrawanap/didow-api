module.exports = (Joi) => {
  const analyzeHandwritingPayload = Joi.object({
    img: Joi.binary().encoding('utf8').required(),
    expectedWord: Joi.string().required(),
  });

  return { analyzeHandwritingPayload };
};
