const Joi = require('joi');
const assessments = require('./assessments')(Joi);
const exercises = require('./exercises')(Joi);
const words = require('./words')(Joi);

module.exports = {
  assessments,
  exercises,
  words,
};
