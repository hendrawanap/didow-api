const Joi = require('joi');
const assessments = require('./assessments')(Joi);
const exercises = require('./exercises')(Joi);
const users = require('./users')(Joi);
const words = require('./words')(Joi);
const avatars = require('./avatars')(Joi);
const items = require('./items')(Joi);

module.exports = {
  assessments,
  exercises,
  users,
  words,
  avatars,
  items,
};
