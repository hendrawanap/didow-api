const Joi = require('joi');
const assessments = require('./assessments')(Joi);
const exercises = require('./exercises')(Joi);
const users = require('./users')(Joi);
const words = require('./words')(Joi);
const avatars = require('./avatars')(Joi);
const items = require('./items')(Joi);
const suggestions = require('./suggestions')(Joi);
const questions = require('./questions')(Joi);
const handwritings = require('./handwritings')(Joi);

module.exports = {
  assessments,
  exercises,
  users,
  words,
  avatars,
  items,
  suggestions,
  questions,
  handwritings,
};
