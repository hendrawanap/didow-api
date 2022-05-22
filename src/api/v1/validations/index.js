const Joi = require('joi');
const exercises = require('./exercises')(Joi);
const words = require('./words')(Joi);

module.exports = {
  exercises,
  words,
};
